import { StatusReservation, StatusReservationApiMapping } from "@/types";
import { authFetch } from "./authFetch";

interface ApiStatusResponse {
  message: string;
  prix_total: number;
  nombres: number;
}

interface ApiSalairePersonnelResponse {
  message: string;
  total: number;
}

interface ApiBilanEtablissementResponse {
  message: string;
  depenses: number;
  rentrant: number;
  details: {
    revenu_reservations: number;
    revenu_commandes: number;
  };
  benefice: number;
}

interface ApiBilanEtablissementAnnuelResponse {
  message: string;
  bilan: {
    [month: string]: {
      depenses: number;
      revenu: number;
      details: {
        revenu_reservations: number;
        revenu_commandes: number;
      };
      benefice: number;
    };
  };
}

interface AllBilan {
  message: string;
  bilan: {
    [year: string]: {
      depenses: number;
      revenu: number;
      benefice: number;
    };
  };
}

export async function getPrixTotalByStatus(
  statusReservation: StatusReservation,
  etabId: number
): Promise<number> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("❌ NEXT_PUBLIC_API_URL non définie dans .env");
      return 0;
    }

    const apiStatusValue = StatusReservationApiMapping[statusReservation];
    if (!apiStatusValue) {
      console.error(`❌ Statut de réservation non supporté: ${statusReservation}`);
      return 0;
    }

    const encodedStatus = encodeURIComponent(apiStatusValue);
    const url = `${apiUrl}/reservation/status/${encodedStatus}/${etabId}`;
    console.log(`🔍 Appel API direct: ${url} (statut: ${statusReservation} -> ${apiStatusValue})`);

    const response = await authFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // 401 will already be handled by authFetch (auto-logout + redirect)
      console.error(`❌ Erreur API ${response.status}: ${response.statusText} pour le statut ${apiStatusValue}`);
      try {
        const errorData = await response.json();
        console.error("Détails de l'erreur:", errorData);
      } catch (e) {
        console.error("Impossible de parser la réponse d'erreur", e);
      }
      return 0;
    }

    const data: ApiStatusResponse = await response.json();
    console.log(`✅ Réponse API pour ${statusReservation} (${apiStatusValue}):`, data);

    if (typeof data.prix_total !== "number") {
      console.warn(`⚠️ prix_total invalide dans la réponse API:`, data);
      return 0;
    }

    return data.prix_total;
  } catch (error) {
    console.error(`❌ Erreur lors de l'appel API pour ${statusReservation}:`, error);
    return 0;
  }
}

export async function getMontantReservationsConfirmees(etabId: number): Promise<number> {
  return getPrixTotalByStatus(StatusReservation.CONFIRMEE, etabId);
}

export async function getMontantReservationsEnAttente(etabId: number): Promise<number> {
  return getPrixTotalByStatus(StatusReservation.EN_ATTENTE, etabId);
}

export async function getStatsByStatus(
  statusReservation: StatusReservation,
  etabId: number
): Promise<ApiStatusResponse | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("❌ NEXT_PUBLIC_API_URL non définie dans .env");
      return null;
    }

    const apiStatusValue = StatusReservationApiMapping[statusReservation];
    if (!apiStatusValue) {
      console.error(`❌ Statut de réservation non supporté: ${statusReservation}`);
      return null;
    }

    const encodedStatus = encodeURIComponent(apiStatusValue);
    const url = `${apiUrl}/reservation/status/${encodedStatus}/${etabId}`;
    console.log(`🔍 Appel API direct: ${url} (statut: ${statusReservation} -> ${apiStatusValue})`);

    const response = await authFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // 401 will already be handled by authFetch (auto-logout + redirect)
      console.error(`❌ Erreur API ${response.status}: ${response.statusText}`);
      try {
        const errorData = await response.json();
        console.error("Détails de l'erreur:", errorData);
      } catch (e) {
        console.error("Impossible de parser la réponse d'erreur");
      }
      return null;
    }

    const data: ApiStatusResponse = await response.json();
    console.log(`✅ Réponse API pour ${statusReservation} (${apiStatusValue}):`, data);
    return data;
  } catch (error) {
    console.error(`❌ Erreur lors de l'appel API pour ${statusReservation}:`, error);
    return null;
  }
}

export async function getTotalSalairePersonnel(etabId: number): Promise<number> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("❌ NEXT_PUBLIC_API_URL non définie dans .env");
      return 0;
    }

    const url = `${apiUrl}/etablissement/salaire/personnel/${etabId}`;
    console.log(`🔍 Appel API direct: ${url} (salaire personnel pour etabId: ${etabId})`);

    const response = await authFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // 401 will already be handled by authFetch (auto-logout + redirect)
      console.error(`❌ Erreur API ${response.status}: ${response.statusText} pour le salaire personnel`);
      try {
        const errorData = await response.json();
        console.error("Détails de l'erreur:", errorData);
      } catch (e) {
        console.error("Impossible de parser la réponse d'erreur");
      }
      return 0;
    }

    const data: ApiSalairePersonnelResponse = await response.json();
    console.log(`✅ Réponse API pour salaire personnel:`, data);

    if (typeof data.total !== "number") {
      console.warn(`⚠️ total invalide dans la réponse API:`, data);
      return 0;
    }

    return data.total;
  } catch (error) {
    console.error(`❌ Erreur lors de l'appel API pour salaire personnel:`, error);
    return 0;
  }
}

export async function getBilanEtablissement(etabId: number): Promise<number> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("❌ NEXT_PUBLIC_API_URL non définie dans .env");
      return 0;
    }

    const url = `${apiUrl}/etablissement/bilan/etablissement/${etabId}`;
    console.log(`🔍 Appel API direct: ${url} (bilan établissement pour etabId: ${etabId})`);

    const response = await authFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // 401 will already be handled by authFetch (auto-logout + redirect)
      console.error(`❌ Erreur API ${response.status}: ${response.statusText} pour le bilan établissement`);
      try {
        const errorData = await response.json();
        console.error("Détails de l'erreur:", errorData);
      } catch (e) {
        console.error("Impossible de parser la réponse d'erreur");
      }
      return 0;
    }

    const data: ApiBilanEtablissementResponse = await response.json();
    console.log(`✅ Réponse API pour bilan établissement:`, data);

    if (typeof data.benefice !== "number") {
      console.warn(`⚠️ benefice invalide dans la réponse API:`, data);
      return 0;
    }

    return data.benefice;
  } catch (error) {
    console.error(`❌ Erreur lors de l'appel API pour bilan établissement:`, error);
    return 0;
  }
}

export async function getBilanEtablissementAnnuel(etabId: number, annee: number): Promise<ApiBilanEtablissementAnnuelResponse | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("❌ NEXT_PUBLIC_API_URL non définie dans .env");
      return null;
    }

    const url = `${apiUrl}/etablissement/bilan/etablissement/${etabId}/${annee}`;
    console.log(`🔍 Appel API direct: ${url} (bilan annuel pour etabId: ${etabId}, année: ${annee})`);

    const response = await authFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // 401 will already be handled by authFetch (auto-logout + redirect)
      console.error(`❌ Erreur API ${response.status}: ${response.statusText} pour le bilan annuel`);
      try {
        const errorData = await response.json();
        console.error("Détails de l'erreur:", errorData);
      } catch (e) {
        console.error("Impossible de parser la réponse d'erreur");
      }
      return null;
    }

    const data: ApiBilanEtablissementAnnuelResponse = await response.json();
    console.log(`✅ Réponse API pour bilan annuel:`, data);

    if (!data.bilan || typeof data.bilan !== "object") {
      console.warn(`⚠️ bilan invalide dans la réponse API:`, data);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`❌ Erreur lors de l'appel API pour bilan annuel:`, error);
    return null;
  }
}

export async function getBilanEtablissementAll(etabId: number): Promise<AllBilan | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("❌ NEXT_PUBLIC_API_URL non définie dans .env");
      return null;
    }

    const url = `${apiUrl}/etablissement/bilan/tout/${etabId}`;
    console.log(`🔍 Appel API direct: ${url} (bilan pour etabId: ${etabId})`);

    const response = await authFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.error(`❌ Erreur API 401: Unauthorized pour le bilan annuel`);
        // Clear auth data and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return null;
      }
      console.error(`❌ Erreur API ${response.status}: ${response.statusText} pour le bilan annuel`);
      try {
        const errorData = await response.json();
        console.error("Détails de l'erreur:", errorData);
      } catch (e) {
        console.error("Impossible de parser la réponse d'erreur");
      }
      return null;
    }

    const data: AllBilan = await response.json();
    console.log(`✅ Réponse API pour bilan annuel:`, data);

    if (!data.bilan || typeof data.bilan !== "object") {
      console.warn(`⚠️ bilan invalide dans la réponse API:`, data);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`❌ Erreur lors de l'appel API pour bilan annuel:`, error);
    return null;
  }
}
