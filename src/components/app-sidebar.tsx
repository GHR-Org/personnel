/* eslint-disable @typescript-eslint/no-explicit-any */
// components/app-sidebar.tsx
"use client"

import * as React from "react"
import {
  IconBook,
  IconBuilding,
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconHelpCircle,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconCashBanknote,
  IconArrowDownRight,
  IconArrowUpRight,
  IconHistory,
  IconReceipt2,
  IconCreditCard,
  IconFileInvoice,
  IconList,
} from "@tabler/icons-react"
import type { IconProps } from "@tabler/icons-react"

// Importez vos composants de navigation (assurez-vous qu'ils sont prêts à recevoir les icônes comme composants React)
import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"

// Importez les composants UI de votre sidebar
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// --- Définition des types pour vos données de navigation (important pour TypeScript) ---
interface NavItemBase {
  title?: string;
  name?: string; // Certaines de vos données utilisent 'name', d'autres 'title'
  url: string;
  icon?: string; // Nom de l'icône en chaîne de caractères
  isActive?: boolean;
}

interface NavItemWithSubItems extends NavItemBase {
  items?: NavItemBase[]; // Pour les sous-éléments comme dans 'navClouds'
}

interface NavigationData {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  navMain: NavItemWithSubItems[];
  navClouds: NavItemWithSubItems[]; // J'ai ajouté navClouds ici car il est dans votre JSON
  navSecondary: NavItemWithSubItems[];
  documents: NavItemWithSubItems[];
}

// --- Mapping des noms d'icônes aux composants d'icônes réels ---
const iconMap: { [key: string]: React.ComponentType<IconProps> } = {
  IconBook,
  IconBuilding,
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconHelpCircle,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconCashBanknote,
  IconArrowDownRight,
  IconArrowUpRight,
  IconHistory,
  IconReceipt2,
  IconCreditCard,
  IconFileInvoice,
  IconList,
  // Ajoutez toutes les icônes que vous utilisez dans votre JSON
};

// --- Définition des types pour les props de AppSidebar ---
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  data: NavigationData; // Maintenant AppSidebar attend une prop 'data'
}

export function AppSidebar({ data, ...props }: AppSidebarProps) {

  // Helper pour mapper les noms d'icônes aux composants réels
  // et unifier 'name'/'title' si nécessaire.
  const mapIcons = (items: NavItemWithSubItems[]): (Omit<NavItemWithSubItems, 'icon'> & { icon?: React.ComponentType<IconProps> })[] => {
    return items.map(item => {
      const mappedItem: (Omit<NavItemWithSubItems, 'icon'> & { icon?: React.ComponentType<IconProps> }) = {
        ...item,
        name: item.name ?? item.title ?? '', // Assure que 'name' est toujours présent pour les composants enfants
        title: item.title ?? item.name ?? '', // Assure que 'title' est toujours présent
        icon: item.icon && iconMap[item.icon] ? iconMap[item.icon] : undefined,
      };

      // Gérer les sous-éléments si votre NavMain/NavDocuments/NavSecondary les gèrent
      if (item.items) {
        mappedItem.items = mapIcons(item.items); // Récursivité pour les sous-éléments
      }
      return mappedItem;
    });
  };

  const mainNavItems = mapIcons(data.navMain) as any;
  const documentsNavItems = mapIcons(data.documents).filter(item => item.icon && item.name) as any;
  const secondaryNavItems = mapIcons(data.navSecondary) as any;
  // J'ajoute navClouds ici, au cas où vous voudriez l'utiliser.
  // const cloudsNavItems = mapIcons(data.navClouds);


  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">GHR Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Passer les données transformées aux composants de navigation */}
        <NavMain items={mainNavItems} />
        <NavDocuments items={documentsNavItems} />
        <NavSecondary items={secondaryNavItems} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
