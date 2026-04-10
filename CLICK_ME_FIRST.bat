@echo off
title NutriSnap Setup and Run
color 0A
cd /d "%~dp0"

echo.
echo  ╔═══════════════════════════════════════════╗
echo  ║         NutriSnap - One Click Setup       ║
echo  ║    Food Calorie Estimation from Photos    ║
echo  ╚═══════════════════════════════════════════╝
echo.

:: Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [!!] Python is NOT installed on this computer.
    echo.
    echo  ┌─────────────────────────────────────────┐
    echo  │  Go to: https://www.python.org/downloads │
    echo  │  Download and install Python 3.11+       │
    echo  │                                          │
    echo  │  IMPORTANT: On the installer, CHECK the  │
    echo  │  box that says "Add Python to PATH"      │
    echo  │                                          │
    echo  │  After installing, double-click this      │
    echo  │  file again.                             │
    echo  └─────────────────────────────────────────┘
    echo.
    start https://www.python.org/downloads/
    pause
    exit /b 1
)

echo  [OK] Python found:
python --version
echo.

:: Install packages
echo  [1/3] Installing required packages...
echo        (This will take 2-5 minutes on first run)
echo.
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu >nul 2>&1
if %errorlevel% neq 0 (
    pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
)
pip install flask pillow numpy pandas matplotlib seaborn tqdm >nul 2>&1
echo  [OK] Packages installed.
echo.

:: Check model
if not exist "models\best_model.pth" (
    echo  [!!] ERROR: Model file not found!
    echo       models\best_model.pth is missing.
    echo       The app cannot work without the trained model.
    pause
    exit /b 1
)
echo  [2/3] Model file found.
echo.

:: Change port to 8080 in app.py to avoid macOS AirPlay conflict on Windows too
echo  [3/3] Starting NutriSnap...
echo.
echo  ═══════════════════════════════════════════
echo    Opening browser at http://localhost:5000
echo    Keep this window OPEN while using the app
echo    Close this window to stop the server
echo  ═══════════════════════════════════════════
echo.

:: Open browser after 3 sec delay
start "" cmd /c "timeout /t 4 /nobreak >nul && start http://localhost:5000"

:: Run Flask
python app.py

pause
