#!/bin/bash
set -e  # Exit on any error

# Function to cleanup processes
cleanup() {
    echo "Stopping servers..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    exit
}

# Trap SIGINT and SIGTERM
trap cleanup SIGINT SIGTERM EXIT

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "Error: backend directory not found"
    exit 1
fi

# Start the backend server
echo "Starting backend server..."
cd backend
if ! npm run dev & then
    echo "Error: Failed to start backend server"
    exit 1
fi
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "Waiting for backend to initialize..."
sleep 5

# Start the frontend server
echo "Starting frontend server..."
if ! npm run dev & then
    echo "Error: Failed to start frontend server"
    cleanup
    exit 1
fi
FRONTEND_PID=$!

echo "✅ Both servers are running!"
echo "📱 Frontend: http://localhost:3002"
echo "🔧 Backend: http://localhost:5000"
echo "⏹️  Press Ctrl+C to stop both servers"

# Wait for processes
wait