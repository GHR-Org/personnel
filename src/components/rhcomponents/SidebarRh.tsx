// src/components/SidebarRh.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardList,
  CalendarClock,
  Users,
  AlertCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Database,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthContext } from "@/contexts/AuthContext";
import { useLayout } from "@/contexts/LayoutContext";

// Données de navigation pour les RH
const navItems = [
  {
    label: "Tableau de bords",
    href: "/rh/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Planning du personnel",
    href: "/rh/planning",
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    label: "Suivi des présences",
    href: "/rh/surveillance/planning-personnel",
    icon: <CalendarClock className="h-5 w-5" />,
  },
  {
    label: "Congés et absences",
    href: "/rh/surveillance/conges",
    icon: <AlertCircle className="h-5 w-5" />,
  },
  {
    label: "Équipes",
    href: "/rh/personnel",
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: "Bibliothèque de données",
    href: "/rh/bibliotheque",
    icon: <Database className="h-5 w-5" />,
  },
  {
    label: "Rapports",
    href: "/rh/rapports",
    icon: <FileText className="h-5 w-5" />,
  },
];

export default function SidebarRh() {
  const pathname = usePathname();
  const { logout } = useAuthContext();
  const { isCollapsed, toggleSidebar } = useLayout();

  return (
    <aside
      className={cn(
        "bg-background border-r h-screen fixed left-0 top-0 flex flex-col z-50 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* En-tête avec le titre et le bouton de redimensionnement */}
      <div
        className={cn(
          "flex items-center justify-between border-b px-6 py-4",
          isCollapsed && "justify-center"
        )}
      >
        {!isCollapsed && (
          <h1 className="text-xl font-bold tracking-tight whitespace-nowrap">
            GHR RH
          </h1>
        )}
        <Button
          variant="default"
          size="icon"
          className="rounded-full"
          onClick={toggleSidebar}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted",
                pathname.startsWith(item.href)
                  ? "bg-muted text-primary"
                  : "text-muted-foreground",
                isCollapsed && "justify-center"
              )}
            >
              {item.icon}
              {!isCollapsed && (
                <span className="truncate whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Bloc d'aide */}
        {!isCollapsed && (
          <div className="m-4 p-4 bg-muted rounded-lg flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Besoin d’aide ?</span>
            </div>
            <p className="text-muted-foreground text-xs leading-snug">
              Consultez la documentation pour plus d’infos.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 text-xs"
            >
              Documentation
            </Button>
          </div>
        )}
      </ScrollArea>

      {/* Bouton de déconnexion */}
      <div className="p-4 border-t">
        <Button
          className="w-full text-white bg-green-700 hover:bg-green-800"
          onClick={logout}
        >
          {!isCollapsed && "Se déconnecter"}
          {isCollapsed && <ChevronLeft className="h-5 w-5 rotate-180" />}
        </Button>
      </div>
    </aside>
  );
}