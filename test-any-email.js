const { sendOTP } = require('./backend/src/utils/email-simple');
require('dotenv').config({ path: './backend/.env' });

async function testAnyEmail() {
  console.log('🧪 Testing Email to Any Address...\n');
  
  // Test with a different email (you can replace this with any email you want to test)
  const testEmail = 'test.user@gmail.com'; // Replace with your test email
  
  try {
    console.log(`📧 Sending OTP to: ${testEmail}`);
    const result = await sendOTP(testEmail, '654321', 'verification');
    console.log('✅ Email result:', result);
  } catch (error) {
    console.error('❌ Email failed:', error.message);
    console.error('Full error:', error);
  }
  
  console.log('\n🏁 Test completed!');
}

testAnyEmail().catch(console.error);