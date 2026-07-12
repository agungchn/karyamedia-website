# Daily SEO article generator wrapper:
# 1. generate + commit + push 1 article (seo:ideas --generate-top 1 --commit-push)
# 2. show a Windows toast when done
# 3. after Vercel deploy, check the live URL and toast again if online
$ErrorActionPreference = "Continue"
$root = "H:\karyamedia-web"
Set-Location $root
$log = Join-Path $root "article-gen-log.txt"
$popup = Join-Path $root "scripts\seo\popup.ps1"

# Show a visible popup window (launched detached so it never blocks the task).
function Show-Popup {
  param([string]$Title, [string]$Message)
  Start-Process powershell -ArgumentList "-NoProfile","-ExecutionPolicy Bypass","-File",$popup,"-Title",$Title,"-Message",$Message -WindowStyle Hidden
}

$ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path $log -Value "`n===== $ts ====="

try {
  $out = & npm run seo:ideas -- --generate-top 1 --commit-push 2>&1 | Tee-Object -FilePath $log -Append | Out-String
} catch {
  Show-Popup -Title "Karyamedia SEO" -Message "Gagal menjalankan generator: $_"
  exit 1
}

$slug = ""
if ($out -match "GENERATED_SLUG:(\S+)") { $slug = $Matches[1] }

$title = ""
if ($out -match "Artikel baru: blog/\S+ — (.+)") { $title = $Matches[1].Trim() }
if (-not $title) { $title = $slug }

if ($slug) {
  Show-Popup -Title "Artikel Baru Terbit" -Message "'$title' berhasil dibuat & di-push. Menunggu deploy..."
  # wait for Vercel to deploy, then verify it is actually online
  Start-Sleep -Seconds 120
  $url = "https://karyamediasouvenir.com/blog/$slug"
  try {
    $r = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec 25 -UseBasicParsing
    if ($r.StatusCode -eq 200) {
      Show-Popup -Title "Sudah Online" -Message "Artikel live: $url"
    } else {
      Show-Popup -Title "Belum Online" -Message "Status $($r.StatusCode) untuk $url"
    }
  } catch {
    Show-Popup -Title "Cek Online" -Message "Tidak bisa cek $url (mungkin masih deploy)."
  }
} else {
  Show-Popup -Title "Karyamedia SEO" -Message "Tidak ada artikel baru hari ini (semua topik sudah ada)."
}
