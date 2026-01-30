"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@components/Header";
import { Footer } from "@components/Footer";
import { GoogleAuth } from "@components/GoogleAuth";
import styles from "./login.module.scss";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("genzla-token", data.token);
        localStorage.setItem("genzla-user", JSON.stringify(data.user));
        if (data.user.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(data.message || "Login failed");
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
          <h1 className={styles.title}>Login</h1>

          <form onSubmit={handleLogin} className={styles.form}>
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
            
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={styles.input}
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
                    {showPassword ? "🙈" : "👁️"}
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
                    {showPassword ? "Oops! Hide it!" : ""}
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
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <GoogleAuth mode="login" />

          <div className={styles.links}>
            <Link href="/forgot-password">Forgot Password?</Link>
            <span>•</span>
            <Link href="/signup">Create Account</Link>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
