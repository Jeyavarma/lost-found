#!/bin/bash

echo "🚀 Deploying MCC Lost & Found to Vercel..."

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm i -g vercel
fi

# Deploy to Vercel
vercel --prod

echo "✅ Deployment complete!"
echo "📝 Don't forget to set environment variables in Vercel dashboard:"
echo "   MONGODB_URI=mongodb+srv://2024178026_db_user:1DUnoM4iWPsDFQ0b@lostandfound.6mo1sey.mongodb.net/mcc-lost-found?retryWrites=true&w=majority&appName=lostAndFound"
echo "   JWT_SECRET=mcc-lost-found-production-secret-2024"
echo "   NEXT_PUBLIC_BACKEND_URL=https://your-app.vercel.app"