Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Starting SAHAYA Backend Microservices Architecture" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

Write-Host "[1/3] Starting Sahaya.Identity.API (Port 5001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "dotnet run --project 'src/Services/Identity.API/Sahaya.Identity.API.csproj'"

Start-Sleep -Seconds 2

Write-Host "[2/3] Starting Sahaya.Coordination.API (Port 5003)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "dotnet run --project 'src/Services/Coordination.API/Sahaya.Coordination.API.csproj'"

Start-Sleep -Seconds 2

Write-Host "[3/3] Starting Sahaya.Gateway (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "dotnet run --project 'src/Sahaya.Gateway/Sahaya.Gateway.csproj'"

Write-Host ""
Write-Host "====================================================" -ForegroundColor Green
Write-Host "All Backend Services are running!" -ForegroundColor Green
Write-Host "Gateway:              http://localhost:5000" -ForegroundColor Green
Write-Host "Identity Swagger:     http://localhost:5001/swagger" -ForegroundColor Green
Write-Host "Coordination Swagger: http://localhost:5003/swagger" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
