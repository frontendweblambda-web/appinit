Write-Output "🧹 Full Clean — Appinit OS (Windows)"

# Kill locked processes
./scripts/kill-processes.ps1

# Clean dist
Remove-Item -Recurse -Force packages/*/dist -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force apps/*/dist -ErrorAction SilentlyContinue

# Clean generated JS/DTS
Get-ChildItem -Recurse -Filter *.js,*.d.ts,*.js.map,*.tsbuildinfo |
Where-Object { $_.FullName -notmatch "\\dist\\" } |
Remove-Item -Force -ErrorAction SilentlyContinue

# Clean caches
Remove-Item -Recurse -Force .turbo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules/.pnpm-store -ErrorAction SilentlyContinue

# Clean node_modules
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

Write-Output "✔ Clean complete!"
