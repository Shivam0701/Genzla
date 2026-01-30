const express = require("express");
const Product = require("../models/Product");
const { auth, adminAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      products,
      count: products.length,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch products" 
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }
    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch product" 
    });
  }
});

router.post("/", adminAuth, async (req, res) => {
  try {
    const { name, category, price, description, availableCustomizations } = req.body;

    const product = new Product({
      name,
      category,
      price: price ? parseFloat(price) : undefined,
      description,
      images: [],
      availableCustomizations: availableCustomizations || [],
    });

    await product.save();
    res.status(201).json({
      success: true,
      product,
      message: "Product created successfully",
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to create product" 
    });
  }
});

router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { name, category, price, description, availableCustomizations } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }

    if (name) product.name = name;
    if (category) product.category = category;
    if (description) product.description = description;
    if (price !== undefined) product.price = parseFloat(price);
    if (availableCustomizations) product.availableCustomizations = availableCustomizations;

    await product.save();
    res.json({
      success: true,
      product,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to update product" 
    });
  }
});

router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }
    res.json({ 
      success: true,
      message: "Product deleted successfully" 
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to delete product" 
    });
  }
});

module.exports = router;
