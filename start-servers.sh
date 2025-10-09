#!/bin/bash

echo "🚀 Starting MCC Lost & Found Application..."

# Start backend in background
echo "📡 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "🌐 Starting frontend server..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo "✅ Servers started!"
echo "📡 Backend: http://localhost:5000"
echo "🌐 Frontend: http://localhost:3002"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait