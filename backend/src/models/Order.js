const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productCategory: {
      type: String,
      required: true,
    },
    customizationType: {
      type: String,
      enum: ["Hand Painted", "DTF", "DTG", "Puff Print", "Embroidery"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    designImage: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
