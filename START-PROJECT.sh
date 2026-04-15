#!/bin/bash

# Beskydy Tourism Website - Quick Start Script
# This script starts both backend and frontend servers

echo "🏔️  Starting Beskydy Tourism Website..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install it from https://www.python.org/"
    exit 1
fi

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    cd ..
fi

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "⚙️  Creating .env file from .env.example..."
    cp backend/.env.example backend/.env
    echo "✅ .env file created. Please update database credentials if needed."
fi

# Start PostgreSQL check
echo "🔍 Checking PostgreSQL database..."
echo "   Make sure PostgreSQL or Docker container is running on port 5433"
echo ""

# Start backend server in background
echo "🚀 Starting backend server on port 3001..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 5

# Start frontend server
echo "🌐 Starting frontend server on port 8080..."
python3 -m http.server 8080 &
FRONTEND_PID=$!

# Wait a bit for frontend to start
sleep 2

echo ""
echo "✅ Servers are running!"
echo ""
echo "📍 Access the website at:"
echo "   Frontend: http://localhost:8080"
echo "   Backend API: http://localhost:3001"
echo ""
echo "🔐 Demo credentials:"
echo "   Admin: admin@beskydy.cz / adminpass123"
echo "   User: user@beskydy.cz / userpass123"
echo ""
echo "⚠️  Press Ctrl+C to stop all servers"
echo ""

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    # Also kill any remaining processes
    pkill -f "node server.js" 2>/dev/null
    pkill -f "python3 -m http.server 8080" 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup INT TERM

# Keep script running
wait
