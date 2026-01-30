const axios = require('axios');

async function testServerHealth() {
  console.log('🏥 Testing Server Health...\n');
  
  const baseURL = 'https://genzla.onrender.com';
  
  try {
    console.log('📡 Testing health endpoint...');
    const healthResponse = await axios.get(`${baseURL}/health`, {
      timeout: 10000
    });
    console.log('✅ Health check:', healthResponse.data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
  
  try {
    console.log('📡 Testing API test endpoint...');
    const testResponse = await axios.get(`${baseURL}/api/test`, {
      timeout: 10000
    });
    console.log('✅ API test:', testResponse.data);
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
  
  console.log('\n🏁 Server health test completed!');
}

testServerHealth().catch(console.error);