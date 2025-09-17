// src/components/providers/ThemeClassProvider.tsx
"use client";

import { useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";

export default function ThemeClassProvider() {
  const { user } = useAuthContext();

  useEffect(() => {
    // We check for the window object to ensure this runs only in the browser
    if (typeof window !== "undefined" && user?.role) {
      const userRoleClass = user.role.toLowerCase().replace(/[\s&]+/g, "-");
      // Add the theme class directly to the <body> tag
      document.body.className += ` theme-${userRoleClass}`;
    }
  }, [user]);

  return null; 
}