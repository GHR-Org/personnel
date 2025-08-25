"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Building, 
  BarChart3, 
  Users, 
  Settings, 
  Shield,
  Activity,
  Globe,
  TrendingUp
} from "lucide-react";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: <Shield className="h-4 w-4" />,
    description: "Vue d'ensemble de la plateforme"
  },
  {
    name: "Établissements",
    href: "/admin/etablissement",
    icon: <Building className="h-4 w-4" />,
    description: "Gestion des établissements"
  },
  {
    name: "Statistiques",
    href: "/admin/statistiques",
    icon: <BarChart3 className="h-4 w-4" />,
    description: "Analyses détaillées"
  },
  {
    name: "Utilisateurs",
    href: "/admin/utilisateurs",
    icon: <Users className="h-4 w-4" />,
    description: "Gestion des utilisateurs"
  },
  {
    name: "Activité",
    href: "/admin/activite",
    icon: <Activity className="h-4 w-4" />,
    description: "Suivi en temps réel"
  },
  {
    name: "Géographie",
    href: "/admin/geographie",
    icon: <Globe className="h-4 w-4" />,
    description: "Répartition géographique"
  },
  {
    name: "Performance",
    href: "/admin/performance",
    icon: <TrendingUp className="h-4 w-4" />,
    description: "Métriques de performance"
  },
  {
    name: "Paramètres",
    href: "/admin/parametres",
    icon: <Settings className="h-4 w-4" />,
    description: "Configuration système"
  }
];

export function DashboardNavigation() {
  const pathname = usePathname();

  return (
    <div className="space-y-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Administration
        </h2>
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2 h-auto p-3",
                    isActive && "bg-secondary"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <div className="text-left">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
} 