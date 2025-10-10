# Check Database Connection & Data

## 1. Check Backend Health
Visit: `https://lost-found-79xn.onrender.com/api/health`

Should show:
```json
{
  "status": "OK",
  "database": "connected",
  "mongodb_connected": true
}
```

## 2. Check Render Logs
1. Go to Render Dashboard
2. Click your service
3. Check **Logs** tab for:
   - `"Connected to MongoDB"`
   - Any error messages

## 3. Check MongoDB Atlas
1. Go to MongoDB Atlas Dashboard
2. Click **"Database"** → **"Browse Collections"**
3. Look for `mcc-lost-found` database
4. Check collections: `items`, `users`, `feedbacks`

## 4. Test API Directly
Try: `https://lost-found-79xn.onrender.com/api/items`

## 5. Seed Demo Data
```bash
cd backend
npm run seed
```

## 6. Common Issues
- Wrong database name in connection string
- Network access not configured (0.0.0.0/0)
- User permissions insufficient
- Backend not saving data properly