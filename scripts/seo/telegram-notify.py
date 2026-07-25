#!/usr/bin/env python3
"""
Send Telegram notification for SEO article generation.
Usage: python scripts/seo/telegram-notify.py --status success --keyword "plakat custom"
"""

import json
import os
import sys
import urllib.request
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv

# Load .env.local
env_file = Path(__file__).parent.parent.parent / ".env.local"
load_dotenv(env_file)

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

def send_telegram_message(message, parse_mode="HTML"):
    """Send message to Telegram."""
    if not BOT_TOKEN or not CHAT_ID:
        print("❌ TELEGRAM_BOT_TOKEN atau TELEGRAM_CHAT_ID tidak diset")
        return False
    
    try:
        url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
        data = json.dumps({
            "chat_id": CHAT_ID,
            "text": message,
            "parse_mode": parse_mode
        }).encode('utf-8')
        
        req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode())
            if result["ok"]:
                print(f"✅ Telegram notification sent to {CHAT_ID}")
                return True
            else:
                print(f"❌ Failed: {result}")
                return False
    except Exception as e:
        print(f" Error: {e}")
        return False

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Send SEO article notification to Telegram")
    parser.add_argument("--status", required=True, choices=["success", "failure", "start"],
                       help="Status: success, failure, or start")
    parser.add_argument("--keyword", required=True, help="Keyword that was generated")
    parser.add_argument("--slug", help="Article slug (for success)")
    parser.add_argument("--error", help="Error message (for failure)")
    parser.add_argument("--count", type=int, default=1, help="Number of articles generated")
    
    args = parser.parse_args()
    
    # Build message based on status
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    if args.status == "start":
        emoji = ""
        title = "Generate Artikel SEO Dimulai"
        message = f"""
{emoji} <b>{title}</b>

📅 Waktu: {now}
🔑 Keyword: <code>{args.keyword}</code>
📊 Jumlah: {args.count} artikel

⏳ Sedang generate...
"""
    
    elif args.status == "success":
        emoji = "✅"
        title = "Generate Artikel SEO Berhasil"
        slug_text = f"\n Slug: <code>{args.slug}</code>" if args.slug else ""
        message = f"""
{emoji} <b>{title}</b>

📅 Waktu: {now}
 Keyword: <code>{args.keyword}</code>
📊 Jumlah: {args.count} artikel{slug_text}

✅ Artikel berhasil dibuat dan siap untuk commit!
"""
    
    elif args.status == "failure":
        emoji = "❌"
        title = "Generate Artikel SEO Gagal"
        error_text = f"\n️ Error: <code>{args.error}</code>" if args.error else ""
        message = f"""
{emoji} <b>{title}</b>

📅 Waktu: {now}
🔑 Keyword: <code>{args.keyword}</code>
📊 Jumlah: {args.count} artikel{error_text}

⚠️ Periksa log untuk detail error.
"""
    
    else:
        print(f"❌ Invalid status: {args.status}")
        return 1
    
    # Send message
    success = send_telegram_message(message.strip())
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
