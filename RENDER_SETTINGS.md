# Render Deployment Settings

## Fill these exact values in Render:

**Name**: `mcc-lost-found-backend`

**Language**: `Node`

**Branch**: `main`

**Region**: `Singapore (Southeast Asia)`

**Root Directory**: `backend`

**Build Command**: `npm install`

**Start Command**: `npm start`

**Instance Type**: `Free` (Hobby)

## Environment Variables:
Click "Add Environment Variable" for each:

1. **MONGODB_URI**
   ```
   mongodb+srv://2024178026_db_user:1DUnoM4iWPsDFQ0b@lostandfound.6mo1sey.mongodb.net/mcc-lost-found?retryWrites=true&w=majority&appName=lostAndFound
   ```

2. **JWT_SECRET**
   ```
   mcc-lost-found-production-secret-2024
   ```

3. **PORT**
   ```
   10000
   ```

## Advanced Settings:
- **Health Check Path**: Leave empty or `/`
- **Auto-Deploy**: Keep `On Commit` enabled
- **Pre-Deploy Command**: Leave empty

## After Deployment:
Your backend URL will be: `https://mcc-lost-found-backend.onrender.com`

Update this URL in your Vercel frontend environment variables.