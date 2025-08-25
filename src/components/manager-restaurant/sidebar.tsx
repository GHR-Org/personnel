// src/components/ui/Sidebar.tsx
"use client";

import React, { useState } from 'react';
import {
  IconCalendar,
  IconUsers,
  IconSettings,
  IconLayoutDashboard,
  IconChartInfographic,
  IconChevronRight,
  IconChevronLeft,
} from '@tabler/icons-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useRouter, usePathname } from 'next/navigation'; // <-- Importez usePathname

// Définition des types pour les éléments de navigation
type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
};

// Liste des éléments de navigation
const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: IconLayoutDashboard },
  { name: 'Commandes', href: '/manager/commande', icon: IconCalendar },
  { name: 'Restaurant', href: '/manager/restaurant', icon: IconUsers },
  { name: 'Statistiques', href: '/analytics', icon: IconChartInfographic },
  { name: 'Rapports', href: '/manager/rapports', icon: IconChartInfographic },
  { name: 'Paramètres', href: '/parametres/general', icon: IconSettings },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // <-- Récupérez le chemin de l'URL

  const handleLogout = async () => {
    localStorage.removeItem("access_token_ghr");
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-screen z-50 flex flex-col transition-all duration-300 ease-in-out",
        "bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800",
        isCollapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      {/* Header et bouton de repliement */}
      <div className="flex items-center justify-center p-4 h-[72px]">
        {!isCollapsed && (
          <Link href="/">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-opacity duration-300">GHR Zomatel</h1>
          </Link>
        )}
        <Button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-transform duration-300",
            isCollapsed ? "absolute right-[-16px] top-6 bg-white dark:bg-gray-900 border" : "ml-auto"
          )}
        >
          <IconChevronRight size={20} className={cn({ "rotate-180": isCollapsed })} />
        </Button>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 scrollbar-hidden">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href; // <-- Vérifiez si le lien est actif

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 py-3 px-3 rounded-lg transition-colors duration-200",
                    "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400",
                    { "justify-center": isCollapsed },
                    isActive && "bg-gray-200 text-blue-600 dark:bg-gray-800 dark:text-blue-400" // <-- Appliquez les classes de style pour l'état actif
                  )}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="text-sm font-medium transition-opacity duration-300">
                      {item.name}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <Button
          variant={"default"}
          className="w-full text-white"
          onClick={handleLogout}
        >
          {!isCollapsed && "Se déconnecter"}
          {isCollapsed && <IconChevronLeft size={20} className="h-5 w-5 rotate-180" />}
        </Button>
      </div>
    </aside>
  );
}