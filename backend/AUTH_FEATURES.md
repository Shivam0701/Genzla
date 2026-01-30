# GENZLA Authentication System - Updated

## 🚀 Complete Authentication Features

### ✅ Enhanced Signup Process
- **Required Fields**: Email, Name, Phone Number, OTP
- **Step 1**: Enter email → Send OTP
- **Step 2**: Enter name, phone, and OTP → Create account
- **Validation**: Phone number format validation
- **Security**: Unique phone number constraint
- **Database**: All data stored in MongoDB

### ✅ OTP-Based Authentication
- **Signup**: Email + OTP + Name + Phone
- **Login**: Email + OTP (for existing users)
- **Security**: 6-digit OTP with 10-minute expiry
- **Rate Limiting**: 5 OTP requests per 15 minutes

### ✅ Forgot Password System
- **Reset Flow**: Email → OTP → New Password
- **Endpoint**: `POST /api/auth/forgot-password`
- **Reset Endpoint**: `POST /api/auth/reset-password`
- **Email Templates**: Professional HTML emails with GENZLA branding

### ✅ Google OAuth Integration
- **Backend Ready**: `POST /api/auth/google`
- **Frontend Component**: `<GoogleAuth />` with React OAuth
- **Phone Requirement**: New Google users must provide phone number
- **Auto-Verification**: Google accounts are pre-verified
- **User Linking**: Links existing accounts with Google

### ✅ Enhanced User Model
```javascript
{
  name: String (required when verified),
  email: String (required, unique),
  phone: String (required when verified, validated format),
  password: String (optional, for password-based auth),
  role: String (customer/admin),
  isVerified: Boolean,
  googleId: String (for Google OAuth),
  avatar: String (profile picture URL),
  otp: String (temporary),
  otpExpiry: Date (temporary),
  address: Object (optional),
  preferences: Object (optional)
}
```

### ✅ Database Storage
- **MongoDB Atlas**: All user data stored securely
- **Validation**: Phone number format validation
- **Constraints**: Unique email and phone numbers
- **Indexing**: Optimized queries on email field
- **Security**: Password hashing with bcrypt

## 📡 Updated API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP for signup/login
- `POST /api/auth/verify-otp` - Verify OTP with name/phone for signup
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/forgot-password` - Send password reset OTP
- `POST /api/auth/reset-password` - Reset password with OTP
- `POST /api/auth/google` - Google OAuth (requires phone for new users)
- `GET /api/auth/me` - Get current user (includes phone)
- `POST /api/auth/logout` - Logout user

### Request/Response Examples

#### Signup Flow
```javascript
// Step 1: Send OTP
POST /api/auth/send-otp
{
  "email": "user@example.com"
}

// Step 2: Verify OTP with user details
POST /api/auth/verify-otp
{
  "email": "user@example.com",
  "otp": "123456",
  "name": "John Doe",
  "phone": "+1234567890"
}

// Response
{
  "success": true,
  "message": "Account created successfully",
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "+1234567890",
    "role": "customer",
    "isVerified": true
  }
}
```

#### Google OAuth with Phone
```javascript
POST /api/auth/google
{
  "googleToken": "google-jwt-token",
  "name": "John Doe",
  "email": "john@gmail.com",
  "picture": "avatar-url",
  "phone": "+1234567890"
}
```

## 🎨 Frontend Updates

### Enhanced Signup Page (`/signup`)
- **Step 1**: Email input → Send OTP
- **Step 2**: Name, Phone, OTP inputs → Create Account
- **Validation**: Client-side phone format validation
- **Error Handling**: Comprehensive error messages
- **Google OAuth**: Integrated with phone collection

### Google Auth Component
- **Phone Collection**: Modal for new Google users
- **Validation**: Phone format validation
- **Error Handling**: User-friendly error messages
- **Responsive**: Works on all devices

### Updated Login Page (`/login`)
- **OTP Flow**: Email → OTP → Login
- **Google OAuth**: One-click login for existing users
- **Forgot Password**: Link to password reset flow

## 🔧 Environment Variables

### Backend (.env)
```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# JWT
JWT_SECRET=your-secret-key

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=GENZLA <your-email@gmail.com>

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  password: "hashed-password", // Optional
  role: "customer", // or "admin"
  isVerified: true,
  googleId: "google-oauth-id", // Optional
  avatar: "https://avatar-url.com", // Optional
  address: {
    street: "123 Main St",
    city: "City",
    state: "State",
    zipCode: "12345",
    country: "Country"
  },
  preferences: {
    newsletter: true,
    notifications: true
  },
  createdAt: ISODate,
  updatedAt: ISODate
}
```

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend  
   cd frontend && npm install
   ```

2. **Setup Environment**:
   - Configure MongoDB Atlas
   - Setup Gmail app password
   - Get Google OAuth client ID
   - Update .env files

3. **Create Admin User**:
   ```bash
   cd backend && npm run create-admin [email] [name] [phone]
   ```

4. **Start Servers**:
   ```bash
   # Backend (port 5000)
   cd backend && npm start
   
   # Frontend (port 3000)
   cd frontend && npm run dev
   ```

## 📱 User Experience

### New User Signup
1. Enter email address
2. Receive OTP via email
3. Enter name, phone number, and OTP
4. Account created → Redirect to dashboard

### Existing User Login
1. Enter email address
2. Receive OTP via email
3. Enter OTP → Login successful

### Google OAuth
1. Click "Sign in with Google"
2. If new user: Enter phone number
3. Account created/logged in → Redirect to dashboard

### Forgot Password
1. Click "Forgot Password"
2. Enter email address
3. Receive reset OTP via email
4. Enter OTP and new password
5. Password reset successful

## 🔐 Security Features

- ✅ Phone number validation and uniqueness
- ✅ Rate limiting on all auth endpoints
- ✅ OTP expiry (10 minutes)
- ✅ JWT token expiry (7 days)
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Password hashing with bcrypt
- ✅ Secure email templates
- ✅ MongoDB data validation

## 📊 Data Storage

All user data is securely stored in MongoDB:
- **Personal Info**: Name, email, phone number
- **Authentication**: Hashed passwords, OTP data
- **Profile**: Avatar, address, preferences
- **OAuth**: Google ID and profile data
- **Metadata**: Creation/update timestamps

---

**Status**: ✅ Fully Functional with Name & Phone
**Last Updated**: January 29, 2026
**Version**: 3.0.0