# Daily SEO article generator wrapper:
# 1. generate + commit + push 5 artikel (seo:ideas --generate-top 5 --commit-push)
# 2. show a Windows toast when done
# 3. after Vercel deploy, check the live URL(s) and toast again if online
# 4. auto-post ke GBP, FB & IG lewat fire-and-forget
# Dijadwalkan 2x sehari (mis. 12:30 & 18:30) via Task Scheduler -> total 10 artikel/hari.
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

# Kabari Google bahwa sitemap berubah agar artikel baru ter-crawl lebih cepat.
# (Google tidak pakai IndexNow; "public sitemap ping" juga sudah tidak didukung -> 404/410.
#  Cara resmi yang tersisa: submit sitemap via Search Console API, lihat submit-sitemap.mjs.)
function Submit-SitemapGSC {
  try {
    & node scripts/seo/submit-sitemap.mjs 2>&1 | Tee-Object -FilePath $log -Append | Out-String
  } catch {
    Add-Content -Path $log -Value "submit-sitemap gagal: $($_.Exception.Message)"
  }
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

# enrich: tambah "Artikel terkait" antar artikel (max 4 link/artikel, 2 link/run)
try {
  & npm run seo:link-old 2>&1 | Tee-Object -FilePath $log -Append | Out-String
} catch {
  # biarkan lanjut meskipun tidak ada yang perlu ditambahkan
}

# auto-konsolidasi: deteksi artikel duplikat (>=80% Jaccard) secara otomatis,
# rewire link internal, dan merge + 301 untuk yang nyaris identik (>=85%).
# Hasil disimpan ke consolidate.merges.json (idempoten).
try {
  & npm run seo:consolidate 2>&1 | Tee-Object -FilePath $log -Append | Out-String
  # jika konsolidasi mengubah file, commit + push agar tidak tertimpa push berikutnya
  # PENTING: jangan pernah staging file di .github/ (terutama workflows) agar push
  # tidak butuh scope 'workflow' & tidak mengganggu otomatisasi lain.
  $consStat = & git status --porcelain 2>$null
  if ($consStat) {
    & git add -A 2>&1 | Out-Null
    & git reset -q -- .github 2>&1 | Out-Null
    $consStat2 = & git status --porcelain 2>$null
    if ($consStat2) {
      & git commit -m "chore(seo): auto-consolidate duplicate articles" 2>&1 | Tee-Object -FilePath $log -Append | Out-String
      & git push 2>&1 | Tee-Object -FilePath $log -Append | Out-String
    } else {
      Add-Content -Path $log -Value "Konsolidasi hanya menyentuh .github, push dilewati (aman)."
    }
  }
} catch {
  # konsolidasi gagal bukan masalah kritis
}

$out = & npm run seo:ideas -- --generate-top 5 --commit-push 2>&1 | Tee-Object -FilePath $log -Append | Out-String
$ideasExit = $LASTEXITCODE

$slugs = [regex]::Matches($out, "GENERATED_SLUG:(\S+)") | ForEach-Object { $_.Groups[1].Value }
$titles = [regex]::Matches($out, "Artikel disisipkan: blog/(\S+)") | ForEach-Object { $_.Groups[1].Value.Trim() }

if ($ideasExit -ne 0) {
  # Deteksi apakah penyebabnya kuota/usage LLM (Zen free "Free usage exceeded", Gemini 429/503, dll)
  $quotaHit = $false
  $reason = ""
  if ($out -match "Free usage exceeded") {
    $quotaHit = $true
    $reason = "Kuota OpenCode Zen (deepseek-v4-flash-free) habis/tercapai fair-use limit."
  } elseif ($out -match "429|quota|rate.?limit|RESOURCE_EXHAUSTED|rateLimitExceeded") {
    $quotaHit = $true
    $reason = "API LLM kena rate-limit/quota (429)."
  } elseif ($out -match "503|overload|high demand") {
    $quotaHit = $true
    $reason = "LLM sedang overload (503)."
  }
  if ($quotaHit) {
    Add-Content -Path $log -Value "QUOTA/USAGE ERROR: $reason Cek apakah Zen free sudah 'exceeded' atau fallback Gemini juga habis."
    Show-Popup -Title "Gagal Generate Artikel" -Message "$reason Artikel tidak dibuat hari ini. Akan coba lagi di jadwal berikutnya."
  } else {
    Add-Content -Path $log -Value "GENERATOR ERROR (exit $ideasExit): $($out | Select-Object -Last 20 | Out-String)"
    Show-Popup -Title "Gagal Generate Artikel" -Message "Generator error (exit $ideasExit). Cek log article-gen-log.txt."
  }
  exit 1
}

if ($slugs.Count -eq 0) {
  Show-Popup -Title "Karyamedia SEO" -Message "Tidak ada artikel baru hari ini (semua topik sudah ada)."
  exit 0
}

$n = $slugs.Count
$titleList = $titles -join "`, "
Show-Popup -Title "$n Artikel Baru Terbit" -Message "$titleList berhasil dibuat & di-push. Menunggu deploy..."

# tunggu Vercel deploy sekali saja
Start-Sleep -Seconds 120

# kabari Google (Search Console API) bahwa sitemap (berisi artikel baru) sudah berubah
Submit-SitemapGSC

foreach ($slug in $slugs) {
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
}

# verify Google indexing status of the most recent article (read-only GSC API)
try {
  $inspect = & npm run seo:inspect -- 1 2>&1 | Out-String
  $status = "NEUTRAL"
  if ($inspect -match "PASS") { $status = "PASS (terindeks)" }
  elseif ($inspect -match "FAIL") { $status = "FAIL (belum terindeks)" }
  Show-Popup -Title "Status Indexing Google" -Message "$status"
} catch {
  Show-Popup -Title "Status Indexing Google" -Message "Tidak bisa cek status indexing."
}

# auto-post ke GBP (fire-and-forget, tidak blokir sisa script)
try {
  Add-Content -Path $log -Value "[gbp] auto-post dimulai..."
  $gbpOut = & npm run social:gbp 2>&1 | Out-String
  Add-Content -Path $log -Value $gbpOut
  if ($gbpOut -match "tidak ada artikel baru") {
    Add-Content -Path $log -Value "[gbp] Tidak ada artikel baru untuk GBP."
  } elseif ($gbpOut -match "OK") {
    Show-Popup -Title "GBP Auto-Post" -Message "Artikel baru berhasil diposting ke Google Business Profile."
    Add-Content -Path $log -Value "[gbp] GBP auto-post berhasil."
  }
} catch {
  Add-Content -Path $log -Value "[gbp] GBP auto-post gagal (mungkin quota blm approve): $($_.Exception.Message)"
}

# auto-post ke FB + IG
try {
  Add-Content -Path $log -Value "[fb] auto-post dimulai..."
  $fbOut = & npm run social:autopost 2>&1 | Out-String
  Add-Content -Path $log -Value $fbOut
  if ($fbOut -match "tidak ada artikel baru") {
    Add-Content -Path $log -Value "[fb] Tidak ada artikel baru untuk FB/IG."
  } elseif ($fbOut -match "fb|ig|posted") {
    Show-Popup -Title "FB & IG Auto-Post" -Message "Artikel baru berhasil diposting ke Facebook & Instagram."
    Add-Content -Path $log -Value "[fb] FB/IG auto-post berhasil."
  }
} catch {
  Add-Content -Path $log -Value "[fb] FB/IG auto-post gagal: $($_.Exception.Message)"
}
