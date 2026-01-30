# 🚀 GENZLA Production Deployment Guide

## Current Status ✅

Your GENZLA application is now configured for production deployment with the following URLs:

- **Frontend (Vercel)**: https://genzla.vercel.app
- **Backend (Render)**: https://genzla.onrender.com

## Configuration Summary

### ✅ Backend Configuration (Render)
- **Environment**: Production
- **Port**: 4000 (configurable via PORT env var)
- **CORS**: Configured for Vercel domain
- **Database**: MongoDB Atlas connected
- **Email**: Gmail SMTP configured

### ✅ Frontend Configuration (Vercel)
- **API URL**: Points to Render backend
- **Environment Variables**: Properly set
- **Build**: Next.js optimized for production

## 🔧 Testing Your Production Setup

1. **Open the test file**: `test-production-api.html` in your browser
2. **Run all tests** to verify:
   - Backend health
   - API endpoints
   - CORS configuration
   - Authentication flow

## 🚨 Common Issues & Solutions

### Issue 1: "Network Error" or CORS Issues
**Symptoms**: API calls fail with network errors
**Solutions**:
1. Ensure backend is running on Render
2. Check CORS configuration in `backend/src/server.js`
3. Verify environment variables are set correctly

### Issue 2: Admin Dashboard Not Loading Data
**Symptoms**: Admin dashboard shows empty tables
**Solutions**:
1. Check browser console for API errors
2. Verify admin user has correct role in database
3. Test API endpoints individually

### Issue 3: Status Updates Failing
**Symptoms**: Status dropdown changes don't save
**Solutions**:
1. Check network tab for failed requests
2. Verify admin authentication token
3. Check backend logs for errors

## 🔍 Debugging Steps

### 1. Check Backend Health
```bash
curl https://genzla.onrender.com/health
```

### 2. Test API Endpoints
```bash
# Test products
curl https://genzla.onrender.com/api/products

# Test with authentication (replace TOKEN)
curl -H "Authorization: Bearer TOKEN" https://genzla.onrender.com/api/admin/users
```

### 3. Check Frontend Environment
Open browser console and run:
```javascript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
```

## 📋 Deployment Checklist

### Backend (Render) ✅
- [x] Environment variables set
- [x] MongoDB connection string configured
- [x] SMTP email settings configured
- [x] CORS configured for Vercel domain
- [x] Admin user created
- [x] Sample products added

### Frontend (Vercel) ✅
- [x] API URL environment variable set
- [x] Google OAuth configured (if needed)
- [x] Build and deployment successful
- [x] All pages accessible

## 🔐 Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **JWT Secret**: Use strong, unique secret in production
3. **Database**: Ensure MongoDB Atlas has proper access controls
4. **CORS**: Only allow necessary domains
5. **HTTPS**: Both frontend and backend use HTTPS

## 📊 Monitoring & Maintenance

### Backend Monitoring
- Check Render dashboard for uptime
- Monitor MongoDB Atlas for performance
- Review application logs regularly

### Frontend Monitoring
- Check Vercel dashboard for deployments
- Monitor Core Web Vitals
- Test user flows regularly

## 🆘 Emergency Procedures

### Backend Down
1. Check Render service status
2. Review recent deployments
3. Check environment variables
4. Restart service if needed

### Database Issues
1. Check MongoDB Atlas status
2. Verify connection string
3. Check database permissions
4. Review recent schema changes

### Frontend Issues
1. Check Vercel deployment status
2. Review build logs
3. Test API connectivity
4. Verify environment variables

## 📞 Support Information

- **Admin Email**: store.genzla@gmail.com
- **Database**: MongoDB Atlas
- **Hosting**: Vercel (Frontend) + Render (Backend)
- **Domain**: genzla.vercel.app

## 🔄 Update Procedures

### Code Updates
1. Push changes to repository
2. Vercel auto-deploys frontend
3. Render auto-deploys backend
4. Test functionality after deployment

### Environment Variables
1. Update in Vercel dashboard (frontend)
2. Update in Render dashboard (backend)
3. Restart services if needed
4. Test affected functionality

---

## 🎯 Next Steps

1. **Test all functionality** using the test file
2. **Create admin user** if not already done
3. **Add sample products** for testing
4. **Test user registration** and login flows
5. **Verify email functionality** works in production
6. **Test customization requests** end-to-end

Your GENZLA application is ready for production use! 🎉