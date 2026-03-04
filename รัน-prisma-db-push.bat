@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo กำลังอัปเดตตารางในฐานข้อมูลตาม schema.prisma ...
echo.
npx prisma db push
echo.
pause
