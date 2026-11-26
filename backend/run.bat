@echo off
title SAHAYA Backend Services
echo ====================================================
echo Starting SAHAYA Backend Microservices Architecture
echo ====================================================

echo [1/2] Starting Sahaya.Identity.API (Port 5001)...
start "Sahaya.Identity.API (5001)" cmd /k "cd /d \"C:\Users\Nawam\OneDrive\Desktop\SA\SAHAYA-Project\sahaya-app\backend\src\Services\Identity.API\" && dotnet run"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Sahaya.Gateway (Port 5000)...
start "Sahaya.Gateway (5000)" cmd /k "cd /d \"C:\Users\Nawam\OneDrive\Desktop\SA\SAHAYA-Project\sahaya-app\backend\src\Sahaya.Gateway\" && dotnet run"

echo.
echo ====================================================
echo Backend running!
echo Swagger: http://localhost:5001/swagger
echo Gateway: http://localhost:5000
echo ====================================================
