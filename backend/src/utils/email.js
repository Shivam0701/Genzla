const nodemailer = require("nodemailer");

// Create transporter with enhanced error handling and debugging
const createTransporter = () => {
  // Validate required environment variables
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("❌ Missing required email environment variables");
    throw new Error("Email configuration incomplete - missing SMTP_USER or SMTP_PASS");
  }

  const config = {
    service: 'gmail', // Use Gmail service directly
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  };

  return nodemailer.createTransport(config);
};

// Verify transporter configuration with detailed logging
const verifyTransporter = async () => {
  try {
    console.log("🔍 Verifying email transporter...");
    const transporter = createTransporter();
    
    await transporter.verify();
    console.log("✅ Email transporter verified successfully");
    return true;
  } catch (error) {
    console.error("❌ Email transporter verification failed:", error.message);
    return false;
  }
};

/**
 * Send OTP email with enhanced error handling
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit OTP
 * @param {string} type - Email type: 'verification' or 'password reset'
 * @returns {Promise} - Email sending promise
 */
const sendOTP = async (email, otp, type = 'verification') => {
  try {
    const transporter = createTransporter();
    
    const isPasswordReset = type === 'password reset';
    const subject = isPasswordReset ? 'GENZLA - Password Reset Code' : 'GENZLA - Your Verification Code';
    const title = isPasswordReset ? 'Password Reset Code' : 'Verification Code';
    const message = isPasswordReset 
      ? 'Use the following code to reset your password:' 
      : 'Use the following code to complete your authentication:';
    
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${subject}</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f5f4f0; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
            
            <div style="background: linear-gradient(135deg, #b89b5e, #d4af37); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 500; letter-spacing: 0.18em;">GENZLA</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">LUXURY CUSTOM CLOTHING</p>
            </div>
            
            <div style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #111111; font-size: 24px;">${title}</h2>
              <p style="margin: 0 0 30px 0; color: #555555; font-size: 16px;">${message}</p>
              
              <div style="background-color: #f5f4f0; border: 2px solid #b89b5e; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                <div style="font-size: 36px; font-weight: 600; color: #b89b5e; letter-spacing: 8px; font-family: monospace;">${otp}</div>
              </div>
              
              <div style="background-color: #fff8f0; border-left: 4px solid #b89b5e; padding: 15px 20px; margin: 30px 0;">
                <p style="margin: 0; color: #8b7355; font-size: 14px;">
                  <strong>⏰ This code expires in 10 minutes</strong><br>
                  If you didn't request this code, please ignore this email.
                </p>
              </div>
            </div>
            
            <div style="background-color: #f8f8f8; padding: 20px 30px; text-align: center;">
              <p style="margin: 0; color: #999999; font-size: 12px;">
                © ${new Date().getFullYear()} GENZLA. All rights reserved.
              </p>
            </div>
            
          </div>
        </body>
        </html>
      `,
      text: `GENZLA - ${title}\n\nYour ${type} code is: ${otp}\n\nThis code expires in 10 minutes.\n\n© ${new Date().getFullYear()} GENZLA.`,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ ${title} email sent successfully to ${email}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send ${type} email to ${email}:`, error.message);
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};

/**
 * Send contact form email to admin
 * @param {string} adminEmail - Admin email address
 * @param {Object} contactData - Contact form data
 * @returns {Promise} - Email sending promise
 */
const sendContactEmail = async (adminEmail, contactData) => {
  try {
    console.log(`📧 Sending contact form email to admin:`, adminEmail);
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: "GENZLA Contact Form",
        address: process.env.SMTP_FROM || process.env.SMTP_USER,
      },
      to: adminEmail,
      replyTo: contactData.email,
      subject: `GENZLA Contact Form - ${contactData.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>GENZLA - New Contact Form Submission</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f5f4f0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #b89b5e, #d4af37); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 500;">New Contact Form Submission</h1>
            </div>
            
            <!-- Content -->
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
        </body>
        </html>
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

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Contact email sent successfully to ${adminEmail}`);
    return result;
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