@echo off
echo Starting Study Spark...
echo.

:: Start backend in a new window
start "Study Spark Backend" cmd /c "cd /d %~dp0backend && npm run dev"

:: Wait a moment for backend to boot
timeout /t 2 /nobreak >nul

:: Start frontend
cd /d %~dp0
cmd /c npm run dev
