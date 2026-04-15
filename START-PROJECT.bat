@echo off
REM Beskydy Tourism Website - Quick Start Script for Windows

echo.
echo Starting Beskydy Tourism Website...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Python is not installed. Please install it from https://www.python.org/
    pause
    exit /b 1
)

REM Check if backend dependencies are installed
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

REM Check if .env file exists
if not exist "backend\.env" (
    echo Creating .env file from .env.example...
    copy "backend\.env.example" "backend\.env"
    echo .env file created. Please update database credentials if needed.
)

echo.
echo Starting backend server on port 3001...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo.
echo Starting frontend server on port 8080...
start "Frontend Server" cmd /k "python -m http.server 8080"

echo.
echo ========================================
echo Servers are running!
echo ========================================
echo.
echo Frontend: http://localhost:8080
echo Backend API: http://localhost:3001
echo.
echo Demo credentials:
echo   Admin: admin@beskydy.cz / adminpass123
echo   User: user@beskydy.cz / userpass123
echo.
echo Close the server windows to stop the servers.
echo.
pause
