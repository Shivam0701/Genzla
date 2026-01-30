"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "./ThemeContext";
import styles from "./Header.module.scss";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/customization", label: "Customization" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/coming-soon", label: "Retail Launch" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("genzla-user");
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("genzla-user");
        }
      }
    }
  }, []);

  useEffect(() => {
    // Close mobile menu when clicking outside
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest(`.${styles.header}`)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMenuOpen]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("genzla-token");
    localStorage.removeItem("genzla-user");
    setUser(null);
    router.push("/");
  }, [router]);

  const handleThemeToggle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  const handleNavClick = useCallback((href) => {
    setIsMenuOpen(false);
    
    // Always use router.push for consistent navigation
    router.push(href);
    
    // If we're on the same page, scroll to top
    if (pathname === href) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [pathname, router]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <button 
          onClick={() => handleNavClick("/")}
          className={styles.brand}
          type="button"
        >
          GENZLA
        </button>
        
        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className={`${styles.navItem} ${
                pathname === item.href ? styles.navItemActive : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        
        {/* Actions */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.themeToggle}
            onClick={handleThemeToggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          {user ? (
            <>
              <button
                onClick={() => handleNavClick(user.role === "admin" ? "/admin/dashboard" : "/dashboard")}
                className={styles.authLink}
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => handleNavClick("/login")}
              className={styles.authLink}
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`${styles.mobileNavItem} ${
                  pathname === item.href ? styles.mobileNavItemActive : ""
                }`}
              >
                {item.label}
              </button>
            ))}
            {user && (
              <button
                onClick={() => handleNavClick(user.role === "admin" ? "/admin/dashboard" : "/dashboard")}
                className={`${styles.mobileNavItem} ${
                  pathname === "/dashboard" || pathname === "/admin/dashboard" ? styles.mobileNavItemActive : ""
                }`}
              >
                Dashboard
              </button>
            )}
            <div className={styles.mobileActions}>
              <button
                type="button"
                className={styles.mobileThemeToggle}
                onClick={handleThemeToggle}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? "☀️" : "🌙"} {theme === "dark" ? "Light" : "Dark"} Mode
              </button>
              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className={styles.mobileLogoutButton}
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => handleNavClick("/login")}
                  className={styles.mobileAuthLink}
                >
                  Login
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

