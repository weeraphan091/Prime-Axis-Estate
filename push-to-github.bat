@echo off
chcp 65001 >nul
echo ========================================
echo   ส่งโปรเจกต์ขึ้น GitHub
echo ========================================
echo.

REM === แก้บรรทัดด้านล่าง: ใส่ลิงก์ repo ของคุณ (จาก GitHub) ===
REM ตัวอย่าง: https://github.com/username/prime-axis-estate.git
set GITHUB_URL=https://github.com/weeraphan091/Prime-Axis-Estate.git
echo ลิงก์ repo ที่ตั้งไว้: %GITHUB_URL%
echo.
if "%GITHUB_URL%"=="https://github.com/ใส่ชื่อuser/ใส่ชื่อrepo.git" (
  echo [ผิดพลาด] กรุณาเปิดไฟล์ push-to-github.bat ด้วย Notepad
  echo แล้วแก้บรรทัด set GITHUB_URL= ให้เป็นลิงก์ repo จริงของคุณ
  pause
  exit /b 1
)

if not exist .git (
  echo กำลัง git init...
  git init
  echo.
)

echo กำลัง add ไฟล์...
git add .
echo.
echo กำลัง commit...
git commit -m "Initial: PRIME AXIS ESTATE website" 2>nul || git commit -m "Update"
echo.
echo กำลังตั้งค่า remote และ push...
git remote remove origin 2>nul
git remote add origin %GITHUB_URL%
git branch -M main
git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
  echo [สำเร็จ] ส่งขึ้น GitHub เรียบร้อย
) else (
  echo [ไม่สำเร็จ] ถ้ายังไม่เคยล็อกอิน GitHub ในเครื่องนี้
  echo   - ไปที่ github.com ^> Settings ^> Developer settings ^> Personal access tokens
  echo   - สร้าง Token แล้วเวลามันถาม Password ให้วาง Token แทนรหัสผ่าน
)
echo.
pause
