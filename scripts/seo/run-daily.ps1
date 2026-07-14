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

# safety net: pastikan seluruh artikel mematuhi standar lint terbaru sebelum generate
try {
  & npm run seo:fix-lint 2>&1 | Tee-Object -FilePath $log -Append | Out-String
} catch {
  # biarkan lanjut meskipun fix-lint tidak mengubah apa pun
}

# safety net: pastikan struktur pilar (cluster <-> panduan-lengkap) tetap terhubung
try {
  & npm run seo:link-pillar 2>&1 | Tee-Object -FilePath $log -Append | Out-String
} catch {
  # biarkan lanjut meskipun link-pillar tidak mengubah apa pun
}

# auto-konsolidasi: deteksi artikel duplikat (>=80% Jaccard) secara otomatis,
# rewire link internal, dan merge + 301 untuk yang nyaris identik (>=85%).
# Hasil disimpan ke consolidate.merges.json (idempoten).
try {
  & npm run seo:consolidate 2>&1 | Tee-Object -FilePath $log -Append | Out-String
  # jika konsolidasi mengubah file, commit + push agar tidak tertimpa push berikutnya
  $consStat = & git status --porcelain 2>$null
  if ($consStat) {
    & git add -A 2>&1 | Out-Null
    & git commit -m "chore(seo): auto-consolidate duplicate articles" 2>&1 | Tee-Object -FilePath $log -Append | Out-String
    & git push 2>&1 | Tee-Object -FilePath $log -Append | Out-String
  }
} catch {
  # konsolidasi gagal bukan masalah kritis
}

$out = & npm run seo:ideas -- --generate-top 1 --commit-push 2>&1 | Tee-Object -FilePath $log -Append | Out-String
$ideasExit = $LASTEXITCODE

$slug = ""
if ($out -match "GENERATED_SLUG:(\S+)") { $slug = $Matches[1] }

$title = ""
if ($out -match "Artikel disisipkan: blog/(\S+)") { $title = $Matches[1].Trim() }
if (-not $title) { $title = $slug }

if ($ideasExit -ne 0) {
  Show-Popup -Title "Gagal Generate Artikel" -Message "Generator error (exit $ideasExit). Cek log article-gen-log.txt. Mungkin kuota Gemini habis."
  exit 1
}

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

  # notify search engines of the new article via IndexNow (instant crawl, Bing + partners)
  try {
    & npm run seo:indexnow -- $slug 2>&1 | Tee-Object -FilePath $log -Append | Out-String
  } catch {
    # indexnow gagal bukan masalah kritis
  }

  # verify Google indexing status of the new article (read-only GSC API)
  try {
    $inspect = & npm run seo:inspect -- 1 2>&1 | Out-String
    $status = "NEUTRAL"
    if ($inspect -match "PASS") { $status = "PASS (terindeks)" }
    elseif ($inspect -match "FAIL") { $status = "FAIL (belum terindeks)" }
    Show-Popup -Title "Status Indexing Google" -Message "$status`n$url"
  } catch {
    Show-Popup -Title "Status Indexing Google" -Message "Tidak bisa cek status indexing."
  }
} else {
  Show-Popup -Title "Karyamedia SEO" -Message "Tidak ada artikel baru hari ini (semua topik sudah ada)."
}
