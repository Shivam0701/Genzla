# GENZLA Backend API

A complete Node.js/Express backend with OTP-based authentication for the GENZLA luxury clothing platform.

## 🚀 Features

- **OTP-based Authentication**: Secure email-based login/signup flow
- **JWT Token Management**: Stateless authentication with 7-day expiry
- **Email Service**: Professional HTML email templates with Nodemailer
- **MongoDB Integration**: User management with Mongoose ODM
- **Rate Limiting**: Protection against spam and abuse
- **Error Handling**: Comprehensive error responses and logging
- **CORS Support**: Configured for frontend integration
- **Environment Validation**: Startup checks for required configuration

## 📋 Prerequisites

- Node.js 16+ 
- MongoDB (local or cloud)
- SMTP email service (Gmail, SendGrid, etc.)

## 🛠️ Installation

1. **Clone and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment setup:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```env
   # Server
   PORT=5000
   NODE_ENV=development

   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/genzla
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/genzla

   # JWT
   JWT_SECRET=your-super-secret-jwt-key-here

   # Email Configuration (Gmail example)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=GENZLA <your-email@gmail.com>

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3000

   # Admin
   ADMIN_EMAIL=store.genzla@gmail.com
   ```

## 🔧 Gmail SMTP Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `SMTP_PASS`

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Test the API
```bash
node test-auth.js
```

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

#### Send OTP
```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully to your email",
  "isNewUser": true
}
```

#### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f7b1234567890abcdef123",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "customer",
    "isVerified": true
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <jwt-token>
```

#### Resend OTP
```http
POST /api/auth/resend-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Logout
```http
POST /api/auth/logout
```

### Health Check
```http
GET /health
GET /api/auth/health
```

## 🔐 Authentication Flow

1. **User enters email** → Frontend calls `/api/auth/send-otp`
2. **System generates 6-digit OTP** → Stores in user document with 10-min expiry
3. **Email sent with OTP** → Professional HTML template
4. **User enters OTP + name (if new)** → Frontend calls `/api/auth/verify-otp`
5. **System verifies OTP** → Returns JWT token for authenticated sessions
6. **Frontend stores token** → Uses for subsequent API calls

## 🛡️ Security Features

- **Rate Limiting**: 5 OTP requests per 15 minutes
- **OTP Expiry**: 10-minute automatic expiration
- **JWT Expiry**: 7-day token lifetime
- **Input Validation**: Email format and OTP format validation
- **Error Handling**: No sensitive information in error responses
- **CORS Protection**: Configured for specific frontend origin

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique, required),
  password: String (optional),
  role: String (customer/admin),
  isVerified: Boolean,
  otp: String,
  otpExpiry: Date,
  phone: String,
  address: Object,
  preferences: Object,
  createdAt: Date,
  updatedAt: Date
}
```

## 🐛 Troubleshooting

### Server won't start
- Check MongoDB connection string
- Verify all required environment variables
- Ensure port 5000 is available

### OTP emails not sending
- Verify SMTP credentials
- Check Gmail app password setup
- Review server logs for email errors

### 404 errors on API calls
- Confirm server is running on correct port
- Check frontend API base URL configuration
- Verify route paths match exactly

### JWT token issues
- Ensure JWT_SECRET is set and consistent
- Check token expiry (7 days default)
- Verify Authorization header format: `Bearer <token>`

## 📝 Development Notes

- **OTP Storage**: Stored directly in User model for simplicity
- **Password Field**: Optional, supports future password-based auth
- **Email Templates**: Professional HTML with fallback text
- **Error Logging**: Comprehensive console logging for debugging
- **Graceful Shutdown**: Handles SIGTERM/SIGINT for clean exits

## 🚀 Production Deployment

1. **Set NODE_ENV=production**
2. **Use strong JWT_SECRET**
3. **Configure production MongoDB**
4. **Set up proper SMTP service**
5. **Enable HTTPS**
6. **Configure reverse proxy (nginx)**
7. **Set up monitoring and logging**

## 📞 Support

For issues or questions:
- Check server logs for detailed error messages
- Run `node test-auth.js` to verify basic functionality
- Ensure all environment variables are properly configured