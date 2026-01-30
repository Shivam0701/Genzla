# GENZLA Admin Reference Guide

## Product Creation - Valid Values

### Categories (Required)
- Jacket
- T-shirt  
- Shirt
- Jeans
- Baggy Pants
- Bags
- **Hoodie** ✅ (Now Added)

### Available Customizations (Optional)
- Hand Painted
- DTF (Direct to Film)
- DTG (Direct to Garment)
- Puff Print
- Embroidery

### Price Field (Optional) ✅
- **Type**: Text field (allows both numbers and text)
- **Currency**: Indian Rupees (₹)
- **Examples**:
  - `₹999` (numeric price)
  - `Contact for Price` (text)
  - `Custom Quote` (text)
  - `Starting from ₹500` (text)
  - Leave empty for no price display

## Authentication System Status ✅

### Current Flow:
1. **Login**: Email + Password (no OTP required)
2. **Signup**: OTP verification required
3. **Forgot Password**: OTP verification required

### Test Accounts:
- Admin: `store.genzla@gmail.com` (use create-admin-temp endpoint)
- Test emails: `test@example.com`, `test@genzla.com`, `demo@genzla.com`

## Working Features ✅

- ✅ User authentication (login, signup, forgot password)
- ✅ Admin dashboard
- ✅ Product management (CRUD operations)
- ✅ **Hoodie category support** ✅
- ✅ **Flexible pricing (₹ symbol, text allowed)** ✅
- ✅ User management
- ✅ Customization request management
- ✅ Email service (OTP sending)
- ✅ JWT token authentication
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ MongoDB connection
- ✅ File upload (Cloudinary)

## Recent Updates ✅

### Product System Improvements:
1. **Added Hoodie Category**: Now you can create Hoodie products
2. **Indian Currency (₹)**: All prices now display with Rupee symbol
3. **Flexible Pricing**: Price field accepts:
   - Numbers: `₹999`, `₹1500`
   - Text: `Contact for Price`, `Custom Quote`
   - Empty: No price display
4. **Optional Price**: Price field is now completely optional

## Common Issues & Solutions

### Product Creation Fails
**Problem**: Invalid category or customization method
**Solution**: Use only the valid enum values listed above

### Price Field Issues
**Problem**: Want to use text instead of numbers
**Solution**: ✅ **FIXED** - Now accepts any text like "Contact for Price"

### Currency Display
**Problem**: Showing $ instead of ₹
**Solution**: ✅ **FIXED** - All displays now show Indian Rupees (₹)

### OTP Not Received
**Problem**: Rate limiting or email service issues
**Solution**: Use test emails (test@example.com) for development

### Authentication Errors
**Problem**: Invalid token or expired session
**Solution**: Re-login to get fresh token

## Server Status
- Backend: http://localhost:5001 ✅ (Note: Port changed to 5001)
- Frontend: http://localhost:3000 ✅
- Database: MongoDB Atlas ✅
- Email: Gmail SMTP ✅