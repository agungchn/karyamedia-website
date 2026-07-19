# Monthly Google Trends article generator:
# 1. Fetch Google Trends data
# 2. LLM picks the best keywords
# 3. Generate articles
# Dijadwalkan tiap tanggal 5 via Task Scheduler.
$ErrorActionPreference = "Continue"
$root = "H:\karyamedia-web"
Set-Location $root
$log = Join-Path $root "article-gen-log.txt"
$popup = Join-Path $root "scripts\seo\popup.ps1"

function Show-Popup {
  param([string]$Title, [string]$Message)
  Start-Process powershell -ArgumentList "-NoProfile","-ExecutionPolicy Bypass","-File",$popup,"-Title",$Title,"-Message",$Message -WindowStyle Hidden
}

$ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path $log -Value "`n===== MONTHLY TRENDS $ts ====="

$out = & node scripts/seo/trends-keywords.mjs --generate-next 3 2>&1 | Tee-Object -FilePath $log -Append | Out-String
$exitCode = $LASTEXITCODE

$slugs = [regex]::Matches($out, "GENERATED_SLUG:(\S+)") | ForEach-Object { $_.Groups[1].Value }

if ($exitCode -ne 0) {
  Show-Popup -Title "Monthly Trends Gagal" -Message "Google Trends bulan ini gagal. Cek log article-gen-log.txt."
  exit 1
}

if ($slugs.Count -eq 0) {
  Show-Popup -Title "Monthly Trends" -Message "Tidak ada artikel baru dari Google Trends bulan ini (semua topik sudah ada atau tidak relevan)."
  exit 0
}

Show-Popup -Title "$($slugs.Count) Artikel dari Google Trends" -Message "$($slugs.Count) artikel berhasil dibuat dari data Google Trends."
