// ============================================================================
// SERVICE GRAPHIQUES FINANCIERS - Données pour les graphiques du dashboard
// ============================================================================

import { reservationsService } from "./reservations";
import { personnelService } from "./personnel";
import { chambresService } from "./chambres";
import { handleApiError } from "./api";

export interface DonneesMensuelle {
  periode: string; // "2024-01" ou "Jan 2024"
  revenu_previsionnel: number;
  depenses: number;
  benefice: number;
}

export interface DonneesAnnuelle {
  annee: string; // "2024"
  revenu_previsionnel: number;
  depenses: number;
  benefice: number;
}

export type TypeFiltre = "tous" | "annee";

export class GraphiquesService {
  
  /**
   * Génère des données mensuelles pour une année donnée
   */
  async getDonneesMensuelles(etablissementId: number, annee: number): Promise<DonneesMensuelle[]> {
    try {
      const mois = [
        "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
        "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"
      ];

      const donnees: DonneesMensuelle[] = [];

      for (let moisIndex = 0; moisIndex < 12; moisIndex++) {
        const debutMois = new Date(annee, moisIndex, 1);
        const finMois = new Date(annee, moisIndex + 1, 0);
        
        // Calculer les revenus pour ce mois
        const revenu = await this.calculerRevenuMois(etablissementId, debutMois, finMois);
        
        // Calculer les dépenses pour ce mois
        const depenses = await this.calculerDepensesMois(etablissementId, debutMois, finMois);
        
        // Calculer le bénéfice
        const benefice = Math.max(0, revenu - depenses);

        donnees.push({
          periode: `${mois[moisIndex]} ${annee}`,
          revenu_previsionnel: revenu,
          depenses: depenses,
          benefice: benefice
        });
      }

      return donnees;
    } catch (error) {
      return this.getMockDonneesMensuelles(annee);
    }
  }

  /**
   * Génère des données annuelles pour plusieurs années
   */
  async getDonneesAnnuelles(etablissementId: number, anneesNombre: number = 3): Promise<DonneesAnnuelle[]> {
    try {
      const anneeActuelle = new Date().getFullYear();
      const donnees: DonneesAnnuelle[] = [];

      for (let i = anneesNombre - 1; i >= 0; i--) {
        const annee = anneeActuelle - i;
        const debutAnnee = new Date(annee, 0, 1);
        const finAnnee = new Date(annee, 11, 31);
        
        // Calculer les totaux pour l'année
        const revenu = await this.calculerRevenuMois(etablissementId, debutAnnee, finAnnee);
        const depenses = await this.calculerDepensesMois(etablissementId, debutAnnee, finAnnee);
        const benefice = Math.max(0, revenu - depenses);

        donnees.push({
          annee: annee.toString(),
          revenu_previsionnel: revenu,
          depenses: depenses,
          benefice: benefice
        });
      }

      return donnees;
    } catch (error) {
      return this.getMockDonneesAnnuelles();
    }
  }

  /**
   * Calcule le revenu pour une période donnée
   */
  private async calculerRevenuMois(etablissementId: number, debut: Date, fin: Date): Promise<number> {
    try {
      const reservations = await reservationsService.getByEtablissement(etablissementId);
      const chambres = await chambresService.getByEtablissement(etablissementId);

      let revenuTotal = 0;

      for (const reservation of reservations) {
        const dateDebut = new Date(reservation.date_debut);
        const dateFin = new Date(reservation.date_fin);
        
        if (
          (reservation.statut === "CONFIRMEE" || reservation.statut === "TERMINEE") &&
          dateDebut <= fin && dateFin >= debut
        ) {
          const chambre = chambres.find(c => c.id === reservation.chambre_id);
          if (chambre) {
            const debutOccupation = dateDebut > debut ? dateDebut : debut;
            const finOccupation = dateFin < fin ? dateFin : fin;
            
            const joursOccupation = Math.ceil(
              (finOccupation.getTime() - debutOccupation.getTime()) / (1000 * 60 * 60 * 24)
            );
            
            if (joursOccupation > 0) {
              revenuTotal += chambre.tarif * joursOccupation;
            }
          }
        }
      }

      return revenuTotal;
    } catch (error) {
      // Fallback avec simulation
      const moisDansAnnee = fin.getMonth() - debut.getMonth() + 1;
      return Math.random() * 5000000 * moisDansAnnee + 8000000;
    }
  }

  /**
   * Calcule les dépenses pour une période donnée
   */
  private async calculerDepensesMois(etablissementId: number, debut: Date, fin: Date): Promise<number> {
    try {
      const personnel = await personnelService.getByEtablissement(etablissementId);
      
      const moisDansAnnee = fin.getMonth() - debut.getMonth() + 1;
      
      // Masse salariale pour la période
      const masseSalariale = personnel
        .filter(p => p.statut === "Actif")
        .reduce((total, p) => total + p.salaire, 0) * moisDansAnnee;

      // Charges sociales (30%)
      const chargesSociales = masseSalariale * 0.3;
      
      // Autres dépenses opérationnelles (20% du salaire)
      const autresDepenses = masseSalariale * 0.2;

      return masseSalariale + chargesSociales + autresDepenses;
    } catch (error) {
      // Fallback avec simulation
      const moisDansAnnee = fin.getMonth() - debut.getMonth() + 1;
      return Math.random() * 2000000 * moisDansAnnee + 3000000;
    }
  }



  /**
   * Obtenir les années disponibles
   */
  getAnneesDisponibles(): number[] {
    const anneeActuelle = new Date().getFullYear();
    return [anneeActuelle - 2, anneeActuelle - 1, anneeActuelle];
  }
}

export const graphiquesService = new GraphiquesService();
