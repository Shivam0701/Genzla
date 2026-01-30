require('dotenv').config({ path: './backend/.env' });
const { sendOTP, verifyTransporter } = require('./backend/src/utils/email');

async function testEmail() {
  console.log('🔧 Testing Email Configuration');
  console.log('=' .repeat(50));
  
  // Check environment variables
  console.log('\n📋 Environment Variables:');
  console.log('SMTP_HOST:', process.env.SMTP_HOST || 'Missing');
  console.log('SMTP_PORT:', process.env.SMTP_PORT || 'Missing');
  console.log('SMTP_USER:', process.env.SMTP_USER || 'Missing');
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'Set (hidden)' : 'Missing');
  console.log('SMTP_FROM:', process.env.SMTP_FROM || 'Missing');
  
  // Test transporter
  console.log('\n🔌 Testing SMTP Connection...');
  try {
    const isVerified = await verifyTransporter();
    if (isVerified) {
      console.log('✅ SMTP connection successful!');
    } else {
      console.log('❌ SMTP connection failed!');
      return;
    }
  } catch (error) {
    console.log('❌ SMTP connection error:', error.message);
    return;
  }
  
  // Test sending OTP (to admin email)
  console.log('\n📧 Testing OTP Email...');
  try {
    const testEmail = process.env.SMTP_USER; // Send to self for testing
    const testOTP = '123456';
    
    await sendOTP(testEmail, testOTP, 'verification');
    console.log('✅ Test OTP email sent successfully!');
  } catch (error) {
    console.log('❌ Test OTP email failed:', error.message);
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('🎯 Email test completed!');
}

testEmail().catch(console.error);