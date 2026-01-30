const { sendOTP, verifyTransporter } = require('./backend/src/utils/email-reliable');
require('dotenv').config({ path: './backend/.env' });

async function testReliableEmail() {
  console.log('🧪 Testing Reliable Email Service...\n');
  
  // Test 1: Verify transporter
  console.log('1️⃣ Testing transporter verification...');
  const isVerified = await verifyTransporter();
  console.log('Result:', isVerified);
  
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
  
  console.log('\n🏁 Reliable email test completed!');
}

testReliableEmail().catch(console.error);