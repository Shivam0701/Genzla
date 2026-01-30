require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const User = require('./backend/src/models/User');
const Product = require('./backend/src/models/Product');
const { sendOTP, verifyTransporter } = require('./backend/src/utils/email');

const BACKEND_URL = 'https://genzla.onrender.com';
const FRONTEND_URL = 'https://genzla.vercel.app';

async function deploymentCheck() {
  console.log('🚀 GENZLA Production Deployment Check');
  console.log('=' .repeat(60));
  
  let allChecks = [];
  
  // 1. Environment Variables Check
  console.log('\n📋 1. Environment Variables Check');
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'SMTP_HOST',
    'SMTP_USER',
    'SMTP_PASS',
    'FRONTEND_URL',
    'ADMIN_EMAIL'
  ];
  
  let envCheck = true;
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`   ✅ ${varName}: Set`);
    } else {
      console.log(`   ❌ ${varName}: Missing`);
      envCheck = false;
    }
  });
  allChecks.push({ name: 'Environment Variables', passed: envCheck });
  
  // 2. Database Connection Check
  console.log('\n🗄️  2. Database Connection Check');
  let dbCheck = false;
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('   ✅ MongoDB connection successful');
    dbCheck = true;
  } catch (error) {
    console.log('   ❌ MongoDB connection failed:', error.message);
  }
  allChecks.push({ name: 'Database Connection', passed: dbCheck });
  
  // 3. Email Service Check
  console.log('\n📧 3. Email Service Check');
  let emailCheck = false;
  try {
    const isVerified = await verifyTransporter();
    if (isVerified) {
      console.log('   ✅ Email service verified');
      emailCheck = true;
    } else {
      console.log('   ❌ Email service verification failed');
    }
  } catch (error) {
    console.log('   ❌ Email service error:', error.message);
  }
  allChecks.push({ name: 'Email Service', passed: emailCheck });
  
  // 4. Admin User Check
  console.log('\n👑 4. Admin User Check');
  let adminCheck = false;
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminUser = await User.findOne({ email: adminEmail, role: 'admin' });
    
    if (adminUser) {
      console.log(`   ✅ Admin user exists: ${adminUser.name} (${adminUser.email})`);
      adminCheck = true;
    } else {
      console.log(`   ⚠️  Admin user not found for ${adminEmail}`);
      console.log('   Creating admin user...');
      
      const newAdmin = new User({
        name: 'GENZLA Admin',
        email: adminEmail,
        phone: '+1234567890',
        role: 'admin',
        isVerified: true,
      });
      
      await newAdmin.save();
      console.log('   ✅ Admin user created successfully');
      adminCheck = true;
    }
  } catch (error) {
    console.log('   ❌ Admin user check failed:', error.message);
  }
  allChecks.push({ name: 'Admin User', passed: adminCheck });
  
  // 5. Sample Products Check
  console.log('\n📦 5. Sample Products Check');
  let productsCheck = false;
  try {
    const productCount = await Product.countDocuments();
    
    if (productCount > 0) {
      console.log(`   ✅ Found ${productCount} products in database`);
      productsCheck = true;
    } else {
      console.log('   ⚠️  No products found, adding sample products...');
      
      const sampleProducts = [
        {
          name: 'Classic White T-Shirt',
          category: 'T-shirt',
          description: 'Premium cotton t-shirt perfect for custom designs',
          price: 25.00,
          availableCustomizations: ['Hand Painted', 'DTG', 'Embroidery']
        },
        {
          name: 'Denim Jacket',
          category: 'Jacket',
          description: 'Vintage-style denim jacket ideal for patches and embroidery',
          price: 85.00,
          availableCustomizations: ['Hand Painted', 'Embroidery', 'Patches']
        },
        {
          name: 'Canvas Tote Bag',
          category: 'Bag',
          description: 'Eco-friendly canvas bag for custom prints',
          price: 15.00,
          availableCustomizations: ['Hand Painted', 'DTG', 'Screen Print']
        }
      ];
      
      await Product.insertMany(sampleProducts);
      console.log(`   ✅ Added ${sampleProducts.length} sample products`);
      productsCheck = true;
    }
  } catch (error) {
    console.log('   ❌ Products check failed:', error.message);
  }
  allChecks.push({ name: 'Sample Products', passed: productsCheck });
  
  // 6. API Endpoints Check
  console.log('\n🔌 6. API Endpoints Check');
  let apiCheck = false;
  try {
    const https = require('https');
    
    const testEndpoint = (path) => {
      return new Promise((resolve, reject) => {
        const url = new URL(path, BACKEND_URL);
        const req = https.get(url, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            resolve({ status: res.statusCode, data });
          });
        });
        req.on('error', reject);
        req.setTimeout(10000, () => {
          req.destroy();
          reject(new Error('Request timeout'));
        });
      });
    };
    
    // Test health endpoint
    const healthResult = await testEndpoint('/health');
    if (healthResult.status === 200) {
      console.log('   ✅ Health endpoint working');
    } else {
      console.log(`   ❌ Health endpoint failed: ${healthResult.status}`);
    }
    
    // Test products endpoint
    const productsResult = await testEndpoint('/api/products');
    if (productsResult.status === 200) {
      console.log('   ✅ Products endpoint working');
    } else {
      console.log(`   ❌ Products endpoint failed: ${productsResult.status}`);
    }
    
    // Test auth endpoint
    const authResult = await testEndpoint('/api/auth/health');
    if (authResult.status === 200) {
      console.log('   ✅ Auth endpoint working');
      apiCheck = true;
    } else {
      console.log(`   ❌ Auth endpoint failed: ${authResult.status}`);
    }
    
  } catch (error) {
    console.log('   ❌ API endpoints check failed:', error.message);
  }
  allChecks.push({ name: 'API Endpoints', passed: apiCheck });
  
  // 7. Test Email Sending
  console.log('\n📬 7. Test Email Sending');
  let emailSendCheck = false;
  try {
    const testEmail = process.env.ADMIN_EMAIL;
    await sendOTP(testEmail, '123456', 'verification');
    console.log('   ✅ Test email sent successfully');
    emailSendCheck = true;
  } catch (error) {
    console.log('   ❌ Test email failed:', error.message);
  }
  allChecks.push({ name: 'Email Sending', passed: emailSendCheck });
  
  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 DEPLOYMENT CHECK SUMMARY');
  console.log('=' .repeat(60));
  
  const passedChecks = allChecks.filter(check => check.passed).length;
  const totalChecks = allChecks.length;
  
  allChecks.forEach(check => {
    const status = check.passed ? '✅' : '❌';
    console.log(`${status} ${check.name}`);
  });
  
  console.log('\n' + '-' .repeat(60));
  console.log(`🎯 Overall Status: ${passedChecks}/${totalChecks} checks passed`);
  
  if (passedChecks === totalChecks) {
    console.log('🎉 ALL CHECKS PASSED! Production deployment is ready!');
    console.log('\n🚀 Next Steps:');
    console.log('1. Open test-frontend-flow.html to test the complete user flow');
    console.log('2. Visit https://genzla.vercel.app to test the live frontend');
    console.log('3. Test admin login with:', process.env.ADMIN_EMAIL);
    console.log('4. Monitor logs for any issues');
  } else {
    console.log('⚠️  Some checks failed. Please review and fix the issues above.');
  }
  
  console.log('\n📞 Support Information:');
  console.log(`   Admin Email: ${process.env.ADMIN_EMAIL}`);
  console.log(`   Frontend: ${FRONTEND_URL}`);
  console.log(`   Backend: ${BACKEND_URL}`);
  
  // Close database connection
  await mongoose.connection.close();
  console.log('\n🔌 Database connection closed');
}

// Run deployment check
deploymentCheck().catch(error => {
  console.error('❌ Deployment check failed:', error);
  process.exit(1);
});