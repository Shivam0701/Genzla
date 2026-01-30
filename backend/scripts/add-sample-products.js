const mongoose = require("mongoose");
const Product = require("../src/models/Product");
require("dotenv").config();

const sampleProducts = [
  {
    name: "Classic Denim Jacket",
    category: "Jacket",
    price: 89.99,
    description: "A timeless denim jacket perfect for customization. Made from high-quality cotton denim with a comfortable fit. Ideal for hand painting, embroidery, or DTF prints.",
    images: ["/images/hero-jacket-placeholder.jpeg"],
    availableCustomizations: ["Hand Painted", "DTF", "Embroidery", "Puff Print"]
  },
  {
    name: "Premium Cotton T-Shirt",
    category: "T-shirt",
    price: 24.99,
    description: "Soft, breathable premium cotton t-shirt. Perfect canvas for all types of customization. Available in multiple sizes with a comfortable regular fit.",
    images: ["/images/hero-shirt-placeholder.jpeg"],
    availableCustomizations: ["Hand Painted", "DTF", "DTG", "Puff Print"]
  },
  {
    name: "Relaxed Fit Baggy Pants",
    category: "Baggy Pants",
    price: 69.99,
    description: "Comfortable baggy pants with a relaxed fit. Made from durable cotton blend fabric. Great for unique customization projects and street style looks.",
    images: ["/images/hero-baggy-placeholder.jpeg"],
    availableCustomizations: ["Hand Painted", "DTF", "Embroidery"]
  },
  {
    name: "Designer Canvas Bag",
    category: "Bags",
    price: 39.99,
    description: "Sturdy canvas tote bag perfect for custom designs. Spacious interior with reinforced handles. Ideal for hand painting and embroidery work.",
    images: ["/images/product-placeholder.svg"],
    availableCustomizations: ["Hand Painted", "Embroidery", "DTF"]
  },
  {
    name: "Vintage Style Shirt",
    category: "Shirt",
    price: 34.99,
    description: "Classic button-up shirt with vintage styling. Made from comfortable cotton fabric. Perfect for subtle customizations and professional looks.",
    images: ["/images/product-placeholder.svg"],
    availableCustomizations: ["Embroidery", "DTF"]
  },
  {
    name: "Slim Fit Jeans",
    category: "Jeans",
    price: 79.99,
    description: "Modern slim fit jeans crafted from premium denim. Comfortable stretch fabric with classic styling. Great for embroidery and small custom details.",
    images: ["/images/product-placeholder.svg"],
    availableCustomizations: ["Embroidery", "Hand Painted"]
  }
];

async function addSampleProducts() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing products
    console.log("🔄 Clearing existing products...");
    await Product.deleteMany({});
    console.log("✅ Cleared existing products");

    // Add sample products
    console.log("🔄 Adding sample products...");
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Added ${createdProducts.length} sample products`);

    console.log("\n📦 Sample Products Added:");
    createdProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.category}) - $${product.price}`);
    });

    console.log("\n🎉 Sample products added successfully!");
  } catch (error) {
    console.error("❌ Error adding sample products:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
}

addSampleProducts();