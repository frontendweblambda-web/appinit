# Kill Turbo, Node, PNPM, Yarn if running
Write-Output "🔪 Killing processes that lock node_modules..."

$processes = @("node", "turbo", "pnpm", "yarn")

foreach ($p in $processes) {
  try {
    taskkill /F /IM "$p.exe" /T 2>$null
  } catch {
    # ignore
  }
}

Write-Output "✔ All blocking processes terminated."
