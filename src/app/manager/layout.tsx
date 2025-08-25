
"use client"

// import { AppSidebar } from "@/components/app-sidebar"
// import ManagerNavigation from "@/components/config/ManagerNavigation.json"
import { SidebarProvider } from "@/components/ui/sidebar"
// import { SiteHeader } from "@/components/site-header"
import { RealTimeRestaurantActivitySidebar } from "@/components/manager-restaurant/RealTimeRestaurantActivity"
import { Sidebar } from "@/components/manager-restaurant/sidebar"
import SiteHeader from "@/components/SiteHeader"

export default function ManagerRestaurationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className=" w-full">
        <Sidebar />
        <main className="flex-1 w-full pl-20 pt-12">
          {/* <SiteHeader user={ManagerNavigation.user} /> */}
          {/* <SiteHeader /> */}
          <SiteHeader />
          {children}
          {/* Aside activité à droite */}
          <RealTimeRestaurantActivitySidebar role ="manager" />
        </main>
      </div>
    </SidebarProvider>
  )
}
