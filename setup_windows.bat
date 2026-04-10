@echo off
title NutriSnap - Windows Setup
color 0A

echo.
echo  ╔═══════════════════════════════════════╗
echo  ║       NutriSnap - Windows Setup       ║
echo  ║   Food Calorie Estimation Project     ║
echo  ╚═══════════════════════════════════════╝
echo.

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed!
    echo.
    echo Please download Python from: https://www.python.org/downloads/
    echo IMPORTANT: Check "Add Python to PATH" during installation!
    echo.
    echo After installing Python, run this script again.
    pause
    exit /b 1
)

echo [1/4] Python found:
python --version
echo.

:: Check pip
pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] pip not found. Reinstall Python with "Add to PATH" checked.
    pause
    exit /b 1
)

:: Install dependencies
echo [2/4] Installing dependencies (this may take a few minutes)...
echo.
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
pip install flask pillow numpy pandas matplotlib seaborn tqdm
echo.

:: Check if model exists
if not exist "models\best_model.pth" (
    echo [WARNING] Trained model not found at models\best_model.pth
    echo The app needs the trained model to work.
    echo Please make sure best_model.pth is in the models folder.
    echo.
)

echo [3/4] Setup complete!
echo.
echo [4/4] Creating run shortcut...

:: Create run script
echo @echo off > run_nutrisnap.bat
echo title NutriSnap >> run_nutrisnap.bat
echo color 0A >> run_nutrisnap.bat
echo echo. >> run_nutrisnap.bat
echo echo Starting NutriSnap... >> run_nutrisnap.bat
echo echo. >> run_nutrisnap.bat
echo python app.py >> run_nutrisnap.bat
echo pause >> run_nutrisnap.bat

echo.
echo  ═══════════════════════════════════════
echo  Setup Complete!
echo.
echo  To run the app:
echo    Double-click "run_nutrisnap.bat"
echo    OR type: python app.py
echo.
echo  Then open: http://localhost:5000
echo  ═══════════════════════════════════════
echo.
pause
