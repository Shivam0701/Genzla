const { sendOTP, verifyTransporter } = require('./backend/src/utils/email-simple');
require('dotenv').config({ path: './backend/.env' });

async function testEmail() {
  console.log('🧪 Testing Email Service...\n');
  
  // Test 1: Verify transporter
  console.log('1️⃣ Testing transporter verification...');
  try {
    const isVerified = await verifyTransporter();
    console.log('✅ Transporter verification result:', isVerified);
  } catch (error) {
    console.error('❌ Transporter verification failed:', error.message);
  }
  
  console.log('\n2️⃣ Testing OTP email to test account...');
  
  // Test 2: Send test OTP
  try {
    const result = await sendOTP('test@genzla.com', '123456', 'verification');
    console.log('✅ Test email result:', result);
  } catch (error) {
    console.error('❌ Test email failed:', error.message);
  }
  
  console.log('\n🏁 Email test completed!');
}

testEmail().catch(console.error);