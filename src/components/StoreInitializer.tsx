// src/components/StoreInitializer.tsx
"use client";

import { useAppStore } from '@/lib/stores/maintenance_store';
import { useEffect } from 'react';

export function StoreInitializer({ children }: { children: React.ReactNode }) {
  const initializeStore = useAppStore(state => state.initializeStore);
  const establishmentId = useAppStore(state => state.establishmentId);

  // Appeler initializeStore une seule fois au chargement pour récupérer l'ID de l'établissement
  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  if (establishmentId === null) {
    // Affichez un état de chargement tant que l'ID n'est pas disponible
    return <div>Chargement de l&apos;utilisateur...</div>;
  }

  // Une fois l'ID disponible, affichez le reste de l'application
  return <>{children}</>;
}