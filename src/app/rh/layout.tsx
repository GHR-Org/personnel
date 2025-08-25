
import { AppSidebar } from "@/components/app-sidebar"
import RhNavigation from "@/components/config/RhNavigation.json"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { AuthProvider } from "@/contexts/AuthContext"

export default function RHLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <div className="flex w-full min-h-screen ">
          <AppSidebar data={RhNavigation} />
          <main className="flex-1 overflow-y-auto w-full">
            <SiteHeader />
            {children}
          </main>
        </div>
      </SidebarProvider>
    </AuthProvider>
      
    
  );
} 