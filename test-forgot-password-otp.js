const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testForgotPasswordOTP() {
  console.log('🧪 Testing Forgot Password OTP with Resend\n');

  try {
    // Test forgot password OTP with your verified email
    console.log('1️⃣ Sending forgot password OTP to store.genzla@gmail.com...');
    
    const response = await axios.post(`${API_URL}/auth/forgot-password`, {
      email: 'store.genzla@gmail.com'
    });

    if (response.data.success) {
      console.log('✅ Forgot password OTP sent successfully via Resend!');
      console.log('📧 Message:', response.data.message);
      console.log('📬 Check your email inbox for the password reset OTP');
      
      if (response.data.testMode) {
        console.log('🔢 Test OTP:', response.data.developmentOTP);
      }
    } else {
      console.log('❌ Email failed:', response.data.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    console.error('Full error:', error.response?.data || error.message);
  }
}

testForgotPasswordOTP();