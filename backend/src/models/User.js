const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: function() {
        return this.isVerified;
      }
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      required: function() {
        return this.isVerified;
      },
      validate: {
        validator: function(v) {
          // Only validate if phone is provided
          if (!v) return !this.isVerified; // Required only if verified
          return /^[+]?[\d\s\-\(\)]{10,15}$/.test(v);
        },
        message: 'Please enter a valid phone number'
      }
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // OTP fields for direct storage in user model
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    // Profile fields
    avatar: {
      type: String, // URL to profile picture
    },
    googleId: {
      type: String, // Google OAuth ID
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    // Preferences
    preferences: {
      newsletter: {
        type: Boolean,
        default: true,
      },
      notifications: {
        type: Boolean,
        default: true,
      },
      preferredProductTypes: [{
        type: String,
        enum: ["Jacket", "T-shirt", "Hoodie", "Jeans", "Bag", "Shoes", "Accessories", "Other"]
      }],
      preferredCustomizationMethods: [{
        type: String,
        enum: ["Hand Painted", "DTF (Direct to Film)", "DTG (Direct to Garment)", "Puff Print", "Embroidery", "Screen Print", "Heat Transfer", "Other"]
      }],
      sizeNotes: {
        type: String,
        maxlength: 500,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving (only if password is provided)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate OTP method
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = otp;
  this.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return otp;
};

// Verify OTP method
userSchema.methods.verifyOTP = function (candidateOTP) {
  if (!this.otp || !this.otpExpiry) return false;
  if (new Date() > this.otpExpiry) return false;
  return this.otp === candidateOTP;
};

// Clear OTP method
userSchema.methods.clearOTP = function () {
  this.otp = undefined;
  this.otpExpiry = undefined;
};

// Create indexes - email index is created by unique: true
// Remove the TTL index as it's not needed for OTP expiry

module.exports = mongoose.model("User", userSchema);
