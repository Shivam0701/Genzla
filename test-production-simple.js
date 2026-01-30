const axios = require('axios');

async function testProductionSimple() {
  console.log('🧪 Testing Production Email (Simple)...\n');
  
  const baseURL = 'https://genzla.onrender.com';
  
  try {
    console.log('📧 Sending OTP request to test email...');
    
    const response = await axios.post(`${baseURL}/api/auth/send-otp`, {
      email: 'test@genzla.com'
    }, {
      timeout: 60000, // 60 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Success! Response:', response.data);
    
    if (response.data.developmentOTP) {
      console.log(`🔢 Your OTP: ${response.data.developmentOTP}`);
    }
    
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error('❌ Request timed out - server might be processing email slowly');
    } else if (error.response) {
      console.error('❌ Server error:', error.response.status, error.response.data);
    } else {
      console.error('❌ Network error:', error.message);
    }
  }
  
  console.log('\n🏁 Test completed!');
}

testProductionSimple().catch(console.error);