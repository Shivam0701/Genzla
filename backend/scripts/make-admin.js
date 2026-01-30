const mongoose = require("mongoose");
const User = require("../src/models/User");
require("dotenv").config();

async function makeAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const adminEmail = process.argv[2] || "store.genzla@gmail.com";

    const user = await User.findOne({ email: adminEmail });

    if (!user) {
      console.log(`❌ User with email ${adminEmail} not found!`);
      process.exit(1);
    }

    // Update user to admin
    user.role = "admin";
    user.isVerified = true; // Ensure admin is verified
    
    // Set required fields if missing
    if (!user.name) user.name = "GENZLA Admin";
    if (!user.phone) user.phone = "+1234567890";
    
    await user.save();

    console.log(`✅ User updated to admin successfully!`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Name: ${user.name}`);
    console.log(`📱 Phone: ${user.phone}`);
    console.log(`🔑 Role: ${user.role}`);
    console.log(`✅ Verified: ${user.isVerified}`);
    console.log(`\n📝 The admin can now access admin dashboard at: /admin/dashboard`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating user to admin:", error);
    process.exit(1);
  }
}

makeAdmin();