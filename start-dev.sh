#!/bin/bash

# Start the backend server
echo "Starting backend server..."
cd backend && npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start the frontend server
echo "Starting frontend server..."
cd .. && npm run dev &
FRONTEND_PID=$!

# Function to cleanup processes
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Trap SIGINT and SIGTERM
trap cleanup SIGINT SIGTERM

echo "Both servers are running!"
echo "Frontend: http://localhost:3002"
echo "Backend: http://localhost:5000"
echo "Press Ctrl+C to stop both servers"

# Wait for processes
wait