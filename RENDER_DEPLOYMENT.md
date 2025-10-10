# Deploy Backend to Render (Free)

## Step 1: Create render.yaml
```yaml
services:
  - type: web
    name: mcc-lost-found-backend
    env: node
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: MONGODB_URI
        value: mongodb+srv://2024178026_db_user:1DUnoM4iWPsDFQ0b@lostandfound.6mo1sey.mongodb.net/mcc-lost-found?retryWrites=true&w=majority&appName=lostAndFound
      - key: JWT_SECRET
        value: mcc-lost-found-production-secret-2024
      - key: PORT
        value: 5000
```

## Step 2: Deploy Steps
1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Connect GitHub repo
4. Select "Web Service"
5. Choose your repo
6. Use these settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

## Step 3: Update Frontend
Update `.env.local`:
```
NEXT_PUBLIC_BACKEND_URL=https://your-render-app.onrender.com
```

## Step 4: Redeploy Frontend
```bash
git add .
git commit -m "Update backend URL"
git push origin main
```

**Result**: Backend on Render, Frontend on Vercel