#!/bin/bash
# Quick Run Script for Frontend

cd "$(dirname "$0")"

echo "=========================================="
echo "Starting Frontend Development Server..."
echo "=========================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠ Dependencies not installed. Installing..."
    npm install
fi

echo "Starting Vite development server..."
echo "Frontend will be available at: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop"
echo ""

npm run dev
