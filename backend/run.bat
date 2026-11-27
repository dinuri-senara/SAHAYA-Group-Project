@echo off
title SAHAYA Backend Services
echo ====================================================
echo Starting SAHAYA Backend Microservices Architecture
echo ====================================================

echo [1/3] Starting Sahaya.Identity.API (Port 5001)...
start "Sahaya.Identity.API (5001)" cmd /k "cd /d \"%~dp0src\Services\Identity.API\" && dotnet run"

timeout /t 2 /nobreak >nul

echo [2/3] Starting Sahaya.AIIntelligence.API (Port 5005) - Member 5...
start "Sahaya.AIIntelligence.API (5005)" cmd /k "cd /d \"%~dp0src\Services\AIIntelligence.API\" && dotnet run"

timeout /t 2 /nobreak >nul

echo [3/3] Starting Sahaya.Gateway (Port 5000)...
start "Sahaya.Gateway (5000)" cmd /k "cd /d \"%~dp0src\Sahaya.Gateway\" && dotnet run"

echo.
echo ====================================================
echo All Backend Services running!
echo Gateway: http://localhost:5000
echo Identity Swagger: http://localhost:5001/swagger
echo AI Swagger: http://localhost:5005/swagger
echo ====================================================
