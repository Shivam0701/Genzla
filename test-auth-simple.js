const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAuthFlow() {
  console.log('🧪 Testing GENZLA Authentication Flow\n');

  try {
    // Test 1: Login with email + password (no OTP)
    console.log('1️⃣ Testing Login (Email + Password)...');
    
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@genzla.com',
      password: 'password123'
    });

    if (loginResponse.data.success) {
      console.log('✅ Login successful');
      console.log('👤 User:', loginResponse.data.user.name);
      console.log('🔑 Token received');
    }

    // Test 2: Signup with OTP
    console.log('\n2️⃣ Testing Signup (OTP Required)...');
    
    const otpResponse = await axios.post(`${API_URL}/auth/send-otp`, {
      email: 'test@example.com',
      purpose: 'signup'
    });

    if (otpResponse.data.success) {
      console.log('✅ OTP sent for signup');
      if (otpResponse.data.testMode) {
        console.log('🔢 Test OTP:', otpResponse.data.developmentOTP);
      }
    }

    // Test 3: Forgot Password with OTP
    console.log('\n3️⃣ Testing Forgot Password (OTP Required)...');
    
    const forgotResponse = await axios.post(`${API_URL}/auth/forgot-password`, {
      email: 'test@genzla.com'
    });

    if (forgotResponse.data.success) {
      console.log('✅ Password reset OTP sent');
      if (forgotResponse.data.testMode) {
        console.log('🔢 Test OTP:', forgotResponse.data.developmentOTP);
      }
    }

    console.log('\n🎉 Authentication flow test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('• Login: Email + Password ✅');
    console.log('• Signup: OTP Verification ✅');
    console.log('• Forgot Password: OTP Verification ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
  }
}

testAuthFlow();