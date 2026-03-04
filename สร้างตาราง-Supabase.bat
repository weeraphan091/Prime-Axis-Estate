@echo off
chcp 65001 >nul
echo ========================================
echo   สร้างตารางและข้อมูลเริ่มต้นใน Supabase
echo ========================================
echo.
echo ถ้าใส่ DATABASE_URL ใน .env แล้ว — กดปุ่มใดก็ได้เพื่อสร้างตาราง
echo (ถ้ายังไม่ใส่ ดูวิธีเอา connection string ใน ต่อ-Supabase-ทำตามนี้.md)
echo.
pause
echo กำลัง prisma db push...
call npx prisma db push
if %ERRORLEVEL% NEQ 0 (
  echo [ผิดพลาด] ไม่สามารถเชื่อมต่อ DB ได้ — ตรวจสอบ DATABASE_URL ใน .env
  pause
  exit /b 1
)
echo.
echo กำลัง seed ข้อมูล...
call npm run db:seed
echo.
echo เสร็จแล้ว
pause
