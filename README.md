# MCC Lost & Found System

A comprehensive lost and found management system for Madras Christian College (MCC) built with Next.js and Node.js.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation & Setup

1. **Clone and Install Dependencies**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

2. **Database Setup**
```bash
# Start MongoDB (if using local installation)
sudo systemctl start mongod

# Or install MongoDB using the provided script
cd backend
chmod +x install-mongodb.sh
./install-mongodb.sh
```

3. **Environment Configuration**
The environment files are already configured:
- Frontend: `.env.local`
- Backend: `backend/.env`

4. **Seed Demo Data**
```bash
cd backend
npm run seed
cd ..
```

5. **Start Development Servers**
```bash
# Option 1: Use the automated script
./start-dev.sh

# Option 2: Start manually
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
npm run dev
```

## 🌐 Access URLs

- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:5000
- **Database**: MongoDB on localhost:27017

## 📱 Features

### Core Functionality
- ✅ Report lost items with photos and location
- ✅ Report found items with detailed descriptions
- ✅ Browse and search all items
- ✅ User authentication and registration
- ✅ Real-time activity feed
- ✅ Email contact system
- ✅ Interactive campus map
- ✅ Feedback system

### MCC-Specific Features
- 🏫 Campus building integration
- 🏠 Hostel information
- 📚 Academic department categorization
- 🎭 Cultural event integration
- 📊 Live statistics dashboard
- 🗺️ Interactive MCC campus map

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15
- **UI Library**: Radix UI + Tailwind CSS
- **Icons**: Lucide React
- **Maps**: Leaflet + React Leaflet
- **Forms**: React Hook Form + Zod

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT
- **File Upload**: Multer
- **Image Processing**: Sharp

## 📁 Project Structure

```
lost-found/
├── app/                    # Next.js app directory
│   ├── api/               # API routes (proxy to backend)
│   ├── browse/            # Browse items page
│   ├── dashboard/         # User dashboard
│   ├── login/             # Authentication pages
│   ├── report-lost/       # Report lost item
│   ├── report-found/      # Report found item
│   └── feedback/          # Feedback system
├── backend/               # Express.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth & upload middleware
│   └── uploads/          # File storage
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   └── *.tsx            # Feature components
└── public/              # Static assets
```

## 🔧 Development Commands

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Backend
cd backend
npm run dev          # Start with nodemon
npm run start        # Start production server
npm run seed         # Seed demo data
npm run test         # Run auth tests

# Combined
./start-dev.sh       # Start both servers
```

## 🗄️ Database Schema

### Users
- Authentication and profile information
- Department and hostel associations

### Items
- Lost/found item details
- Images and location data
- Status tracking

### Feedback
- User feedback and suggestions
- Rating system

## 🎨 Design System

### MCC Brand Colors
- **Primary**: Maroon (#8B0000)
- **Accent**: Red (#DC2626)
- **Text**: Dark gray (#374151)
- **Background**: Light gray (#F9FAFB)

### Typography
- **Headings**: GeistSans (serif for titles)
- **Body**: GeistSans
- **Code**: GeistMono

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel
```

### Backend (Railway/Heroku)
```bash
cd backend
# Configure environment variables
# Deploy to your preferred platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues or questions:
- 📧 Email: lostfound@mcc.edu.in
- 🐛 Issues: GitHub Issues
- 📖 Docs: This README

## 📄 License

This project is built for Madras Christian College and is intended for educational use.

---

**Made with ❤️ for the MCC Community**