# Script to generate SSL certificates for development
# Run this script in PowerShell: .\generate-cert.ps1

Write-Host "Generating SSL certificates for development..." -ForegroundColor Green

# Create certs directory if it doesn't exist
if (-not (Test-Path "certs")) {
    New-Item -ItemType Directory -Path "certs" | Out-Null
    Write-Host "Created certs directory" -ForegroundColor Yellow
}

# Check if OpenSSL is available
$opensslPath = Get-Command openssl -ErrorAction SilentlyContinue

if (-not $opensslPath) {
    Write-Host "ERROR: OpenSSL not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Install OpenSSL using one of these methods:" -ForegroundColor Yellow
    Write-Host "1. Via Chocolatey: choco install openssl" -ForegroundColor Cyan
    Write-Host "2. Via Git Bash (if Git is installed)" -ForegroundColor Cyan
    Write-Host "3. Download from https://slproweb.com/products/Win32OpenSSL.html" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or use Git Bash to run this command:" -ForegroundColor Yellow
    Write-Host "openssl req -x509 -newkey rsa:2048 -keyout certs/cert.key -out certs/cert.crt -days 365 -nodes -subj /CN=localhost" -ForegroundColor Cyan
    exit 1
}

# Generate certificate
Write-Host "Generating certificate..." -ForegroundColor Yellow
openssl req -x509 -newkey rsa:2048 -keyout certs/cert.key -out certs/cert.crt -days 365 -nodes -subj "/CN=localhost"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Certificates successfully created!" -ForegroundColor Green
    Write-Host "- certs/cert.key" -ForegroundColor Gray
    Write-Host "- certs/cert.crt" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Note: This is a self-signed certificate for development only." -ForegroundColor Yellow
    Write-Host "Browser may show a security warning - this is normal." -ForegroundColor Yellow
} else {
    Write-Host "Error generating certificate!" -ForegroundColor Red
    exit 1
}
