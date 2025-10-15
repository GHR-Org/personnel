import { apiService } from "./api";
import { Conge, CongeFormData, StatusConge, TypeConge } from "@/types";

export class CongesService {
  private baseUrl = "/conge";

  // Récupérer tous les congés d'un établissement
  async getByEtablissement(etablissementId: number): Promise<Conge[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/etablissement/${etablissementId}`);
      return response.conges || [];
    } catch (error) {
      console.error("[CongesService] Erreur getByEtablissement:", error);
      throw new Error("Erreur lors du chargement des congés");
    }
  }

  // Récupérer les congés d'un personnel spécifique
  async getByPersonnel(personnelId: number): Promise<Conge[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/personnel/${personnelId}`);
      return response.conges || [];
    } catch (error) {
      console.error("[CongesService] Erreur getByPersonnel:", error);
      throw new Error("Erreur lors du chargement des congés du personnel");
    }
  }

  // Créer un nouveau congé
  async create(data: CongeFormData): Promise<Conge> {
    try {
      const response = await apiService.post(this.baseUrl, data);
      return response.conge;
    } catch (error: any) {
      console.error("[CongesService] Erreur create:", error);
      const message = error?.response?.data?.message || "Erreur lors de la création du congé";
      throw new Error(message);
    }
  }

  // Supprimer un congé
  async delete(id: number): Promise<void> {
    try {
      await apiService.delete(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      console.error("[CongesService] Erreur delete:", error);
      const message = error?.response?.data?.message || "Erreur lors de la suppression du congé";
      throw new Error(message);
    }
  }

  // Mettre à jour un congé
  async update(id: number, data: CongeFormData): Promise<Conge> {
    try {
      const response = await apiService.put(`${this.baseUrl}/${id}`, data);
      return response.conge;
    } catch (error: any) {
      console.error("[CongesService] Erreur update:", error);
      const message = error?.response?.data?.message || "Erreur lors de la mise à jour du congé";
      throw new Error(message);
    }
  }

  // Mettre à jour le statut d'un congé (PATCH /api/conge/{id}/{status})
  async updateStatus(id: number, status: StatusConge): Promise<void> {
    try {
      await apiService.patch(`${this.baseUrl}/${id}/${encodeURIComponent(status)}`);
    } catch (error: any) {
      console.error("[CongesService] Erreur updateStatus:", error);
      const message = error?.response?.data?.message || "Erreur lors de la mise à jour du statut du congé";
      throw new Error(message);
    }
  }

  // Calculer les statistiques des congés
  getStats(conges: Conge[]) {
    const totalConges = conges.length;
    const congesEnAttente = conges.filter(c => c.status === StatusConge.EN_ATTENTE).length;
    const congesApprouves = conges.filter(c => c.status === StatusConge.APPROUVER).length;
    const congesRefuses = conges.filter(c => c.status === StatusConge.REFUSER).length;
    const congesAnnules = conges.filter(c => c.status === StatusConge.ANNULER).length;

    // Statistiques par type
    const congesVacances = conges.filter(c => c.type === TypeConge.VACANCE).length;
    const congesMaladie = conges.filter(c => c.type === TypeConge.MALADIE).length;
    const congesFormation = conges.filter(c => c.type === TypeConge.FORMATION).length;
    const congesRTT = conges.filter(c => c.type === TypeConge.RTT).length;

    // Congés en cours (approuvés et dans la période)
    const now = new Date();
    const congesEnCours = conges.filter(c => {
      if (c.status !== StatusConge.APPROUVER) return false;
      const dateDebut = new Date(c.dateDebut);
      const dateFin = new Date(c.dateFin);
      return dateDebut <= now && now <= dateFin;
    }).length;

    return {
      totalConges,
      congesEnAttente,
      congesApprouves,
      congesRefuses,
      congesAnnules,
      congesEnCours,
      congesVacances,
      congesMaladie,
      congesFormation,
      congesRTT
    };
  }

  // Calculer la durée d'un congé en jours
  calculateDuration(dateDebut: string, dateFin: string): number {
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    const diffTime = Math.abs(fin.getTime() - debut.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // +1 pour inclure le jour de début
  }

  // Vérifier si un congé est en cours
  isCongeEnCours(conge: Conge): boolean {
    if (conge.status !== StatusConge.APPROUVER) return false;
    const now = new Date();
    const dateDebut = new Date(conge.dateDebut);
    const dateFin = new Date(conge.dateFin);
    return dateDebut <= now && now <= dateFin;
  }

  // Vérifier si un congé est à venir
  isCongeAVenir(conge: Conge): boolean {
    if (conge.status !== StatusConge.APPROUVER) return false;
    const now = new Date();
    const dateDebut = new Date(conge.dateDebut);
    return dateDebut > now;
  }

  // Formater les dates pour l'affichage
  formatDateRange(dateDebut: string, dateFin: string): string {
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    };
    
    const debutStr = debut.toLocaleDateString('fr-FR', options);
    const finStr = fin.toLocaleDateString('fr-FR', options);
    
    return `${debutStr} - ${finStr}`;
  }

  // Obtenir la couleur selon le statut
  getStatusColor(status: StatusConge): string {
    switch (status) {
      case StatusConge.EN_ATTENTE:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case StatusConge.APPROUVER:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case StatusConge.REFUSER:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case StatusConge.ANNULER:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  }

  // Obtenir l'icône selon le type
  getTypeIcon(type: TypeConge): string {
    switch (type) {
      case TypeConge.VACANCE:
        return "🏖️";
      case TypeConge.MALADIE:
        return "🏥";
      case TypeConge.RTT:
        return "⏰";
      case TypeConge.PARENTALE:
        return "👶";
      case TypeConge.FORMATION:
        return "📚";
      case TypeConge.AUTRE:
        return "📋";
      default:
        return "📅";
    }
  }

  // Obtenir l'icône selon le statut
  getStatusIcon(status: StatusConge): string {
    switch (status) {
      case StatusConge.EN_ATTENTE:
        return "⏳";
      case StatusConge.APPROUVER:
        return "✅";
      case StatusConge.REFUSER:
        return "❌";
      case StatusConge.ANNULER:
        return "🚫";
      default:
        return "❓";
    }
  }
}

export const congesService = new CongesService();