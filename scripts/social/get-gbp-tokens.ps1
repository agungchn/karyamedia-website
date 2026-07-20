# ========================================
# Setup Google OAuth + GBP Tokens
# ========================================
# Jalankan di PowerShell:
#   powershell -ExecutionPolicy Bypass -File scripts/social/get-gbp-tokens.ps1
#
# Prasyarat (lakukan manual dulu):
#   1. Buka https://console.cloud.google.com/
#   2. Buat project baru (atau pilih existing)
#   3. Ke APIs & Services > Library, cari & ENABLE:
#      - "My Business Business Information API"
#      - "My Business Account Management API"
#      - "My Business API"
#   4. Ke APIs & Services > OAuth consent screen:
#      - Pilih "External", isi required fields
#      - Scope: tambah "https://www.googleapis.com/auth/business.manage"
#      - Test users: tambah email Google kamu
#   5. Ke APIs & Services > Credentials > Create Credentials > OAuth client ID
#      - Application type: "Desktop app"
#      - Download JSON lalu ambil client_id & client_secret
#   6. Ke https://console.cloud.google.com/apis/api/mybusiness.googleapis.com/quotas
#      - Klik "Request additional quota" lalu isi formulir
#      - Butuh beberapa hari~minggu untuk approval
#   7. Setelah approval, lanjutkan ke bawah
# ========================================

$ClientId = Read-Host "Masukkan GOOGLE_CLIENT_ID"
$ClientSecret = Read-Host "Masukkan GOOGLE_CLIENT_SECRET"

# OAuth URL
$redirectUri = "http://localhost:8080"
$scope = [System.Uri]::EscapeDataString("https://www.googleapis.com/auth/business.manage")
$authUrl = "https://accounts.google.com/o/oauth2/auth?client_id=$ClientId&redirect_uri=$([System.Uri]::EscapeDataString($redirectUri))&response_type=code&scope=$scope&access_type=offline&prompt=consent"

Write-Host ""
Write-Host "===== LANGKAH 1: Buka URL ini di browser ====="
Write-Host $authUrl
Write-Host ""
Write-Host "Login dengan email Google yang punya akses GBP."
Write-Host "Setelah approve, browser akan redirect ke $redirectUri/?code=..."
Write-Host ""

$authCode = Read-Host "Copy-paste CODE dari URL (bagian setelah ?code=) lalu enter"

# 2. Tukar code → access + refresh token
$body = @{
    client_id = $ClientId
    client_secret = $ClientSecret
    code = $authCode
    redirect_uri = $redirectUri
    grant_type = "authorization_code"
}

$tokenRes = Invoke-RestMethod -Method Post -Uri "https://oauth2.googleapis.com/token" -Body $body -ContentType "application/x-www-form-urlencoded"
$ACCESS_TOKEN = $tokenRes.access_token
$REFRESH_TOKEN = $tokenRes.refresh_token

if (-not $REFRESH_TOKEN) {
    Write-Host "ERROR: Tidak dapat refresh_token. Hapus aplikasi di https://myaccount.google.com/permissions lalu coba lagi."
    exit 1
}

Write-Host "Access token OK (${($ACCESS_TOKEN).Substring(0,20)}...)"
Write-Host "Refresh token OK (${($REFRESH_TOKEN).Substring(0,20)}...)"

# 3. Cari accounts
Write-Host ""
Write-Host "===== LANGKAH 3: Mencari Account & Location ID ====="

# Get list accounts
$accRes = Invoke-RestMethod -Uri "https://mybusiness.googleapis.com/v4/accounts" -Headers @{ Authorization = "Bearer $ACCESS_TOKEN" } -Method Get
$accounts = $accRes.accounts

if (-not $accounts -or $accounts.Count -eq 0) {
    Write-Host "Tidak ada GBP account ditemukan."
    Write-Host "Pastikan:"
    Write-Host "  1. Bisnis sudah terverifikasi di Google"
    Write-Host "  2. Email ini adalah owner/manager GBP"
    Write-Host "  3. Access request quota sudah disetujui"
    exit 1
}

Write-Host "Ditemukan $($accounts.Count) account(s):"
for ($i = 0; $i -lt $accounts.Count; $i++) {
    Write-Host "  [$i] $($accounts[$i].accountName) -> $($accounts[$i].name)"
}

$accIdx = Read-Host "Pilih account (0-$($accounts.Count-1))"
$ACCOUNT_ID = $accounts[$accIdx].accountName -replace "accounts/", ""

# Get locations
$locRes = Invoke-RestMethod -Uri "https://mybusiness.googleapis.com/v4/accounts/$ACCOUNT_ID/locations?pageSize=100" -Headers @{ Authorization = "Bearer $ACCESS_TOKEN" } -Method Get
$locations = $locRes.locations

if (-not $locations -or $locations.Count -eq 0) {
    Write-Host "Tidak ada location ditemukan untuk account ini."
    exit 1
}

Write-Host "Ditemukan $($locations.Count) location(s):"
for ($i = 0; $i -lt $locations.Count; $i++) {
    Write-Host "  [$i] $($locations[$i].locationName) -> $($locations[$i].name)"
}

$locIdx = Read-Host "Pilih location (0-$($locations.Count-1))"
$LOCATION_ID = $locations[$locIdx].name -replace "accounts/$ACCOUNT_ID/locations/", ""

Write-Host "ACCOUNT_ID=$ACCOUNT_ID"
Write-Host "LOCATION_ID=$LOCATION_ID"

# 4. Tulis .env.local
$envPath = "H:\karyamedia-web\.env.local"
$existing = Get-Content $envPath -Raw

# Remove old GBP values if any
$lines = $existing -split "`n" | Where-Object { $_ -notmatch "^(GBP_|SITE_URL)" }

$newLines = @()
$newLines += "GBP_CLIENT_ID=$ClientId"
$newLines += "GBP_CLIENT_SECRET=$ClientSecret"
$newLines += "GBP_REFRESH_TOKEN=$REFRESH_TOKEN"
$newLines += "GBP_ACCOUNT_ID=$ACCOUNT_ID"
$newLines += "GBP_LOCATION_ID=$LOCATION_ID"
$newLines += "GBP_AUTOPOST_LIMIT=3"
$newLines += ""

$content = ($lines -join "`n").TrimEnd() + "`n" + ($newLines -join "`n")
Set-Content -Path $envPath -Value $content -Encoding ascii

Write-Host ""
Write-Host "===== DONE ====="
Write-Host ".env.local sudah diupdate dengan GBP credentials."
Write-Host ""
Write-Host "Coba jalankan:"
Write-Host "  node scripts/social/autopost-gbp.mjs"
Write-Host ""
Write-Host "Atau:"
Write-Host "  GBP_DRYRUN=1 node scripts/social/autopost-gbp.mjs"
Write-Host "(dry-run = lihat artikel yg akan diposting tanpa beneran posting)"
