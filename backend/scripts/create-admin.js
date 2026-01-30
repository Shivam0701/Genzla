const mongoose = require("mongoose");
const User = require("../src/models/User");
require("dotenv").config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const adminEmail = process.argv[2] || "store.genzla@gmail.com";
    const adminName = process.argv[3] || "Admin User";
    const adminPhone = process.argv[4] || "+1234567890";

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin user already exists!");
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`👤 Name: ${existingAdmin.name}`);
      console.log(`📱 Phone: ${existingAdmin.phone}`);
      console.log(`🔑 Role: ${existingAdmin.role}`);
      process.exit(0);
    }

    const admin = new User({
      name: adminName,
      email: adminEmail,
      phone: adminPhone,
      role: "admin",
      isVerified: true, // Admin is pre-verified
    });

    await admin.save();
    console.log(`✅ Admin user created successfully!`);
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`👤 Name: ${adminName}`);
    console.log(`📱 Phone: ${adminPhone}`);
    console.log(`🔑 Role: admin`);
    console.log(`\n📝 The admin can now login using OTP authentication at: ${adminEmail}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
