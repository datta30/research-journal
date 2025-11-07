@echo off
REM Research Journal Management System - Quick Start Script (Windows)

echo ==========================================
echo Research Journal Management System
echo Quick Setup Script
echo ==========================================
echo.

REM Check Java
echo Checking Java installation...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo X Java is not installed. Please install JDK 17 or higher.
    exit /b 1
)
echo √ Java found

REM Check Maven
echo Checking Maven installation...
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ! Maven not found. Will use Maven wrapper.
) else (
    echo √ Maven found
)

REM Check Node.js
echo Checking Node.js installation...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo X Node.js is not installed. Please install Node.js 18 or higher.
    exit /b 1
)
echo √ Node.js found

REM Check MySQL
echo Checking MySQL installation...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ! MySQL command not found. Please ensure MySQL is installed and running.
) else (
    echo √ MySQL found
)

echo.
echo ==========================================
echo Setting up Backend...
echo ==========================================
cd backend

REM Create uploads directory
if not exist "uploads" mkdir uploads
echo √ Created uploads directory

REM Install backend dependencies
echo Installing Maven dependencies...
call mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo X Failed to install backend dependencies
    exit /b 1
)
echo √ Backend dependencies installed

echo.
echo ==========================================
echo Setting up Frontend...
echo ==========================================
cd ..\frontend

REM Install frontend dependencies
echo Installing npm dependencies...
call npm install
if %errorlevel% neq 0 (
    echo X Failed to install frontend dependencies
    exit /b 1
)
echo √ Frontend dependencies installed

cd ..

echo.
echo ==========================================
echo Setup Complete!
echo ==========================================
echo.
echo Next Steps:
echo 1. Ensure MySQL is running
echo 2. Create database: CREATE DATABASE research_journal_db;
echo 3. Update backend\src\main\resources\application.properties if needed
echo.
echo To start the application:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   mvn spring-boot:run
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm run dev
echo.
echo Then visit: http://localhost:5173
echo ==========================================
pause
