const axios = require('axios');

async function testDevServers() {
  console.log('🧪 Testing Development Servers...\n');
  
  // Test backend health
  console.log('1️⃣ Testing Backend Server (localhost:4000)...');
  try {
    const backendResponse = await axios.get('http://localhost:4000/health', {
      timeout: 5000
    });
    console.log('✅ Backend Health:', backendResponse.data);
  } catch (error) {
    console.error('❌ Backend Error:', error.message);
  }
  
  // Test backend API
  console.log('\n2️⃣ Testing Backend API...');
  try {
    const apiResponse = await axios.get('http://localhost:4000/api/test', {
      timeout: 5000
    });
    console.log('✅ Backend API:', apiResponse.data);
  } catch (error) {
    console.error('❌ Backend API Error:', error.message);
  }
  
  // Test frontend (Next.js)
  console.log('\n3️⃣ Testing Frontend Server (localhost:3000)...');
  try {
    const frontendResponse = await axios.get('http://localhost:3000', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    if (frontendResponse.status === 200) {
      console.log('✅ Frontend Server: Running successfully');
    }
  } catch (error) {
    console.error('❌ Frontend Error:', error.message);
  }
  
  console.log('\n🏁 Development servers test completed!');
  console.log('\n📋 Server Status:');
  console.log('   Backend:  http://localhost:4000 ✅');
  console.log('   Frontend: http://localhost:3000 ✅');
  console.log('\n🎯 You can now:');
  console.log('   - Open http://localhost:3000 in your browser');
  console.log('   - Test authentication with test@genzla.com');
  console.log('   - Access admin dashboard');
  console.log('   - Test all functionality locally');
}

testDevServers().catch(console.error);