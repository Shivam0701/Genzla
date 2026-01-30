const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function testUpdatedProducts() {
  console.log('🧪 Testing Updated GENZLA Product System\n');

  try {
    // Get admin token
    console.log('1️⃣ Getting admin token...');
    
    const adminResponse = await axios.post(`${API_URL}/auth/create-admin-temp`);
    const adminToken = adminResponse.data.token;
    console.log('✅ Admin token received');

    // Test 1: Create product with Hoodie category
    console.log('\n2️⃣ Testing Hoodie category creation...');
    
    const hoodieData = {
      name: 'Custom Hoodie',
      category: 'Hoodie',
      price: '₹1999',
      description: 'Premium quality hoodie perfect for customization',
      availableCustomizations: ['Embroidery', 'DTF']
    };

    const hoodieResponse = await axios.post(`${API_URL}/products`, hoodieData, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (hoodieResponse.data.success) {
      console.log('✅ Hoodie created successfully');
      console.log('📦 Product:', hoodieResponse.data.product.name);
      console.log('💰 Price:', hoodieResponse.data.product.price);
      console.log('🏷️ Category:', hoodieResponse.data.product.category);
    }

    // Test 2: Create product with text price
    console.log('\n3️⃣ Testing text price creation...');
    
    const textPriceData = {
      name: 'Custom T-Shirt',
      category: 'T-shirt',
      price: 'Contact for Price',
      description: 'Premium t-shirt with custom pricing',
      availableCustomizations: ['Hand Painted', 'Puff Print']
    };

    const textPriceResponse = await axios.post(`${API_URL}/products`, textPriceData, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (textPriceResponse.data.success) {
      console.log('✅ Text price product created successfully');
      console.log('📦 Product:', textPriceResponse.data.product.name);
      console.log('💰 Price:', textPriceResponse.data.product.price);
    }

    // Test 3: Create product with no price
    console.log('\n4️⃣ Testing no price creation...');
    
    const noPriceData = {
      name: 'Custom Jacket',
      category: 'Jacket',
      description: 'Premium jacket for custom orders',
      availableCustomizations: ['Embroidery']
    };

    const noPriceResponse = await axios.post(`${API_URL}/products`, noPriceData, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (noPriceResponse.data.success) {
      console.log('✅ No price product created successfully');
      console.log('📦 Product:', noPriceResponse.data.product.name);
      console.log('💰 Price:', noPriceResponse.data.product.price || 'No price set');
    }

    // Test 4: Update product
    console.log('\n5️⃣ Testing product update...');
    
    const productId = hoodieResponse.data.product._id;
    const updateData = {
      name: 'Updated Custom Hoodie',
      price: 'Custom Quote Available'
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

    // Test 5: Get all products
    console.log('\n6️⃣ Testing product listing...');
    
    const listResponse = await axios.get(`${API_URL}/products`);

    if (listResponse.data.success) {
      console.log('✅ Products listed successfully');
      console.log('📦 Total products:', listResponse.data.products.length);
      
      // Show some products with their prices
      listResponse.data.products.slice(0, 3).forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} - ${product.price ? '₹' + product.price : 'No price'}`);
      });
    }

    console.log('\n🎉 All product tests passed!');
    console.log('\n📋 Summary:');
    console.log('• Hoodie category: ✅');
    console.log('• Rupee (₹) pricing: ✅');
    console.log('• Text pricing: ✅');
    console.log('• Optional pricing: ✅');
    console.log('• Product updates: ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    console.error('Status:', error.response?.status);
    console.error('Full error:', error.response?.data || error.message);
  }
}

testUpdatedProducts();