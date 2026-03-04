@echo off
chcp 65001 >nul
title พัทยา พร็อพเพอร์ตี้
echo.
echo ========================================
echo   พัทยา พร็อพเพอร์ตี้ - กำลังเริ่ม...
echo ========================================
echo.

cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
    echo [ผิดพลาด] ยังไม่มี Node.js
    echo.
    echo กรุณาติดตั้ง Node.js ก่อน:
    echo 1. เปิดเบราว์เซอร์ไปที่ https://nodejs.org
    echo 2. กด Download แล้วติดตั้ง
    echo 3. ปิดหน้าต่างนี้ แล้วลองดับเบิลคลิก start.bat อีกครั้ง
    echo.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo กำลังติดตั้งแพ็กเกจ... รอสักครู่
    echo.
    call npm install
    if errorlevel 1 (
        echo ติดตั้งไม่สำเร็จ
        pause
        exit /b 1
    )
    echo.
)

echo กำลังเปิดเว็บเซิร์ฟเวอร์...
echo.
echo เมื่อเห็นคำว่า "Ready" ด้านล่าง
echo ให้เปิดเบราว์เซอร์ไปที่:  http://localhost:3000
echo.
echo กด Ctrl+C เพื่อปิดเซิร์ฟเวอร์
echo ========================================
echo.

call npm run dev

pause
