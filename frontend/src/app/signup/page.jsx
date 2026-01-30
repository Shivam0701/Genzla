"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@components/Header";
import { Footer } from "@components/Footer";
import { GoogleAuth } from "@components/GoogleAuth";
import styles from "./signup.module.scss";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    name: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStep(2);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Validate required fields for signup
    if (!formData.name.trim()) {
      setError("Name is required");
      setIsSubmitting(false);
      return;
    }

    if (!formData.phone.trim()) {
      setError("Phone number is required");
      setIsSubmitting(false);
      return;
    }

    // Validate phone number format
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,15}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      setError("Please enter a valid phone number");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email: formData.email, 
            otp: formData.otp,
            name: formData.name.trim(),
            phone: formData.phone.trim()
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("genzla-token", data.token);
        localStorage.setItem("genzla-user", JSON.stringify(data.user));
        router.push("/dashboard");
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Header />
      <main className={styles.main}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.container}
        >
          <h1 className={styles.title}>Sign Up</h1>

          {step === 1 && (
            <form onSubmit={handleSendOTP} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>
              {error && <div className={styles.error}>{error}</div>}
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? "Sending..." : "Send OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className={styles.form}>
              <p className={styles.info}>
                OTP sent to {formData.email}. Please check your inbox.
              </p>
              
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="Enter your full name"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="otp">OTP</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                  maxLength={6}
                  className={styles.input}
                  placeholder="Enter 6-digit OTP"
                />
              </div>
              
              {error && <div className={styles.error}>{error}</div>}
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? "Creating account..." : "Create Account"}
              </button>
            </form>
          )}

          <GoogleAuth mode="signup" />

          <p className={styles.loginLink}>
            Already have an account? <Link href="/login">Login</Link>
          </p>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
