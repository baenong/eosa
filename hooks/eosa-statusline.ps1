# eosa statusline — PowerShell version for Windows
# Outputs [EOSA:보안+접근성+디자인] or nothing if inactive

$configDir = if ($env:CLAUDE_CONFIG_DIR) { $env:CLAUDE_CONFIG_DIR } else { "$env:USERPROFILE\.claude" }
$flagFile = Join-Path $configDir ".eosa-active"

if (-not (Test-Path $flagFile)) { exit 0 }

$ids = (Get-Content $flagFile -Raw).Trim()
if (-not $ids) { exit 0 }

$display = $ids `
  -replace "`n", "+" `
  -replace "security-pipa", "보안" `
  -replace "accessibility-kwcag22", "접근성" `
  -replace "design-krds", "디자인"

Write-Host -NoNewline "[EOSA:$display]" -ForegroundColor Yellow
