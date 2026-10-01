@echo off
title SmartScreener Launcher
echo ====================================================
echo           SMARTSCREENER STARTUP LAUNCHER            
echo ====================================================
echo.

set "BASE_DIR=%~dp0"
if exist "%BASE_DIR%backend" (
    set "PROJ_DIR=%BASE_DIR%"
) else if exist "%BASE_DIR%smartscreener-main\backend" (
    set "PROJ_DIR=%BASE_DIR%smartscreener-main\"
) else (
    echo [ERROR] Could not find backend directory.
    pause
    exit /b 1
)

:: 1. Detect Python command
set "PY_CMD="
where python >nul 2>&1
if %errorlevel% equ 0 (
    set "PY_CMD=python"
) else (
    where py >nul 2>&1
    if %errorlevel% equ 0 (
        set "PY_CMD=py"
    )
)

if "%PY_CMD%"=="" (
    echo [ERROR] Python is not installed or not found in system PATH.
    echo Please install Python 3.10+ from https://www.python.org/
    echo Remember to check "Add python.exe to PATH" during installation.
    echo.
    pause
    exit /b 1
)

:: 2. Detect Node.js & npm
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or npm was not found in system PATH.
    echo Please install Node.js LTS from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Python and Node.js detected.

:: 3. Check Ollama status
curl -s -f http://localhost:11434/ >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Ollama LLM is running locally.
) else (
    echo [INFO] Ollama not detected on port 11434. Local NLP Fallback will be used.
)
echo.

:: 4. Backend Setup
if not exist "%PROJ_DIR%backend\venv" (
    echo [1/2] Creating Python virtual environment in backend...
    %PY_CMD% -m venv "%PROJ_DIR%backend\venv"
    echo [1/2] Installing backend dependencies with pip...
    call "%PROJ_DIR%backend\venv\Scripts\activate.bat"
    pip install -r "%PROJ_DIR%backend\requirements.txt"
) else (
    echo [1/2] Backend virtual environment already exists.
)

:: 5. Frontend Setup
if not exist "%PROJ_DIR%frontend\node_modules" (
    echo [2/2] Installing frontend dependencies with npm. Please wait...
    cd /d "%PROJ_DIR%frontend"
    call npm install
    cd /d "%BASE_DIR%"
) else (
    echo [2/2] Frontend dependencies already installed.
)

echo.
echo ====================================================
echo Starting Backend on port 8000 and Frontend on port 3000...
echo ====================================================

start "SmartScreener Backend - FastAPI" cmd /k "cd /d "%PROJ_DIR%backend" && call venv\Scripts\activate.bat && %PY_CMD% -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

start "SmartScreener Frontend - Next.js" cmd /k "cd /d "%PROJ_DIR%frontend" && npm run dev"

echo.
echo ====================================================
echo   Servers launched!
echo   - Web Interface:  http://localhost:3000
echo   - API Docs:       http://localhost:8000/docs
echo.
echo   Wait a few seconds for Next.js to compile,
echo   then open http://localhost:3000 in your browser.
echo ====================================================
echo.
pause
