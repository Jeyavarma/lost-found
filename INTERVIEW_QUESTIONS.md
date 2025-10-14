# MCC Lost & Found System - Interview Questions & Answers

## 🔐 **Authentication System - Deep Dive**

### **Authentication Architecture Overview**
```
User Registration/Login → JWT Token Generation → Token Storage → Protected Routes → Token Validation
```

### **Core Components**

#### **A. User Model (MongoDB)**
```javascript
// backend/models/User.js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed with bcrypt
  role: { type: String, enum: ['student', 'staff', 'admin'], default: 'student' },
  phone: String,
  studentId: String,
  department: String,
  // ... MCC-specific fields
})

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10); // Salt rounds: 10
})

// Password comparison method
userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
}
```

#### **B. JWT Token System**
```javascript
// Token Generation (Login/Register)
const token = jwt.sign(
  { userId: user._id }, 
  process.env.JWT_SECRET, 
  { expiresIn: '7d' }
)

// Token Validation
const decoded = jwt.verify(token, process.env.JWT_SECRET)
```

#### **C. Authentication Middleware**
```javascript
// backend/middleware/authMiddleware.js
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] // Bearer <token>
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  req.user = await User.findById(decoded.userId).select('-password')
  next()
}
```

### **Authentication Endpoints**

#### **1. Registration (`POST /api/auth/register`)**
```javascript
// Input: { name, email, password, studentId, department, ... }
// Process: Validate → Hash Password → Save User → Generate JWT
// Output: { token, name, role }
```

#### **2. Login (`POST /api/auth/login`)**
```javascript
// Input: { email, password }
// Process: Find User → Compare Password → Generate JWT
// Output: { token, userId, name, email, role }
```

#### **3. Token Validation (`GET /api/auth/validate`)**
```javascript
// Input: Authorization: Bearer <token>
// Process: Verify JWT → Find User → Return User Data
// Output: { valid: true, user: {...} }
```

#### **4. Password Reset Flow**
```javascript
// Step 1: Forgot Password (POST /api/auth/forgot-password)
// Generate 6-digit OTP → Store in OTP collection (10min expiry)

// Step 2: Reset Password (POST /api/auth/reset-password)
// Validate OTP → Update Password → Delete OTP
```

### **Security Features**

#### **1. Password Security**
- **Bcrypt Hashing**: Salt rounds = 10
- **Pre-save Middleware**: Auto-hash on password change
- **Secure Comparison**: bcrypt.compare() prevents timing attacks

#### **2. JWT Security**
- **Secret Key**: Environment variable (JWT_SECRET)
- **Expiration**: 7 days
- **Payload**: Only userId (minimal data)
- **Stateless**: No server-side session storage

#### **3. Input Validation & Sanitization**
```javascript
// Email validation
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// Input sanitization
const sanitizedEmail = String(email).toLowerCase().trim()
const sanitizedUser = {
  name: String(user.name).replace(/[<>"'&]/g, ''),
  email: String(user.email).replace(/[<>"'&]/g, '')
}
```

#### **4. OTP System**
```javascript
// OTP Model with TTL (Time To Live)
const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  createdAt: { type: Date, default: Date.now, expires: 600 } // 10 minutes
})
```

### **Frontend Authentication (Next.js)**

#### **1. Token Management**
```typescript
// lib/auth.ts
export function getAuthToken(): string | null {
  return localStorage.getItem('authToken')
}

export function setAuthToken(token: string): void {
  localStorage.setItem('authToken', token)
}

export function removeAuthToken(): void {
  localStorage.removeItem('authToken')
  localStorage.removeItem('userData')
}
```

#### **2. Authentication State**
```typescript
// Client-side authentication check
export function isAuthenticated(): boolean {
  const token = getAuthToken()
  return !!token
}

// Server validation
export async function validateToken(token: string): Promise<boolean> {
  const response = await fetch('/api/auth/validate', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  return response.ok
}
```

### **Business Logic - Differential Authentication**

#### **Key Feature**: Different auth requirements for lost vs found items
```javascript
// Lost Items: Require authentication (for tracking/notifications)
if (status === 'lost' && !req.user) {
  return res.status(401).json({ message: 'Authentication required for lost items' })
}

// Found Items: Allow anonymous reporting (encourage participation)
if (status === 'found') {
  // No authentication required
}
```

### **Authentication Flow Diagram**
```
1. User Registration/Login
   ↓
2. Server validates credentials
   ↓
3. JWT token generated & sent to client
   ↓
4. Client stores token in localStorage
   ↓
5. Protected requests include token in Authorization header
   ↓
6. Server middleware validates token
   ↓
7. User data attached to request object
   ↓
8. Route handler processes authenticated request
```

## 🔐 **Authentication & Security Interview Questions**

### **Q1: How does user authentication work in your system?**
**A**: JWT-based authentication with bcrypt password hashing. Users register/login → server generates JWT token → client stores in localStorage → protected routes validate token via middleware.

**Flow**: Registration → Password Hashing (bcrypt, salt=10) → JWT Generation (7d expiry) → Token Storage → Request Authorization → Middleware Validation

### **Q2: Why did you choose JWT over sessions?**
**A**: 
- **Stateless**: No server-side storage needed
- **Scalable**: Works across microservices (frontend on Vercel, backend on Render)
- **Cross-domain**: Supports distributed architecture
- **Performance**: No database lookups for session validation

### **Q3: How do you handle password security?**
**A**: 
- **Bcrypt hashing** with salt rounds = 10
- **Pre-save middleware** auto-hashes passwords
- **Secure comparison** using bcrypt.compare() (prevents timing attacks)
- **Never store plain text** passwords

### **Q4: Explain your password reset flow**
**A**: 
1. **Forgot Password**: Generate 6-digit OTP → Store in MongoDB with 10min TTL
2. **Reset Password**: Validate OTP → Update password → Delete OTP
3. **Security**: OTP expires automatically, one-time use only

### **Q5: What security measures did you implement?**
**A**: 
- **Helmet.js**: Security headers (XSS, clickjacking, MIME sniffing protection)
- **Rate limiting**: Prevents brute force attacks
- **Input sanitization**: XSS prevention
- **CORS configuration**: Controlled cross-origin requests
- **CSRF protection**: Token-based validation

## 🏗️ **System Architecture & Design**

### **Q6: Describe your system architecture**
**A**: 
- **Frontend**: Next.js 15 (Vercel deployment)
- **Backend**: Node.js/Express (Render deployment)
- **Database**: MongoDB Atlas
- **File Storage**: Cloudinary
- **Authentication**: JWT
- **Security**: Helmet, Rate limiting, CORS

### **Q7: Why did you choose this tech stack?**
**A**: 
- **Next.js**: SSR, performance, modern React features
- **Node.js**: JavaScript ecosystem, fast development
- **MongoDB**: Flexible schema for varied item data
- **Cloudinary**: Optimized image handling and CDN
- **Vercel/Render**: Easy deployment, good performance

### **Q8: How do you handle different user types?**
**A**: 
- **Lost items**: Require authentication (tracking, notifications)
- **Found items**: Allow anonymous reporting (encourage participation)
- **Role-based access**: Student, staff, admin roles
- **Differential business logic** based on item status

## 📊 **Database Design & Management**

### **Q9: Explain your database schema**
**A**: 
```javascript
// User Schema
{
  name, email, password (hashed), role, 
  studentId, department, year, phone
}

// Item Schema  
{
  title, description, category, location, status,
  imageUrl, reportedBy, email, createdAt
}

// OTP Schema (TTL)
{
  email, otp, createdAt (expires: 600s)
}
```

### **Q10: How do you handle file uploads?**
**A**: 
- **Multer**: Handle multipart/form-data
- **Sharp**: Image compression and optimization
- **Cloudinary**: Cloud storage with CDN
- **Security**: File type validation, size limits

## 🎯 **Smart Matching Algorithm**

### **Q11: How does your item matching work?**
**A**: 11-parameter scoring system:
- **Category match**: 40 points
- **Location proximity**: 30 points  
- **Brand match**: 25 points
- **Color match**: 20 points
- **Time proximity**: 15 points
- **Minimum threshold**: 10 points for suggestions

### **Q12: What makes your matching algorithm smart?**
**A**: 
- **Weighted scoring**: Important factors get higher weights
- **Fuzzy matching**: Handles typos and variations
- **Time-based relevance**: Recent items score higher
- **Location intelligence**: Building and area matching

## 🚀 **Performance & Optimization**

### **Q13: How did you optimize performance?**
**A**: 
- **Image optimization**: Cloudinary compression and CDN
- **Database indexing**: Email, category, location indexes
- **Client-side caching**: localStorage for user data
- **Lazy loading**: Images load on demand
- **Code splitting**: Next.js automatic optimization

### **Q14: How do you handle large datasets?**
**A**: 
- **Pagination**: Limit results per page
- **Filtering**: Reduce dataset before processing
- **Database indexes**: Fast query execution
- **Caching strategies**: Reduce API calls

## 🔄 **API Design & Integration**

### **Q15: Describe your API structure**
**A**: 
```
/api/auth/* - Authentication endpoints
/api/items/* - Item CRUD operations  
/api/feedback/* - User feedback system
/api/notifications/* - Real-time updates
```
RESTful design with proper HTTP status codes and error handling.

### **Q16: How do you handle API errors?**
**A**: 
- **Structured error responses**: Consistent format
- **HTTP status codes**: Proper semantic usage
- **Error logging**: Server-side error tracking
- **User-friendly messages**: Clear error communication

## 🎨 **Frontend Development**

### **Q17: Why Next.js over React?**
**A**: 
- **SSR/SSG**: Better SEO and performance
- **File-based routing**: Simplified navigation
- **API routes**: Full-stack capabilities
- **Image optimization**: Built-in performance features
- **Deployment**: Seamless Vercel integration

### **Q18: How do you manage state?**
**A**: 
- **React hooks**: useState, useEffect for local state
- **localStorage**: Persistent user data
- **Context API**: Global state when needed
- **Server state**: Fresh data from API calls

## 🔧 **DevOps & Deployment**

### **Q19: Describe your deployment strategy**
**A**: 
- **Frontend**: Vercel (automatic deployments from Git)
- **Backend**: Render (Docker containerization)
- **Database**: MongoDB Atlas (cloud)
- **CDN**: Cloudinary for images
- **Environment management**: Separate dev/prod configs

### **Q20: How do you handle environment variables?**
**A**: 
- **Frontend**: NEXT_PUBLIC_ prefix for client-side
- **Backend**: dotenv for server-side secrets
- **Security**: Never expose secrets to client
- **Deployment**: Platform-specific env management

## 🧪 **Testing & Quality Assurance**

### **Q21: What testing strategies do you use?**
**A**: 
- **Manual testing**: User flow validation
- **API testing**: Postman/automated scripts
- **Security testing**: Input validation, auth flows
- **Performance testing**: Load testing for bottlenecks

### **Q22: How do you ensure code quality?**
**A**: 
- **ESLint**: Code linting and standards
- **TypeScript**: Type safety on frontend
- **Code reviews**: Peer review process
- **Documentation**: Comprehensive README and comments

## 🎯 **Business Logic & Features**

### **Q23: What's unique about your lost & found system?**
**A**: 
- **MCC-specific**: Campus buildings, hostels, events integration
- **Smart matching**: AI-like item suggestion algorithm
- **Differential auth**: Different rules for lost vs found items
- **Real-time features**: Live activity feed and notifications

### **Q24: How do you handle edge cases?**
**A**: 
- **Missing emails**: Fallback to system email
- **Invalid images**: Placeholder handling
- **Network failures**: Retry mechanisms and error states
- **Duplicate items**: Matching algorithm prevents duplicates

## 🔮 **Scalability & Future Enhancements**

### **Q25: How would you scale this system?**
**A**: 
- **Database**: Sharding, read replicas
- **Caching**: Redis for frequently accessed data
- **CDN**: Global content distribution
- **Microservices**: Split into smaller services
- **Load balancing**: Multiple server instances

### **Q26: What features would you add next?**
**A**: 
- **Real-time chat**: Direct messaging between users
- **Mobile app**: React Native implementation
- **AI matching**: Machine learning for better suggestions
- **Analytics dashboard**: Usage statistics and insights
- **Push notifications**: Mobile and web notifications

---

## 💡 **Interview Tips**

### **Technical Depth**
- Always explain the "why" behind technical decisions
- Mention trade-offs and alternatives considered
- Show understanding of production concerns

### **Problem-Solving**
- Walk through your thought process
- Explain how you debugged issues
- Discuss lessons learned and improvements made

### **Business Understanding**
- Connect technical features to user needs
- Explain how features solve real problems
- Show awareness of user experience impact

---

*This comprehensive guide covers all aspects of the MCC Lost & Found system for technical interviews.*