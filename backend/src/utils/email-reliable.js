const nodemailer = require("nodemailer");

// ==============================
// SEND OTP EMAIL (UNCHANGED LOGIC)
// ==============================
const sendOTP = async (email, otp, type = "verification") => {
  console.log(`📧 Email request for: ${email}`);

  // Test emails ONLY
  const testEmails = [
    "test@example.com",
    "test@genzla.com",
    "demo@genzla.com",
    "admin@test.com",
  ];

  if (testEmails.includes(email.toLowerCase())) {
    console.log(`📧 Test email mode - OTP: ${otp}`);
    return {
      success: true,
      testMode: true,
      otp,
      message: `Test mode - Your OTP is: ${otp}`,
    };
  }

  try {
    console.log(`📧 Sending production email to: ${email}`);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 10000,
      pool: false,
      tls: {
        rejectUnauthorized: false, // Render compatibility
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: `GENZLA - ${
        type === "password reset" ? "Password Reset" : "Verification"
      } Code`,
      html: `
        <h2>Your ${
          type === "password reset" ? "Password Reset" : "Verification"
        } Code</h2>
        <h1 style="letter-spacing:6px">${otp}</h1>
        <p>This code expires in 10 minutes.</p>
      `,
      text: `Your ${type} code is: ${otp}`,
    };

    console.log("📤 Sending email...");
    const result = await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email timeout after 15 seconds")), 15000)
      ),
    ]);

    console.log("✅ Email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error(`❌ Email failed for ${email}:`, error.message);
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};

// =====================================================
// SAFE VERIFY FUNCTION (NO SMTP CALL — VERY IMPORTANT)
// =====================================================
const verifyTransporter = async () => {
  // ❌ DO NOT VERIFY SMTP ON RENDER
  // ✅ Just check env presence to keep app stable

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("⚠️ Email credentials not configured");
    return false;
  }

  console.log("ℹ️ Email transporter check skipped (Render-safe mode)");
  return true;
};

// ==============================
// CONTACT FORM EMAIL (UNCHANGED)
// ==============================
const sendContactEmail = async (adminEmail, contactData) => {
  try {
    console.log(`📧 Sending contact form email to admin: ${adminEmail}`);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 10000,
      pool: false,
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: {
        name: "GENZLA Contact Form",
        address: process.env.SMTP_USER,
      },
      to: adminEmail,
      replyTo: contactData.email,
      subject: `GENZLA Contact Form - ${contactData.name}`,
      html: `<p>${contactData.message}</p>`,
      text: contactData.message,
    };

    const result = await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Contact email timeout after 15 seconds")),
          15000
        )
      ),
    ]);

    console.log("✅ Contact email sent");
    return result;
  } catch (error) {
    console.error("❌ Contact email failed:", error.message);
    throw error;
  }
};

module.exports = {
  sendOTP,
  sendContactEmail,
  verifyTransporter,
};
