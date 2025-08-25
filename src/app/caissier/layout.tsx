"use client";


import { AppSidebar } from "@/components/app-sidebar"
import CaisseNavigation from "@/components/config/CaisseNavigation.json"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"


export default function CaissierLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
    
      <div className="flex min-h-screen">
        <SidebarProvider>
          
        <AppSidebar data={CaisseNavigation} />
        <main className="flex-1 overflow-y-auto">
          <SiteHeader />
          {children}
        </main>
        </SidebarProvider>
      </div>
    
  )
}