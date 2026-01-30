const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Jacket",
        "T-shirt",
        "Shirt",
        "Jeans",
        "Baggy Pants",
        "Bags",
        "Hoodie",
        "Shoe",
      ],
      required: true,
    },
    price: {
      type: String, // Changed to String to allow text like "Contact for Price"
      required: false, // Made optional
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    availableCustomizations: [
      {
        type: String,
        enum: ["Hand Painted", "DTF", "DTG", "Puff Print", "Embroidery"],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
