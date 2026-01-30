"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@components/Header";
import { Footer } from "@components/Footer";
import { WhatsappFloatingButton } from "@components/WhatsappFloatingButton";
import Image from "next/image";
import styles from "./products.module.scss";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`
      );
      if (response.ok) {
        const data = await response.json();
        // Fix: Extract products array from response
        setProducts(data.products || []);
      } else {
        console.error("Failed to fetch products:", response.statusText);
        setProducts([]);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["all", "Jacket", "T-shirt", "Shirt", "Jeans", "Baggy Pants", "Bags"];
  
  // Ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];
  const filteredProducts =
    selectedCategory === "all"
      ? safeProducts
      : safeProducts.filter((p) => p.category === selectedCategory);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
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
          <h1 className={styles.title}>Product Collection</h1>
          <p className={styles.subtitle}>
            Explore our curated selection of base products ready for customization.
          </p>
        </motion.div>

        <div className={styles.filters}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`${styles.filterButton} ${
                selectedCategory === cat ? styles.filterButtonActive : ""
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className={styles.loading}>
            <motion.div
              className={styles.spinner}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div 
            className={styles.empty}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.emptyIcon}>📦</div>
            <h3>No products available</h3>
            <p>No products found in this category yet. Check back soon!</p>
          </motion.div>
        ) : (
          <div className={styles.grid}>
            {filteredProducts.map((product, index) => (
              <motion.article
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={styles.card}
                onClick={() => handleProductClick(product)}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={
                      product.images?.[0] ||
                      "/images/product-placeholder.svg"
                    }
                    alt={product.name}
                    width={400}
                    height={500}
                    className={styles.image}
                  />
                  <div className={styles.overlay}>
                    <span className={styles.viewDetails}>View Details</span>
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.category}>{product.category}</div>
                  <h3 className={styles.productName}>{product.name}</h3>
                  {product.price && (
                    <div className={styles.price}>${product.price}</div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Product Detail Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <motion.div
                className={styles.modalContent}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className={styles.closeButton} onClick={closeModal}>
                  ×
                </button>
                
                <div className={styles.modalBody}>
                  <div className={styles.modalImage}>
                    <Image
                      src={
                        selectedProduct.images?.[0] ||
                        "/images/product-placeholder.svg"
                      }
                      alt={selectedProduct.name}
                      width={500}
                      height={600}
                      className={styles.modalImg}
                    />
                  </div>
                  
                  <div className={styles.modalDetails}>
                    <div className={styles.modalCategory}>
                      {selectedProduct.category}
                    </div>
                    <h2 className={styles.modalTitle}>
                      {selectedProduct.name}
                    </h2>
                    <p className={styles.modalDescription}>
                      {selectedProduct.description || "No description available."}
                    </p>
                    
                    {selectedProduct.price && (
                      <div className={styles.modalPrice}>
                        ${selectedProduct.price}
                      </div>
                    )}
                    
                    {selectedProduct.availableCustomizations && 
                     selectedProduct.availableCustomizations.length > 0 && (
                      <div className={styles.customizations}>
                        <h4>Available Customizations:</h4>
                        <ul>
                          {selectedProduct.availableCustomizations.map((custom, idx) => (
                            <li key={idx}>{custom}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className={styles.modalActions}>
                      <button 
                        className={styles.customizeButton}
                        onClick={() => {
                          closeModal();
                          window.location.href = '/customization';
                        }}
                      >
                        Customize This Product
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
      <WhatsappFloatingButton />
    </div>
  );
}
