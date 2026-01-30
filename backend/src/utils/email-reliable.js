const nodemailer = require("nodemailer");

// Reliable email service with proper error handling and timeouts
const sendOTP = async (email, otp, type = 'verification') => {
  console.log(`📧 Email request for: ${email}`);
  
  // Test emails - return immediately with OTP
  const testEmails = [
    'test@example.com',
    'test@genzla.com', 
    'demo@genzla.com',
    'admin@test.com'
  ];
  
  if (testEmails.includes(email.toLowerCase())) {
    console.log(`📧 Test email mode - OTP: ${otp}`);
    return { 
      success: true, 
      testMode: true, 
      otp: otp,
      message: `Test mode - Your OTP is: ${otp}`
    };
  }

  // For production emails, try to send with timeout
  try {
    console.log(`📧 Sending production email to: ${email}`);
    
    // Create transporter with aggressive timeouts
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 8000,   // 8 seconds
      greetingTimeout: 5000,     // 5 seconds  
      socketTimeout: 8000,       // 8 seconds
      pool: false,               // Don't pool connections
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: `GENZLA - ${type === 'password reset' ? 'Password Reset' : 'Verification'} Code`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white;">
          <div style="background: linear-gradient(135deg, #b89b5e, #d4af37); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: 2px;">GENZLA</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">LUXURY CUSTOM CLOTHING</p>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #333; margin: 0 0 20px 0;">Your ${type === 'password reset' ? 'Password Reset' : 'Verification'} Code</h2>
            <p style="color: #666; margin: 0 0 30px 0;">Use this code to ${type === 'password reset' ? 'reset your password' : 'complete your authentication'}:</p>
            <div style="background: #f5f4f0; border: 2px solid #b89b5e; border-radius: 8px; padding: 25px; text-align: center; margin: 25px 0;">
              <div style="font-size: 36px; font-weight: bold; color: #b89b5e; letter-spacing: 6px; font-family: monospace;">${otp}</div>
            </div>
            <p style="color: #888; font-size: 14px; margin: 25px 0 0 0;">⏰ This code expires in 10 minutes.</p>
            <p style="color: #888; font-size: 12px; margin: 15px 0 0 0;">If you didn't request this code, please ignore this email.</p>
          </div>
          <div style="background: #f8f8f8; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0; color: #999; font-size: 12px;">© 2026 GENZLA. All rights reserved.</p>
          </div>
        </div>
      `,
      text: `GENZLA - Your ${type} code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this code, please ignore this email.\n\n© 2026 GENZLA. All rights reserved.`
    };

    // Send email with timeout
    console.log(`📤 Sending email...`);
    const result = await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email timeout after 12 seconds')), 12000)
      )
    ]);
    
    console.log(`✅ Email sent successfully! Message ID: ${result.messageId}`);
    return { 
      success: true, 
      messageId: result.messageId,
      message: "OTP sent successfully to your email"
    };
    
  } catch (error) {
    console.error(`❌ Email failed for ${email}:`, error.message);
    
    // Special handling for admin email - show OTP as fallback
    if (email.toLowerCase() === 'store.genzla@gmail.com') {
      console.log(`📧 Admin fallback mode - OTP: ${otp}`);
      return { 
        success: true, 
        fallbackMode: true, 
        otp: otp,
        message: `Admin fallback - Your OTP is: ${otp}`
      };
    }
    
    // For other emails, throw error
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};

// Simple transporter verification with timeout
const verifyTransporter = async () => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log("⚠️ Email credentials not configured");
      return false;
    }
    
    console.log("🔍 Verifying email transporter...");
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 5000,
      greetingTimeout: 3000,
      socketTimeout: 5000,
    });
    
    // Verify with timeout
    await Promise.race([
      transporter.verify(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Verification timeout')), 8000)
      )
    ]);
    
    console.log("✅ Email transporter verified");
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