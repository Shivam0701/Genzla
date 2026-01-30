const https = require('https');

const BACKEND_URL = 'https://genzla.onrender.com';
const ADMIN_EMAIL = 'store.genzla@gmail.com';

function makeRequest(path, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BACKEND_URL);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'GENZLA-Admin-Setup/1.0',
        ...headers
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

    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function createAdminUser() {
  console.log('👑 Creating Admin User for Production');
  console.log('=' .repeat(50));
  console.log(`Admin Email: ${ADMIN_EMAIL}`);
  console.log(`Backend URL: ${BACKEND_URL}`);
  console.log('');

  try {
    // Step 1: Send OTP to admin email
    console.log('📧 Step 1: Sending OTP to admin email...');
    const otpResponse = await makeRequest('/api/auth/send-otp', 'POST', {
      email: ADMIN_EMAIL
    });

    console.log(`Response Status: ${otpResponse.status}`);
    console.log(`Response:`, otpResponse.data);

    if (otpResponse.status === 200) {
      console.log('✅ OTP sent successfully!');
      console.log('');
      console.log('🔑 NEXT STEPS:');
      console.log('1. Check your email for the OTP code');
      console.log('2. Use the test-frontend-flow.html file to complete verification');
      console.log('3. Or use the following curl command:');
      console.log('');
      console.log(`curl -X POST ${BACKEND_URL}/api/auth/verify-otp \\`);
      console.log(`  -H "Content-Type: application/json" \\`);
      console.log(`  -d '{`);
      console.log(`    "email": "${ADMIN_EMAIL}",`);
      console.log(`    "otp": "YOUR_OTP_HERE",`);
      console.log(`    "name": "GENZLA Admin",`);
      console.log(`    "phone": "+1234567890"`);
      console.log(`  }'`);
      console.log('');
      console.log('4. After verification, run the make-admin script:');
      console.log(`   node backend/scripts/make-admin.js ${ADMIN_EMAIL}`);
    } else {
      console.log('❌ Failed to send OTP');
      console.log('This might be because:');
      console.log('- The user already exists');
      console.log('- Email service is not configured properly');
      console.log('- Rate limiting is active');
    }

  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('');
  console.log('🔧 Alternative: Direct Admin Creation');
  console.log('If OTP doesn\'t work, you can create the admin user directly:');
  console.log('');
  console.log('1. Connect to your MongoDB database');
  console.log('2. Run this command in MongoDB shell:');
  console.log('');
  console.log(`db.users.insertOne({`);
  console.log(`  name: "GENZLA Admin",`);
  console.log(`  email: "${ADMIN_EMAIL}",`);
  console.log(`  phone: "+1234567890",`);
  console.log(`  role: "admin",`);
  console.log(`  isVerified: true,`);
  console.log(`  createdAt: new Date(),`);
  console.log(`  updatedAt: new Date()`);
  console.log(`});`);
}

createAdminUser().catch(console.error);