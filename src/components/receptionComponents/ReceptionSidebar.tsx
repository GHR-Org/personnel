/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  IconDashboard,
  IconListDetails,
  IconFileDescription,
  IconFileWord,
  IconReport,
  IconChartBar,
  IconSettings,
  IconCamera,
  IconHelp,
  IconSearch,
  IconDatabase
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

const navData = {
  user: {
    name: "Nom du Réceptionniste",
    email: "reception@ghrinc.com",
    avatar: "/avatars/receptionniste.jpg"
  },
  navMain: [
    {
      title: "Tableau de bord",
      url: "/reception",
      icon: IconDashboard
    },
    {
      title: "Réservations",
      url: "/reception/reservation",
      icon: IconListDetails,
      items: [
        { title: "Ajouter", url: "#", icon: IconFileDescription },
        { title: "Modifier", url: "#", icon: IconFileWord },
        { title: "Clôturer", url: "#", icon: IconReport }
      ]
    },
    {
      title: "Suivi des Commandes",
      url: "#",
      icon: IconListDetails
    },
    {
      title: "Statistiques",
      url: "#",
      icon: IconChartBar
    },
    {
      title: "Gestion des Chambres",
      url: "#",
      icon: IconSettings,
      items: [
        { title: "Mettre à jour statut", url: "#", icon: IconCamera }
      ]
    }
  ],
  navClouds: [
    {
      title: "Capture",
      url: "#",
      icon: IconCamera,
      isActive: false,
      items: [
        { title: "Propositions actives", url: "#" },
        { title: "Archivées", url: "#" }
      ]
    }
  ],
  navSecondary: [
    { title: "Paramètres", url: "#", icon: IconSettings },
    { title: "Aide", url: "#", icon: IconHelp },
    { title: "Recherche", url: "#", icon: IconSearch }
  ],
  documents: [
    { name: "Bibliothèque de données", url: "#", icon: IconDatabase }
  ]
};

export default function ReceptionSidebar() {
  const { user, navMain, navClouds, navSecondary, documents } = navData;

  const renderNavItem = (item: any) => {
    const Icon = item.icon;
    if (!Icon) return null;

    if (item.items?.length) {
      return (
        <AccordionItem value={item.title} key={item.title}>
          <AccordionTrigger className="hover:bg-muted/10 flex items-center gap-2 px-4 py-2 rounded-md text-sm text-muted-foreground">
            <Icon size={18} /> {item.title}
          </AccordionTrigger>
          <AccordionContent className="pl-6 space-y-1">
            {item.items.map((sub: any) => {
              const SubIcon = sub.icon;
              return (
                <Link
                  key={sub.title}
                  href={sub.url}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-white hover:text-white hover:bg-muted/20 rounded"
                >
                  {SubIcon && <SubIcon size={16} />} {sub.title}
                </Link>
              );
            })}
          </AccordionContent>
        </AccordionItem>
      );
    }

    return (
      <Link
        key={item.title}
        href={item.url}
        className="flex items-center gap-2 px-4 py-2 rounded-md text-sm text-muted-foreground hover:text-white hover:bg-muted/10"
      >
        <Icon size={18} /> {item.title}
      </Link>
    );
  };

  return (
    <aside className="w-72 h-screen bg-[hsl(224,71.4%,4.1%)] text-white flex flex-col border-r border-white/10">
      <div className="flex items-center gap-4 px-4 py-6 border-b border-white/10">
        <Image
          src={user.avatar}
          alt="Avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-sm text-white">{user.name}</span>
          <span className="text-muted-foreground text-xs">{user.email}</span>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <nav className="space-y-4 px-2 py-4">
          <Accordion type="multiple" className="w-full space-y-1">
            {navMain.map(renderNavItem)}
            {navClouds.map(renderNavItem)}
          </Accordion>

          <div className="border-t border-white/10 pt-4 mt-4 space-y-1">
            {navSecondary.map(({ title, url, icon: Icon }) => (
              <Link
                key={title}
                href={url}
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-white hover:bg-muted/10 rounded-md"
              >
                <Icon size={18} /> {title}
              </Link>
            ))}
          </div>

          <div className="border-t border-white/10 pt-4 mt-4 space-y-1">
            {documents.map(({ name, url, icon: Icon }) => (
              <Link
                key={name}
                href={url}
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-white hover:bg-muted/10 rounded-md"
              >
                <Icon size={18} /> {name}
              </Link>
            ))}
          </div>
        </nav>
      </ScrollArea>
      <div className="p-4 border-t border-white/10">
        <Button className="w-full bg-white text-black hover:bg-white/90" variant="ghost">
          Déconnexion
        </Button>
      </div>
    </aside>
  );
}
