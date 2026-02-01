const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testOTPWithRealEmail() {
  console.log('🧪 Testing OTP with Real Email (Resend)\n');

  try {
    // Test with your verified email address
    console.log('1️⃣ Testing with verified email (store.genzla@gmail.com)...');
    
    const response = await axios.post(`${API_URL}/auth/send-otp`, {
      email: 'store.genzla@gmail.com',
      purpose: 'signup'
    });

    if (response.data.success) {
      console.log('✅ Email sent successfully via Resend!');
      console.log('📧 Message:', response.data.message);
      console.log('📬 Check your email inbox for the OTP');
    } else {
      console.log('❌ Email failed:', response.data.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    console.error('Full error:', error.response?.data || error.message);
  }
}

testOTPWithRealEmail();