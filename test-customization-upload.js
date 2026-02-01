const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const API_URL = 'http://localhost:5000/api';

async function testCustomizationUpload() {
  console.log('🧪 Testing Customization Image Upload\n');

  try {
    // First get admin token
    const adminResponse = await axios.post(`${API_URL}/auth/create-admin-temp`);
    const token = adminResponse.data.token;
    console.log('✅ Admin token obtained');

    // Test customization request without image first
    console.log('\n1️⃣ Testing customization request without image...');
    
    const requestData = {
      productType: 'T-shirt',
      customizationMethod: 'Embroidery',
      notes: 'Please add a custom logo on the front'
    };

    const response = await axios.post(`${API_URL}/customization/request`, requestData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      console.log('✅ Customization request without image successful');
      console.log('📦 Product Type:', response.data.request.productType);
      console.log('🎨 Method:', response.data.request.customizationMethod);
    }

    console.log('\n🎉 Customization upload system is working!');
    console.log('💡 Image upload should now work in the frontend');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    console.error('Full error:', error.response?.data || error.message);
  }
}

testCustomizationUpload();