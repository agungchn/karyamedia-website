# Generate artikel medali ber-intent tinggi (demand & timely) - batch kurasi.
# Idempoten: slug dup otomatis diskip oleh article-generate.
# Tidak commit di sini - commit/push & deploy dilakukan terpisah setelah run.
$ErrorActionPreference = "Continue"
$root = "H:\karyamedia-web"
Set-Location $root
$log = Join-Path $root "gen-medali-intent-log.txt"
$slugFile = Join-Path $root "gen-medali-intent-slugs.txt"
$ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Encoding utf8 -Path $log -Value "`n===== $ts ====="

# (keyword, provinsi) - prioritas: HUT RI (peak Juli-Agu), pramuka, olahraga,
# event sekolah nasional (O2SN/OSN/PORSENI), akademik & keagamaan.
$pairs = @(
  @{kw="medali HUT RI DKI Jakarta";        prov="DKI Jakarta"}
  @{kw="medali HUT RI Jawa Barat";         prov="Jawa Barat"}
  @{kw="medali HUT RI Jawa Timur";         prov="Jawa Timur"}
  @{kw="medali HUT RI DI Yogyakarta";      prov="DI Yogyakarta"}
  @{kw="medali pramuka DKI Jakarta";       prov="DKI Jakarta"}
  @{kw="medali pramuka Jawa Barat";        prov="Jawa Barat"}
  @{kw="medali olahraga DKI Jakarta";      prov="DKI Jakarta"}
  @{kw="medali turnamen Jawa Barat";       prov="Jawa Barat"}
  @{kw="medali juara Jawa Timur";          prov="Jawa Timur"}
  @{kw="medali O2SN DKI Jakarta";          prov="DKI Jakarta"}
  @{kw="medali OSN Jawa Barat";            prov="Jawa Barat"}
  @{kw="medali PORSENI Jawa Tengah";       prov="Jawa Tengah"}
  @{kw="medali wisuda DI Yogyakarta";      prov="DI Yogyakarta"}
  @{kw="medali MTQ DKI Jakarta";           prov="DKI Jakarta"}
)

$generated = 0; $skipped = 0; $failed = 0
foreach ($p in $pairs) {
  $kw = $p.kw
  $env:ARTICLE_PROVINCE = $p.prov
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
