# Weekly Google recap: indexing (inspect) + trafik (GSC), satu popup.
# jalankan seo:inspect untuk ~1 minggu artikel terakhir (default 42 = 6/hari x 7)
# lalu tampilkan ringkasan yang jelas via popup (bukan cuma angka).
# Arg opsional: jumlah artikel, mis. "inspect-weekly.ps1 10" untuk tes cepat.
# Dijadwalkan mingguan (Senin 10:00 WIB) via Task Scheduler.
$ErrorActionPreference = "Continue"
$root = "H:\karyamedia-web"
Set-Location $root
$log = Join-Path $root "seo-inspect-log.txt"
$popup = Join-Path $root "scripts\seo\popup.ps1"

$n = if ($args.Count -gt 0) { [int]$args[0] } else { 42 }

$ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path $log -Value "`n===== $ts ====="

$out = & npm run seo:inspect -- $n 2>&1 | Tee-Object -FilePath $log -Append | Out-String

# hitung status tiap artikel dari output inspect
$counts = @{}
$err = 0
foreach ($line in ($out -split "`n")) {
  if ($line -match '\[(OK|  )\]\s+(.+?)\s{2,}https?://') {
    $v = $matches[2].Trim()
    if ($counts.ContainsKey($v)) { $counts[$v]++ } else { $counts[$v] = 1 }
  } elseif ($line -match '\[!!\]') {
    $err++
  }
}

$detail = ($counts.GetEnumerator() | Sort-Object Name | ForEach-Object { "  - $($_.Value) $($_.Key)" }) -join "`n"
$total = 0
$counts.Values | ForEach-Object { $total += $_ }

$title = "Rekap Indexing Google (mingguan)"
if ($total -gt 0) {
  $msg = "Rekap indexing Google minggu ini:`nDari $n artikel terbaru, status di Google:`n$detail"
  if ($err -gt 0) { $msg += "`n`n($err artikel gagal dicek / error)" }
  $msg += "`n`nKeterangan:`nPASS = sudah diindeks Google."
  $msg += "`nNEUTRAL = sudah di-crawl tapi belum masuk indeks (biasanya naik ke PASS dalam beberapa hari)."
  $msg += "`n'unknown to Google' = belum ditemukan Google sama sekali."
  $msg += "`n`nDetail per-URL ada di seo-inspect-log.txt."
} else {
  $msg = "Tidak ada data inspect. Cek seo-inspect-log.txt."
}

# tambahan: trafik Google dari GSC (read-only) — lewat query apa pengunjung mengklik
try {
  $traf = & node scripts/gsc/traffic.mjs 2>&1 | Out-String
  $msg += "`n`n" + $traf.Trim()
  Add-Content -Encoding utf8 -Path (Join-Path $root "seo-traffic-log.txt") -Value "`n===== $ts =====`n$traf"
} catch {
  $msg += "`n`n(Gagal mengambil trafik GSC)"
}

# tambahan: trafik Bing dari Bing Webmaster Tools (read-only, AI search = Copilot/DuckDuckGo)
try {
  $bing = & node scripts/bing/traffic.mjs 2>&1 | Out-String
  $msg += "`n`n" + $bing.Trim()
  Add-Content -Encoding utf8 -Path (Join-Path $root "seo-bing-traffic-log.txt") -Value "`n===== $ts =====`n$bing"
} catch {
  $msg += "`n`n(Gagal mengambil trafik Bing)"
}

Set-Content -Path (Join-Path $root "seo-inspect-last-msg.txt") -Encoding utf8 -Value "TITLE: $title`n`nMSG:`n$msg"

Start-Process powershell -ArgumentList "-NoProfile","-ExecutionPolicy Bypass","-File",$popup,"-Title",$title,"-Message",$msg -WindowStyle Hidden
