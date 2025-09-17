"use client";

import React, { useEffect, useState } from 'react';
import {
  IconCalendar,
  IconUsers,
  IconSettings,
  IconLayoutDashboard,
  IconChartInfographic,
  IconCash,
  IconChevronRight,
  IconChevronLeft,
  IconChevronDown,
  IconFileReport,
  IconLogout,
} from '@tabler/icons-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { useLayout } from '@/contexts/LayoutContext';
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from 'next/image';
import { useTheme } from 'next-themes';

// Définition des types pour les éléments de navigation
type NavItem = {
  name: string;
  href: string;
  icon?: React.ComponentType<{ size: number; className?: string }>;
  children?: NavItem[];
};

// Liste des éléments de navigation pour la réception
const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/reception/dashboard', icon: IconLayoutDashboard },
  { name: 'Réservations', href: '/reception/reservation', icon: IconCalendar },
  { name: 'Clients', href: '/reception/clients', icon: IconUsers },
  {
    name: 'Caisse',
    href: '/reception/caissier',
    icon: IconCash,
    children: [
      { name: 'Caisse', href: '/reception/caissier/caisse' },
      { name: 'Factures', href: '/reception/caissier/invoice' },
      { name: 'Créer une facture', href: '/reception/caissier/invoice/facture' },
      { name: 'Statistiques', href: '/reception/caissier/statistiques' },
    ],
  },
  { name: 'Statistiques', href: '/reception/analytics', icon: IconChartInfographic },
  { name: 'Rapports', href: '/reception/rapports', icon: IconFileReport },
  { name: 'Paramètres', href: '/reception/parametres', icon: IconSettings },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useLayout();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { theme } = useTheme();
    const [logoSrc, setLogoSrc] = useState('/logo/dark.png');
    useEffect(() => {
      if (theme === 'dark') {
        setLogoSrc('/logo/dark.png');
      } else {
        setLogoSrc('/logo/white.png');
      }
    }, [theme]);
  

  const handleLogout = async () => {
    localStorage.removeItem("access_token_ghr");
    router.push("/login");
  };

  const handleToggleSubmenu = (href: string) => {
    setOpenSubmenu(openSubmenu === href ? null : href);
  };

  return (
    <aside
      className={cn(
        "bg-background border-r h-screen fixed left-0 top-0 flex flex-col z-50 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
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
            Réception
        </h1>
    </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={toggleSidebar}
        >
          {isCollapsed ? (
            <IconChevronRight size={20} />
          ) : (
            <IconChevronLeft size={20} />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <React.Fragment key={item.href}>
              {item.children ? (
                // Gestion des éléments avec sous-menu
                <>
                  <button
                    onClick={() => handleToggleSubmenu(item.href)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted w-full",
                      pathname.startsWith(item.href)
                        ? "bg-muted text-primary"
                        : "text-muted-foreground",
                      isCollapsed && "justify-center"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon && <item.icon size={20} className="flex-shrink-0" />}
                      {!isCollapsed && (
                        <span className="truncate whitespace-nowrap">
                          {item.name}
                        </span>
                      )}
                    </div>
                    {!isCollapsed && (
                      <IconChevronDown
                        size={16}
                        className={cn(
                          "transition-transform duration-200",
                          openSubmenu === item.href && "rotate-180"
                        )}
                      />
                    )}
                  </button>
                  {/* Affichage des sous-menus */}
                  {!isCollapsed && openSubmenu === item.href && (
                    <div className="flex flex-col pl-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted",
                            pathname === child.href
                              ? "bg-muted text-primary"
                              : "text-muted-foreground"
                          )}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                // Gestion des éléments sans sous-menu
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted",
                    pathname.startsWith(item.href)
                      ? "bg-muted text-primary"
                      : "text-muted-foreground",
                    isCollapsed && "justify-center"
                  )}
                >
                  {item.icon && <item.icon size={20} className="flex-shrink-0" />}
                  {!isCollapsed && (
                    <span className="truncate whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t">
        <Button
          variant={"destructive"}
          className="w-full text-white"
          onClick={handleLogout}
        >
          {!isCollapsed && "Se déconnecter"}
          {isCollapsed && <IconLogout size={20} className="h-5 w-5 rotate-180" />}
        </Button>
      </div>
    </aside>
  );
}