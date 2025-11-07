#!/bin/bash

# Research Journal Management System - Quick Start Script

echo "=========================================="
echo "Research Journal Management System"
echo "Quick Setup Script"
echo "=========================================="
echo ""

# Check Java
echo "Checking Java installation..."
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install JDK 17 or higher."
    exit 1
fi
echo "✓ Java found: $(java -version 2>&1 | head -n 1)"

# Check Maven
echo "Checking Maven installation..."
if ! command -v mvn &> /dev/null; then
    echo "⚠ Maven not found. Will use Maven wrapper."
else
    echo "✓ Maven found: $(mvn -version | head -n 1)"
fi

# Check Node.js
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi
echo "✓ Node.js found: $(node -v)"

# Check MySQL
echo "Checking MySQL installation..."
if ! command -v mysql &> /dev/null; then
    echo "⚠ MySQL command not found. Please ensure MySQL is installed and running."
else
    echo "✓ MySQL found"
fi

echo ""
echo "=========================================="
echo "Setting up Backend..."
echo "=========================================="
cd backend

# Create uploads directory
mkdir -p uploads
echo "✓ Created uploads directory"

# Install backend dependencies
echo "Installing Maven dependencies..."
if [ -f "mvnw" ]; then
    ./mvnw clean install -DskipTests
elif command -v mvn &> /dev/null; then
    mvn clean install -DskipTests
else
    echo "❌ Maven not found and wrapper not available"
    exit 1
fi
if [ $? -eq 0 ]; then
    echo "✓ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo ""
echo "=========================================="
echo "Setting up Frontend..."
echo "=========================================="
cd ../frontend

# Install frontend dependencies
echo "Installing npm dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "✓ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next Steps:"
echo "1. Ensure MySQL is running"
echo "2. Create database: CREATE DATABASE research_journal_db;"
echo "3. Update backend/src/main/resources/application.properties if needed"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  mvn spring-boot:run"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then visit: http://localhost:5173"
echo "=========================================="
