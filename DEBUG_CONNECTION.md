# Debug Connection Issues

## 1. Check Backend Status
Visit: `https://lost-found-79xn.onrender.com/api/health`

Should show:
```json
{
  "status": "OK",
  "database": "connected",
  "mongodb_connected": true
}
```

## 2. Check Vercel Environment Variables
In Vercel Dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_BACKEND_URL=https://lost-found-79xn.onrender.com
```

## 3. Check CORS in Render Logs
1. Go to Render Dashboard
2. Click your service
3. Check Logs for CORS errors

## 4. Test API Directly
```
https://lost-found-79xn.onrender.com/api/items
```

## 5. Common Fixes
- Update CORS in backend
- Redeploy Render service
- Redeploy Vercel frontend
- Check Network tab in browser DevTools

## 6. Quick Fix Commands
```bash
# Push CORS fix to trigger Render redeploy
git add .
git commit -m "Fix CORS for Vercel"
git push origin main
```