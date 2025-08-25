// src/hooks/useEtablissementId.ts

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/func/api/personnel/apipersonnel"; // Assurez-vous que le chemin est correct

/**
 * Hook personnalisé pour récupérer l'ID de l'établissement de l'utilisateur connecté.
 * @returns {{ etablissementId: number | null, isLoading: boolean }} L'ID de l'établissement et l'état de chargement.
 */
export const useEtablissementId = () => {
  const [etablissementId, setEtablissementId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEtablissementId = async () => {
      setIsLoading(true);
      try {
        const user = await getCurrentUser();
        if (user && user.etablissement_id) {
          
          console.table(user)
          setEtablissementId(user.etablissement_id);
            console.log(user.etablissement_id)

        } else {
          console.error("ID de l'établissement introuvable pour l'utilisateur.");
          setEtablissementId(0);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'ID de l'établissement :", error);
        setEtablissementId(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEtablissementId();
  }, []);

  return { etablissementId, isLoading };
};