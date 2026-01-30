const https = require('https');

const BACKEND_URL = 'https://genzla.onrender.com';

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BACKEND_URL);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'GENZLA-Test/1.0'
      }
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsed
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: responseData
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testProduction() {
  console.log('🚀 Testing GENZLA Production API');
  console.log('Backend URL:', BACKEND_URL);
  console.log('=' .repeat(50));

  // Test 1: Health Check
  try {
    console.log('\n1. Testing Health Endpoint...');
    const health = await makeRequest('/health');
    console.log(`   Status: ${health.status}`);
    console.log(`   Response:`, health.data);
    
    if (health.status === 200) {
      console.log('   ✅ Backend is healthy!');
    } else {
      console.log('   ❌ Backend health check failed');
    }
  } catch (error) {
    console.log('   ❌ Health check error:', error.message);
  }

  // Test 2: API Test Endpoint
  try {
    console.log('\n2. Testing API Test Endpoint...');
    const apiTest = await makeRequest('/api/test');
    console.log(`   Status: ${apiTest.status}`);
    console.log(`   Response:`, apiTest.data);
    
    if (apiTest.status === 200) {
      console.log('   ✅ API test endpoint working!');
    } else {
      console.log('   ❌ API test endpoint failed');
    }
  } catch (error) {
    console.log('   ❌ API test error:', error.message);
  }

  // Test 3: Products Endpoint
  try {
    console.log('\n3. Testing Products Endpoint...');
    const products = await makeRequest('/api/products');
    console.log(`   Status: ${products.status}`);
    
    if (products.status === 200) {
      console.log(`   ✅ Products endpoint working! Found ${products.data.products?.length || 0} products`);
      if (products.data.products?.length > 0) {
        console.log(`   Sample product: ${products.data.products[0].name}`);
      }
    } else {
      console.log('   ❌ Products endpoint failed');
      console.log(`   Response:`, products.data);
    }
  } catch (error) {
    console.log('   ❌ Products error:', error.message);
  }

  // Test 4: Auth Endpoint (should fail without proper data)
  try {
    console.log('\n4. Testing Auth Endpoint...');
    const auth = await makeRequest('/api/auth/send-otp', 'POST', {
      email: 'test@example.com'
    });
    console.log(`   Status: ${auth.status}`);
    
    if (auth.status === 400 || auth.status === 404) {
      console.log('   ✅ Auth endpoint responding (expected failure for test email)');
    } else if (auth.status === 200) {
      console.log('   ✅ Auth endpoint working!');
    } else {
      console.log('   ⚠️ Auth endpoint unexpected response');
    }
    console.log(`   Response:`, auth.data);
  } catch (error) {
    console.log('   ❌ Auth error:', error.message);
  }

  console.log('\n' + '=' .repeat(50));
  console.log('🎯 Production test completed!');
  console.log('\nNext steps:');
  console.log('1. Open test-production-api.html in your browser');
  console.log('2. Test the frontend at https://genzla.vercel.app');
  console.log('3. Try logging in and using admin features');
}

testProduction().catch(console.error);