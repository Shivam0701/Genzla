const axios = require('axios');

async function testFreshAuth() {
  console.log('🔐 Testing Fresh Authentication...\n');
  
  const BASE_URL = 'https://genzla.onrender.com';
  const FRESH_EMAIL = 'demo@genzla.com'; // Different test email
  
  // Test 1: Fresh signup
  console.log('1️⃣ Testing Fresh Signup...');
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/send-otp`, {
      email: FRESH_EMAIL
    }, { timeout: 20000 });
    
    console.log('✅ OTP Response:', response.data);
    
    if (response.data.developmentOTP) {
      console.log('🔢 OTP:', response.data.developmentOTP);
      
      // Verify with fresh data
      console.log('\n2️⃣ Testing Fresh Verification...');
      const verifyResponse = await axios.post(`${BASE_URL}/api/auth/verify-otp`, {
        email: FRESH_EMAIL,
        otp: response.data.developmentOTP,
        name: 'Demo User',
        phone: '+9876543210' // Different phone
      }, { timeout: 15000 });
      
      console.log('✅ Verification Response:', verifyResponse.data);
      
      if (verifyResponse.data.token) {
        const token = verifyResponse.data.token;
        console.log('🎫 Token received!');
        
        // Test customization request
        console.log('\n3️⃣ Testing Customization Request...');
        const customResponse = await axios.post(`${BASE_URL}/api/customization/request`, {
          productType: 'shirt',
          size: 'M',
          color: 'Blue',
          customizationType: 'embroidery',
          description: 'Test customization',
          urgency: 'normal'
        }, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000
        });
        
        console.log('✅ Customization Response:', customResponse.data);
        
        // Test dashboard access
        console.log('\n4️⃣ Testing Dashboard Access...');
        const dashResponse = await axios.get(`${BASE_URL}/api/customization/requests`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000
        });
        
        console.log('✅ Dashboard Response:', dashResponse.data);
      }
    }
    
  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
  }
  
  // Test admin functionality
  console.log('\n5️⃣ Testing Admin Login...');
  try {
    const adminOtpResponse = await axios.post(`${BASE_URL}/api/auth/send-otp`, {
      email: 'store.genzla@gmail.com'
    }, { timeout: 20000 });
    
    console.log('✅ Admin OTP Response:', adminOtpResponse.data);
    
    if (adminOtpResponse.data.developmentOTP) {
      const adminVerifyResponse = await axios.post(`${BASE_URL}/api/auth/verify-otp`, {
        email: 'store.genzla@gmail.com',
        otp: adminOtpResponse.data.developmentOTP
      }, { timeout: 15000 });
      
      console.log('✅ Admin Verification:', adminVerifyResponse.data);
      
      if (adminVerifyResponse.data.token) {
        const adminToken = adminVerifyResponse.data.token;
        console.log('👑 Admin token received!');
        
        // Test admin endpoints
        console.log('\n6️⃣ Testing Admin Endpoints...');
        
        // Get users
        const usersResponse = await axios.get(`${BASE_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${adminToken}` },
          timeout: 15000
        });
        console.log('✅ Users loaded:', usersResponse.data.users?.length || 0);
        
        // Get customization requests
        const requestsResponse = await axios.get(`${BASE_URL}/api/admin/customization-requests`, {
          headers: { Authorization: `Bearer ${adminToken}` },
          timeout: 15000
        });
        console.log('✅ Requests loaded:', requestsResponse.data.requests?.length || 0);
        
        // Test product creation
        console.log('\n7️⃣ Testing Product Creation...');
        const productResponse = await axios.post(`${BASE_URL}/api/admin/products`, {
          name: 'Test Product ' + Date.now(),
          category: 'shirt',
          price: 99.99,
          description: 'Test product for functionality check',
          customizations: ['Embroidery', 'DTF']
        }, {
          headers: { Authorization: `Bearer ${adminToken}` },
          timeout: 15000
        });
        
        console.log('✅ Product Creation:', productResponse.data);
      }
    }
    
  } catch (error) {
    console.log('❌ Admin Error:', error.response?.data || error.message);
  }
  
  console.log('\n🏁 Fresh Authentication Test Complete!');
}

testFreshAuth().catch(console.error);