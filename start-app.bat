@echo off
echo Starting BFP Evacuation Simulation Application...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

REM Start the frontend and backend in parallel
echo Starting frontend server...
start "Frontend Server" cmd /c "npm run dev"

echo Starting backend server...
start "Backend Server" cmd /c "cd bfp-simulation-backend && python main.py"

echo.
echo Application started successfully!
echo.
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000
echo.
echo Note: Keep this window open to maintain both servers.
pause