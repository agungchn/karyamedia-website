param([string]$Title, [string]$Message)
Add-Type -AssemblyName System.Windows.Forms
[System.Windows.Forms.MessageBox]::Show($Message, $Title, "OK", "Information") | Out-Null
