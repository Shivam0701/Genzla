const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testGoogleAdminAuth() {
  console.log('🧪 Testing Google Auth with Admin Access\n');

  try {
    // Simulate Google auth for admin email
    const response = await axios.post(`${API_URL}/auth/google`, {
      googleToken: 'fake-google-token-for-testing',
      name: 'GENZLA Admin',
      email: 'store.genzla@gmail.com',
      picture: 'https://example.com/avatar.jpg',
      // No phone required for admin emails
    });

    if (response.data.success) {
      console.log('✅ Google Auth successful!');
      console.log('📧 Email:', response.data.user.email);
      console.log('👤 Name:', response.data.user.name);
      console.log('👑 Role:', response.data.user.role);
      console.log('🔑 Token:', response.data.token ? 'Generated' : 'None');
      console.log('💬 Message:', response.data.message);
      
      if (response.data.user.role === 'admin') {
        console.log('\n🎉 SUCCESS: Admin access granted via Google Auth!');
        console.log('🚀 You can now access admin dashboard');
      } else {
        console.log('\n⚠️ User role is not admin');
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    console.error('Full error:', error.response?.data || error.message);
  }
}

testGoogleAdminAuth();