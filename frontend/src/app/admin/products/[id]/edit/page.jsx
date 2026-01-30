"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Header } from "@components/Header";
import { Footer } from "@components/Footer";
import { useTheme } from "@components/ThemeContext";
import styles from "./edit-product.module.scss";

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const { theme } = useTheme();
  const [product, setProduct] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    images: [],
    customizationOptions: []
  });
  const [loading, setLoading] = useState(true);
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

    fetchProduct(token);
  }, [params.id, router]);

  const fetchProduct = async (token) => {
    console.log("Fetching product with ID:", params.id);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const url = `${API_URL}/api/products/${params.id}`;
      console.log("Product fetch URL:", url);
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Product fetch response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Product data received:", data);
        setProduct(data.product || data);
      } else {
        const errorText = await response.text();
        console.error("Product fetch failed:", errorText);
        alert("Product not found");
        router.push("/admin/dashboard");
      }
    } catch (error) {
      console.error("Network error fetching product:", error);
      alert(`Failed to load product: ${error.message}`);
      router.push("/admin/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    console.log("Submitting product update:", product);

    try {
      const token = localStorage.getItem("genzla-token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const url = `${API_URL}/api/products/${params.id}`;
      
      console.log("Product update URL:", url);
      console.log("Product data to send:", product);
      
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      console.log("Product update response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Product updated successfully:", data);
        alert("Product updated successfully!");
        router.push("/admin/dashboard");
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error("Product update failed:", errorData);
        alert(`Failed to update product: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Network error updating product:", error);
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

  if (loading) {
    return (
      <div className={styles.pageWrapper} data-theme={theme}>
        <Header />
        <main className={styles.main}>
          <div className={styles.loading}>
            <motion.div
              className={styles.spinner}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p>Loading product...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
            <h1 className={styles.title}>Edit Product</h1>
            <button
              onClick={() => router.push("/admin/dashboard")}
              className={styles.backButton}
            >
              ← Back to Dashboard
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="category">Category</label>
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
              />
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
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}