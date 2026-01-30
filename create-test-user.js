const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function createTestUser() {
  console.log('🧪 Creating Test User for GENZLA\n');

  try {
    // Step 1: Send OTP for signup
    console.log('1️⃣ Sending OTP for signup...');
    
    const otpResponse = await axios.post(`${API_URL}/auth/send-otp`, {
      email: 'newtest@genzla.com',
      purpose: 'signup'
    });

    if (otpResponse.data.success) {
      console.log('✅ OTP sent successfully');
      
      if (otpResponse.data.testMode && otpResponse.data.developmentOTP) {
        const otp = otpResponse.data.developmentOTP;
        console.log('🔢 Test OTP:', otp);

        // Step 2: Verify OTP and complete signup
        console.log('\n2️⃣ Completing signup with OTP...');
        
        const signupResponse = await axios.post(`${API_URL}/auth/verify-otp`, {
          email: 'newtest@genzla.com',
          otp: otp,
          name: 'Test User',
          phone: '+5555555555',
          password: 'password123',
          purpose: 'signup'
        });

        if (signupResponse.data.success) {
          console.log('✅ Test user created successfully');
          console.log('👤 User:', signupResponse.data.user.name);
          console.log('📧 Email:', signupResponse.data.user.email);
          console.log('📱 Phone:', signupResponse.data.user.phone);
          console.log('🔑 Token:', signupResponse.data.token ? 'Generated' : 'None');
          
          console.log('\n🎉 Test user ready for authentication tests!');
        }
      } else {
        console.log('⚠️ No test OTP provided - check email service');
      }
    }

  } catch (error) {
    console.error('❌ Failed to create test user:', error.response?.data?.message || error.message);
  }
}

createTestUser();