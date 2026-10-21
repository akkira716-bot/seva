$ErrorActionPreference = 'SilentlyContinue'
while ($true) {
    Write-Host "Starting localtunnel on port 3000..."
    npx.cmd --yes localtunnel --port 3000 --subdomain maatrusetu-seva
    Write-Host "Tunnel disconnected. Reconnecting in 3 seconds..."
    Start-Sleep -Seconds 3
}
