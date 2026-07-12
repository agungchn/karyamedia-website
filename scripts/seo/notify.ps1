# Windows toast notification helper (no external modules; uses WinRT).
# Usage (after dot-sourcing): Show-Toast -Title "..." -Message "..."
function Show-Toast {
  param([string]$Title, [string]$Message)
  try {
    $null = [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime]
    $null = [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom, ContentType = WindowsRuntime]
    $appId = "Karyamedia SEO"
    $template = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent(
      [Windows.UI.Notifications.ToastTemplateType]::ToastText02)
    $binding = $template.GetElementsByTagName("text")
    $binding.Item(0).AppendChild($template.CreateTextNode($Title)) | Out-Null
    $binding.Item(1).AppendChild($template.CreateTextNode($Message)) | Out-Null
    $toast = [Windows.UI.Notifications.ToastNotification]::new($template)
    [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($appId).Show($toast)
  } catch {
    $fallback = Join-Path $PSScriptRoot "..\..\notify-fallback.log"
    Add-Content -Path $fallback -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm') [$Title] $Message  (toast error: $_)"
  }
}
