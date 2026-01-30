"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@components/Header";
import { Footer } from "@components/Footer";
import styles from "./forgot-password.module.scss";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
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
        setError(data.message || "Failed to send reset code");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            otp: formData.otp,
            newPassword: formData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStep(3);
      } else {
        setError(data.message || "Failed to reset password");
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
          <h1 className={styles.title}>Reset Password</h1>

          {step === 1 && (
            <form onSubmit={handleSendOTP} className={styles.form}>
              <p className={styles.description}>
                Enter your email address and we'll send you a code to reset your password.
              </p>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="Enter your email"
                />
              </div>
              {error && <div className={styles.error}>{error}</div>}
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className={styles.form}>
              <p className={styles.info}>
                Reset code sent to {formData.email}. Please check your inbox.
              </p>
              <div className={styles.formGroup}>
                <label htmlFor="otp">Reset Code</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                  maxLength={6}
                  className={styles.input}
                  placeholder="Enter 6-digit code"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="newPassword">New Password</label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className={styles.input}
                    placeholder="Enter new password"
                  />
                  <motion.button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className={styles.eyeButton}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{ 
                      rotate: showPassword ? 0 : 15,
                      scale: showPassword ? 1.1 : 1 
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <motion.span
                      className={styles.eyeIcon}
                      animate={{
                        opacity: showPassword ? 1 : 0.7,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {showPassword ? "🔒" : "🔓"}
                    </motion.span>
                    <motion.span
                      className={styles.eyeText}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: showPassword ? 1 : 0,
                        y: showPassword ? 0 : 10 
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {showPassword ? "Secure!" : ""}
                    </motion.span>
                  </motion.button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="Confirm new password"
                  />
                  <motion.button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className={styles.eyeButton}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{ 
                      rotate: showConfirmPassword ? 0 : 15,
                      scale: showConfirmPassword ? 1.1 : 1 
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <motion.span
                      className={styles.eyeIcon}
                      animate={{
                        opacity: showConfirmPassword ? 1 : 0.7,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {showConfirmPassword ? "✅" : "🔍"}
                    </motion.span>
                    <motion.span
                      className={styles.eyeText}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: showConfirmPassword ? 1 : 0,
                        y: showConfirmPassword ? 0 : 10 
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {showConfirmPassword ? "Match!" : ""}
                    </motion.span>
                  </motion.button>
                </div>
              </div>
              {error && <div className={styles.error}>{error}</div>}
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className={styles.success}>
              <div className={styles.successIcon}>✅</div>
              <h2>Password Reset Successful!</h2>
              <p>Your password has been reset successfully. You can now login with your new password.</p>
              <Link href="/login" className={styles.loginButton}>
                Go to Login
              </Link>
            </div>
          )}

          <div className={styles.links}>
            <Link href="/login">Back to Login</Link>
            <span>•</span>
            <Link href="/signup">Create Account</Link>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}