import { DirectionEtablissementGuard } from "@/components/auth-guard"
import { AppSidebar } from "@/components/app-sidebar"
import DirectionNavigation from "@/components/config/DirectionNavigation.json";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ClientOnly } from "@/components/client-only";
import { SiteHeader } from "@/components/site-header";

export default function DirectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DirectionEtablissementGuard>
      <ClientOnly
        fallback={
          <div className="flex min-h-screen">
            <div className="w-64 bg-sidebar">
              {/* Placeholder for sidebar */}
            </div>
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        }
      >
        <SidebarProvider>
            <div className="flex min-h-screen">
              <AppSidebar data={DirectionNavigation} />
              <main className="flex-1 overflow-y-auto">
                <SiteHeader />
                {children}
              </main>
            </div>
        </SidebarProvider>
      </ClientOnly>
    </DirectionEtablissementGuard>
  )
}