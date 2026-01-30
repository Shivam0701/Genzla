const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function checkProductImages() {
  console.log('🔍 Checking Product Images\n');

  try {
    // Get all products
    const response = await axios.get(`${API_URL}/products`);
    
    if (response.data.success) {
      console.log(`Found ${response.data.products.length} products:\n`);
      
      response.data.products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   Category: ${product.category}`);
        console.log(`   Images: ${product.images?.length || 0} image(s)`);
        
        if (product.images && product.images.length > 0) {
          product.images.forEach((img, imgIndex) => {
            console.log(`   Image ${imgIndex + 1}: ${img}`);
          });
        } else {
          console.log('   ❌ No images found');
        }
        console.log('');
      });
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkProductImages();