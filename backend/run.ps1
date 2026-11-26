Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Starting SAHAYA Backend Microservices Architecture" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

Write-Host "[1/2] Starting Sahaya.Identity.API (Port 5001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "dotnet run --project 'src/Services/Identity.API/Sahaya.Identity.API.csproj'"

Start-Sleep -Seconds 2

Write-Host "[2/2] Starting Sahaya.Gateway (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "dotnet run --project 'src/Sahaya.Gateway/Sahaya.Gateway.csproj'"

Write-Host ""
Write-Host "All Backend Services are running!" -ForegroundColor Green
Write-Host "Gateway: http://localhost:5000" -ForegroundColor Green
Write-Host "Swagger: http://localhost:5001/swagger" -ForegroundColor Green
