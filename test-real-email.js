const { sendOTP, verifyTransporter } = require('./backend/src/utils/email-simple');
require('dotenv').config({ path: './backend/.env' });

async function testRealEmail() {
  console.log('🧪 Testing Real Email Service...\n');
  
  // Test 1: Verify transporter
  console.log('1️⃣ Testing transporter verification...');
  try {
    const isVerified = await verifyTransporter();
    console.log('✅ Transporter verification result:', isVerified);
  } catch (error) {
    console.error('❌ Transporter verification failed:', error.message);
    console.error('Full error:', error);
  }
  
  console.log('\n2️⃣ Testing OTP email to real email...');
  
  // Test 2: Send real OTP (replace with your email)
  try {
    const result = await sendOTP('store.genzla@gmail.com', '123456', 'verification');
    console.log('✅ Real email result:', result);
  } catch (error) {
    console.error('❌ Real email failed:', error.message);
    console.error('Full error:', error);
  }
  
  console.log('\n🏁 Real email test completed!');
}

testRealEmail().catch(console.error);