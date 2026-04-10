@echo off
title NutriSnap
color 0A
cd /d "%~dp0"

echo.
echo  ╔═══════════════════════════════════════╗
echo  ║          🍽 NutriSnap v1.0            ║
echo  ╚═══════════════════════════════════════╝
echo.

:: Quick checks
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [X] Python not found. Run CLICK_ME_FIRST.bat first.
    pause
    exit /b 1
)
echo  [OK] Python

python -c "import torch" >nul 2>&1
if %errorlevel% neq 0 (
    echo  [X] PyTorch not installed. Run CLICK_ME_FIRST.bat first.
    pause
    exit /b 1
)
echo  [OK] PyTorch

python -c "import flask" >nul 2>&1
if %errorlevel% neq 0 (
    echo  [X] Flask not installed. Run CLICK_ME_FIRST.bat first.
    pause
    exit /b 1
)
echo  [OK] Flask

if not exist "models\best_model.pth" (
    echo  [X] Model file missing. Cannot run.
    pause
    exit /b 1
)
echo  [OK] Model
echo.
echo  All checks passed! Starting server...
echo.
echo  ═══════════════════════════════════════
echo    Browser will open at localhost:5000
echo    Keep this window OPEN
echo    Close this window to stop
echo  ═══════════════════════════════════════
echo.

start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:5000"
python app.py
pause
