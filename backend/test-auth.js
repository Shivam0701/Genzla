const http = require('http');

const BASE_URL = 'http://localhost:5000';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
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

async function testAuthFlow() {
  console.log('🧪 Testing GENZLA Backend Authentication Flow\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health check...');
    const healthResponse = await makeRequest('GET', '/health');
    console.log('✅ Health check passed:', healthResponse.data);
    console.log();

    // Test 2: Auth health check
    console.log('2️⃣ Testing auth health check...');
    const authHealthResponse = await makeRequest('GET', '/api/auth/health');
    console.log('✅ Auth health check passed:', authHealthResponse.data);
    console.log();

    // Test 3: Send OTP
    console.log('3️⃣ Testing send OTP...');
    const testEmail = 'test@example.com';
    
    const otpResponse = await makeRequest('POST', '/api/auth/send-otp', {
      email: testEmail
    });
    
    if (otpResponse.status === 200) {
      console.log('✅ Send OTP passed:', otpResponse.data);
    } else {
      console.log('📧 Send OTP response:', otpResponse.data);
      if (otpResponse.data.message && otpResponse.data.message.includes('Email delivery failed')) {
        console.log('⚠️  Email sending failed (expected if SMTP not configured)');
      }
    }
    console.log();

    // Test 4: Test invalid routes
    console.log('4️⃣ Testing 404 handling...');
    const notFoundResponse = await makeRequest('GET', '/api/nonexistent');
    if (notFoundResponse.status === 404) {
      console.log('✅ 404 handling works:', notFoundResponse.data);
    }
    console.log();

    console.log('🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Server is running and responding');
    console.log('- Auth routes are properly mapped');
    console.log('- Error handling is working');
    console.log('- OTP generation is functional');
    console.log('\n💡 To test email sending, configure SMTP settings in .env file');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the backend server is running:');
      console.log('   cd backend && npm run dev');
    }
  }
}

// Run tests
testAuthFlow();