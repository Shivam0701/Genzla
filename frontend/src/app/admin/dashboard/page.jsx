"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@components/Header";
import { Footer } from "@components/Footer";
import { useTheme } from "@components/ThemeContext";
import styles from "./admin-dashboard.module.scss";

export default function AdminDashboard() {
  const router = useRouter();
  const { theme } = useTheme();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("requests");
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", phone: "", role: "customer" });

  useEffect(() => {
    console.log("Admin Dashboard - API URL:", process.env.NEXT_PUBLIC_API_URL);
    
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

    setUser(parsedUser);
    fetchData(token);
  }, [router]);

  const fetchData = async (token) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://genzla.onrender.com";
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const requestsUrl = `${API_URL}/api/admin/customization-requests`;
      const usersUrl = `${API_URL}/api/admin/users`;
      const productsUrl = `${API_URL}/api/products`;
      
      const [requestsRes, usersRes, productsRes] = await Promise.all([
        fetch(requestsUrl, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        }),
        fetch(usersUrl, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        }),
        fetch(productsUrl, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        }),
      ]);

      clearTimeout(timeoutId);

      if (requestsRes.ok) {
        const data = await requestsRes.json();
        setRequests(data.requests || []);
      } else {
        console.error("Failed to fetch requests:", requestsRes.status);
        setRequests([]);
      }
      
      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.users || []);
      } else {
        console.error("Failed to fetch users:", usersRes.status);
        setUsers([]);
      }
      
      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.products || []);
      } else {
        console.error("Failed to fetch products:", productsRes.status);
        setProducts([]);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log("Admin data requests timed out");
      } else {
        console.error("Network error fetching data:", error);
      }
      setRequests([]);
      setUsers([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("genzla-token");
    localStorage.removeItem("genzla-user");
    router.push("/");
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    console.log("Attempting to update status:", { requestId, newStatus });
    
    try {
      const token = localStorage.getItem("genzla-token");
      console.log("Token exists:", !!token);
      
      // Use production API URL
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://genzla.onrender.com";
      const url = `${API_URL}/api/admin/customization-requests/${requestId}/status`;
      console.log("API URL:", url);
      
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);
      
      const data = await response.json();
      console.log("Response data:", data);
      
      if (response.ok) {
        console.log("Status updated successfully:", data);
        // Refresh data to show updated status
        fetchData(token);
        // Show success message
        alert(`Status updated to: ${newStatus}`);
      } else {
        console.error("Failed to update status:", data);
        alert(`Failed to update status: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Network error updating status:", error);
      alert(`Network error: ${error.message}`);
    }
  };

  const handleDelete = async (type, id) => {
    try {
      const token = localStorage.getItem("genzla-token");
      let endpoint;
      
      switch(type) {
        case 'user':
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${id}`;
          break;
        case 'request':
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/customization-requests/${id}`;
          break;
        case 'product':
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`;
          break;
        default:
          throw new Error('Invalid delete type');
      }

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`${type} deleted successfully:`, data);
        fetchData(token);
        setShowDeleteModal(null);
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
      } else {
        console.error(`Failed to delete ${type}:`, data);
        alert(`Failed to delete ${type}: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Failed to delete:", error);
      alert(`Network error: Failed to delete ${type}`);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("genzla-token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        }
      );

      if (response.ok) {
        fetchData(token);
        setShowAddUserModal(false);
        setNewUser({ name: "", email: "", phone: "", role: "customer" });
      }
    } catch (error) {
      console.error("Failed to add user:", error);
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

  if (!user) return null;

  return (
    <div className={styles.pageWrapper} data-theme={theme}>
      <Header />
      <main className={styles.main}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={styles.container}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className={styles.header}>
            <div className={styles.headerContent}>
              <h1 className={styles.title}>Admin Dashboard</h1>
              <p className={styles.subtitle}>Manage your GENZLA platform</p>
            </div>
            <div className={styles.headerActions}>
              <motion.button
                onClick={async () => {
                  try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/test`);
                    const data = await response.json();
                    alert(`API Test: ${data.message} (Port: ${data.port})`);
                  } catch (error) {
                    alert(`API Test Failed: ${error.message}`);
                  }
                }}
                className={styles.testButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🔧 Test API
              </motion.button>
              <motion.button 
                onClick={handleLogout} 
                className={styles.logoutButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className={styles.logoutIcon}>🚪</span>
                Logout
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={itemVariants} className={styles.statsGrid}>
            <motion.div 
              className={styles.statCard}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.statIcon}>📋</div>
              <div className={styles.statNumber}>{requests.length}</div>
              <div className={styles.statLabel}>Customization Requests</div>
            </motion.div>
            <motion.div 
              className={styles.statCard}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.statIcon}>👥</div>
              <div className={styles.statNumber}>{users.length}</div>
              <div className={styles.statLabel}>Total Users</div>
            </motion.div>
            <motion.div 
              className={styles.statCard}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.statIcon}>📦</div>
              <div className={styles.statNumber}>{products.length}</div>
              <div className={styles.statLabel}>Products</div>
            </motion.div>
            <motion.div 
              className={styles.statCard}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.statIcon}>⚡</div>
              <div className={styles.statNumber}>
                {requests.filter(r => r.status === "In Production").length}
              </div>
              <div className={styles.statLabel}>In Production</div>
            </motion.div>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div variants={itemVariants} className={styles.tabNavigation}>
            {[
              { key: 'requests', label: 'Customization Requests', icon: '🎨' },
              { key: 'users', label: 'Users', icon: '👥' },
              { key: 'products', label: 'Products', icon: '📦' }
            ].map((tab) => (
              <motion.button
                key={tab.key}
                className={`${styles.tabButton} ${activeTab === tab.key ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab.key)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={styles.tabIcon}>{tab.icon}</span>
                {tab.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'requests' && (
              <motion.div
                key="requests"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className={styles.tabContent}
              >
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Customization Requests</h2>
                  <div className={styles.sectionSubtitle}>
                    Manage and track all customer customization requests
                  </div>
                </div>
                
                {loading ? (
                  <div className={styles.loading}>
                    <motion.div
                      className={styles.spinner}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p>Loading requests...</p>
                  </div>
                ) : requests.length === 0 ? (
                  <motion.div 
                    className={styles.emptyState}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className={styles.emptyIcon}>📋</div>
                    <h3>No requests yet</h3>
                    <p>Customization requests will appear here</p>
                  </motion.div>
                ) : (
                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Product</th>
                          <th>Customization</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((request, index) => (
                          <motion.tr 
                            key={request._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <td>
                              <div className={styles.customerInfo}>
                                <div className={styles.customerName}>
                                  {request.user?.name || "N/A"}
                                </div>
                                <div className={styles.customerEmail}>
                                  {request.user?.email}
                                </div>
                                <div className={styles.customerPhone}>
                                  {request.user?.phone}
                                </div>
                              </div>
                            </td>
                            <td>{request.productType}</td>
                            <td>{request.customizationMethod}</td>
                            <td>
                              <span
                                className={`${styles.status} ${
                                  styles[`status${request.status.replace(/\s+/g, '')}`]
                                }`}
                              >
                                {request.status}
                              </span>
                            </td>
                            <td>
                              {new Date(request.createdAt).toLocaleDateString()}
                            </td>
                            <td>
                              <div className={styles.actionButtons}>
                                <select
                                  value={request.status}
                                  onChange={(e) =>
                                    handleStatusUpdate(request._id, e.target.value)
                                  }
                                  className={styles.statusSelect}
                                >
                                  <option value="Received">Received</option>
                                  <option value="In Review">In Review</option>
                                  <option value="In Production">In Production</option>
                                  <option value="Completed">Completed</option>
                                  <option value="On Hold">On Hold</option>
                                </select>
                                <motion.button
                                  className={styles.deleteButton}
                                  onClick={() => setShowDeleteModal({ type: 'request', id: request._id })}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  🗑️
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className={styles.tabContent}
              >
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>User Management</h2>
                  <motion.button
                    className={styles.addButton}
                    onClick={() => setShowAddUserModal(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className={styles.addIcon}>➕</span>
                    Add User
                  </motion.button>
                </div>
                
                {loading ? (
                  <div className={styles.loading}>
                    <motion.div
                      className={styles.spinner}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p>Loading users...</p>
                  </div>
                ) : (
                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Registered</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u, index) => (
                          <motion.tr 
                            key={u._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <td>
                              <div className={styles.userName}>
                                {u.name}
                                {u.role === 'admin' && (
                                  <span className={styles.adminBadge}>👑</span>
                                )}
                              </div>
                            </td>
                            <td>{u.email}</td>
                            <td>{u.phone || 'N/A'}</td>
                            <td>
                              <span className={`${styles.role} ${styles[`role${u.role}`]}`}>
                                {u.role}
                              </span>
                            </td>
                            <td>
                              <span className={`${styles.status} ${u.isVerified ? styles.statusVerified : styles.statusUnverified}`}>
                                {u.isVerified ? 'Verified' : 'Unverified'}
                              </span>
                            </td>
                            <td>
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td>
                              {u.role !== 'admin' && (
                                <motion.button
                                  className={styles.deleteButton}
                                  onClick={() => setShowDeleteModal({ type: 'user', id: u._id, name: u.name })}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  🗑️
                                </motion.button>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div
                key="products"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className={styles.tabContent}
              >
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Product Management</h2>
                  <Link href="/admin/products/new" className={styles.addButton}>
                    <span className={styles.addIcon}>➕</span>
                    Add Product
                  </Link>
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
                ) : products.length === 0 ? (
                  <motion.div 
                    className={styles.emptyState}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className={styles.emptyIcon}>📦</div>
                    <h3>No products yet</h3>
                    <p>Add your first product to get started</p>
                    <Link href="/admin/products/new" className={styles.emptyAction}>
                      Add Product
                    </Link>
                  </motion.div>
                ) : (
                  <div className={styles.productsGrid}>
                    {products.map((product, index) => (
                      <motion.div 
                        key={product._id} 
                        className={styles.productCard}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                      >
                        <div className={styles.productImage}>
                          {product.images && product.images[0] ? (
                            <img src={product.images[0]} alt={product.name} />
                          ) : (
                            <div className={styles.placeholderImage}>📦</div>
                          )}
                        </div>
                        <div className={styles.productInfo}>
                          <h3 className={styles.productName}>{product.name}</h3>
                          <p className={styles.productCategory}>{product.category}</p>
                          <p className={styles.productDescription}>
                            {product.description?.substring(0, 100)}...
                          </p>
                          {product.price && (
                            <div className={styles.productPrice}>₹{product.price}</div>
                          )}
                          <div className={styles.productActions}>
                            <Link
                              href={`/admin/products/${product._id}/edit`}
                              className={styles.editButton}
                            >
                              ✏️ Edit
                            </Link>
                            <motion.button
                              className={styles.deleteButton}
                              onClick={() => setShowDeleteModal({ type: 'product', id: product._id, name: product.name })}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              🗑️
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              className={styles.modalOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(null)}
            >
              <motion.div
                className={styles.modal}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3>Confirm Delete</h3>
                <p>
                  Are you sure you want to delete this {showDeleteModal.type}
                  {showDeleteModal.name && ` "${showDeleteModal.name}"`}?
                </p>
                <div className={styles.modalActions}>
                  <button
                    className={styles.cancelButton}
                    onClick={() => setShowDeleteModal(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.confirmDeleteButton}
                    onClick={() => handleDelete(showDeleteModal.type, showDeleteModal.id)}
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add User Modal */}
        <AnimatePresence>
          {showAddUserModal && (
            <motion.div
              className={styles.modalOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddUserModal(false)}
            >
              <motion.div
                className={styles.modal}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3>Add New User</h3>
                <form onSubmit={handleAddUser} className={styles.addUserForm}>
                  <div className={styles.formGroup}>
                    <label>Name</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Email</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      className={styles.cancelButton}
                      onClick={() => setShowAddUserModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className={styles.confirmButton}>
                      Add User
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}