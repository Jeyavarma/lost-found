#!/bin/bash
set -e

echo "🚀 Starting MCC Lost & Found Application..."

# Function to cleanup processes
cleanup() {
    echo "📋 Stopping servers..."
    if [ ! -z "$BACKEND_PID" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
        kill "$BACKEND_PID" 2>/dev/null || true
        echo "✅ Backend server stopped"
    fi
    if [ ! -z "$FRONTEND_PID" ] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
        kill "$FRONTEND_PID" 2>/dev/null || true
        echo "✅ Frontend server stopped"
    fi
    exit 0
}

# Trap signals for cleanup
trap cleanup SIGINT SIGTERM EXIT

# Check directories exist
if [ ! -d "backend" ]; then
    echo "❌ Error: backend directory not found"
    exit 1
fi

# Start backend in background
echo "📡 Starting backend server..."
cd backend
if ! npm run dev & then
    echo "❌ Error: Failed to start backend"
    exit 1
fi
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 5

# Start frontend
echo "🌐 Starting frontend server..."
if ! npm run dev & then
    echo "❌ Error: Failed to start frontend"
    cleanup
    exit 1
fi
FRONTEND_PID=$!

echo "✅ Servers started successfully!"
echo "📡 Backend: http://localhost:5000"
echo "🌐 Frontend: http://localhost:3002"
echo ""
echo "⏹️ Press Ctrl+C to stop both servers"

# Wait for processes
wait