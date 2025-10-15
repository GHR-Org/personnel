// src/hooks/useClientsActivitee.ts
import React, { useEffect, useState, useCallback } from "react";
import { clientsActivitee } from "@/services/clientsActivitee";
import { apiService } from "@/services/api";

interface ClientWithActivity {
  id: number;
  first_name: string;
  last_name: string;
  sexe: string;
}

type Status = "idle" | "loading" | "success" | "error";

export function useClientsActivitee(
    etablissementId?: number,
    options?: { recent?: boolean }
) {
    const [data, setData] = useState<ClientWithActivity[] | null>(null);
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState<string | null>(null);

    const fetchClient = useCallback(async () => {
        if (!etablissementId) return;

        // Set the etablissement ID for the API service
        apiService.setEtablissementId(etablissementId);

        setStatus("loading");
        setError(null);

        try {
            const response = options?.recent
                ? await clientsActivitee.getRecentByEtablissement(etablissementId)
                : await clientsActivitee.getByEtablissement(etablissementId);

            setData(response);
            setStatus("success");
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            setError(errorMessage);
            setStatus("error");
        }
    }, [etablissementId, options?.recent]);

    useEffect(() => {
        fetchClient();
    }, [fetchClient]);

    return { data, status, error, refetch: fetchClient };
}
