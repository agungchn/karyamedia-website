# Setup Task Scheduler untuk generate artikel manual (Senin, Rabu, Jumat 10:00 WIB)
# JALANKAN SEBAGAI ADMINISTRATOR (klik kanan -> Run as Administrator)

$taskName = "KaryamediaSEO1000"
$scriptPath = "H:\karyamedia-web\scripts\seo\generate-manual.ps1"
$description = "Generate 1 artikel SEO priority (plakat batas wilayah) - Senin, Rabu, Jumat 10:00 WIB"

# Check if task already exists
$existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue

if ($existingTask) {
  Write-Host "[!] Task '$taskName' sudah ada. Mengupdate..." -ForegroundColor Yellow
  Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

# Create new task
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File $scriptPath"
$trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday, Wednesday, Friday -At 10:00AM
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RunOnlyIfNetworkAvailable

try {
  Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Description $description -RunLevel Highest | Out-Null
  Write-Host "[OK] Task '$taskName' berhasil dibuat!" -ForegroundColor Green
  Write-Host ""
  Write-Host "Schedule: Senin, Rabu, Jumat jam 10:00 WIB" -ForegroundColor Cyan
  Write-Host " Script: $scriptPath" -ForegroundColor Cyan
  Write-Host " Output: H:\karyamedia-web\article-gen-manual-log.txt" -ForegroundColor Cyan
  Write-Host " Notification: Telegram (success/failure)" -ForegroundColor Cyan
  Write-Host ""
  Write-Host " Tips:" -ForegroundColor Yellow
  Write-Host "    - Task akan mulai jalan Senin/Rabu/Jumat berikutnya"
  Write-Host "    - Cek log di: H:\karyamedia-web\article-gen-manual-log.txt"
  Write-Host "    - Notifikasi Telegram akan dikirim otomatis"
  Write-Host "    - Untuk test manual: jalankan script generate-manual.ps1"
  Write-Host ""
  Write-Host "Command untuk test manual:" -ForegroundColor Cyan
  Write-Host "   powershell -ExecutionPolicy Bypass -File H:\karyamedia-web\scripts\seo\generate-manual.ps1"
} catch {
  Write-Host "[ERROR] Gagal membuat task: $_" -ForegroundColor Red
  Write-Host ""
  Write-Host "Pastikan script ini dijalankan sebagai Administrator!" -ForegroundColor Yellow
  exit 1
}
