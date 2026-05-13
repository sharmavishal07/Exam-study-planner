@echo off
echo Starting Study Spark (Cloud-Ready Mode)...
echo.

:: Check if DATABASE_URL contains placeholder
findstr "[YOUR-PASSWORD]" .env >nul
if %errorlevel% == 0 (
    echo [WARNING] You haven't set your database password in the .env file yet!
    echo Please open .env and replace [YOUR-PASSWORD] with your real Supabase password.
    echo.
    pause
)

:: Start backend
start "Study Spark Backend" cmd /c "cd /d %~dp0backend && npm start"

:: Wait a moment
timeout /t 2 /nobreak >nul

:: Start frontend
cd /d %~dp0
cmd /c npm run dev
