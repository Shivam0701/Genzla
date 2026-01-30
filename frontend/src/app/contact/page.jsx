"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@components/Header";
import { Footer } from "@components/Footer";
import { WhatsappFloatingButton } from "@components/WhatsappFloatingButton";
import styles from "./contact.module.scss";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
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
          className={styles.headerSection}
        >
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>
            Have questions about customization, collaborations, or private
            fittings? Reach out via the form below or connect with us on
            WhatsApp.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          onSubmit={handleSubmit}
          className={styles.form}
        >
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

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
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={8}
              required
              className={styles.textarea}
              placeholder="Tell us about your project or inquiry..."
            />
          </div>

          {submitStatus === "success" && (
            <div className={styles.successMessage}>
              Message sent successfully! We'll get back to you soon.
            </div>
          )}

          {submitStatus === "error" && (
            <div className={styles.errorMessage}>
              Failed to send message. Please try again or contact us via
              WhatsApp.
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </motion.form>
      </main>
      <Footer />
      <WhatsappFloatingButton />
    </div>
  );
}
