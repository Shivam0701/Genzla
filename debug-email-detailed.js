const nodemailer = require('nodemailer');
require('dotenv').config({ path: './backend/.env' });

async function debugEmailDetailed() {
  console.log('🔍 Detailed Email Debug...\n');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('SMTP_HOST:', process.env.SMTP_HOST);
  console.log('SMTP_PORT:', process.env.SMTP_PORT);
  console.log('SMTP_USER:', process.env.SMTP_USER);
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? `${process.env.SMTP_PASS.substring(0, 4)}****` : 'Missing');
  console.log('SMTP_FROM:', process.env.SMTP_FROM);
  
  console.log('\n🔧 Creating transporter...');
  
  // Try different configurations
  const configs = [
    {
      name: 'Gmail Service',
      config: {
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        debug: true,
        logger: true
      }
    },
    {
      name: 'Gmail SMTP',
      config: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        debug: true,
        logger: true
      }
    },
    {
      name: 'Gmail SMTP SSL',
      config: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        debug: true,
        logger: true
      }
    }
  ];
  
  for (const { name, config } of configs) {
    console.log(`\n🧪 Testing ${name}...`);
    
    try {
      const transporter = nodemailer.createTransport(config);
      
      console.log('✅ Transporter created');
      
      // Verify connection
      console.log('🔍 Verifying connection...');
      await transporter.verify();
      console.log('✅ Connection verified');
      
      // Try sending test email
      console.log('📧 Sending test email...');
      const result = await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.SMTP_USER, // Send to self for testing
        subject: 'GENZLA Test Email',
        text: 'This is a test email from GENZLA',
        html: '<p>This is a test email from <strong>GENZLA</strong></p>'
      });
      
      console.log('✅ Email sent successfully!');
      console.log('Message ID:', result.messageId);
      console.log('Response:', result.response);
      
      // If we get here, this config works
      console.log(`🎉 ${name} configuration works!`);
      break;
      
    } catch (error) {
      console.error(`❌ ${name} failed:`);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      console.error('Error responseCode:', error.responseCode);
      
      if (error.code === 'EAUTH') {
        console.error('🔐 Authentication failed - check email and app password');
      } else if (error.code === 'ECONNECTION') {
        console.error('🌐 Connection failed - check network/firewall');
      } else if (error.code === 'ETIMEDOUT') {
        console.error('⏰ Connection timed out');
      }
    }
  }
  
  console.log('\n🏁 Email debug completed!');
}

debugEmailDetailed().catch(console.error);