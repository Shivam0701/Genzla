const { sendOTP, verifyTransporter } = require('./src/utils/email-reliable');
require('dotenv').config();

async function testEmailBackend() {
  console.log('🧪 Testing Email from Backend Directory...\n');
  
  // Test 1: Verify transporter
  console.log('1️⃣ Testing transporter verification...');
  const isVerified = await verifyTransporter();
  console.log('Verification result:', isVerified);
  
  console.log('\n2️⃣ Testing test email...');
  try {
    const result = await sendOTP('test@genzla.com', '123456');
    console.log('✅ Test email result:', result);
  } catch (error) {
    console.error('❌ Test email failed:', error.message);
  }
  
  console.log('\n3️⃣ Testing admin email...');
  try {
    const result = await sendOTP('store.genzla@gmail.com', '654321');
    console.log('✅ Admin email result:', result);
  } catch (error) {
    console.error('❌ Admin email failed:', error.message);
  }
  
  console.log('\n🏁 Backend email test completed!');
}

testEmailBackend().catch(console.error);