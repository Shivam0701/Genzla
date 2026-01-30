const axios = require('axios');

// Test the complete email flow
async function testCompleteEmailFlow() {
  console.log('🧪 Testing Complete Email Flow...\n');
  
  const baseURL = 'http://localhost:4000'; // Change to your backend URL
  
  // Test 1: Test email
  console.log('1️⃣ Testing with test email...');
  try {
    const response = await axios.post(`${baseURL}/api/auth/send-otp`, {
      email: 'test@genzla.com'
    });
    console.log('✅ Test email response:', response.data);
  } catch (error) {
    console.error('❌ Test email failed:', error.response?.data || error.message);
  }
  
  console.log('\n2️⃣ Testing with admin email...');
  try {
    const response = await axios.post(`${baseURL}/api/auth/send-otp`, {
      email: 'store.genzla@gmail.com'
    });
    console.log('✅ Admin email response:', response.data);
  } catch (error) {
    console.error('❌ Admin email failed:', error.response?.data || error.message);
  }
  
  console.log('\n3️⃣ Testing with real email...');
  try {
    const response = await axios.post(`${baseURL}/api/auth/send-otp`, {
      email: 'test.user@gmail.com' // Replace with your test email
    });
    console.log('✅ Real email response:', response.data);
  } catch (error) {
    console.error('❌ Real email failed:', error.response?.data || error.message);
  }
  
  console.log('\n🏁 Complete email flow test finished!');
}

testCompleteEmailFlow().catch(console.error);