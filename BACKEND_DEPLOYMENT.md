# Backend Deployment Steps

## Step 1: Update Vercel Configuration
Your frontend is already deployed. Now add backend as serverless functions.

## Step 2: Add Environment Variables in Vercel Dashboard
Go to your Vercel project → Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://2024178026_db_user:1DUnoM4iWPsDFQ0b@lostandfound.6mo1sey.mongodb.net/mcc-lost-found?retryWrites=true&w=majority&appName=lostAndFound

JWT_SECRET=mcc-lost-found-production-secret-2024

NEXT_PUBLIC_BACKEND_URL=https://your-vercel-app-url.vercel.app
```

## Step 3: Deploy Backend
```bash
# Push changes to trigger redeploy
git add .
git commit -m "Add backend API routes"
git push origin main
```

## Step 4: Test API Endpoints
After deployment, test:
- https://your-app.vercel.app/api/items
- https://your-app.vercel.app/api/auth/login

## Step 5: Update Frontend URLs
Replace localhost URLs with your Vercel URL in the frontend code.