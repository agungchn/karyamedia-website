# Draft postingan Google Business Profile (rotasi mingguan) + popup pengingat.
# Jalan tiap Senin via Task Scheduler. GBP tidak punya API publik untuk posting,
# jadi script ini hanya menyediakan teks draf + instruksi upload manual.
# Pool draf ada di gbp-drafts.json (UTF-8, aman dari masalah encoding PowerShell).
$ErrorActionPreference = "Continue"
$root = "H:\karyamedia-web"
$stateFile = Join-Path $root "scripts\seo\gbp-draft-state.json"
$log = Join-Path $root "seo-gbp-draft-log.txt"
$popup = Join-Path $root "scripts\seo\popup.ps1"
$draftsFile = Join-Path $root "scripts\seo\gbp-drafts.json"
$wa = "https://wa.me/6282243580777"
$review = "https://share.google/ZlqytdSBZG9mpyXJM"

$drafts = Get-Content $draftsFile -Encoding utf8 | ConvertFrom-Json

# baca index rotasi
$idx = 0
if (Test-Path $stateFile) {
  try { $idx = (Get-Content $stateFile -Encoding utf8 | ConvertFrom-Json).index } catch { $idx = 0 }
}
if ($null -eq $idx -or $idx -lt 0) { $idx = 0 }
$d = $drafts[$idx % $drafts.Count]

$ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Encoding utf8 -Path $log -Value "$ts | draft #$($idx % $drafts.Count + 1)/$($drafts.Count): $($d.text)"

$title = "Draft Postingan GBP Minggu Ini"
$msg = "Upload postingan GBP minggu ini (dasbor google.com/business -> Postingan):`n`n" +
       "$($d.text)`n`n" +
       "Media: $($d.media)`n`n" +
       "Cara upload:`n" +
       "1. Tempel teks di atas ke kotak Deskripsi`n" +
       "2. Tambah foto/video produk`n" +
       "3. Tambah tombol 'Pesan online' -> $wa`n" +
       "4. Klik Terbitkan`n`n" +
       "Link ulasan pelanggan: $review"

Set-Content -Path (Join-Path $root "seo-gbp-draft-last.txt") -Encoding utf8 -Value "TITLE: $title`n`nMSG:`n$msg"

# simpan index berikutnya
$next = ($idx + 1) % $drafts.Count
@{ index = $next } | ConvertTo-Json | Set-Content -Path $stateFile -Encoding utf8

Start-Process powershell -ArgumentList "-NoProfile","-ExecutionPolicy Bypass","-File",$popup,"-Title",$title,"-Message",$msg -WindowStyle Hidden
