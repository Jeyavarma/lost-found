# Deployment Guide - Vercel + MongoDB Atlas

## 1. Setup MongoDB Atlas (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create new cluster (M0 Sandbox - Free)
4. Create database user
5. Whitelist IP addresses (0.0.0.0/0 for all)
6. Get connection string

## 2. Deploy to Vercel

### Option A: GitHub Integration
```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/mcc-lost-found.git
git push -u origin main

# Deploy via Vercel dashboard
# 1. Connect GitHub repo
# 2. Import project
# 3. Add environment variables
```

### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add NEXT_PUBLIC_BACKEND_URL
```

## 3. Environment Variables

Add these in Vercel dashboard:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mcc-lost-found
JWT_SECRET=your-super-secret-jwt-key-here
NEXT_PUBLIC_BACKEND_URL=https://your-app.vercel.app
```

## 4. File Structure for Vercel

```
/api/index.js          # Serverless backend entry
/app/                  # Next.js frontend
/backend/              # Backend code (used by API)
/vercel.json          # Vercel configuration
```

## 5. Quick Deploy Commands

```bash
# Build and deploy
npm run build
vercel --prod

# Or auto-deploy on git push (recommended)
vercel --prod --confirm
```

Your app will be live at: `https://your-app.vercel.app`