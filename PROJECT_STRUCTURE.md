# GENZLA Project Structure

## Clean Project Structure After Cleanup

### Root Directory
```
├── backend/                 # Backend API server
├── frontend/               # Next.js frontend application
├── .gitignore             # Git ignore rules
├── package.json           # Root package.json
├── README.md              # Project documentation
└── Documentation files:
    ├── EMAIL_SECURITY_FIX.md
    ├── FINAL_PRODUCTION_SETUP.md
    ├── FINAL_SOLUTION.md
    └── PRODUCTION_DEPLOYMENT_GUIDE.md
```

### Backend Structure
```
backend/
├── src/
│   ├── middleware/        # Authentication middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   │   └── email-reliable.js  # Secure email service
│   └── server.js         # Main server file
├── scripts/              # Database scripts
├── .env                  # Environment variables
├── .env.example          # Environment template
├── package.json          # Backend dependencies
└── README.md             # Backend documentation
```

### Frontend Structure
```
frontend/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── admin/        # Admin dashboard pages
│   │   ├── login/        # Login page
│   │   ├── signup/       # Signup page
│   │   ├── dashboard/    # User dashboard
│   │   ├── products/     # Products page
│   │   ├── customization/ # Customization page
│   │   └── ...           # Other pages
│   ├── components/       # Reusable components
│   └── styles/           # Global styles
├── public/               # Static assets
├── .env.local            # Frontend environment
├── package.json          # Frontend dependencies
└── next.config.mjs       # Next.js configuration
```

## Key Features
- ✅ Secure email authentication with OTP
- ✅ Admin dashboard with user/product management
- ✅ User dashboard with customization requests
- ✅ Product catalog with modal views
- ✅ Contact form with email notifications
- ✅ Light/dark theme support
- ✅ Responsive design
- ✅ Production-ready deployment

## Removed Files
All test files, temporary scripts, and old email utilities have been cleaned up:
- All `test-*.js` and `test-*.html` files
- Old email utilities (`email-simple.js`, `email-fixed.js`, `email.js`)
- Temporary documentation files
- Debug and development scripts

## Active Email Service
- **File**: `backend/src/utils/email-reliable.js`
- **Functions**: `sendOTP`, `sendContactEmail`, `verifyTransporter`
- **Security**: No OTP fallbacks for production emails
- **Features**: Secure authentication, contact form support