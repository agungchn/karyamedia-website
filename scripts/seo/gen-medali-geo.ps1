# Generate artikel medali geo untuk semua 38 provinsi (buyer-local capture).
# Idempoten: artikel yang sudah ada (slug dup) otomatis diskip oleh article-generate.
# Tidak commit di sini — commit/push & deploy dilakukan terpisah setelah run.
$ErrorActionPreference = "Continue"
$root = "H:\karyamedia-web"
Set-Location $root
$log = Join-Path $root "gen-medali-geo-log.txt"
$slugFile = Join-Path $root "gen-medali-geo-slugs.txt"
$ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Encoding utf8 -Path $log -Value "`n===== $ts ====="

$provinces = @(
  "Aceh","Sumatra Utara","Sumatra Barat","Riau","Kepulauan Riau","Jambi",
  "Sumatra Selatan","Bengkulu","Lampung","Kepulauan Bangka Belitung","Banten",
  "DKI Jakarta","Jawa Barat","Jawa Tengah","DI Yogyakarta","Jawa Timur","Bali",
  "Nusa Tenggara Barat","Nusa Tenggara Timur","Kalimantan Barat","Kalimantan Tengah",
  "Kalimantan Selatan","Kalimantan Timur","Kalimantan Utara","Sulawesi Utara",
  "Sulawesi Tengah","Sulawesi Selatan","Sulawesi Tenggara","Gorontalo",
  "Sulawesi Barat","Maluku","Maluku Utara","Papua","Papua Barat","Papua Tengah",
  "Papua Pegunungan","Papua Selatan","Papua Barat Daya"
)

$generated = 0; $skipped = 0; $failed = 0
foreach ($p in $provinces) {
  $kw = "medali custom $p"
  $env:ARTICLE_PROVINCE = $p
  Write-Host ">>> $kw"
  try {
    $out = & node scripts/seo/article-generate.mjs "$kw" --category "Medali" 2>&1 | Out-String
    Add-Content -Encoding utf8 -Path $log -Value $out
    if ($out -match "DUPLIKAT") {
      $skipped++; Write-Host "  skip (dup)"
    } elseif ($out -match "GENERATED_SLUG:(\S+)") {
      Add-Content -Encoding utf8 -Path $slugFile -Value $matches[1]
      $generated++; Write-Host "  OK: $($matches[1])"
    } else {
      $failed++; Write-Host "  ? no slug (lihat log)"
    }
  } catch {
    $failed++; Write-Host "  ERROR: $_"
    Add-Content -Encoding utf8 -Path $log -Value "ERROR $kw : $_"
  }
  Remove-Item Env:ARTICLE_PROVINCE -ErrorAction SilentlyContinue
}
Write-Host "`nSELESAI: generated=$generated skipped=$skipped failed=$failed"
Add-Content -Encoding utf8 -Path $log -Value "SELESAI: generated=$generated skipped=$skipped failed=$failed"
