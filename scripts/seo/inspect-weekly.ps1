# Weekly Google indexing recap:
# jalankan seo:inspect untuk ~1 minggu artikel terakhir (6/hari x 7 = 42)
# lalu tampilkan ringkasan via popup.
# Dijadwalkan mingguan (mis. Minggu 09:00) via Task Scheduler.
$ErrorActionPreference = "Continue"
$root = "H:\karyamedia-web"
Set-Location $root
$log = Join-Path $root "seo-inspect-log.txt"
$popup = Join-Path $root "scripts\seo\popup.ps1"

$ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path $log -Value "`n===== $ts ====="

$n = 42
$out = & npm run seo:inspect -- $n 2>&1 | Tee-Object -FilePath $log -Append | Out-String

$summary = [regex]::Match($out, "Ringkasan:\s*(.+)").Groups[1].Value.Trim()
$site = [regex]::Match($out, "Site:\s*(\S+)").Groups[1].Value.Trim()

$title = "Rekap Indexing Google (mingguan)"
$msg = if ($summary) { "$summary`nSite: $site" } else { "Cek log seo-inspect-log.txt" }

Start-Process powershell -ArgumentList "-NoProfile","-ExecutionPolicy Bypass","-File",$popup,"-Title",$title,"-Message",$msg -WindowStyle Hidden
