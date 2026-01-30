const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testCustomization() {
  console.log('🧪 Testing GENZLA Customization Features\n');

  try {
    // First, get admin token
    console.log('1️⃣ Getting admin token...');
    
    const adminResponse = await axios.post(`${API_URL}/auth/create-admin-temp`);
    const adminToken = adminResponse.data.token;
    console.log('✅ Admin token received');

    // Test customization request
    console.log('\n2️⃣ Testing customization request...');
    
    const customizationData = {
      productType: 'T-shirt',
      customizationMethod: 'Embroidery',
      notes: 'Please add a custom logo on the front chest area'
    };

    const customizationResponse = await axios.post(`${API_URL}/customization/request`, customizationData, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (customizationResponse.data.success) {
      console.log('✅ Customization request submitted successfully');
      console.log('📦 Product Type:', customizationResponse.data.request.productType);
      console.log('🎨 Method:', customizationResponse.data.request.customizationMethod);
      console.log('📝 Notes:', customizationResponse.data.request.notes);
      
      const requestId = customizationResponse.data.request._id;

      // Test getting user's requests
      console.log('\n3️⃣ Testing user customization requests...');
      
      const userRequestsResponse = await axios.get(`${API_URL}/customization/my-requests`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (userRequestsResponse.data.success) {
        console.log('✅ User requests loaded');
        console.log('📋 Total requests:', userRequestsResponse.data.count);
      }

      // Test dashboard stats
      console.log('\n4️⃣ Testing customization dashboard stats...');
      
      const statsResponse = await axios.get(`${API_URL}/customization/dashboard-stats`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (statsResponse.data.success) {
        console.log('✅ Dashboard stats loaded');
        console.log('📊 Total requests:', statsResponse.data.stats.totalRequests);
        console.log('⏳ In progress:', statsResponse.data.stats.inProgress);
        console.log('✅ Completed:', statsResponse.data.stats.completed);
      }

      console.log('\n🎉 All customization features working correctly!');
    }

  } catch (error) {
    console.error('❌ Customization test failed:', error.response?.data?.message || error.message);
    console.error('Status:', error.response?.status);
    console.error('Full error:', error.response?.data || error.message);
  }
}

testCustomization();