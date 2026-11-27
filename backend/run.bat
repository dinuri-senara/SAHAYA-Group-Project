@echo off
title SAHAYA Backend Services
echo ====================================================
echo Starting SAHAYA Backend Microservices Architecture
echo ====================================================

echo [1/5] Starting Sahaya.Identity.API (Port 5001)...
start "Sahaya.Identity.API (5001)" cmd /k "cd src\Services\Identity.API && dotnet run"

timeout /t 2 /nobreak >nul

echo [2/5] Starting Sahaya.Assistance.API (Port 5002)...
start "Sahaya.Assistance.API (5002)" cmd /k "cd src\Services\Assistance.API && dotnet run"

timeout /t 2 /nobreak >nul

echo [3/5] Starting Sahaya.Coordination.API (Port 5003)...
start "Sahaya.Coordination.API (5003)" cmd /k "cd src\Services\Coordination.API && dotnet run"

timeout /t 2 /nobreak >nul

echo [4/5] Starting Sahaya.Logistics.API (Port 5004)...
start "Sahaya.Logistics.API (5004)" cmd /k "cd src\Services\Logistics.API && dotnet run"

timeout /t 2 /nobreak >nul

echo [5/5] Starting Sahaya.Gateway (Port 5000)...
start "Sahaya.Gateway (5000)" cmd /k "cd src\Sahaya.Gateway && dotnet run"

echo.
echo ====================================================
echo All Backend Services are running!
echo Gateway URL:          http://localhost:5000
echo Identity Swagger:     http://localhost:5001/swagger
echo Assistance Swagger:   http://localhost:5002/swagger
echo Coordination Swagger: http://localhost:5003/swagger
echo Logistics Swagger:    http://localhost:5004/swagger
echo ====================================================
