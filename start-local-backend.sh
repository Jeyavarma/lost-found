#!/bin/bash

echo "🚀 Starting Local Backend for Vercel Frontend..."

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok not found. Installing..."
    npm install -g ngrok
fi

# Start backend in background
echo "📡 Starting backend server..."
cd backend && npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start ngrok tunnel
echo "🌐 Creating ngrok tunnel..."
ngrok http 5000 &
NGROK_PID=$!

echo "✅ Setup complete!"
echo "📋 Next steps:"
echo "1. Copy the ngrok HTTPS URL from the terminal"
echo "2. Update NEXT_PUBLIC_BACKEND_URL in Vercel dashboard"
echo "3. Your Vercel frontend will connect to your local backend"

# Cleanup function
cleanup() {
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID $NGROK_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Wait for processes
wait