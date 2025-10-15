// src/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardList,
  CalendarClock,
  PackageSearch,
  AlertCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthContext } from "@/contexts/AuthContext";
import { useLayout } from "@/contexts/LayoutContext";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { IconReport } from "@tabler/icons-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/maintenance",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Planning",
    href: "/maintenance/interventions/calendrier",
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    label: "Équipements",
    href: "/maintenance/equipements",
    icon: <PackageSearch className="h-5 w-5" />,
  },
  {
    label: "Incidents",
    href: "/maintenance/incidents",
    icon: <AlertCircle className="h-5 w-5" />,
  },
  {
    label: "Interventions",
    href: "/maintenance/interventions",
    icon: <CalendarClock className="h-5 w-5" />,
  },
  { label: 'Rapports',
     href: '/maintenance/rapports',
    icon : <IconReport className="h-5 w-5" />},
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuthContext();
  const { isCollapsed, toggleSidebar } = useLayout();
  const { theme } = useTheme();
  const router = useRouter();
      const [logoSrc, setLogoSrc] = useState('/logo/dark.png');
      useEffect(() => {
        if (theme === 'dark') {
          setLogoSrc('/logo/dark.png');
        } else {
          setLogoSrc('/logo/white.png');
        }
      }, [theme]);
  
  const handleClick = () => {
    router.push("/maintenance/documentation");
  }
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
                  <div className="flex items-center justify-center gap-2">
                  <Image
                    src={logoSrc}
                    alt="Logo de l'application"
                    width={40} // Ajuste la taille comme tu le souhaites
                    height={40} // Ajuste la taille comme tu le souhaites
                />
                <h1 className="text-xl font-bold tracking-tight whitespace-nowrap">
                    Technicien
                </h1>
            </div>
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
                pathname === item.href
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
              onClick={handleClick}
            >
              Documentation
            </Button>
          </div>
        )}
      </ScrollArea>

      {/* Bouton de déconnexion */}
      <div className="p-4 border-t">
        <Button
          className="w-full text-white bg-orange-500 hover:bg-orange-600"
          onClick={logout} // Appel de la fonction de déconnexion
        >
          {!isCollapsed && "Se déconnecter"}
          {isCollapsed && <ChevronLeft className="h-5 w-5 rotate-180" />}
        </Button>
      </div>
    </aside>
  );
}