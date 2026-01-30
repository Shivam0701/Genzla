const { sendOTP, verifyTransporter } = require('./backend/src/utils/email-simple');
require('dotenv').config({ path: './backend/.env' });

async function testUpdatedEmail() {
  console.log('🧪 Testing Updated Email Service...\n');
  
  // Test 1: Verify transporter with timeout
  console.log('1️⃣ Testing transporter verification with timeout...');
  try {
    const isVerified = await verifyTransporter();
    console.log('✅ Transporter verification result:', isVerified);
  } catch (error) {
    console.error('❌ Transporter verification failed:', error.message);
  }
  
  console.log('\n2️⃣ Testing test email...');
  try {
    const result = await sendOTP('test@genzla.com', '123456', 'verification');
    console.log('✅ Test email result:', result);
  } catch (error) {
    console.error('❌ Test email failed:', error.message);
  }
  
  console.log('\n3️⃣ Testing admin email with timeout...');
  try {
    const result = await sendOTP('store.genzla@gmail.com', '654321', 'verification');
    console.log('✅ Admin email result:', result);
  } catch (error) {
    console.error('❌ Admin email failed:', error.message);
  }
  
  console.log('\n🏁 Updated email test completed!');
}

testUpdatedEmail().catch(console.error);