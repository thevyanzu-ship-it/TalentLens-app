Write-Host "====================================================" -ForegroundColor Magenta
Write-Host "          SMARTSCREENER STARTUP LAUNCHER            " -ForegroundColor Magenta
Write-Host "====================================================" -ForegroundColor Magenta
Write-Host ""

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path

if (Test-Path "$baseDir\backend") {
    $projDir = $baseDir
} elseif (Test-Path "$baseDir\smartscreener-main\backend") {
    $projDir = "$baseDir\smartscreener-main"
} else {
    Write-Host "[ERROR] Could not find backend directory!" -ForegroundColor Red
    pause
    exit 1
}

# 1. Check Python
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Python is not installed or not in PATH!" -ForegroundColor Red
    Write-Host "Please install Python 3.10+ from https://www.python.org/ (Check 'Add python.exe to PATH')"
    pause
    exit 1
}

# 2. Check Node / npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js / npm is not installed or not in PATH!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/"
    pause
    exit 1
}

Write-Host "[OK] Python and Node.js detected." -ForegroundColor Green

# 3. Check Ollama
try {
    $null = Invoke-WebRequest -Uri "http://localhost:11434/" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
    Write-Host "[OK] Ollama LLM is running locally." -ForegroundColor Green
} catch {
    Write-Host "[INFO] Ollama is not detected at http://localhost:11434/." -ForegroundColor Yellow
    Write-Host "       The application will automatically start in Local NLP Fallback mode." -ForegroundColor Yellow
}
Write-Host ""

# 4. Backend setup
if (-not (Test-Path "$projDir\backend\venv")) {
    Write-Host "[1/2] Creating Python virtual environment in backend..." -ForegroundColor Cyan
    python -m venv "$projDir\backend\venv"
    Write-Host "[1/2] Installing Python backend packages..." -ForegroundColor Cyan
    & "$projDir\backend\venv\Scripts\pip.exe" install -r "$projDir\backend\requirements.txt"
} else {
    Write-Host "[1/2] Backend virtual environment already exists." -ForegroundColor Green
}

# 5. Frontend setup
if (-not (Test-Path "$projDir\frontend\node_modules")) {
    Write-Host "[2/2] Installing frontend npm packages (this may take 1-2 minutes)..." -ForegroundColor Cyan
    Push-Location "$projDir\frontend"
    npm install
    Pop-Location
} else {
    Write-Host "[2/2] Frontend dependencies already installed." -ForegroundColor Green
}

Write-Host ""
Write-Host "====================================================" -ForegroundColor Magenta
Write-Host "Starting Backend and Frontend in separate windows..." -ForegroundColor Magenta
Write-Host "====================================================" -ForegroundColor Magenta

# Launch Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projDir\backend'; .\venv\Scripts\Activate.ps1; python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

# Launch Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projDir\frontend'; npm run dev"

Write-Host ""
Write-Host "====================================================" -ForegroundColor Green
Write-Host "  Servers are starting up!" -ForegroundColor Green
Write-Host "  - Web Interface:  http://localhost:3000" -ForegroundColor Green
Write-Host "  - API Swagger:    http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""
Write-Host "  Wait ~10-15 seconds for Next.js to compile," -ForegroundColor Green
Write-Host "  then open http://localhost:3000 in your browser!" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""
pause
