# 🚀 Production Deployment Guide

## Frontend (Vercel)

### 1. Deploy to Vercel
```bash
npm run deploy
# or
vercel --prod
```

### 2. Set Environment Variables in Vercel Dashboard
```
NEXT_PUBLIC_BACKEND_URL=https://lost-found-79xn.onrender.com
NEXT_PUBLIC_EMAILJS_SERVICE_ID=LostandFound_otp
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=lostAndFound_otp
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your-emailjs-public-key
```

## Backend (Render)

### 1. Connect GitHub Repository
- Go to Render.com
- Connect your GitHub repository
- Select "Web Service"

### 2. Set Environment Variables in Render Dashboard
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
JWT_SECRET=<generate-secure-32-char-secret>
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
FRONTEND_URL=https://your-app.vercel.app
```

### 3. Build Settings
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Root Directory**: Leave empty (uses project root)

## 🔒 Security Checklist

### ✅ Before Going Live:
- [ ] Update all environment variables with real values
- [ ] Generate strong JWT secret (32+ characters)
- [ ] Set up proper MongoDB database (not local)
- [ ] Configure Cloudinary for image uploads
- [ ] Set up EmailJS service for OTP emails
- [ ] Update CORS origins with your actual domains
- [ ] Test all functionality in production

### 🌐 URLs After Deployment:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://lost-found-79xn.onrender.com`
- **API**: `https://lost-found-79xn.onrender.com/api`

## 🔧 Troubleshooting

### Common Issues:
1. **CORS Errors**: Update allowed origins in backend/server.js
2. **Build Failures**: Use `npm install --legacy-peer-deps`
3. **API Timeouts**: Check Render service status
4. **Image Upload Issues**: Verify Cloudinary credentials

### Health Check:
- Backend: `https://lost-found-79xn.onrender.com/api/health`
- Frontend: Check console for any errors

## 📱 Post-Deployment Testing

Test these features:
- [ ] User registration and login
- [ ] Report lost/found items
- [ ] Image uploads
- [ ] Email OTP system
- [ ] Dashboard functionality
- [ ] Browse and search items
- [ ] Potential matches system

Your MCC Lost & Found system is now live! 🎉