const express = require("express");
const Order = require("../models/Order");
const { auth, adminAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/customization", auth, async (req, res) => {
  try {
    const { productCategory, customizationType, description } = req.body;

    if (!productCategory || !customizationType || !description) {
      return res
        .status(400)
        .json({ 
          success: false,
          message: "All required fields must be provided" 
        });
    }

    const order = new Order({
      user: req.user._id,
      productCategory,
      customizationType,
      description,
      designImage: undefined, // Will be added when file upload is implemented
    });

    await order.save();
    await order.populate("user", "name email");

    res.status(201).json({
      success: true,
      order,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to create order" 
    });
  }
});

router.get("/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("user", "name email");
      
    res.json({
      success: true,
      orders,
      count: orders.length,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch orders" 
    });
  }
});

router.get("/", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email");
      
    res.json({
      success: true,
      orders,
      count: orders.length,
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch orders" 
    });
  }
});

router.patch("/:id/status", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "in-progress", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid status" 
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: "Order not found" 
      });
    }

    res.json({
      success: true,
      order,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to update order status" 
    });
  }
});

module.exports = router;
