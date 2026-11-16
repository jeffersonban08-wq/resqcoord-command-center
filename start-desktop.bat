@echo off
setlocal
title ResQCoord Desktop
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Node.js was not found on this computer.
  echo  Install the LTS version from https://nodejs.org, then run this file again.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\electron" (
  echo.
  echo  First run: installing Electron. This can take a few minutes...
  echo.
  call npm install
  if errorlevel 1 (
    echo.
    echo  npm install failed. Check your internet connection and try again.
    echo.
    pause
    exit /b 1
  )
)

echo.
echo  Starting ResQCoord desktop app...
echo.
call npm start

echo.
echo  ResQCoord has closed.
pause
