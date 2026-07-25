#!/usr/bin/env python3
"""
Create Google Calendar reminders for SEO article generation schedule.
Run this once to set up recurring reminders.
"""

import json
from datetime import datetime, timedelta
from pathlib import Path

# Output file untuk reminder schedule
OUTPUT_FILE = Path(__file__).parent / "article-schedule.json"

# Daftar keyword prioritas dengan jadwal
SCHEDULE = [
    # Priority 1 - High Search Volume
    {"keyword": "plakat batas wilayah", "week": 1, "day": "Senin", "time": "20:00"},
    {"keyword": "plakat BM", "week": 2, "day": "Senin", "time": "20:00"},
    {"keyword": "plakat CP", "week": 3, "day": "Senin", "time": "20:00"},
    {"keyword": "plakat peresmian gedung", "week": 4, "day": "Senin", "time": "20:00"},
    {"keyword": "plakat center point", "week": 5, "day": "Senin", "time": "20:00"},
    
    # Priority 2 - Medium
    {"keyword": "plakat batas desa", "week": 6, "day": "Senin", "time": "20:00"},
    {"keyword": "plakat batas kecamatan", "week": 7, "day": "Senin", "time": "20:00"},
    
    # Priority 3 - Long Tail (generate bertahap)
    {"keyword": "plakat batas kabupaten", "week": 8, "day": "Senin", "time": "20:00"},
    {"keyword": "plakat batas provinsi", "week": 9, "day": "Senin", "time": "20:00"},
    {"keyword": "plakat batas administratif", "week": 10, "day": "Senin", "time": "20:00"},
    {"keyword": "plakat batas wilayah desa", "week": 11, "day": "Senin", "time": "20:00"},
    {"keyword": "plakat patok batas", "week": 12, "day": "Senin", "time": "20:00"},
    {"keyword": "plakat patok wilayah", "week": 13, "day": "Senin", "time": "20:00"},
    {"keyword": "plakat batas tanah", "week": 14, "day": "Senin", "time": "20:00"},
    {"keyword": "plakat batas kawasan", "week": 15, "day": "Senin", "time": "20:00"},
    {"keyword": "plakat batas area", "week": 16, "day": "Senin", "time": "20:00"},
    {"keyword": "plakat batas zona", "week": 17, "day": "Senin", "time": "20:00"},
    {"keyword": "plakat batas wilayah custom", "week": 18, "day": "Senin", "time": "20:00"},
    {"keyword": "plakat batas wilayah logam", "week": 19, "day": "Senin", "time": "20:00"},
    {"keyword": "plakat batas wilayah kuningan", "week": 20, "day": "Senin", "time": "20:00"},
    {"keyword": "plakat batas wilayah tembaga", "week": 21, "day": "Senin", "time": "20:00"},
    {"keyword": "plakat batas wilayah premium", "week": 22, "day": "Senin", "time": "20:00"},
    {"keyword": "plakat batas wilayah eksklusif", "week": 23, "day": "Senin", "time": "20:00"},
]

def calculate_dates():
    """Calculate actual dates for each reminder starting from next week."""
    today = datetime.now()
    next_monday = today + timedelta(days=(7 - today.weekday()) % 7)
    if next_monday <= today:
        next_monday += timedelta(days=7)
    
    reminders = []
    for item in SCHEDULE:
        # Calculate date: week N from now
        reminder_date = next_monday + timedelta(weeks=item["week"] - 1)
        
        reminders.append({
            "keyword": item["keyword"],
            "week": item["week"],
            "date": reminder_date.strftime("%Y-%m-%d"),
            "day": item["day"],
            "time": item["time"],
            "datetime": f"{reminder_date.strftime('%Y-%m-%d')} {item['time']}",
            "title": f"📝 Generate Artikel SEO: {item['keyword']}",
            "description": f"Generate 1 artikel untuk keyword '{item['keyword']}'\n\n"
                          f"Jalankan: node scripts/seo/article-generate.mjs \"{item['keyword']}\" --category \"Plakat\"\n\n"
                          f"Tips:\n"
                          f"- Pastikan keyword unik (cek dulu di articles.ts)\n"
                          f"- Gunakan --dry-run dulu untuk preview\n"
                          f"- Kalau OK, jalankan tanpa --dry-run\n"
                          f"- Commit & push setelah generate",
            "priority": "High" if item["week"] <= 5 else "Medium" if item["week"] <= 7 else "Low"
        })
    
    return reminders

def main():
    print("📅 Membuat jadwal reminder untuk generate artikel SEO...\n")
    
    reminders = calculate_dates()
    
    # Save to JSON file
    output_data = {
        "created_at": datetime.now().isoformat(),
        "total_reminders": len(reminders),
        "schedule": reminders,
        "instructions": {
            "manual_setup": "Kamu bisa import ke Google Calendar dengan:\n"
                           "1. Buka https://calendar.google.com\n"
                           "2. Buat event manual untuk setiap reminder\n"
                           "3. Set recurring: setiap Senin jam 20:00\n"
                           "4. Set duration: 30 menit\n"
                           "5. Add notification: 1 jam sebelum",
            "auto_generate": "Atau biarkan task scheduler otomatis jalan setiap hari jam 20:00\n"
                            "File ini hanya untuk tracking manual jika mau kontrol penuh"
        }
    }
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Jadwal tersimpan di: {OUTPUT_FILE}\n")
    print(f"📊 Total reminder: {len(reminders)} artikel")
    print(f"📅 Periode: {reminders[0]['date']} - {reminders[-1]['date']}")
    print(f"⏰ Waktu: Setiap Senin jam 20:00\n")
    
    print("📋 Preview 5 reminder pertama:")
    print("=" * 80)
    for r in reminders[:5]:
        print(f"Week {r['week']:2d} | {r['date']} | {r['priority']:6s} | {r['keyword']}")
    
    print("\n" + "=" * 80)
    print("\n💡 Tips:")
    print("1. Buka file JSON ini untuk lihat semua jadwal")
    print("2. Import manual ke Google Calendar atau")
    print("3. Biarkan task scheduler otomatis (sudah diset jam 20:00)")
    print("4. Monitor performa per keyword di Google Search Console")
    
    return 0

if __name__ == "__main__":
    exit(main())
