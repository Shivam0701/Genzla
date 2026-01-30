"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("genzla-theme");
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    } else {
      setTheme("light");
      window.localStorage.setItem("genzla-theme", "light");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Apply theme to localStorage
    window.localStorage.setItem("genzla-theme", theme);
    
    // Apply theme to document element
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    
    // Also apply to body for additional styling
    document.body.setAttribute("data-theme", theme);
    
    // Remove any existing theme classes and add the current one
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(`theme-${theme}`);
    
    console.log(`Theme applied: ${theme}`);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
