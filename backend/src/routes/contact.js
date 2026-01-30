const express = require("express");
const { sendContactEmail } = require("../utils/email");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

    await sendContactEmail(adminEmail, { name, email, message });

    res.json({ message: "Contact form submitted successfully" });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ message: "Failed to submit contact form" });
  }
});

module.exports = router;
