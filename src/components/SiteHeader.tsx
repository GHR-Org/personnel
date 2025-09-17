// src/components/SiteHeader.tsx
"use client";

import { ChevronDown } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { toast } from "sonner";
import { NotificationPanel } from "./notification/NotificationPanel";
import ModeToggle from "./modetoggle";

import { useState } from "react"; // <-- 1. On importe useState
import { Sheet, SheetContent } from "@/components/ui/sheet"; // <-- 2. On importe Sheet
import { UserProfilePanel } from "./UserProfilePanel"; // <-- 3. On importe notre nouveau composant

export default function SiteHeader() {
  const { user, logout } = useAuthContext();
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false); // <-- 4. Nouvel état pour le panneau

  const handleLogout = () => {
    logout();
    toast.info("Vous avez été déconnecté.");
  };

  return (
    <header className="fixed max-w-screen w-full top-0 z-40 bg-background/80 backdrop-blur-lg border-b">
      <div className="flex h-17 justify-between items-center px-4 md:px-8">
        {/* Nom de l'utilisateur à gauche */}
        <div className="flex-1 items-center ml-12 hidden md:flex">
          <span className="text-xl font-bold tracking-tight">
            Bonjour, {user?.prenom || "Utilisateur"} !
          </span>
        </div>

        {/* Espace vide pour les petits écrans */}
        <div className="flex-1 md:hidden"></div>

        {/* Icônes de droite */}
        <div className="flex items-center justify-between pr-20">
          {/* Notifications */}
          <NotificationPanel />

          {/* Menu de l'utilisateur */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative rounded-full"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{user?.prenom?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
              <div className="border-t my-1" />
              {/* Le bouton "Mon Profil" ouvre maintenant le panneau latéral */}
              <DropdownMenuItem 
                onSelect={() => setIsProfilePanelOpen(true)} // <-- 5. On ouvre le panneau ici
              >
                Mon Profil
              </DropdownMenuItem>
              <Link href="/parametres/security">
                <DropdownMenuItem>
                  Sécurité
                </DropdownMenuItem>
              </Link>
              <Link href="/parametres/general">
                <DropdownMenuItem>
                  Préférence
                </DropdownMenuItem>
              </Link>
              <div className="border-t my-1" />
              <DropdownMenuItem onClick={handleLogout}>
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle/>
        </div>
      </div>
      {/* 6. On intègre le composant du panneau ici */}
      <Sheet open={isProfilePanelOpen} onOpenChange={setIsProfilePanelOpen}>
        <SheetContent>
            <UserProfilePanel />
        </SheetContent>
      </Sheet>
    </header>
  );
}