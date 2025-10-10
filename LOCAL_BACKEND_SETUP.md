# Local Backend + Vercel Frontend Setup

## Setup: Frontend (Vercel) → Backend (Your Laptop) → MongoDB (Local/Atlas)

### Step 1: Expose Local Backend to Internet
Install ngrok to make your local backend accessible:
```bash
# Install ngrok
npm install -g ngrok

# Or download from https://ngrok.com/
```

### Step 2: Start Local Backend
```bash
cd backend
npm run dev
# Backend runs on http://localhost:5000
```

### Step 3: Expose Backend with ngrok
```bash
# In new terminal
ngrok http 5000
# Copy the https URL (e.g., https://abc123.ngrok.io)
```

### Step 4: Update Vercel Environment Variables
In Vercel dashboard, update:
```
NEXT_PUBLIC_BACKEND_URL=https://abc123.ngrok.io
```

### Step 5: Update CORS in Backend
```javascript
// backend/server.js
app.use(cors({
  origin: ['https://your-vercel-app.vercel.app'],
  credentials: true
}));
```

### Step 6: Keep Running
- Keep backend running: `npm run dev`
- Keep ngrok running: `ngrok http 5000`
- Frontend automatically uses your local backend

**Result**: Vercel frontend → Your laptop backend → Local/Atlas MongoDB