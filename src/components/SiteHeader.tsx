// src/components/SiteHeader.tsx
"use client";

import { ChevronDown } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


import Link from "next/link";
import { toast } from "sonner";
import { NotificationPanel } from "./notification/NotificationPanel";

export default function SiteHeader() {
  const { user, logout } = useAuthContext();

  const handleLogout = () => {
    logout();
    toast.info("Vous avez été déconnecté.");
  };

  return (
    <header className="fixed max-w-screen w-full top-0 z-40 bg-background/80 backdrop-blur-lg border-b">
      <div className="flex h-17 justify-between items-center px-4 md:px-8">
        {/* Nom de l'utilisateur à gauche */}
        <div className="flex-1 items-center ml-12 hidden md:flex"> {/* Masqué sur mobile */}
          <span className="text-xl font-bold tracking-tight">
            Bonjour, {user?.prenom || "Utilisateur"} !
          </span>
        </div>

        {/* Espace vide pour les petits écrans */}
        <div className="flex-1 md:hidden"></div>

        {/* Icônes de droite */}
        <div className="flex items-center space-x-2 md:space-x-4 pr-20">
          {/* Notifications */} 
          <NotificationPanel />

          {/* <ModeToggle /> */}

          {/* Menu de l'utilisateur */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder-user.jpg" alt="Avatar utilisateur" />
                  <AvatarFallback>{user?.prenom?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 ml-2" />
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
              <Link href="/parametres/profil">
                <DropdownMenuItem>
                  Mon Profil
                </DropdownMenuItem>
              </Link>
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
        </div>
      </div>
    </header>
  );
}