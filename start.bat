@echo off
setlocal
title ResQCoord - Local Server
cd /d "%~dp0"

set "PORT=%~1"
if "%PORT%"=="" set "PORT=3000"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Node.js was not found on this computer.
  echo  Install the LTS version from https://nodejs.org, then run start.bat again.
  echo.
  pause
  exit /b 1
)

echo.
echo  Starting ResQCoord on http://localhost:%PORT%
echo  Keep this window open while you use the app.
echo  Press Ctrl+C to stop the server.
echo.

start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:%PORT%'"

node server.js %PORT%

echo.
echo  The server has stopped.
pause
