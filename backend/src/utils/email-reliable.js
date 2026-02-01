const { Resend } = require('resend');

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Secure email service using Resend API
const sendOTP = async (email, otp, type = 'verification') => {
  console.log(`📧 Email request for: ${email}`);
  
  // Test emails ONLY - return immediately with OTP (for development/testing only)
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

  // For ALL production emails, must send via Resend - NO fallbacks for security
  try {
    console.log(`📧 Sending production email to: ${email}`);
    
    const emailData = {
      from: process.env.RESEND_FROM_EMAIL || 'GENZLA <noreply@genzla.com>',
      to: [email],
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

    // Send email with Resend API
    console.log(`📤 Sending email via Resend...`);
    const result = await resend.emails.send(emailData);
    
    if (result.error) {
      throw new Error(`Resend API error: ${result.error.message}`);
    }
    
    console.log(`✅ Email sent successfully! Message ID: ${result.data.id}`);
    return { 
      success: true, 
      messageId: result.data.id,
      message: "OTP sent successfully to your email"
    };
    
  } catch (error) {
    console.error(`❌ Email failed for ${email}:`, error.message);
    
    // SECURITY: Never show OTP for production emails - throw error instead
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};

// Resend service verification
const verifyTransporter = async () => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log("⚠️ Resend API key not configured");
      return false;
    }
    
    console.log("🔍 Verifying Resend service...");
    
    // Simple API key validation - Resend doesn't have a verify endpoint
    // We'll just check if the API key is present and properly formatted
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey.startsWith('re_')) {
      throw new Error('Invalid Resend API key format');
    }
    
    console.log("✅ Resend service configured");
    return true;
  } catch (error) {
    console.log("❌ Resend verification failed:", error.message);
    return false;
  }
};

/**
 * Send contact form email to admin using Resend
 * @param {string} adminEmail - Admin email address
 * @param {Object} contactData - Contact form data
 * @returns {Promise} - Email sending promise
 */
const sendContactEmail = async (adminEmail, contactData) => {
  try {
    console.log(`📧 Sending contact form email to admin: ${adminEmail}`);
    
    const emailData = {
      from: process.env.RESEND_FROM_EMAIL || 'GENZLA Contact <noreply@genzla.com>',
      to: [adminEmail],
      reply_to: contactData.email,
      subject: `GENZLA Contact Form - ${contactData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white;">
          <div style="background: linear-gradient(135deg, #b89b5e, #d4af37); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
          </div>
          <div style="padding: 30px;">
            <div style="margin-bottom: 20px;">
              <strong style="color: #111111;">Name:</strong>
              <p style="margin: 5px 0 0 0; color: #555555;">${contactData.name}</p>
            </div>
            <div style="margin-bottom: 20px;">
              <strong style="color: #111111;">Email:</strong>
              <p style="margin: 5px 0 0 0; color: #555555;">
                <a href="mailto:${contactData.email}" style="color: #b89b5e; text-decoration: none;">${contactData.email}</a>
              </p>
            </div>
            <div style="margin-bottom: 20px;">
              <strong style="color: #111111;">Message:</strong>
              <div style="background-color: #f5f4f0; padding: 20px; border-radius: 8px; margin-top: 10px; border-left: 4px solid #b89b5e;">
                <p style="margin: 0; color: #333333; white-space: pre-wrap; line-height: 1.6;">${contactData.message}</p>
              </div>
            </div>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee;">
              <p style="margin: 0; color: #888888; font-size: 14px;">
                Submitted on: ${new Date().toLocaleString()}<br>
                Reply directly to this email to respond to the customer.
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
GENZLA - New Contact Form Submission

Name: ${contactData.name}
Email: ${contactData.email}

Message:
${contactData.message}

Submitted on: ${new Date().toLocaleString()}
Reply directly to this email to respond to the customer.
      `.trim(),
    };

    const result = await resend.emails.send(emailData);
    
    if (result.error) {
      throw new Error(`Resend API error: ${result.error.message}`);
    }
    
    console.log(`✅ Contact email sent successfully to ${adminEmail}, ID: ${result.data.id}`);
    return { id: result.data.id, success: true };
  } catch (error) {
    console.error(`❌ Failed to send contact email to ${adminEmail}:`, error.message);
    throw new Error(`Contact email delivery failed: ${error.message}`);
  }
};

module.exports = {
  sendOTP,
  sendContactEmail,
  verifyTransporter,
};