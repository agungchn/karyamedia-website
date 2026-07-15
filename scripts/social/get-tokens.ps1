# Jalankan di PowerShell (klik kanan > Run with PowerShell, atau paste ke terminal).
# Ganti 3 nilai di bawah dengan nilai ASLI dari akun kamu.
$APP_ID      = "GANTI_APP_ID"
$APP_SECRET  = "GANTI_APP_SECRET"
$SHORT       = "GANTI_SHORT_TOKEN"

# 0. validasi APP_SECRET
$secEsc = [System.Uri]::EscapeDataString($APP_SECRET)
$app = Invoke-RestMethod "https://graph.facebook.com/v21.0/oauth/access_token?client_id=$APP_ID&client_secret=$secEsc&grant_type=client_credentials"
Write-Host "APP SECRET OK (app token: $($app.access_token.Substring(0,15))...)"

# 1. cek permission token pendek
Write-Host "=== PERMISSIONS ==="
(Invoke-RestMethod "https://graph.facebook.com/v21.0/me/permissions?access_token=$SHORT").data |
  ForEach-Object { Write-Host "$($_.permission) : $($_.status)" }

# 2. tukar ke long-lived user token
$tokEsc = [System.Uri]::EscapeDataString($SHORT)
$ex = Invoke-RestMethod "https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=$APP_ID&client_secret=$secEsc&fb_exchange_token=$tokEsc"
$LONG = $ex.access_token
Write-Host "LONG USER TOKEN ok (len $(($LONG).Length))"

# 3. ambil FB Page + page token
$acc = Invoke-RestMethod "https://graph.facebook.com/v21.0/me/accounts?access_token=$LONG"
Write-Host "=== PAGES ==="
$acc.data | ForEach-Object { Write-Host "$($_.name) -> $($_.id)" }
$page = $acc.data | Where-Object { $_.name -eq "Suvenir Kenang Kenangan" }
if (-not $page) { Write-Host "PAGE NOT FOUND"; exit 1 }
$FB_PAGE_ID = $page.id
$PAGE_TOKEN = $page.access_token

# 4. ambil IG business account id
$ig = Invoke-RestMethod "https://graph.facebook.com/v21.0/$FB_PAGE_ID?fields=instagram_business_account&access_token=$PAGE_TOKEN"
$IG_USER_ID = $ig.instagram_business_account.id

Write-Host "FB_PAGE_ID=$FB_PAGE_ID"
Write-Host "IG_USER_ID=$IG_USER_ID"
Write-Host "PAGE_TOKEN (20 char pertama)=$($PAGE_TOKEN.Substring(0,20))..."

# 5. tulis .env.local (gitignored)
$AUTOPOST_SECRET = -join ((48..57) + (97..102) | Get-Random -Count 48 | ForEach-Object { [char]$_ })
$content = "SITE_URL=https://karyamediasouvenir.com`nFB_PAGE_ID=$FB_PAGE_ID`nFB_PAGE_ACCESS_TOKEN=$PAGE_TOKEN`nIG_USER_ID=$IG_USER_ID`nAUTOPOST_SECRET=$AUTOPOST_SECRET`nAUTOPOST_LIMIT=3`n"
Set-Content -Path "H:\karyamedia-web\.env.local" -Value $content -Encoding ascii
Write-Host "=== .env.local TERTULIS di H:\karyamedia-web\.env.local ==="
