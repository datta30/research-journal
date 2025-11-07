#!/bin/bash
# Quick Run Script for Backend

cd "$(dirname "$0")"

echo "=========================================="
echo "Starting Backend Server..."
echo "=========================================="
echo ""

# Check if MySQL is running
if ! sudo systemctl is-active --quiet mysqld; then
    echo "⚠ MySQL is not running. Starting MySQL..."
    sudo systemctl start mysqld
    sleep 2
fi

# Check if uploads directory exists
if [ ! -d "uploads" ]; then
    mkdir uploads
    echo "✓ Created uploads directory"
fi

echo "Starting Spring Boot application..."
echo "Backend will be available at: http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop"
echo ""

if [ -f "mvnw" ]; then
    ./mvnw spring-boot:run
else
    mvn spring-boot:run
fi
