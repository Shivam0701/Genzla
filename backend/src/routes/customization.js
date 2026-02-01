const express = require("express");
const CustomizationRequest = require("../models/CustomizationRequest");
const { auth } = require("../middleware/auth");
const { customizationUpload } = require("../utils/cloudinary");

const router = express.Router();

/**
 * @route   POST /api/customization/request
 * @desc    Submit a new customization request
 * @access  Private
 */
router.post("/request", auth, customizationUpload.single("referenceImage"), async (req, res) => {
  try {
    const { productType, customizationMethod, notes } = req.body;

    // Validation with detailed error messages
    const errors = [];
    
    if (!productType || productType.trim() === "") {
      errors.push("Product type is required");
    }
    
    if (!customizationMethod || customizationMethod.trim() === "") {
      errors.push("Customization method is required");
    }
    
    if (!notes || notes.trim() === "") {
      errors.push("Design description is required");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.join(", "),
        errors: errors
      });
    }

    const customizationRequest = new CustomizationRequest({
      user: req.user._id,
      productType: productType.trim(),
      customizationMethod: customizationMethod.trim(),
      notes: notes.trim(),
      referenceImage: req.file ? req.file.path : null, // Optional - can be null
    });

    await customizationRequest.save();
    await customizationRequest.populate("user", "name email");

    res.status(201).json({
      success: true,
      message: "Customization request submitted successfully",
      request: customizationRequest,
    });
  } catch (error) {
    console.error("Create customization request error:", error);
    
    // Handle multer errors (file upload errors)
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum size is 10MB.",
      });
    }
    
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: "Invalid file upload. Please upload only image files.",
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Failed to submit customization request. Please try again.",
    });
  }
});

/**
 * @route   GET /api/customization/my-requests
 * @desc    Get user's customization requests
 * @access  Private
 */
router.get("/my-requests", auth, async (req, res) => {
  try {
    const requests = await CustomizationRequest.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    res.json({
      success: true,
      requests,
      count: requests.length,
    });
  } catch (error) {
    console.error("Get user requests error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customization requests",
    });
  }
});

/**
 * @route   GET /api/customization/request/:id
 * @desc    Get specific customization request
 * @access  Private
 */
router.get("/request/:id", auth, async (req, res) => {
  try {
    const request = await CustomizationRequest.findOne({
      _id: req.params.id,
      user: req.user._id, // Ensure user can only access their own requests
    }).populate("user", "name email");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Customization request not found",
      });
    }

    res.json({
      success: true,
      request,
    });
  } catch (error) {
    console.error("Get request error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customization request",
    });
  }
});

/**
 * @route   GET /api/customization/dashboard-stats
 * @desc    Get dashboard statistics for user
 * @access  Private
 */
router.get("/dashboard-stats", auth, async (req, res) => {
  try {
    const totalRequests = await CustomizationRequest.countDocuments({ user: req.user._id });
    const inProgress = await CustomizationRequest.countDocuments({ 
      user: req.user._id, 
      status: { $in: ["In Review", "In Production"] }
    });
    const completed = await CustomizationRequest.countDocuments({ 
      user: req.user._id, 
      status: "Completed" 
    });

    const recentRequests = await CustomizationRequest.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("productType customizationMethod status createdAt");

    res.json({
      success: true,
      stats: {
        totalRequests,
        inProgress,
        completed,
        recentRequests,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
});

module.exports = router;