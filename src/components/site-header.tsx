import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ModeToggle from "./modetoggle";

export function SiteHeader() {
  return (
    // Ajout des classes 'fixed', 'top-0', 'left-0', 'right-0' et 'z-50'
    <header className=" flex h-[8vh] shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height)]">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Acceuil</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              Lovasoa Nantenaina
            </a>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}