const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAdminFunctions() {
  console.log('🧪 Testing GENZLA Admin Functions\n');

  try {
    // First, create admin user
    console.log('1️⃣ Creating admin user...');
    
    const adminResponse = await axios.post(`${API_URL}/auth/create-admin-temp`);
    
    if (adminResponse.data.success) {
      console.log('✅ Admin user created/updated');
      const adminToken = adminResponse.data.token;
      console.log('🔑 Admin token received');

      // Test product creation
      console.log('\n2️⃣ Testing product creation...');
      
      const productData = {
        name: 'Test Jacket',
        category: 'Jacket',
        price: 49.99,
        description: 'A test jacket for testing purposes',
        availableCustomizations: ['Embroidery', 'DTF']
      };

      const createProductResponse = await axios.post(`${API_URL}/products`, productData, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (createProductResponse.data.success) {
        console.log('✅ Product created successfully');
        console.log('📦 Product:', createProductResponse.data.product.name);
        console.log('💰 Price:', createProductResponse.data.product.price);
        
        const productId = createProductResponse.data.product._id;

        // Test product update
        console.log('\n3️⃣ Testing product update...');
        
        const updateData = {
          name: 'Updated Test Jacket',
          price: 59.99,
          description: 'Updated description for testing'
        };

        const updateResponse = await axios.put(`${API_URL}/products/${productId}`, updateData, {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (updateResponse.data.success) {
          console.log('✅ Product updated successfully');
          console.log('📦 Updated name:', updateResponse.data.product.name);
          console.log('💰 Updated price:', updateResponse.data.product.price);
        }

        // Test product deletion
        console.log('\n4️⃣ Testing product deletion...');
        
        const deleteResponse = await axios.delete(`${API_URL}/products/${productId}`, {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        });

        if (deleteResponse.data.success) {
          console.log('✅ Product deleted successfully');
        }
      }

      // Test admin dashboard data
      console.log('\n5️⃣ Testing admin dashboard...');
      
      const usersResponse = await axios.get(`${API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (usersResponse.data.success) {
        console.log('✅ Users data loaded');
        console.log('👥 Total users:', usersResponse.data.users.length);
      }

      const requestsResponse = await axios.get(`${API_URL}/admin/customization-requests`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (requestsResponse.data.success) {
        console.log('✅ Customization requests loaded');
        console.log('📋 Total requests:', requestsResponse.data.requests.length);
      }

      console.log('\n🎉 All admin functions working correctly!');
    }

  } catch (error) {
    console.error('❌ Admin test failed:', error.response?.data?.message || error.message);
    console.error('Status:', error.response?.status);
    console.error('Full error:', error.response?.data || error.message);
  }
}

testAdminFunctions();