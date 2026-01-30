const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ✅ FIX HERE
app.set("trust proxy", 1);

/* =============================
   BASIC CONFIG
============================= */

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const allowedOrigins = [
  FRONTEND_URL,
  "https://genzla.vercel.app",
  "https://genzla.vercel.app/",
  "http://localhost:3000",
  "http://localhost:3001",
];

/* =============================
   CORS (PRODUCTION SAFE)
============================= */

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (curl, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// IMPORTANT: allow preflight requests
app.options("*", cors());

/* =============================
   BODY PARSERS
============================= */

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* =============================
   REQUEST LOGGER
============================= */

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

/* =============================
   ROUTES
============================= */

app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/customization", require("./routes/customization"));

/* =============================
   HEALTH CHECK
============================= */

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

/* =============================
   TEST ROUTE
============================= */

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "GENZLA API is working",
    timestamp: new Date().toISOString(),
  });
});

/* =============================
   404 HANDLER
============================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

/* =============================
   GLOBAL ERROR HANDLER
============================= */

app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

/* =============================
   START SERVER
============================= */

const startServer = async () => {
  try {
    const requiredEnv = [
      "MONGODB_URI",
      "JWT_SECRET",
      "SMTP_HOST",
      "SMTP_USER",
      "SMTP_PASS",
    ];

    const missing = requiredEnv.filter((key) => !process.env[key]);
    if (missing.length) {
      console.error("❌ Missing env vars:", missing.join(", "));
      process.exit(1);
    }

    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ MongoDB connected");

    console.log("📧 Email service configured (Gmail SMTP)");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Allowed frontend: ${allowedOrigins.join(", ")}`);
    });
  } catch (error) {
    console.error("❌ Startup failed:", error);
    process.exit(1);
  }
};

/* =============================
   PROCESS SAFETY
============================= */

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

/* =============================
   INIT
============================= */

startServer();

module.exports = app;
