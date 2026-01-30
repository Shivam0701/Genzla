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
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://genzla.onrender.com";
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

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setSaving(true);
    try {
      const uploadedImages = [];
      
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        
        const token = localStorage.getItem("genzla-token");
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://genzla.onrender.com";
        
        const response = await fetch(`${API_URL}/api/admin/upload-image`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        
        if (response.ok) {
          const data = await response.json();
          uploadedImages.push(data.imageUrl);
        } else {
          console.error('Failed to upload image:', file.name);
        }
      }
      
      setProduct(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const removeImage = (index) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
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
                <option value="Shirt">Shirt</option>
                <option value="Hoodie">Hoodie</option>
                <option value="Jeans">Jeans</option>
                <option value="Baggy Pants">Baggy Pants</option>
                <option value="Bags">Bags</option>
                <option value="Shoe">Shoe</option>
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
              <label htmlFor="price">Price (Optional) - ₹</label>
              <input
                type="text"
                id="price"
                name="price"
                value={product.price}
                onChange={handleChange}
                className={styles.input}
                placeholder="e.g., ₹999, Contact for Price, Custom Quote"
              />
              <small className={styles.fieldNote}>
                You can enter numbers (₹999) or text (Contact for Price, Custom Quote, etc.)
              </small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="images">Product Images</label>
              <input
                type="file"
                id="images"
                name="images"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.fileInput}
              />
              <small className={styles.fieldNote}>
                Upload multiple images (JPG, PNG, WebP). First image will be the main image.
              </small>
              {product.images.length > 0 && (
                <div className={styles.imagePreview}>
                  {product.images.map((image, index) => (
                    <div key={index} className={styles.imageItem}>
                      <img src={image} alt={`Product ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className={styles.removeImage}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
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