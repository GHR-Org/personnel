// components/layouts/AdminLayout.tsx
"use client"

import * as React from "react"
// import { SuperAdminGuard } from "@/components/auth-guard"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { DashboardNavigation } from "@/components/admin/DashboardNavigation"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import adminNavigation from "@/components/config/adminNavigation.json"
import { ClientOnly } from "@/components/client-only"

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <SuperAdminGuard>
      <ClientOnly
        fallback={null}
      >
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar data={adminNavigation} />
            <main className="flex-1 flex flex-col min-w-0">
              <SiteHeader />
              <div className="flex-1 overflow-auto">
              {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
      </ClientOnly>
    // </SuperAdminGuard>
  )
}