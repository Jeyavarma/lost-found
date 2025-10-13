#!/bin/bash
set -e

echo "🚀 Deploying MCC Lost & Found to Vercel..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the project root?"
    exit 1
fi

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    if ! npm i -g vercel; then
        echo "❌ Error: Failed to install Vercel CLI"
        exit 1
    fi
fi

# Build the project first
echo "🔨 Building project..."
if ! npm run build; then
    echo "❌ Error: Build failed"
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
if ! vercel --prod; then
    echo "❌ Error: Deployment failed"
    exit 1
fi

echo "✅ Deployment complete!"
echo "⚠️ SECURITY WARNING: Remove hardcoded credentials!"
echo "📋 Set these environment variables in Vercel dashboard:"
echo "   MONGODB_URI=<your-mongodb-connection-string>"
echo "   JWT_SECRET=<generate-strong-random-secret>"
echo "   NEXT_PUBLIC_BACKEND_URL=<your-backend-url>"
echo "🔒 Never commit real credentials to version control!"