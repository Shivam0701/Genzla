"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {}
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("genzla-theme");
      if (stored === "dark" || stored === "light") {
        setTheme(stored);
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    
    try {
      // Apply theme to localStorage
      window.localStorage.setItem("genzla-theme", theme);
      
      // Safely apply theme to document elements
      const root = document.documentElement;
      const body = document.body;
      
      if (root) {
        root.setAttribute("data-theme", theme);
      }
      
      if (body) {
        body.setAttribute("data-theme", theme);
        body.classList.remove("theme-light", "theme-dark");
        body.classList.add(`theme-${theme}`);
      }
    } catch (error) {
      console.warn("Theme application error:", error);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const contextValue = {
    theme,
    toggleTheme
  };

  if (!mounted) {
    return (
      <ThemeContext.Provider value={contextValue}>
        <div style={{ visibility: 'hidden' }}>{children}</div>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  try {
    const ctx = useContext(ThemeContext);
    // Always return a valid context, even if not within provider
    return ctx || {
      theme: "light",
      toggleTheme: () => {}
    };
  } catch (error) {
    console.warn("Theme context error:", error);
    return {
      theme: "light",
      toggleTheme: () => {}
    };
  }
}
