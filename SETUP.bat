@echo off
cd /d "%~dp0"
echo Downloading photos into assets\img (skips any already there) ...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0download-media.ps1"
echo.
echo Starting Lead Base Pro at http://localhost:5560
start "" http://localhost:5560
where python >nul 2>&1
if %errorlevel%==0 (
    python -m http.server 5560
) else (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Port 5560
)
