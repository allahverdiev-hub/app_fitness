@echo off
chcp 65001 >nul
cd /d "%~dp0"

where npm >nul 2>&1
if errorlevel 1 (
  echo.
  echo Node.js не найден.
  echo Установите с https://nodejs.org и перезапустите этот файл.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo Устанавливаю зависимости...
  call npm install
  if errorlevel 1 (
    echo Ошибка установки. Проверьте подключение к интернету.
    pause
    exit /b 1
  )
)

echo.
echo Запуск веб-прототипа...
echo Браузер откроется автоматически: http://localhost:5173
echo Чтобы остановить — закройте это окно или нажмите Ctrl+C
echo.

call npm run start

pause
