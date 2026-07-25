#!/usr/bin/env python3
"""
Create Google Calendar reminders for SEO article generation schedule.
Run this once to set up recurring reminders.

Usage:
    python create-calendar-reminder.py              # Generate JSON schedule
    python create-calendar-reminder.py --export-csv # Export CSV for Google Calendar import
"""

import json
import csv
import sys
from datetime import datetime, timedelta
from pathlib import Path

# Output file untuk reminder schedule
OUTPUT_FILE = Path(__file__).parent / "article-schedule.json"

# Daftar keyword prioritas dengan jadwal
SCHEDULE = [
    # Priority 1 - High Search Volume
    {"keyword": "plakat batas wilayah", "week": 1, "day": "Senin", "time": "10:00"},
    {"keyword": "plakat BM", "week": 2, "day": "Senin", "time": "10:00"},
    {"keyword": "plakat CP", "week": 3, "day": "Senin", "time": "10:00"},
    {"keyword": "plakat peresmian gedung", "week": 4, "day": "Senin", "time": "10:00"},
    {"keyword": "plakat center point", "week": 5, "day": "Senin", "time": "10:00"},
    
    # Priority 2 - Medium
    {"keyword": "plakat batas desa", "week": 6, "day": "Senin", "time": "10:00"},
    {"keyword": "plakat batas kecamatan", "week": 7, "day": "Senin", "time": "10:00"},
    
    # Priority 3 - Long Tail (generate bertahap)
    {"keyword": "plakat batas kabupaten", "week": 8, "day": "Senin", "time": "10:00"},
    {"keyword": "plakat batas provinsi", "week": 9, "day": "Senin", "time": "10:00"},
    {"keyword": "plakat batas administratif", "week": 10, "day": "Senin", "time": "10:00"},
    {"keyword": "plakat batas wilayah desa", "week": 11, "day": "Senin", "time": "10:00"},
    {"keyword": "plakat patok batas", "week": 12, "day": "Senin", "time": "10:00"},
    {"keyword": "plakat patok wilayah", "week": 13, "day": "Senin", "time": "10:00"},
    {"keyword": "plakat batas tanah", "week": 14, "day": "Senin", "time": "10:00"},
    {"keyword": "plakat batas kawasan", "week": 15, "day": "Senin", "time": "10:00"},
    {"keyword": "plakat batas area", "week": 16, "day": "Senin", "time": "10:00"},
    {"keyword": "plakat batas zona", "week": 17, "day": "Senin", "time": "10:00"},
    {"keyword": "plakat batas wilayah custom", "week": 18, "day": "Senin", "time": "10:00"},
    {"keyword": "plakat batas wilayah logam", "week": 19, "day": "Senin", "time": "10:00"},
    {"keyword": "plakat batas wilayah kuningan", "week": 20, "day": "Senin", "time": "10:00"},
    {"keyword": "plakat batas wilayah tembaga", "week": 21, "day": "Senin", "time": "10:00"},
    {"keyword": "plakat batas wilayah premium", "week": 22, "day": "Senin", "time": "10:00"},
    {"keyword": "plakat batas wilayah eksklusif", "week": 23, "day": "Senin", "time": "10:00"},
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
        
        # Override time to 10:00 (manual schedule, separate from auto scheduler at 20:00)
        reminder_time = "10:00"
        
        reminders.append({
            "keyword": item["keyword"],
            "week": item["week"],
            "date": reminder_date.strftime("%Y-%m-%d"),
            "day": item["day"],
            "time": reminder_time,
            "datetime": f"{reminder_date.strftime('%Y-%m-%d')} {reminder_time}",
            "title": f"📝 Generate Artikel SEO: {item['keyword']}",
            "description": f"Generate 1 artikel untuk keyword '{item['keyword']}'\n\n"
                          f"Jalankan: node scripts/seo/article-generate.mjs \"{item['keyword']}\" --category \"Plakat\"\n\n"
                          f"Tips:\n"
                          f"- Pastikan keyword unik (cek dulu di articles.ts)\n"
                          f"- Gunakan --dry-run dulu untuk preview\n"
                          f"- Kalau OK, jalankan tanpa --dry-run\n"
                          f"- Commit & push setelah generate\n\n"
                          f"⚠️ JANGAN digabung dengan task scheduler otomatis (20:00)!",
            "priority": "High" if item["week"] <= 5 else "Medium" if item["week"] <= 7 else "Low"
        })
    
    return reminders

def export_csv(reminders, output_file):
    """Export reminders to CSV format for Google Calendar import."""
    
    # Google Calendar CSV format
    # Subject, Start Date, Start Time, End Date, End Time, All Day Event, Description, Location, Private
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        # Header
        writer.writerow([
            'Subject',
            'Start Date',
            'Start Time',
            'End Date',
            'End Time',
            'All Day Event',
            'Description',
            'Location',
            'Private'
        ])
        
        for r in reminders:
            # Parse date
            start_date = r['date']
            end_date = r['date']  # Same day
            start_time = '10:00'
            end_time = '10:30'  # 30 minutes duration
            
            # Clean description for CSV (remove newlines, escape quotes)
            description = r['description'].replace('\n', '\\n').replace('"', '""')
            
            writer.writerow([
                r['title'],
                start_date,
                start_time,
                end_date,
                end_time,
                'False',
                f'"{description}"',
                '',  # Location
                'False'  # Private
            ])
    
    print(f"✅ CSV exported to: {output_file}")
    print(f"📊 Total events: {len(reminders)}")
    print(f"\n📋 Import ke Google Calendar:")
    print(f"   1. Buka https://calendar.google.com")
    print(f"   2. Settings (⚙️) → Import & Export")
    print(f"   3. Upload file: {output_file}")
    print(f"   4. Pilih calendar tujuan")
    print(f"   5. Click Import")
    print(f"\n💡 After import:")
    print(f"   - Events akan muncul setiap Senin jam 10:00")
    print(f"   - Set notification: 30 menit sebelum (default Google Calendar)")

def main():
    # Check for --export-csv flag
    export_csv_flag = '--export-csv' in sys.argv
    
    print("📅 Membuat jadwal reminder untuk generate artikel SEO...\n")
    
    reminders = calculate_dates()
    
    if export_csv_flag:
        # Export to CSV
        csv_file = Path(__file__).parent / "article-schedule.csv"
        export_csv(reminders, csv_file)
        return 0
    
    # Default: save to JSON
    # Save to JSON file
    output_data = {
        "created_at": datetime.now().isoformat(),
        "total_reminders": len(reminders),
        "schedule": reminders,
        "instructions": {
            "manual_setup": "Kamu bisa import ke Google Calendar dengan:\n"
                           "1. Buka https://calendar.google.com\n"
                           "2. Buat event manual untuk setiap reminder\n"
                           "3. Set recurring: setiap Senin jam 10:00\n"
                           "4. Set duration: 30 menit\n"
                           "5. Add notification: 1 jam sebelum",
            "csv_import": "Atau export ke CSV untuk import massal:\n"
                         "python create-calendar-reminder.py --export-csv\n"
                         "Lalu import CSV ke Google Calendar",
            "auto_generate": "Task scheduler otomatis jalan SETIAP HARI jam 20:00 (terpisah dari jadwal ini)\n"
                            "Jadwal ini HANYA untuk tracking manual jika mau kontrol penuh generate artikel\n"
                            "Generate manual: node scripts/seo/article-generate.mjs \"<keyword>\" --category \"Plakat\"",
            "note": "⚠️ JANGAN gabungkan jadwal ini dengan task scheduler otomatis!\n"
                   "Task scheduler = otomatis setiap hari 20:00 (2 artikel)\n"
                   "Jadwal manual ini = kontrol penuh 1 artikel/minggu Senin 10:00"
        }
    }
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Jadwal tersimpan di: {OUTPUT_FILE}\n")
    print(f"📊 Total reminder: {len(reminders)} artikel")
    print(f"📅 Periode: {reminders[0]['date']} - {reminders[-1]['date']}")
    print(f"⏰ Waktu: Setiap Senin jam 10:00 (manual, terpisah dari auto scheduler 20:00)\n")
    print("📋 Preview 5 reminder pertama:")
    print("=" * 80)
    for r in reminders[:5]:
        print(f"Week {r['week']:2d} | {r['date']} | {r['priority']:6s} | {r['keyword']}")
    
    print("\n" + "=" * 80)
    print("\n💡 Tips:")
    print("1. Buka file JSON ini untuk lihat semua jadwal")
    print("2. Export ke CSV: python create-calendar-reminder.py --export-csv")
    print("3. Import CSV ke Google Calendar untuk auto-reminder")
    print("4. Monitor performa per keyword di Google Search Console")
    
    return 0

if __name__ == "__main__":
    exit(main())
