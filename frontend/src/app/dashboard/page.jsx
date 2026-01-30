"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Header } from "@components/Header";
import { Footer } from "@components/Footer";
import styles from "./dashboard.module.scss";

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const token = localStorage.getItem("genzla-token");
    const userData = localStorage.getItem("genzla-user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
      return;
    }

    fetchDashboardStats();
  }, [router]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("genzla-token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/customization/dashboard-stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("genzla-token");
        localStorage.removeItem("genzla-user");
        router.push("/login");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else {
        // If API doesn't exist or fails, set default stats
        console.log("Dashboard stats API not available, using defaults");
        setStats({
          totalRequests: 0,
          inProgress: 0,
          completed: 0,
          recentRequests: []
        });
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      // Set default stats on error
      setStats({
        totalRequests: 0,
        inProgress: 0,
        completed: 0,
        recentRequests: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContactStudio = () => {
    const message = `Hello GENZLA Studio,\n\nI'm ${user?.name} and I'm interested in discussing a custom piece.\n\nBest regards,\n${user?.name}`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleTabChange = (tab) => {
    console.log(`Switching to tab: ${tab}`);
    setActiveTab(tab);
    
    // Refresh data when switching to requests tab
    if (tab === 'requests') {
      const token = localStorage.getItem("genzla-token");
      if (token) {
        fetchDashboardStats();
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Header />
        <div className={styles.loading}>
          <motion.div
            className={styles.spinner}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading your studio...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <main className={styles.main}>
        <motion.div
          className={styles.container}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome Section */}
          <motion.section variants={itemVariants} className={styles.welcome}>
            <div className={styles.welcomeContent}>
              <motion.h1 
                className={styles.welcomeTitle}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Welcome back, <span className={styles.userName}>{user?.name}</span>
              </motion.h1>
              <motion.p 
                className={styles.brandStatement}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Every GENZLA piece is crafted exclusively for you.
              </motion.p>
            </div>
            <motion.div 
              className={styles.welcomeDecor}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              ✨
            </motion.div>
          </motion.section>

          {/* Navigation Tabs */}
          <motion.section variants={itemVariants} className={styles.tabNavigation}>
            {['overview', 'requests', 'profile'].map((tab) => (
              <button
                key={tab}
                className={`${styles.tabButton} ${activeTab === tab ? styles.tabActive : ''}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </motion.section>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className={styles.tabContent}
              >
                {/* Quick Stats */}
                <div className={styles.statsSection}>
                  <h2 className={styles.sectionTitle}>Your Studio Stats</h2>
                  <div className={styles.statsGrid}>
                    <motion.div 
                      className={styles.statCard}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <div className={styles.statIcon}>📊</div>
                      <div className={styles.statNumber}>{stats?.totalRequests || 0}</div>
                      <div className={styles.statLabel}>Total Requests</div>
                    </motion.div>
                    <motion.div 
                      className={styles.statCard}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <div className={styles.statIcon}>⚡</div>
                      <div className={styles.statNumber}>{stats?.inProgress || 0}</div>
                      <div className={styles.statLabel}>In Progress</div>
                    </motion.div>
                    <motion.div 
                      className={styles.statCard}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <div className={styles.statIcon}>✅</div>
                      <div className={styles.statNumber}>{stats?.completed || 0}</div>
                      <div className={styles.statLabel}>Completed</div>
                    </motion.div>
                  </div>
                </div>

                {/* Primary Actions */}
                <div className={styles.actionsSection}>
                  <h2 className={styles.sectionTitle}>Quick Actions</h2>
                  <div className={styles.actions}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      whileHover={{ scale: 1.02, y: -3 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link href="/customization" className={styles.primaryCta}>
                        <div className={styles.ctaIcon}>✨</div>
                        <div className={styles.ctaContent}>
                          <h3>Start New Customization</h3>
                          <p>Begin your next exclusive piece</p>
                        </div>
                        <div className={styles.ctaArrow}>→</div>
                      </Link>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      whileHover={{ scale: 1.02, y: -3 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link href="/products" className={styles.secondaryCta}>
                        <div className={styles.ctaIcon}>👕</div>
                        <div className={styles.ctaContent}>
                          <h3>Browse Products</h3>
                          <p>Explore our collection</p>
                        </div>
                        <div className={styles.ctaArrow}>→</div>
                      </Link>
                    </motion.div>
                  </div>
                </div>

                {/* Exclusive Content */}
                <div className={styles.exclusiveSection}>
                  <h2 className={styles.sectionTitle}>Exclusive Content</h2>
                  <div className={styles.contentGrid}>
                    <motion.div 
                      className={styles.contentCard}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      whileHover={{ scale: 1.03, y: -5 }}
                    >
                      <div className={styles.cardImage}>
                        <div className={styles.placeholder}>Behind the Studio</div>
                      </div>
                      <h3>Craftsmanship Process</h3>
                      <p>Exclusive look into our artisan workshop</p>
                    </motion.div>
                    
                    <motion.div 
                      className={styles.contentCard}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      whileHover={{ scale: 1.03, y: -5 }}
                    >
                      <div className={styles.cardImage}>
                        <div className={styles.placeholder}>Coming Soon</div>
                        <div className={styles.lockOverlay}>🔒</div>
                      </div>
                      <h3>Retail Preview</h3>
                      <p>First access to upcoming collections</p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'requests' && (
              <motion.div
                key="requests"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className={styles.requestsTab}
              >
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>My Requests</h2>
                  <motion.button
                    className={styles.refreshButton}
                    onClick={() => {
                      const token = localStorage.getItem("genzla-token");
                      if (token) fetchDashboardStats();
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🔄 Refresh
                  </motion.button>
                </div>
                {stats?.recentRequests?.length > 0 ? (
                  <div className={styles.requestsList}>
                    {stats.recentRequests.map((request) => (
                      <motion.div 
                        key={request._id} 
                        className={styles.requestCard}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02, y: -3 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className={styles.requestIcon}>
                          {request.productType === 'Jacket' ? '🧥' :
                           request.productType === 'T-shirt' ? '👕' :
                           request.productType === 'Hoodie' ? '👘' :
                           request.productType === 'Jeans' ? '👖' :
                           request.productType === 'Bag' ? '👜' :
                           request.productType === 'Shoes' ? '👟' : '✨'}
                        </div>
                        <div className={styles.requestContent}>
                          <h4>{request.productType} - {request.customizationMethod}</h4>
                          <p className={styles.requestStatus}>
                            Status: <span className={styles[`status${request.status.replace(/\s+/g, '')}`]}>
                              {request.status}
                            </span>
                          </p>
                          <p className={styles.requestDate}>
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    className={styles.emptyState}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className={styles.emptyIcon}>📋</div>
                    <h3>No requests yet</h3>
                    <p>Start your first customization to see your requests here</p>
                    <Link href="/customization" className={styles.emptyAction}>
                      Start Customization
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className={styles.profileTab}
              >
                <h2 className={styles.sectionTitle}>Profile Information</h2>
                <motion.div 
                  className={styles.profileCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className={styles.profileHeader}>
                    <div className={styles.profileAvatar}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.profileInfo}>
                      <h3>{user?.name}</h3>
                      <p>{user?.email}</p>
                      {user?.phone && <p>{user.phone}</p>}
                    </div>
                  </div>
                  <div className={styles.profileDetails}>
                    <div className={styles.profileField}>
                      <label>Role</label>
                      <span>{user?.role || 'Customer'}</span>
                    </div>
                    <div className={styles.profileField}>
                      <label>Member Since</label>
                      <span>Welcome to GENZLA</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Contact Studio */}
          <motion.section variants={itemVariants} className={styles.contactSection}>
            <motion.button 
              onClick={handleContactStudio} 
              className={styles.contactButton}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <span className={styles.contactIcon}>💬</span>
              Contact Studio
            </motion.button>
            <p className={styles.contactNote}>
              Direct access to our design team
            </p>
          </motion.section>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}