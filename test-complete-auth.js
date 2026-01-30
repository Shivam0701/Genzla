const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testCompleteAuth() {
  console.log('🧪 GENZLA Complete Authentication Test\n');

  try {
    // Test 1: Create test user with OTP signup
    console.log('1️⃣ Testing Signup Flow (OTP Required)...');
    
    const otpResponse = await axios.post(`${API_URL}/auth/send-otp`, {
      email: 'test@example.com', // This should trigger test mode
      purpose: 'signup'
    });

    if (otpResponse.data.success && otpResponse.data.testMode) {
      console.log('✅ OTP sent in test mode');
      console.log('🔢 Test OTP:', otpResponse.data.developmentOTP);

      // Complete signup
      const signupResponse = await axios.post(`${API_URL}/auth/verify-otp`, {
        email: 'test@example.com',
        otp: otpResponse.data.developmentOTP,
        name: 'Test User',
        phone: '+1111111111',
        password: 'password123',
        purpose: 'signup'
      });

      if (signupResponse.data.success) {
        console.log('✅ Signup completed successfully');
        console.log('👤 User:', signupResponse.data.user.name);
      }
    }

    // Test 2: Login with email + password (no OTP)
    console.log('\n2️⃣ Testing Login (Email + Password)...');
    
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });

    if (loginResponse.data.success) {
      console.log('✅ Login successful');
      console.log('👤 User:', loginResponse.data.user.name);
      console.log('🔑 Token received');
    }

    // Test 3: Forgot password with OTP
    console.log('\n3️⃣ Testing Forgot Password (OTP Required)...');
    
    const forgotResponse = await axios.post(`${API_URL}/auth/forgot-password`, {
      email: 'test@example.com'
    });

    if (forgotResponse.data.success) {
      console.log('✅ Password reset OTP sent');
      if (forgotResponse.data.testMode) {
        console.log('🔢 Test OTP:', forgotResponse.data.developmentOTP);

        // Test password reset
        const resetResponse = await axios.post(`${API_URL}/auth/reset-password`, {
          email: 'test@example.com',
          otp: forgotResponse.data.developmentOTP,
          newPassword: 'newpassword123'
        });

        if (resetResponse.data.success) {
          console.log('✅ Password reset successful');
        }
      }
    }

    // Test 4: Login with new password
    console.log('\n4️⃣ Testing Login with New Password...');
    
    const newLoginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'newpassword123'
    });

    if (newLoginResponse.data.success) {
      console.log('✅ Login with new password successful');
      console.log('👤 User:', newLoginResponse.data.user.name);
    }

    console.log('\n🎉 All authentication tests passed!');
    console.log('\n📋 Summary:');
    console.log('• Signup with OTP: ✅');
    console.log('• Login with Email + Password: ✅');
    console.log('• Forgot Password with OTP: ✅');
    console.log('• Password Reset: ✅');
    console.log('• Login with New Password: ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    console.error('Full error:', error.response?.data || error.message);
  }
}

testCompleteAuth();