@echo off
title SAHAYA Backend Services
echo ====================================================
echo Starting SAHAYA Backend Microservices Architecture
echo ====================================================

echo [1/2] Starting Sahaya.Identity.API (Port 5001)...
start "Sahaya.Identity.API (5001)" cmd /k "dotnet run --project \"src\Services\Identity.API\Sahaya.Identity.API.csproj\""

timeout /t 2 /nobreak >nul

echo [2/2] Starting Sahaya.Gateway (Port 5000)...
start "Sahaya.Gateway (5000)" cmd /k "dotnet run --project \"src\Sahaya.Gateway\Sahaya.Gateway.csproj\""

echo.
echo ====================================================
echo All Backend Services are running!
echo Gateway URL: http://localhost:5000
echo Swagger UI:  http://localhost:5001/swagger
echo ====================================================
