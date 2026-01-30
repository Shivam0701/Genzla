const mongoose = require("mongoose");

const customizationRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productType: {
      type: String,
      required: true,
      enum: [
        "Jacket",
        "T-shirt", 
        "Hoodie",
        "Jeans",
        "Bag",
        "Shoes",
        "Accessories",
        "Other"
      ],
    },
    customizationMethod: {
      type: String,
      required: true,
      enum: [
        "Hand Painted",
        "DTF (Direct to Film)",
        "DTG (Direct to Garment)",
        "Puff Print",
        "Embroidery",
        "Screen Print",
        "Heat Transfer",
        "Other"
      ],
    },
    referenceImage: {
      type: String, // Cloudinary URL
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ["Received", "In Review", "In Production", "Completed", "On Hold"],
      default: "Received",
    },
    priority: {
      type: String,
      enum: ["Standard", "Priority", "Rush"],
      default: "Standard",
    },
    estimatedCompletion: {
      type: Date,
    },
    adminNotes: {
      type: String, // Internal notes for admin
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
customizationRequestSchema.index({ user: 1, createdAt: -1 });
customizationRequestSchema.index({ status: 1 });

module.exports = mongoose.model("CustomizationRequest", customizationRequestSchema);