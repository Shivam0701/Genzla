const express = require("express");
const User = require("../models/User");
const CustomizationRequest = require("../models/CustomizationRequest");
const { adminAuth } = require("../middleware/auth");
const { upload } = require("../utils/cloudinary");

const router = express.Router();

// All admin routes require admin authentication
router.use(adminAuth);

// Image upload endpoint
router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    res.json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: req.file.path,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload image",
    });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -otp -otpExpiry")
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      users,
      count: users.length,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch users" 
    });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -otp -otpExpiry");
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }
    
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch user" 
    });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const adminUsers = await User.countDocuments({ role: "admin" });
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        verifiedUsers,
        adminUsers,
        customerUsers: totalUsers - adminUsers,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch stats" 
    });
  }
});

// Get all customization requests
router.get("/customization-requests", async (req, res) => {
  try {
    const requests = await CustomizationRequest.find()
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      requests,
      count: requests.length,
    });
  } catch (error) {
    console.error("Get customization requests error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch customization requests" 
    });
  }
});

// Update customization request status
router.patch("/customization-requests/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const validStatuses = ["Received", "In Review", "In Production", "Completed", "On Hold"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const request = await CustomizationRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("user", "name email phone");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Customization request not found",
      });
    }

    res.json({
      success: true,
      message: "Status updated successfully",
      request,
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to update status" 
    });
  }
});

// Delete customization request
router.delete("/customization-requests/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const request = await CustomizationRequest.findByIdAndDelete(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Customization request not found",
      });
    }

    res.json({
      success: true,
      message: "Customization request deleted successfully",
    });
  } catch (error) {
    console.error("Delete customization request error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to delete customization request" 
    });
  }
});

// Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Don't allow deleting admin users
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot delete admin users",
      });
    }

    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to delete user" 
    });
  }
});

// Create new user
router.post("/users", async (req, res) => {
  try {
    const { name, email, phone, role = "customer" } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const user = new User({
      name,
      email,
      phone,
      role,
      isVerified: true, // Admin-created users are pre-verified
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to create user" 
    });
  }
});

module.exports = router;
