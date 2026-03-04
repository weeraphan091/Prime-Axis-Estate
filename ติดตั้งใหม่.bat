@echo off
chcp 65001 >nul
title ติดตั้งใหม่
cd /d "%~dp0"

echo ล้าง cache และติดตั้งใหม่...
call npm cache clean --force
call npm install --prefer-offline --no-audit --no-fund

echo.
echo เสร็จแล้ว ถ้าสำเร็จ ให้รัน start.bat อีกครั้ง
pause
