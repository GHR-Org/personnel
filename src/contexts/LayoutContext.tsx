// src/context/LayoutContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <LayoutContext.Provider value={{ isCollapsed, toggleSidebar }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout doit être utilisé à l\'intérieur d\'un LayoutProvider');
  }
  return context;
};