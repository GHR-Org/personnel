"use client";

import SiteHeader from "@/components/SiteHeader";
import { LayoutProvider, useLayout } from "@/contexts/LayoutContext";
import { cn } from "@/lib/utils";
import { StoreInitializer } from '@/components/StoreInitializer';
import { Sidebar } from "@/components/reception/sidebar";

const MainContent = ({ children }: { children: React.ReactNode }) => {
  const { isCollapsed } = useLayout();

  return (
    <div
      className={cn(
        "flex-1 transition-all duration-300 overflow-x-hidden",
        isCollapsed ? "ml-20" : "ml-64"
      )}
    >
      <SiteHeader />
      <div className="flex-1 pb-4 pt-14 overflow-x-auto">{children}</div>
    </div>
  );
};

export default function ReceptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutProvider>
      <StoreInitializer>
        <div className="flex dark:bg-gray-950">
          <Sidebar />
          <MainContent>{children}</MainContent>
        </div>
      </StoreInitializer>
    </LayoutProvider>
  );
}