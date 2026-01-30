const axios = require('axios');

async function testAuthFlow() {
  console.log('🔐 Testing Authentication Flow...\n');
  
  const BASE_URL = 'https://genzla.onrender.com';
  
  // Test 1: Send OTP to test email
  console.log('1️⃣ Testing OTP Send (Test Email)...');
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/send-otp`, {
      email: 'test@genzla.com'
    }, { timeout: 20000 });
    
    console.log('✅ OTP Response:', response.data);
    
    if (response.data.developmentOTP) {
      console.log('🔢 OTP Received:', response.data.developmentOTP);
      
      // Test 2: Verify OTP
      console.log('\n2️⃣ Testing OTP Verification...');
      const verifyResponse = await axios.post(`${BASE_URL}/api/auth/verify-otp`, {
        email: 'test@genzla.com',
        otp: response.data.developmentOTP,
        name: 'Test User',
        phone: '+1234567890'
      }, { timeout: 15000 });
      
      console.log('✅ Verification Response:', verifyResponse.data);
      
      if (verifyResponse.data.token) {
        console.log('🎫 Auth Token Received!');
        
        // Test 3: Test authenticated endpoint
        console.log('\n3️⃣ Testing Authenticated Request...');
        const authResponse = await axios.get(`${BASE_URL}/api/customization/requests`, {
          headers: { Authorization: `Bearer ${verifyResponse.data.token}` },
          timeout: 15000
        });
        
        console.log('✅ Authenticated Request Success:', authResponse.data);
      }
    }
    
  } catch (error) {
    console.log('❌ Auth Flow Error:', error.response?.data || error.message);
  }
  
  // Test 4: Admin Email
  console.log('\n4️⃣ Testing Admin Email...');
  try {
    const adminResponse = await axios.post(`${BASE_URL}/api/auth/send-otp`, {
      email: 'store.genzla@gmail.com'
    }, { timeout: 20000 });
    
    console.log('✅ Admin OTP Response:', adminResponse.data);
    
  } catch (error) {
    console.log('❌ Admin Email Error:', error.response?.data || error.message);
  }
  
  // Test 5: Forgot Password
  console.log('\n5️⃣ Testing Forgot Password...');
  try {
    const forgotResponse = await axios.post(`${BASE_URL}/api/auth/forgot-password`, {
      email: 'test@genzla.com'
    }, { timeout: 20000 });
    
    console.log('✅ Forgot Password Response:', forgotResponse.data);
    
  } catch (error) {
    console.log('❌ Forgot Password Error:', error.response?.data || error.message);
  }
  
  console.log('\n🏁 Authentication Flow Test Complete!');
}

testAuthFlow().catch(console.error);