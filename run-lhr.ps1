$ErrorActionPreference = 'SilentlyContinue'
while ($true) {
    Write-Host "Starting localhost.run tunnel on port 3000..."
    ssh -R 80:localhost:3000 -o ServerAliveInterval=15 -o ServerAliveCountMax=3 -o StrictHostKeyChecking=no nokey@localhost.run
    Write-Host "Tunnel reset. Reconnecting in 3 seconds..."
    Start-Sleep -Seconds 3
}
