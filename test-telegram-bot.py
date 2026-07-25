#!/usr/bin/env python3
"""
Test Telegram bot connection and get Chat ID.
Usage: python test-telegram-bot.py
"""

import json
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env.local
env_file = Path(__file__).parent / ".env.local"
load_dotenv(env_file)

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

if not BOT_TOKEN:
    print("❌ TELEGRAM_BOT_TOKEN tidak ditemukan di .env.local")
    exit(1)

print(f"✅ Bot token loaded: {BOT_TOKEN[:20]}...")
print()

# Test 1: Get bot info
print(" Test 1: Get bot info...")
import urllib.request
try:
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/getMe"
    with urllib.request.urlopen(url, timeout=10) as response:
        data = json.loads(response.read().decode())
        if data["ok"]:
            bot = data["result"]
            print(f"✅ Bot aktif!")
            print(f"   ID: {bot['id']}")
            print(f"   Name: {bot['first_name']}")
            print(f"   Username: @{bot['username']}")
        else:
            print(f"❌ Bot tidak aktif: {data}")
except Exception as e:
    print(f"❌ Error: {e}")

print()

# Test 2: Get updates (to find Chat ID)
print("📋 Test 2: Get recent updates...")
try:
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/getUpdates"
    with urllib.request.urlopen(url, timeout=10) as response:
        data = json.loads(response.read().decode())
        if data["ok"]:
            if data["result"]:
                print(f"✅ Ditemukan {len(data['result'])} message(s):")
                for msg in data["result"]:
                    if "message" in msg:
                        chat = msg["message"].get("chat", {})
                        print(f"   - Chat ID: {chat.get('id')}")
                        print(f"     From: {chat.get('first_name', 'Unknown')}")
                        print(f"     Message: {msg['message'].get('text', '(no text)')}")
                        print()
                        print(f"💡 Gunakan Chat ID ini: {chat.get('id')}")
            else:
                print("⚠️  Belum ada message dari bot.")
                print()
                print("📱 Cara dapat Chat ID:")
                print("   1. Buka Telegram")
                print("   2. Cari: @karyamedia_seo_bot")
                print("   3. Kirim: /start")
                print("   4. Jalankan script ini lagi")
        else:
            print(f"❌ Error: {data}")
except Exception as e:
    print(f"❌ Error: {e}")

print()

# Test 3: Send test message (if Chat ID known)
chat_id_input = input("📝 Masukkan Chat ID (atau Enter untuk skip): ").strip()

if chat_id_input:
    print(f"\n📋 Test 3: Send test message to {chat_id_input}...")
    try:
        import urllib.request
        message = "✅ Test notification dari Karyamedia SEO Bot!\n\nBot sudah siap untuk kirim notifikasi generate artikel."
        url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
        data = json.dumps({
            "chat_id": chat_id_input,
            "text": message,
            "parse_mode": "HTML"
        }).encode('utf-8')
        
        req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode())
            if result["ok"]:
                print("✅ Message terkirim!")
            else:
                print(f"❌ Gagal kirim: {result}")
    except Exception as e:
        print(f"❌ Error: {e}")
else:
    print("\n️  Skip test kirim message.")

print("\n✅ Test selesai!")
