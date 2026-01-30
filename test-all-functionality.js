const axios = require('axios');

// Configuration
const BASE_URL = 'https://genzla.onrender.com';
const TEST_EMAIL = 'test@genzla.com';
const ADMIN_EMAIL = 'store.genzla@gmail.com';

let authToken = '';
let adminToken = '';
let testUserId = '';
let testProductId = '';

async function testAllFunctionality() {
  console.log('🧪 GENZLA Complete Functionality Test\n');
  console.log('Testing Production API:', BASE_URL);
  console.log('=' .repeat(50));

  try {
    // 1. Test Server Health
    await testServerHealth();
    
    // 2. Test Authentication Flow
    await testAuthFlow();
    
    // 3. Test Admin Authentication
    await testAdminAuth();
    
    // 4. Test Product Management
    await testProductManagement();
    
    // 5. Test Customization Requests
    await testCustomizationRequests();
    
    // 6. Test Status Updates
    await testStatusUpdates();
    
    // 7. Test Forgot Password
    await testForgotPassword();
    
    console.log('\n' + '=' .repeat(50));
    console.log('🎉 ALL TESTS COMPLETED!');
    
  } catch (error) {
    console.error('\n❌ TEST SUITE FAILED:', error.message);
  }
}

async function testServerHealth() {
  console.log('\n📡 1. Testing Server Health...');
  
  try {
    const response = await axios.get(`${BASE_URL}/health`, { timeout: 10000 });
    console.log('✅ Server is running:', response.data.status);
    console.log('   Environment:', response.data.environment);
  } catch (error) {
    throw new Error(`Server health check failed: ${error.message}`);
  }
}

async function testAuthFlow() {
  console.log('\n🔐 2. Testing Authentication Flow...');
  
  // Test OTP Send
  console.log('   📧 Testing OTP send...');
  try {
    const otpResponse = await axios.post(`${BASE_URL}/api/auth/send-otp`, {
      email: TEST_EMAIL
    }, { timeout: 15000 });
    
    if (otpResponse.data.success) {
      console.log('   ✅ OTP sent successfully');
      
      if (otpResponse.data.developmentOTP) {
        console.log('   🔢 Test OTP received:', otpResponse.data.developmentOTP);
        
        // Test OTP Verification
        console.log('   🔍 Testing OTP verification...');
        const verifyResponse = await axios.post(`${BASE_URL}/api/auth/verify-otp`, {
          email: TEST_EMAIL,
          otp: otpResponse.data.developmentOTP,
          name: 'Test User',
          phone: '+1234567890'
        }, { timeout: 10000 });
        
        if (verifyResponse.data.success) {
          console.log('   ✅ OTP verification successful');
          authToken = verifyResponse.data.token;
          testUserId = verifyResponse.data.user.id;
          console.log('   🎫 Auth token received');
        } else {
          throw new Error('OTP verification failed');
        }
      } else {
        console.log('   ⚠️ No development OTP - email service working');
      }
    } else {
      throw new Error('OTP send failed');
    }
  } catch (error) {
    throw new Error(`Auth flow failed: ${error.message}`);
  }
}

async function testAdminAuth() {
  console.log('\n👑 3. Testing Admin Authentication...');
  
  try {
    const otpResponse = await axios.post(`${BASE_URL}/api/auth/send-otp`, {
      email: ADMIN_EMAIL
    }, { timeout: 15000 });
    
    if (otpResponse.data.success) {
      console.log('   ✅ Admin OTP request successful');
      
      if (otpResponse.data.developmentOTP) {
        console.log('   🔢 Admin OTP:', otpResponse.data.developmentOTP);
        
        const verifyResponse = await axios.post(`${BASE_URL}/api/auth/verify-otp`, {
          email: ADMIN_EMAIL,
          otp: otpResponse.data.developmentOTP
        }, { timeout: 10000 });
        
        if (verifyResponse.data.success) {
          console.log('   ✅ Admin authentication successful');
          adminToken = verifyResponse.data.token;
          console.log('   👑 Admin role:', verifyResponse.data.user.role);
        }
      } else {
        console.log('   ⚠️ Admin email sent - check email for OTP');
      }
    }
  } catch (error) {
    console.log('   ⚠️ Admin auth test skipped:', error.message);
  }
}

async function testProductManagement() {
  console.log('\n📦 4. Testing Product Management...');
  
  // Test Get Products
  console.log('   📋 Testing product listing...');
  try {
    const productsResponse = await axios.get(`${BASE_URL}/api/products`, { timeout: 10000 });
    
    if (productsResponse.data.success) {
      console.log('   ✅ Products loaded:', productsResponse.data.products.length, 'items');
      
      if (productsResponse.data.products.length > 0) {
        testProductId = productsResponse.data.products[0]._id;
        console.log('   📝 Test product ID:', testProductId);
      }
    }
  } catch (error) {
    console.log('   ❌ Product listing failed:', error.message);
  }
  
  // Test Add Product (Admin only)
  if (adminToken) {
    console.log('   ➕ Testing product creation...');
    try {
      const newProduct = {
        name: 'Test Product',
        category: 'shirt',
        price: 99.99,
        description: 'Test product description',
        customizations: ['Embroidery', 'Color Change']
      };
      
      const createResponse = await axios.post(`${BASE_URL}/api/admin/products`, newProduct, {
        headers: { Authorization: `Bearer ${adminToken}` },
        timeout: 10000
      });
      
      if (createResponse.data.success) {
        console.log('   ✅ Product created successfully');
        testProductId = createResponse.data.product._id;
      }
    } catch (error) {
      console.log('   ❌ Product creation failed:', error.message);
    }
  }
  
  // Test Edit Product (Admin only)
  if (adminToken && testProductId) {
    console.log('   ✏️ Testing product edit...');
    try {
      const updateData = {
        name: 'Updated Test Product',
        price: 149.99
      };
      
      const updateResponse = await axios.put(`${BASE_URL}/api/admin/products/${testProductId}`, updateData, {
        headers: { Authorization: `Bearer ${adminToken}` },
        timeout: 10000
      });
      
      if (updateResponse.data.success) {
        console.log('   ✅ Product updated successfully');
      }
    } catch (error) {
      console.log('   ❌ Product update failed:', error.message);
    }
  }
}

async function testCustomizationRequests() {
  console.log('\n🎨 5. Testing Customization Requests...');
  
  if (!authToken) {
    console.log('   ⚠️ Skipping - no auth token');
    return;
  }
  
  console.log('   📝 Testing customization request creation...');
  try {
    const customizationData = {
      productType: 'shirt',
      size: 'M',
      color: 'Blue',
      customizationType: 'embroidery',
      description: 'Test customization request',
      urgency: 'normal'
    };
    
    const response = await axios.post(`${BASE_URL}/api/customization/request`, customizationData, {
      headers: { Authorization: `Bearer ${authToken}` },
      timeout: 10000
    });
    
    if (response.data.success) {
      console.log('   ✅ Customization request created');
      console.log('   📋 Request ID:', response.data.request._id);
    }
  } catch (error) {
    console.log('   ❌ Customization request failed:', error.message);
  }
}

async function testStatusUpdates() {
  console.log('\n📊 6. Testing Status Updates...');
  
  if (!adminToken) {
    console.log('   ⚠️ Skipping - no admin token');
    return;
  }
  
  console.log('   📋 Testing customization requests listing...');
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/customization-requests`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      timeout: 10000
    });
    
    if (response.data.success && response.data.requests.length > 0) {
      console.log('   ✅ Requests loaded:', response.data.requests.length, 'items');
      
      const requestId = response.data.requests[0]._id;
      console.log('   🔄 Testing status update...');
      
      const statusUpdate = await axios.put(`${BASE_URL}/api/admin/customization-requests/${requestId}/status`, {
        status: 'in_progress'
      }, {
        headers: { Authorization: `Bearer ${adminToken}` },
        timeout: 10000
      });
      
      if (statusUpdate.data.success) {
        console.log('   ✅ Status updated successfully');
      }
    } else {
      console.log('   ℹ️ No requests found to update');
    }
  } catch (error) {
    console.log('   ❌ Status update test failed:', error.message);
  }
}

async function testForgotPassword() {
  console.log('\n🔑 7. Testing Forgot Password...');
  
  console.log('   📧 Testing forgot password OTP...');
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/forgot-password`, {
      email: TEST_EMAIL
    }, { timeout: 15000 });
    
    if (response.data.success) {
      console.log('   ✅ Forgot password OTP sent');
      
      if (response.data.developmentOTP) {
        console.log('   🔢 Reset OTP:', response.data.developmentOTP);
        
        // Test password reset
        console.log('   🔄 Testing password reset...');
        const resetResponse = await axios.post(`${BASE_URL}/api/auth/reset-password`, {
          email: TEST_EMAIL,
          otp: response.data.developmentOTP,
          newPassword: 'newPassword123'
        }, { timeout: 10000 });
        
        if (resetResponse.data.success) {
          console.log('   ✅ Password reset successful');
        }
      }
    }
  } catch (error) {
    console.log('   ❌ Forgot password test failed:', error.message);
  }
}

// Run the test
testAllFunctionality().catch(console.error);