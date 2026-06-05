@echo off
chcp 65001 >nul
cd /d "%~dp0"

where npm >nul 2>&1
if errorlevel 1 (
  echo Node.js не найден. Установите с https://nodejs.org
  pause
  exit /b 1
)

if not exist "node_modules\" call npm install

echo Сборка статической веб-версии...
call npm run build
if errorlevel 1 (
  pause
  exit /b 1
)

echo.
echo Готово. Папка dist — можно выложить на любой хостинг.
echo Сейчас откроется локальный просмотр: http://localhost:4173
echo.

call npm run preview

pause
