const nodemailer = require("nodemailer");

// Simple email service with fallback
const sendOTP = async (email, otp, type = 'verification') => {
  // For testing emails only, show OTP in response
  const testEmails = [
    'test@example.com',
    'test@genzla.com', 
    'demo@genzla.com',
    'admin@test.com'
  ];
  
  if (testEmails.includes(email.toLowerCase())) {
    console.log(`📧 Test email - OTP for ${email}: ${otp}`);
    return { success: true, testMode: true, otp: otp };
  }

  // For all other emails (including store.genzla@gmail.com), try to send real email
  try {
    console.log(`📧 Attempting to send real email to: ${email}`);
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 5000,    // 5 seconds
      socketTimeout: 10000,     // 10 seconds
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'GENZLA - Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #b89b5e, #d4af37); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">GENZLA</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0;">LUXURY CUSTOM CLOTHING</p>
          </div>
          <div style="padding: 30px; background: white;">
            <h2 style="color: #333; margin: 0 0 20px 0;">Your Verification Code</h2>
            <p style="color: #666; margin: 0 0 30px 0;">Use this code to complete your authentication:</p>
            <div style="background: #f5f4f0; border: 2px solid #b89b5e; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <div style="font-size: 32px; font-weight: bold; color: #b89b5e; letter-spacing: 4px; font-family: monospace;">${otp}</div>
            </div>
            <p style="color: #888; font-size: 14px; margin: 20px 0 0 0;">This code expires in 10 minutes.</p>
          </div>
        </div>
      `,
      text: `GENZLA - Your verification code is: ${otp}\n\nThis code expires in 10 minutes.`
    };

    // Add timeout to email sending
    const emailPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Email sending timeout')), 15000); // 15 second timeout
    });

    const result = await Promise.race([emailPromise, timeoutPromise]);
    
    console.log(`✅ Email sent successfully to ${email}`);
    console.log('Email result:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error(`❌ Email failed for ${email}:`, error.message);
    
    // For admin email, show OTP as fallback
    if (email.toLowerCase() === 'store.genzla@gmail.com') {
      console.log(`📧 Admin email fallback - OTP for ${email}: ${otp}`);
      return { success: true, fallbackMode: true, otp: otp };
    }
    
    throw error;
  }
};

const verifyTransporter = async () => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log("⚠️ Email credentials not configured");
      return false;
    }
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 5000,  // 5 seconds
      greetingTimeout: 3000,    // 3 seconds
      socketTimeout: 5000,      // 5 seconds
    });
    
    // Add timeout to verification
    const verifyPromise = transporter.verify();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Verification timeout')), 10000); // 10 second timeout
    });

    await Promise.race([verifyPromise, timeoutPromise]);
    console.log("✅ Email service verified");
    return true;
  } catch (error) {
    console.log("❌ Email verification failed:", error.message);
    return false;
  }
};

module.exports = {
  sendOTP,
  verifyTransporter,
};