const axios = require('axios');

async function testServerStatus() {
  console.log('🔍 Testing Server Status...\n');
  
  const servers = [
    { name: 'Production Backend', url: 'https://genzla.onrender.com' },
    { name: 'Production Frontend', url: 'https://genzla.vercel.app' }
  ];
  
  for (const server of servers) {
    console.log(`📡 Testing ${server.name}...`);
    
    try {
      const response = await axios.get(server.url, { 
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      console.log(`✅ ${server.name} is responding`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Response size: ${JSON.stringify(response.data).length} bytes`);
      
    } catch (error) {
      console.log(`❌ ${server.name} failed:`);
      console.log(`   Error: ${error.message}`);
      
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
      }
    }
    
    console.log('');
  }
  
  // Test specific API endpoints
  console.log('🔍 Testing API Endpoints...\n');
  
  const endpoints = [
    '/health',
    '/api/test',
    '/api/products'
  ];
  
  for (const endpoint of endpoints) {
    console.log(`📡 Testing ${endpoint}...`);
    
    try {
      const response = await axios.get(`https://genzla.onrender.com${endpoint}`, { 
        timeout: 30000 
      });
      
      console.log(`✅ ${endpoint} is working`);
      console.log(`   Response:`, JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      console.log(`❌ ${endpoint} failed: ${error.message}`);
    }
    
    console.log('');
  }
}

testServerStatus().catch(console.error);