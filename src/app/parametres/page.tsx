/* eslint-disable @typescript-eslint/no-unused-vars */
// app/settings/page.tsx
import { NavSecondary } from "@/components/nav-secondary"; // Assurez-vous que le chemin est correct
import { IconSettings, IconHelp, IconSearch, IconUser, IconBell, IconLock } from "@tabler/icons-react"; // Importez les icônes nécessaires
import Link from "next/link";


export default function Page() {
  return (
    <> {/* Utilisez flexbox pour le layout */}
        <h1 className="text-2xl font-bold mb-6">Bienvenue dans les Paramètres</h1>
        <p className="text-gray-600">
          Sélectionnez une section dans la barre latérale pour commencer.
        </p>
    </>
  );
}