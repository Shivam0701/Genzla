const axios = require('axios');

async function testProductionEmail() {
  console.log('🧪 Testing Production Email API...\n');
  
  const baseURL = 'https://genzla.onrender.com';
  
  // Test different email addresses
  const testEmails = [
    'test@genzla.com',
    'store.genzla@gmail.com',
    'demo@genzla.com'
  ];
  
  for (const email of testEmails) {
    console.log(`📧 Testing email: ${email}`);
    
    try {
      const response = await axios.post(`${baseURL}/api/auth/send-otp`, {
        email: email
      }, {
        timeout: 30000 // 30 second timeout
      });
      
      console.log('✅ Response:', response.data);
      
      if (response.data.developmentOTP) {
        console.log(`🔢 OTP: ${response.data.developmentOTP}`);
      }
      
    } catch (error) {
      console.error('❌ Error:', error.response?.data || error.message);
    }
    
    console.log('---');
  }
  
  console.log('\n🏁 Production email test completed!');
}

testProductionEmail().catch(console.error);