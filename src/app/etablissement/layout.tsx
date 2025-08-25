import { EtablissementGuard } from "@/components/auth-guard"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import EtablissementNavigation from "@/components/config/EtablissementNavigation.json"

export default function EtablissementLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <EtablissementGuard>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar data={EtablissementNavigation} />
          <main className="flex-1 flex flex-col min-w-0">
            <SiteHeader />
            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </EtablissementGuard>
  )
} 