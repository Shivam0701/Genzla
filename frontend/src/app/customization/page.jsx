"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@components/Header";
import { Footer } from "@components/Footer";
import { WhatsappFloatingButton } from "@components/WhatsappFloatingButton";
import { useTheme } from "@components/ThemeContext";
import styles from "./customization.module.scss";

const customizationTypes = [
  "Hand Painted",
  "DTF (Direct to Film)",
  "DTG (Direct to Garment)",
  "Puff Print",
  "Embroidery"
];

const customizationTypeDescriptions = {
  "Hand Painted": "Artwork painted by hand, each piece is unique",
  "DTF (Direct to Film)": "Digital print transferred onto fabric using heat",
  "DTG (Direct to Garment)": "Ink printed directly on fabric",
  "Puff Print": "Raised print with a soft 3D effect",
  "Embroidery": "Design stitched using thread"
};

const categories = [
  "Jacket",
  "T-shirt",
  "Jeans",
  "Bag",
  "Shoes"
];

export default function CustomizationPage() {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    productCategory: "",
    customizationType: "",
    description: "",
    designFile: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.productCategory || !formData.customizationType || !formData.description) {
      alert("Please fill in all required fields (Product Category, Customization Type, and Design Description)");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("productType", formData.productCategory);
      formDataToSend.append("customizationMethod", formData.customizationType);
      formDataToSend.append("notes", formData.description);
      
      if (formData.designFile) {
        formDataToSend.append("referenceImage", formData.designFile);
      }

      const token = localStorage.getItem("genzla-token");
      
      if (!token) {
        alert("Please log in to submit a customization request");
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customization/request`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (response.ok) {
        alert("Customization request submitted successfully!");
        setFormData({
          productCategory: "",
          customizationType: "",
          description: "",
          designFile: null,
        });
        const fileInput = document.getElementById("designFile");
        if (fileInput) fileInput.value = "";
      } else {
        console.error("Backend error:", data);
        alert(data.message || `Failed to submit request: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        alert("Request timed out. Please try again.");
      } else {
        console.error("Error submitting request:", error);
        alert("Error submitting request. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageWrapper} data-theme={theme}>
      <Header />
      <main className={styles.main}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.headerSection}
        >
          <h1 className={styles.title}>Request a Customization</h1>
          <p className={styles.subtitle}>
            Share your vision and we'll bring it to life. Select your base
            product, choose a customization technique, and upload your design
            reference.
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
            <label htmlFor="productCategory">Product Category</label>
            <div className={styles.selectWrapper}>
              <select
                id="productCategory"
                name="productCategory"
                value={formData.productCategory}
                onChange={handleChange}
                required
                className={styles.select}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="customizationType">Customization Type</label>
            <div className={styles.selectWrapper}>
              <select
                id="customizationType"
                name="customizationType"
                value={formData.customizationType}
                onChange={handleChange}
                required
                className={styles.select}
              >
                <option value="">Select a technique</option>
                {customizationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type} - {customizationTypeDescriptions[type]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Design Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              placeholder="Describe your design idea, placement, colors, and any specific requirements..."
              required
              className={styles.textarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="designFile">
              Upload Design Reference <span className={styles.optional}>(Optional)</span>
            </label>
            <p className={styles.fieldDescription}>
              Upload an image to help us understand your design vision. This is optional - you can describe your idea in the text field above.
            </p>
            <input
              type="file"
              id="designFile"
              name="designFile"
              accept="image/*,.pdf"
              onChange={handleChange}
              className={styles.fileInput}
            />
            {formData.designFile && (
              <p className={styles.fileName}>
                Selected: {formData.designFile.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </button>
        </motion.form>
      </main>
      <Footer />
      <WhatsappFloatingButton />
    </div>
  );
}
