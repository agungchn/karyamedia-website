# Manual SEO article generator for priority keywords (plakat batas wilayah)
# Scheduled via Windows Task Scheduler: Senin, Rabu, Jumat jam 10:00 WIB
# Keyword diambil dari article-schedule.json berdasarkan tanggal hari ini

$ErrorActionPreference = "Continue"
$root = "H:\karyamedia-web"
Set-Location $root
$log = Join-Path $root "article-gen-manual-log.txt"
$python = "python"
$scheduleFile = Join-Path $root "scripts\seo\article-schedule.json"
$notifyScript = Join-Path $root "scripts\seo\telegram-notify.py"

# Load schedule JSON
$schedule = Get-Content $scheduleFile -Raw | ConvertFrom-Json

$today = Get-Date
$todayStr = $today.ToString("yyyy-MM-dd")
$dayName = $today.DayOfWeek
if ($dayName -eq 0) { $dayName = "Minggu" }
elseif ($dayName -eq 1) { $dayName = "Senin" }
elseif ($dayName -eq 2) { $dayName = "Selasa" }
elseif ($dayName -eq 3) { $dayName = "Rabu" }
elseif ($dayName -eq 4) { $dayName = "Kamis" }
elseif ($dayName -eq 5) { $dayName = "Jumat" }
elseif ($dayName -eq 6) { $dayName = "Sabtu" }

# Cari entry untuk hari ini berdasarkan tanggal
$entry = $schedule.schedule | Where-Object { $_.date -eq $todayStr }

if (-not $entry) {
  $msg = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Tidak ada jadwal untuk hari ini ($todayStr / $dayName)"
  Add-Content -Path $log -Value $msg
  exit 0
}

$keyword = $entry.keyword
$angle = $entry.angle
$loc = $entry.loc

$ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path $log -Value "`n===== $ts (Manual 10:00) ====="
Add-Content -Path $log -Value "Tanggal: $todayStr, Hari: $dayName, Keyword: $keyword"

# Send start notification
& $python $notifyScript --status start --keyword $keyword --count 1 | Out-Null

# Build arguments
$nodeArgs = @(
  "scripts/seo/article-generate.mjs"
  $keyword
  "--category"
  "Batas Wilayah"
)
if ($angle) { $nodeArgs += "--angle"; $nodeArgs += $angle }
if ($loc) { $nodeArgs += "--loc"; $nodeArgs += $loc }

# Generate article
Add-Content -Path $log -Value "Exec: node $keyword --category Batas Wilayah [angle: $($angle -ne $null)] [loc: $($loc -ne $null)]"
$out = & "node" $nodeArgs 2>&1 | Tee-Object -FilePath $log -Append | Out-String
$exitCode = $LASTEXITCODE

# Extract slug
$slug = if ($out -match "GENERATED_SLUG:(\S+)") { $matches[1] } else { $null }

if ($exitCode -ne 0) {
  $errorMsg = if ($out -match "DUPLIKAT.*batal") { "Duplikat konten" }
              elseif ($out -match "timeout") { "LLM timeout" }
              elseif ($out -match "quota|rate.?limit|429") { "Kuota LLM habis" }
              else { "Error tidak diketahui" }
  
  & $python $notifyScript --status failure --keyword $keyword --error $errorMsg --count 0 | Out-Null
  Add-Content -Path $log -Value "ERROR (exit $exitCode): $errorMsg"
  exit 1
}

# Send success notification
if ($slug) {
  & $python $notifyScript --status success --keyword $keyword --slug $slug --count 1 | Out-Null
  Add-Content -Path $log -Value "SUCCESS: $slug"
} else {
  & $python $notifyScript --status success --keyword $keyword --count 1 | Out-Null
}

# Commit & push if there are changes
$gitStat = & git status --porcelain 2>$null
if ($gitStat) {
  & git add -A 2>&1 | Out-Null
  & git commit -m "chore(seo): manual generate article - $keyword" 2>&1 | Tee-Object -FilePath $log -Append | Out-String
  & git push 2>&1 | Tee-Object -FilePath $log -Append | Out-String
}

Add-Content -Path $log -Value "DONE"
exit 0
