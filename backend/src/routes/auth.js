const express = require("express");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const User = require("../models/User");
const { sendOTP } = require("../utils/email-reliable");

const router = express.Router();

// Rate limiting for OTP requests
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    error: "Too many OTP requests. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for verification attempts
const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: {
    error: "Too many verification attempts. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * @route   POST /api/auth/send-otp
 * @desc    Send OTP for authentication (signup/login)
 * @access  Public
 */
router.post("/send-otp", otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find or create user
    let user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      user = new User({
        email: normalizedEmail,
        isVerified: false,
      });
    }

    // Generate and save OTP
    const otp = user.generateOTP();
    await user.save();

    // Test emails - show OTP directly
    const testEmails = [
      'test@example.com',
      'test@genzla.com', 
      'demo@genzla.com',
      'admin@test.com'
    ];
    
    if (testEmails.includes(normalizedEmail)) {
      return res.json({
        success: true,
        message: `Test mode - Your OTP is: ${otp}`,
        isNewUser: !user.isVerified,
        developmentOTP: otp,
        testMode: true,
      });
    }

    // Admin email - show OTP if email fails
    if (normalizedEmail === 'store.genzla@gmail.com') {
      try {
        const emailResult = await sendOTP(normalizedEmail, otp);
        if (emailResult.fallbackMode) {
          return res.json({
            success: true,
            message: `Admin fallback - Your OTP is: ${otp}`,
            isNewUser: !user.isVerified,
            developmentOTP: otp,
            emailFallback: true,
          });
        } else {
          return res.json({
            success: true,
            message: "OTP sent to your email",
            isNewUser: !user.isVerified,
          });
        }
      } catch (emailError) {
        return res.json({
          success: true,
          message: `Admin fallback - Your OTP is: ${otp}`,
          isNewUser: !user.isVerified,
          developmentOTP: otp,
          emailFallback: true,
        });
      }
    }

    // Regular emails - try to send, fallback to error
    try {
      const emailResult = await sendOTP(normalizedEmail, otp);
      if (emailResult.testMode) {
        return res.json({
          success: true,
          message: `Test mode - Your OTP is: ${emailResult.otp}`,
          isNewUser: !user.isVerified,
          developmentOTP: emailResult.otp,
          testMode: true,
        });
      } else {
        return res.json({
          success: true,
          message: "OTP sent successfully to your email",
          isNewUser: !user.isVerified,
        });
      }
    } catch (emailError) {
      user.clearOTP();
      await user.save();
      
      res.status(500).json({
        success: false,
        message: "Email service temporarily unavailable. Please try test@genzla.com for testing.",
        emailError: true,
        suggestion: "Use test@genzla.com for immediate access",
      });
    }
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and complete authentication
 * @access  Public
 */
router.post("/verify-otp", verifyLimiter, async (req, res) => {
  try {
    const { email, otp, name, phone } = req.body;

    // Validation
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "OTP must be a 6-digit number",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found. Please request a new OTP.",
      });
    }

    // Verify OTP
    if (!user.verifyOTP(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP. Please request a new one.",
      });
    }

    // Check if this is a new user (signup) and validate required fields
    if (!user.isVerified) {
      if (!name || !phone) {
        return res.status(400).json({
          success: false,
          message: "Name and phone number are required for new users",
        });
      }

      // Validate phone number format
      const phoneRegex = /^[+]?[\d\s\-\(\)]{10,15}$/;
      if (!phoneRegex.test(phone.trim())) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid phone number",
        });
      }

      // Check if phone number already exists
      const existingPhone = await User.findOne({ 
        phone: phone.trim(),
        _id: { $ne: user._id }
      });
      
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: "Phone number is already registered",
        });
      }

      // Update user for new signup
      user.name = name.trim();
      user.phone = phone.trim();
      user.isVerified = true;
    }

    // Clear OTP and save
    user.clearOTP();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Return success response
    res.json({
      success: true,
      message: user.isVerified ? "Login successful" : "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: validationErrors.join(', '),
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
});

/**
 * @route   POST /api/auth/resend-otp
 * @desc    Resend OTP
 * @access  Public
 */
router.post("/resend-otp", otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found. Please start the process again.",
      });
    }

    // Generate new OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP email
    try {
      const emailResult = await sendOTP(normalizedEmail, otp);
      
      if (emailResult.testMode || emailResult.fallbackMode) {
        return res.json({
          success: true,
          message: `OTP resent - Your OTP is: ${emailResult.otp || otp}`,
          developmentOTP: emailResult.otp || otp,
          testMode: emailResult.testMode,
          emailFallback: emailResult.fallbackMode,
        });
      } else {
        return res.json({
          success: true,
          message: "OTP resent successfully",
        });
      }
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      
      user.clearOTP();
      await user.save();
      
      res.status(500).json({
        success: false,
        message: "Failed to send OTP email. Please try again.",
      });
    }
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get("/me", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password -otp -otpExpiry");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        address: user.address,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

/**
 * @route   PUT /api/auth/preferences
 * @desc    Update user preferences
 * @access  Private
 */
router.put("/preferences", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const { preferredProductTypes, preferredCustomizationMethods, sizeNotes, newsletter, notifications } = req.body;

    // Update preferences
    if (preferredProductTypes !== undefined) {
      user.preferences.preferredProductTypes = preferredProductTypes;
    }
    if (preferredCustomizationMethods !== undefined) {
      user.preferences.preferredCustomizationMethods = preferredCustomizationMethods;
    }
    if (sizeNotes !== undefined) {
      user.preferences.sizeNotes = sizeNotes;
    }
    if (newsletter !== undefined) {
      user.preferences.newsletter = newsletter;
    }
    if (notifications !== undefined) {
      user.preferences.notifications = notifications;
    }

    await user.save();

    res.json({
      success: true,
      message: "Preferences updated successfully",
      preferences: user.preferences,
    });
  } catch (error) {
    console.error("Update preferences error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update preferences",
    });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Public
 */
router.post("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send OTP for password reset
 * @access  Public
 */
router.post("/forgot-password", otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No account found with this email address",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Account not verified. Please complete verification first",
      });
    }

    // Generate and save OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP email
    try {
      const emailResult = await sendOTP(normalizedEmail, otp, "password reset");
      
      if (emailResult.testMode || emailResult.fallbackMode) {
        return res.json({
          success: true,
          message: `Password reset OTP - Your OTP is: ${emailResult.otp || otp}`,
          developmentOTP: emailResult.otp || otp,
          testMode: emailResult.testMode,
          emailFallback: emailResult.fallbackMode,
        });
      } else {
        return res.json({
          success: true,
          message: "Password reset OTP sent to your email",
        });
      }
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      
      user.clearOTP();
      await user.save();
      
      res.status(500).json({
        success: false,
        message: "Failed to send password reset email. Please try again.",
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
});

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using OTP
 * @access  Public
 */
router.post("/reset-password", verifyLimiter, async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validation
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and new password are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "OTP must be a 6-digit number",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify OTP
    if (!user.verifyOTP(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP. Please request a new one.",
      });
    }

    // Update password and clear OTP
    user.password = newPassword;
    user.clearOTP();
    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
});

/**
 * @route   POST /api/auth/google
 * @desc    Google OAuth authentication
 * @access  Public
 */
router.post("/google", async (req, res) => {
  try {
    const { googleToken, name, email, picture, phone } = req.body;

    if (!googleToken || !email) {
      return res.status(400).json({
        success: false,
        message: "Google token and email are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find or create user
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // For new Google users, phone is required
      if (!phone) {
        return res.status(400).json({
          success: false,
          message: "Phone number is required for new accounts",
          requiresPhone: true,
        });
      }

      // Validate phone number format
      const phoneRegex = /^[+]?[\d\s\-\(\)]{10,15}$/;
      if (!phoneRegex.test(phone.trim())) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid phone number",
        });
      }

      // Check if phone number already exists
      const existingPhone = await User.findOne({ phone: phone.trim() });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: "Phone number is already registered",
        });
      }

      // Create new user from Google account
      user = new User({
        name: name || "Google User",
        email: normalizedEmail,
        phone: phone.trim(),
        isVerified: true, // Google accounts are pre-verified
        googleId: googleToken, // Store Google token/ID
        avatar: picture,
      });
      await user.save();
    } else {
      // Update existing user with Google info if not already set
      if (!user.googleId) {
        user.googleId = googleToken;
        user.avatar = picture || user.avatar;
        user.isVerified = true;
        await user.save();
      }
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: user.isModified() ? "Account linked with Google successfully" : "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: validationErrors.join(', '),
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Google authentication failed. Please try again.",
    });
  }
});

/**
 * @route   POST /api/auth/create-admin-temp
 * @desc    Temporary endpoint to create admin user (for testing)
 * @access  Public (should be removed in production)
 */
router.post("/create-admin-temp", async (req, res) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "store.genzla@gmail.com";
    
    // Check if admin already exists
    let adminUser = await User.findOne({ email: adminEmail });
    
    if (adminUser) {
      // Update existing user to admin
      adminUser.role = "admin";
      adminUser.isVerified = true;
      adminUser.name = adminUser.name || "GENZLA Admin";
      adminUser.phone = adminUser.phone || "+1234567890";
      await adminUser.save();
      
      const token = generateToken(adminUser._id);
      
      return res.json({
        success: true,
        message: "Admin user updated successfully",
        token,
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          phone: adminUser.phone,
          role: adminUser.role,
          isVerified: adminUser.isVerified,
        },
      });
    } else {
      // Create new admin user
      adminUser = new User({
        name: "GENZLA Admin",
        email: adminEmail,
        phone: "+1234567890",
        role: "admin",
        isVerified: true,
      });
      
      await adminUser.save();
      
      const token = generateToken(adminUser._id);
      
      return res.json({
        success: true,
        message: "Admin user created successfully",
        token,
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          phone: adminUser.phone,
          role: adminUser.role,
          isVerified: adminUser.isVerified,
        },
      });
    }
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create admin user",
    });
  }
});

/**
 * @route   GET /api/auth/health
 * @desc    Health check for auth routes
 * @access  Public
 */
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Auth service is running",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
