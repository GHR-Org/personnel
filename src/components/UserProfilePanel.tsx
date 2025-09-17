// src/components/UserProfilePanel.tsx
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCurrentUser } from "@/func/api/personnel/apipersonnel";
import {
  Loader2,
  X,
  Briefcase,
  Mail,
  Phone,
  Calendar,
  Landmark,
  Clock,
} from "lucide-react";
import { Personnel, AccountStatus } from "@/types/personnel";

const getStatusColor = (status: AccountStatus) => {
  switch (status) {
    case "active":
      return "bg-green-500 text-white";
    case "inactive":
      return "bg-gray-400 text-white";
    case "suspended":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-200 text-gray-700";
  }
};

export function UserProfilePanel() {
  const [user, setUser] = useState<Personnel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();
        setUser(currentUser as Personnel);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <>
      <SheetHeader className="text-center mb-2">
        <SheetTitle className="text-2xl font-bold">Profil du personnel</SheetTitle>
      </SheetHeader>

      <div className="flex flex-col items-center gap-6 p-4 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center gap-2 mt-10">
            <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
            <span className="text-sm text-gray-500">Chargement du profil...</span>
          </div>
        ) : user ? (
          <div className="w-full max-w-md">
            {/* Avatar + Nom */}
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={""} alt={`Photo de ${user.prenom}`} />
                <AvatarFallback className="text-4xl font-semibold bg-gray-200">
                  {user.prenom?.[0]}
                  {user.nom?.[0]}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-2xl font-bold">
                {user.prenom} {user.nom}
              </h3>
              <div
                className={`px-4 py-1 text-sm rounded-full font-medium ${getStatusColor(
                  user.statut_compte as AccountStatus
                )}`}
              >
                {user.statut_compte.charAt(0).toUpperCase() +
                  user.statut_compte.slice(1)}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Infos sous forme de “cards” */}
            <div className="space-y-5">
              <ProfileItem
                icon={<Briefcase className="h-5 w-5 text-gray-500" />}
                title="Rôle & Poste"
                value={`${user.role} ${user.poste ? `- ${user.poste}` : ""}`}
              />
              <ProfileItem
                icon={<Mail className="h-5 w-5 text-gray-500" />}
                title="Email"
                value={user.email}
              />
              <ProfileItem
                icon={<Phone className="h-5 w-5 text-gray-500" />}
                title="Téléphone"
                value={user.telephone}
              />
              <ProfileItem
                icon={<Calendar className="h-5 w-5 text-gray-500" />}
                title="Date d'embauche"
                value={formatDate(user.date_embauche)}
              />
              {user.etablissement && (
                <ProfileItem
                  icon={<Landmark className="h-5 w-5 text-gray-500" />}
                  title="Établissement"
                  value={user.etablissement.nom}
                />
              )}
              <ProfileItem
                icon={<Clock className="h-5 w-5 text-gray-500" />}
                title="Compte créé le"
                value={formatDate(user.date_creation)}
              />
            </div>
          </div>
        ) : (
          <div className="text-center text-red-500 mt-10">
            <X className="h-12 w-12 mx-auto mb-2" />
            <span>Erreur : Impossible de charger le profil.</span>
          </div>
        )}
      </div>
    </>
  );
}

// Composant pour uniformiser les lignes de profil
function ProfileItem({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}
