@echo off
title SAHAYA Backend Services
echo ====================================================
echo Starting SAHAYA Backend Microservices Architecture
echo ====================================================

echo [1/3] Starting Sahaya.Identity.API (Port 5001)...
start "Sahaya.Identity.API (5001)" cmd /k "dotnet run --project \"src\Services\Identity.API\Sahaya.Identity.API.csproj\""

timeout /t 2 /nobreak >nul

echo [2/3] Starting Sahaya.Logistics.API (Port 5004)...
start "Sahaya.Logistics.API (5004)" cmd /k "dotnet run --project \"src\Services\Logistics.API\Sahaya.Logistics.API.csproj\""

timeout /t 2 /nobreak >nul

echo [3/3] Starting Sahaya.Gateway (Port 5000)...
start "Sahaya.Gateway (5000)" cmd /k "dotnet run --project \"src\Sahaya.Gateway\Sahaya.Gateway.csproj\""

echo.
echo ====================================================
echo All Backend Services are running!
echo Gateway URL:        http://localhost:5000
echo Identity Swagger:   http://localhost:5001/swagger
echo Logistics Swagger:  http://localhost:5004/swagger
echo ====================================================
