const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testOTPWithResend() {
  console.log('🧪 Testing OTP with Resend API\n');

  try {
    // Test 1: Test email (should work without Resend API key)
    console.log('1️⃣ Testing with test email (should show OTP directly)...');
    
    const testResponse = await axios.post(`${API_URL}/auth/send-otp`, {
      email: 'test@example.com',
      purpose: 'signup'
    });

    if (testResponse.data.success) {
      console.log('✅ Test email OTP sent successfully');
      console.log('📧 Test mode:', testResponse.data.testMode);
      if (testResponse.data.testMode) {
        console.log('🔢 OTP:', testResponse.data.developmentOTP || testResponse.data.otp);
      }
    } else {
      console.log('❌ Test email failed:', testResponse.data.message);
    }

    // Test 2: Production email (requires Resend API key)
    console.log('\n2️⃣ Testing with production email (requires Resend API key)...');
    
    try {
      const prodResponse = await axios.post(`${API_URL}/auth/send-otp`, {
        email: 'user@example.org', // Non-test email
        purpose: 'signup'
      });

      if (prodResponse.data.success) {
        console.log('✅ Production email sent via Resend');
        console.log('📧 Message:', prodResponse.data.message);
      }
    } catch (prodError) {
      console.log('❌ Production email failed (expected if no Resend API key)');
      console.log('Error:', prodError.response?.data?.message || prodError.message);
    }

    // Test 3: Check environment variables
    console.log('\n3️⃣ Environment Check:');
    console.log('Backend running:', '✅');
    console.log('Test emails working:', testResponse.data.success ? '✅' : '❌');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
  }
}

testOTPWithResend();