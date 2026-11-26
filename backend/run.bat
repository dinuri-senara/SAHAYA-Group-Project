@echo off
title SAHAYA Backend Services
echo ====================================================
echo Starting SAHAYA Backend Microservices Architecture
echo ====================================================

echo [1/4] Starting Sahaya.Identity.API (Port 5001)...
start "Sahaya.Identity.API (5001)" cmd /k "dotnet run --project \"src\Services\Identity.API\Sahaya.Identity.API.csproj\""

timeout /t 2 /nobreak >nul

echo [2/4] Starting Sahaya.Assistance.API (Port 5002)...
start "Sahaya.Assistance.API (5002)" cmd /k "dotnet run --project \"src\Services\Assistance.API\Sahaya.Assistance.API.csproj\""

timeout /t 2 /nobreak >nul

echo [3/4] Starting Sahaya.Coordination.API (Port 5003)...
start "Sahaya.Coordination.API (5003)" cmd /k "dotnet run --project \"src\Services\Coordination.API\Sahaya.Coordination.API.csproj\""

timeout /t 2 /nobreak >nul

echo [4/4] Starting Sahaya.Gateway (Port 5000)...
start "Sahaya.Gateway (5000)" cmd /k "dotnet run --project \"src\Sahaya.Gateway\Sahaya.Gateway.csproj\""

echo.
echo ====================================================
echo All Backend Services are running!
echo Gateway URL:          http://localhost:5000
echo Identity Swagger:     http://localhost:5001/swagger
echo Assistance Swagger:   http://localhost:5002/swagger
echo Coordination Swagger: http://localhost:5003/swagger
echo ====================================================
