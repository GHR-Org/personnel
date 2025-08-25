// src/app/reception/dashboard/page.tsx (le composant de page serveur)

import { Suspense } from "react";
import Loading from "./loading"; // Importez le loading.tsx que vous avez créé
import DashboardPageContent from "@/components/reception/dashboard-page-content";

// Le composant de page est un composant serveur
// Il a pour seule responsabilité d'afficher la structure principale
// et d'utiliser Suspense pour le chargement.
export default function DashboardPage() {
  return (
    <Suspense fallback={<Loading />}>
      <DashboardPageContent />
    </Suspense>
  );
}