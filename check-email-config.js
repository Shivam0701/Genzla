// Check email configuration and provide solutions
require('dotenv').config({ path: './backend/.env' });

function checkEmailConfig() {
  console.log('📧 GENZLA Email Configuration Checker');
  console.log('=' .repeat(50));
  
  const requiredVars = {
    'SMTP_HOST': process.env.SMTP_HOST,
    'SMTP_PORT': process.env.SMTP_PORT,
    'SMTP_USER': process.env.SMTP_USER,
    'SMTP_PASS': process.env.SMTP_PASS,
    'SMTP_FROM': process.env.SMTP_FROM,
    'ADMIN_EMAIL': process.env.ADMIN_EMAIL
  };
  
  console.log('\n📋 Environment Variables Check:');
  let allSet = true;
  
  Object.entries(requiredVars).forEach(([key, value]) => {
    if (value) {
      if (key === 'SMTP_PASS') {
        console.log(`✅ ${key}: Set (${value.length} characters)`);
      } else {
        console.log(`✅ ${key}: ${value}`);
      }
    } else {
      console.log(`❌ ${key}: Missing`);
      allSet = false;
    }
  });
  
  console.log('\n🔧 Configuration Analysis:');
  
  if (!allSet) {
    console.log('❌ Missing required environment variables');
    console.log('\n📝 Required Variables:');
    console.log('SMTP_HOST=smtp.gmail.com');
    console.log('SMTP_PORT=587');
    console.log('SMTP_USER=your-gmail@gmail.com');
    console.log('SMTP_PASS=your-app-password');
    console.log('SMTP_FROM=Your Name <your-gmail@gmail.com>');
    console.log('ADMIN_EMAIL=your-admin@gmail.com');
  } else {
    console.log('✅ All environment variables are set');
  }
  
  console.log('\n🔍 Gmail App Password Setup:');
  console.log('1. Go to Google Account settings');
  console.log('2. Security → 2-Step Verification (must be enabled)');
  console.log('3. App passwords → Generate new app password');
  console.log('4. Select "Mail" and your device');
  console.log('5. Use the generated 16-character password');
  
  console.log('\n🚨 Common Issues & Solutions:');
  
  if (process.env.SMTP_PASS && process.env.SMTP_PASS.length !== 16) {
    console.log('⚠️ SMTP_PASS should be 16 characters (Gmail app password)');
  }
  
  if (process.env.SMTP_HOST !== 'smtp.gmail.com') {
    console.log('⚠️ SMTP_HOST should be "smtp.gmail.com" for Gmail');
  }
  
  if (process.env.SMTP_PORT !== '587') {
    console.log('⚠️ SMTP_PORT should be "587" for Gmail TLS');
  }
  
  console.log('\n🔄 Alternative Solutions:');
  console.log('1. Use the temporary admin creation endpoint');
  console.log('2. Test with development mode (shows OTP in response)');
  console.log('3. Use a different email service (SendGrid, Mailgun)');
  console.log('4. Set up a different SMTP provider');
  
  console.log('\n🧪 Testing Options:');
  console.log('1. Open test-complete-flow.html');
  console.log('2. Use "Quick Admin Setup" to bypass email');
  console.log('3. Test with development email (test@example.com)');
  console.log('4. Check backend logs for detailed error messages');
  
  console.log('\n📞 Production URLs:');
  console.log('Frontend: https://genzla.vercel.app');
  console.log('Backend: https://genzla.onrender.com');
  console.log('Admin: https://genzla.vercel.app/admin/dashboard');
  
  console.log('\n' + '=' .repeat(50));
  console.log('🎯 Next Steps:');
  console.log('1. Fix any missing environment variables');
  console.log('2. Verify Gmail app password is correct');
  console.log('3. Use test-complete-flow.html for testing');
  console.log('4. Create admin user using Quick Admin Setup');
  console.log('5. Test all features once admin is created');
}

checkEmailConfig();