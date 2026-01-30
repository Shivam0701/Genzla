"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Header } from "@components/Header";
import { Footer } from "@components/Footer";
import { useTheme } from "@components/ThemeContext";
import styles from "./new-product.module.scss";

export default function NewProduct() {
  const router = useRouter();
  const { theme } = useTheme();
  const [product, setProduct] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    images: [],
    customizationOptions: []
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("genzla-token");
    const userData = localStorage.getItem("genzla-user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "admin") {
      router.push("/dashboard");
      return;
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    console.log("Creating new product:", product);

    try {
      const token = localStorage.getItem("genzla-token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const url = `${API_URL}/api/products`;
      
      console.log("Product create URL:", url);
      console.log("Product data to send:", product);
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      console.log("Product create response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Product created successfully:", data);
        alert("Product created successfully!");
        router.push("/admin/dashboard");
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error("Product create failed:", errorData);
        alert(`Failed to create product: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Network error creating product:", error);
      alert(`Network error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.pageWrapper} data-theme={theme}>
      <Header />
      <main className={styles.main}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.container}
        >
          <div className={styles.header}>
            <h1 className={styles.title}>Add New Product</h1>
            <button
              onClick={() => router.push("/admin/dashboard")}
              className={styles.backButton}
            >
              ← Back to Dashboard
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Enter product name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={product.category}
                onChange={handleChange}
                required
                className={styles.select}
              >
                <option value="">Select a category</option>
                <option value="Jacket">Jacket</option>
                <option value="T-shirt">T-shirt</option>
                <option value="Hoodie">Hoodie</option>
                <option value="Jeans">Jeans</option>
                <option value="Bag">Bag</option>
                <option value="Shoes">Shoes</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleChange}
                rows={6}
                className={styles.textarea}
                placeholder="Describe the product features, materials, and customization options..."
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="price">Price (Optional)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={product.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={styles.input}
                placeholder="0.00"
              />
              <small className={styles.fieldNote}>
                Leave empty if pricing is custom/quote-based
              </small>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={() => router.push("/admin/dashboard")}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className={styles.saveButton}
              >
                {saving ? "Creating..." : "Create Product"}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}