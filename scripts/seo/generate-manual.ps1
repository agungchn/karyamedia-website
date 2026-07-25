# Manual SEO article generator for priority keywords (plakat batas wilayah)
# Scheduled via Windows Task Scheduler: Senin & Kamis jam 10:00 WIB
# Keyword diambil dari article-schedule.json berdasarkan minggu saat ini

$ErrorActionPreference = "Continue"
$root = "H:\karyamedia-web"
Set-Location $root
$log = Join-Path $root "article-gen-manual-log.txt"
$python = "python"
$scheduleFile = Join-Path $root "scripts\seo\article-schedule.json"
$notifyScript = Join-Path $root "scripts\seo\telegram-notify.py"

# Load schedule JSON
$schedule = Get-Content $scheduleFile -Raw | ConvertFrom-Json

# Calculate current week (from start date 2026-07-27)
$startDate = [datetime]::Parse("2026-07-27")
$today = Get-Date
$weekNumber = [math]::Ceiling(($today - $startDate).TotalDays / 7) + 1

if ($weekNumber -lt 1) { $weekNumber = 1 }
if ($weekNumber -gt $schedule.schedule.Count) {
  Add-Content -Path $log -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Schedule selesai (week $weekNumber > $($schedule.schedule.Count))"
  & $python $notifyScript --status start --keyword "schedule-completed" --count 0 | Out-Null
  exit 0
}

# Get keyword for current week
$weekSchedule = $schedule.schedule | Where-Object { $_.week -eq $weekNumber }

if (-not $weekSchedule) {
  Add-Content -Path $log -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - No schedule for week $weekNumber"
  exit 0
}

# Determine which day (Senin=1, Kamis=4)
$dayOfWeek = [int]$today.DayOfWeek
if ($dayOfWeek -eq 0) { $dayOfWeek = 7 } # Sunday = 7

$keyword = if ($dayOfWeek -eq 1) {
  # Senin - ambil entry pertama minggu ini
  $weekSchedule[0].keyword
} elseif ($dayOfWeek -eq 4) {
  # Kamis - ambil entry kedua minggu ini (jika ada)
  if ($weekSchedule.Count -gt 1) {
    $weekSchedule[1].keyword
  } else {
    $weekSchedule[0].keyword
  }
} else {
  # Bukan Senin/Kamis - skip
  Add-Content -Path $log -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Skip (bukan Senin/Kamis)"
  exit 0
}

$ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path $log -Value "`n===== $ts (Manual 10:00) ====="
Add-Content -Path $log -Value "Week: $weekNumber, Day: $dayOfWeek, Keyword: $keyword"

# Send start notification
& $python $notifyScript --status start --keyword $keyword --count 1 | Out-Null

# Generate article
$out = & node scripts/seo/article-generate.mjs $keyword --category "Plakat" 2>&1 | Tee-Object -FilePath $log -Append | Out-String
$exitCode = $LASTEXITCODE

# Extract slug
$slug = if ($out -match "GENERATED_SLUG:(\S+)") { $matches[1] } else { $null }

if ($exitCode -ne 0) {
  # Extract error
  $errorMsg = if ($out -match "DUPLIKAT.*batal") { "Duplikat konten" }
              elseif ($out -match "timeout") { "LLM timeout" }
              elseif ($out -match "quota|rate.?limit|429") { "Kuota LLM habis" }
              else { "Error tidak diketahui" }
  
  # Send failure notification
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
