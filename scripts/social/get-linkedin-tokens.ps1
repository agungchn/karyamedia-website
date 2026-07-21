# ========================================
# Setup LinkedIn OAuth Token
# ========================================
# Jalankan di PowerShell:
#   powershell -ExecutionPolicy Bypass -File scripts/social/get-linkedin-tokens.ps1
# ========================================

$ClientId = Read-Host "Masukkan LINKEDIN_CLIENT_ID"
$ClientSecret = Read-Host "Masukkan LINKEDIN_CLIENT_SECRET"

$redirectUri = "https://karyamediasouvenir.com/api/linkedin/callback"
$scope = [System.Uri]::EscapeDataString("w_member_social w_organization_social rw_organization_admin")
$authUrl = "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=$ClientId&redirect_uri=$([System.Uri]::EscapeDataString($redirectUri))&scope=$scope"

Write-Host ""
Write-Host "===== LANGKAH 1: Buka URL ini di browser ====="
Write-Host $authUrl
Write-Host ""
Write-Host "Login dengan akun LinkedIn yang admin dari Karyamedia Souvenir."
Write-Host "Setelah approve, browser akan redirect ke $redirectUri/?code=..."
Write-Host ""

$authCode = Read-Host "Copy-paste CODE dari URL (bagian setelah ?code=) lalu enter"

# 2. Tukar code → access token
$body = @{
    client_id = $ClientId
    client_secret = $ClientSecret
    code = $authCode
    redirect_uri = $redirectUri
    grant_type = "authorization_code"
}

try {
    $tokenRes = Invoke-RestMethod -Method Post -Uri "https://www.linkedin.com/oauth/v2/accessToken" -Body $body -ContentType "application/x-www-form-urlencoded"
    $ACCESS_TOKEN = $tokenRes.access_token
} catch {
    Write-Host "ERROR: Gagal mendapatkan token: $_"
    exit 1
}

Write-Host "Access token OK (${($ACCESS_TOKEN).Substring(0,20)}...)"

# 3. Dapatkan Organization ID
Write-Host ""
Write-Host "===== LANGKAH 2: Mencari Organization ID ====="

try {
    $orgRes = Invoke-RestMethod -Uri "https://api.linkedin.com/v2/organizationalEntityAcls?q=roleAssignee&role=ADMINISTRATOR&projection=(elements*(organizationalTarget~))" -Headers @{ Authorization = "Bearer $ACCESS_TOKEN" } -Method Get
    $orgs = $orgRes.elements
} catch {
    Write-Host "ERROR: Gagal mendapatkan organization info: $_"
    exit 1
}

if (-not $orgs -or $orgs.Count -eq 0) {
    Write-Host "Tidak ada organization ditemukan."
    Write-Host "Pastikan:"
    Write-Host "  1. Akun ini adalah admin dari Karyamedia Souvenir"
    Write-Host "  2. Scope w_organization_social sudah ditambahkan"
    exit 1
}

Write-Host "Ditemukan $($orgs.Count) organization(s):"
for ($i = 0; $i -lt $orgs.Count; $i++) {
    $orgTarget = $orgs[$i].'organizationalTarget~'
    $orgName = $orgTarget.localizedName
    $orgUrn = $orgs[$i].organizationalTarget
    $orgId = $orgUrn -replace "urn:li:organization:",""
    Write-Host "  [$i] $orgName -> ID: $orgId"
}

$orgIdx = Read-Host "Pilih organization (0-$($orgs.Count-1))"
$orgTarget = $orgs[$orgIdx].'organizationalTarget~'
$orgUrn = $orgs[$orgIdx].organizationalTarget
$ORG_ID = $orgUrn -replace "urn:li:organization:",""
$ORG_NAME = $orgTarget.localizedName

Write-Host "Selected organization: $ORG_NAME (ID: $ORG_ID)"

# 4. Tulis .env.local
$envPath = "H:\karyamedia-web\.env.local"
$existing = Get-Content $envPath -Raw

$lines = $existing -split "`n" | Where-Object { $_ -notmatch "^(LINKEDIN_|SITE_URL)" }

$newLines = @()
$newLines += "LINKEDIN_CLIENT_ID=$ClientId"
$newLines += "LINKEDIN_CLIENT_SECRET=$ClientSecret"
$newLines += "LINKEDIN_ACCESS_TOKEN=$ACCESS_TOKEN"
$newLines += "LINKEDIN_ORG_ID=$ORG_ID"
$newLines += "LINKEDIN_AUTOPOST_LIMIT=3"
$newLines += ""

$content = ($lines -join "`n").TrimEnd() + "`n" + ($newLines -join "`n")
Set-Content -Path $envPath -Value $content -Encoding ascii

Write-Host ""
Write-Host "===== DONE ====="
Write-Host ".env.local sudah diupdate dengan LinkedIn credentials."
Write-Host ""
Write-Host "Coba jalankan:"
Write-Host "  node scripts/social/autopost-linkedin.mjs"
Write-Host ""
Write-Host "Atau:"
Write-Host "  LINKEDIN_DRYRUN=1 node scripts/social/autopost-linkedin.mjs"
Write-Host "(dry-run = lihat artikel yg akan diposting tanpa beneran posting)"
