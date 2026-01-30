// Test email service in production
const https = require('https');

const BACKEND_URL = 'https://genzla.onrender.com';

async function testEmailService() {
  console.log('🧪 Testing GENZLA Production Email Service');
  console.log('=' .repeat(50));
  
  try {
    // Test 1: Send OTP to admin email
    console.log('\n📧 Test 1: Sending OTP to admin email...');
    
    const otpData = {
      email: 'store.genzla@gmail.com'
    };
    
    const postData = JSON.stringify(otpData);
    
    const options = {
      hostname: 'genzla.onrender.com',
      port: 443,
      path: '/api/auth/send-otp',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'GENZLA-Email-Test/1.0'
      }
    };

    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: parsed
            });
          } catch (e) {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: data
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

      req.write(postData);
      req.end();
    });

    console.log(`Response Status: ${response.status}`);
    console.log(`Response Data:`, response.data);

    if (response.status === 200) {
      console.log('✅ OTP request successful!');
      console.log('📬 Check the admin email: store.genzla@gmail.com');
      console.log('');
      console.log('🔑 Next Steps:');
      console.log('1. Check your email inbox for the OTP');
      console.log('2. Use the OTP to complete registration');
      console.log('3. Test the complete authentication flow');
    } else if (response.status === 429) {
      console.log('⚠️ Rate limited - too many requests');
      console.log('Wait a few minutes and try again');
    } else if (response.status === 500) {
      console.log('❌ Server error - email service issue');
      console.log('This could be due to:');
      console.log('- SMTP configuration problems');
      console.log('- Gmail app password issues');
      console.log('- Network connectivity problems');
    } else {
      console.log('❌ Unexpected response');
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
    
    if (error.message.includes('timeout')) {
      console.log('');
      console.log('🔧 Troubleshooting:');
      console.log('1. Check if the backend is running: https://genzla.onrender.com/health');
      console.log('2. Verify network connectivity');
      console.log('3. Try again in a few minutes');
    }
  }

  console.log('\n' + '=' .repeat(50));
  console.log('📊 Email Test Summary');
  console.log('');
  console.log('If the test was successful:');
  console.log('✅ Email service is working');
  console.log('✅ SMTP configuration is correct');
  console.log('✅ OTP delivery is functional');
  console.log('');
  console.log('If the test failed:');
  console.log('❌ Check backend logs for detailed error messages');
  console.log('❌ Verify SMTP environment variables on Render');
  console.log('❌ Ensure Gmail app password is correct');
  console.log('');
  console.log('🌐 Production URLs:');
  console.log('Frontend: https://genzla.vercel.app');
  console.log('Backend: https://genzla.onrender.com');
  console.log('Admin Email: store.genzla@gmail.com');
}

testEmailService().catch(console.error);