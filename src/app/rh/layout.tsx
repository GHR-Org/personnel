// src/app/maintenance/layout.tsx
"use client";

import SiteHeader from "@/components/SiteHeader";
import { LayoutProvider, useLayout } from "@/contexts/LayoutContext";
import { cn } from "@/lib/utils";
import { StoreInitializer } from '@/components/StoreInitializer'; // Importez le StoreInitializer
import SidebarRh from "@/components/rhcomponents/SidebarRh";

const MainContent = ({ children }: { children: React.ReactNode }) => {
  const { isCollapsed } = useLayout();

  return (
    <div
      className={cn(
        "flex-1 transition-all duration-300",
        isCollapsed ? "ml-20" : "ml-64"
      )}
    >
      <SiteHeader />
      <main className="flex-1 p-8 pt-14">{children}</main>
    </div>
  );
};

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutProvider>
      <StoreInitializer>
        <div className="flex">
          <SidebarRh />
          <MainContent>{children}</MainContent>
        </div>
      </StoreInitializer>
    </LayoutProvider>
  );
}