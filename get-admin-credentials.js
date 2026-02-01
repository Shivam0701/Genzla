const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function getAdminCredentials() {
  console.log('🔑 Getting Admin Credentials\n');

  try {
    // Create/get admin user
    const response = await axios.post(`${API_URL}/auth/create-admin-temp`);
    
    if (response.data.success) {
      console.log('✅ Admin user ready!');
      console.log('\n📧 Admin Email:', response.data.user.email);
      console.log('🔑 Admin Token:', response.data.token ? 'Generated' : 'None');
      console.log('👑 Role:', response.data.user.role);
      
      console.log('\n🚀 Admin Login Instructions:');
      console.log('1. Go to: http://localhost:3001/login');
      console.log('2. Email: store.genzla@gmail.com');
      console.log('3. Password: Use forgot password to set one, OR');
      console.log('4. Use the token directly for API calls');
      
      console.log('\n💡 Note: Admin account exists but may need password setup');
    }
  } catch (error) {
    console.error('❌ Failed:', error.response?.data?.message || error.message);
  }
}

getAdminCredentials();