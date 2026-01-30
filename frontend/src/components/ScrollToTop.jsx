"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top immediately on route change
    window.scrollTo(0, 0);
    
    // Also ensure scroll position is reset on page load
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = 'manual';
    }
  }, [pathname]);

  useEffect(() => {
    // Ensure page starts at top on initial load
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, []);

  return null;
}