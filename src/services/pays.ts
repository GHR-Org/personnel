// ============================================================================
// SERVICE PAYS - Gestion des pays
// ============================================================================

import { normalizeCountryName, countryNameMapping } from "@/utils/countryUtils";

export interface Country {
  code: string;
  name: string;
  displayName: string;
}

class PaysService {
  private countries: Country[] = [];
  private loaded = false;

  // Liste des pays les plus courants pour Madagascar et région
  private defaultCountries: Country[] = [
    { code: "MG", name: "Madagascar", displayName: "Madagascar" },
    { code: "FR", name: "France", displayName: "France" },
    { code: "MU", name: "Mauritius", displayName: "Maurice" },
    { code: "RE", name: "Réunion", displayName: "Réunion" },
    { code: "KM", name: "Comoros", displayName: "Comores" },
    { code: "SC", name: "Seychelles", displayName: "Seychelles" },
    { code: "ZA", name: "South Africa", displayName: "Afrique du Sud" },
    { code: "US", name: "United States", displayName: "États-Unis" },
    { code: "GB", name: "United Kingdom", displayName: "Royaume-Uni" },
    { code: "DE", name: "Germany", displayName: "Allemagne" },
    { code: "IT", name: "Italy", displayName: "Italie" },
    { code: "ES", name: "Spain", displayName: "Espagne" },
    { code: "CA", name: "Canada", displayName: "Canada" },
    { code: "AU", name: "Australia", displayName: "Australie" },
    { code: "JP", name: "Japan", displayName: "Japon" },
    { code: "CN", name: "China", displayName: "Chine" },
    { code: "IN", name: "India", displayName: "Inde" },
    { code: "BR", name: "Brazil", displayName: "Brésil" },
    { code: "AR", name: "Argentina", displayName: "Argentine" },
    { code: "EG", name: "Egypt", displayName: "Égypte" },
    { code: "MA", name: "Morocco", displayName: "Maroc" },
    { code: "TN", name: "Tunisia", displayName: "Tunisie" },
    { code: "DZ", name: "Algeria", displayName: "Algérie" },
    { code: "SN", name: "Senegal", displayName: "Sénégal" },
    { code: "CI", name: "Côte d'Ivoire", displayName: "Côte d'Ivoire" },
    { code: "GH", name: "Ghana", displayName: "Ghana" },
    { code: "NG", name: "Nigeria", displayName: "Nigeria" },
    { code: "KE", name: "Kenya", displayName: "Kenya" },
    { code: "TZ", name: "Tanzania", displayName: "Tanzanie" },
    { code: "UG", name: "Uganda", displayName: "Ouganda" },
    { code: "RW", name: "Rwanda", displayName: "Rwanda" },
    { code: "ET", name: "Ethiopia", displayName: "Éthiopie" },
  ];

  // Charger les pays depuis l'API GeoJSON
  async loadCountries(): Promise<Country[]> {
    if (this.loaded && this.countries.length > 0) {
      return this.countries;
    }

    try {
      const response = await fetch('https://unpkg.com/world-atlas@2/countries-110m.json');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des pays');
      }

      const geoData = await response.json();
      const geoCountries = geoData.objects.countries.geometries.map((geo: any) => ({
        code: geo.id || geo.properties.iso_a2 || '',
        name: geo.properties.name || '',
        displayName: countryNameMapping[geo.properties.name] || geo.properties.name || ''
      }));

      // Combiner avec les pays par défaut et supprimer les doublons
      const allCountries = [...this.defaultCountries];
      
      geoCountries.forEach((geoCountry: Country) => {
        if (geoCountry.name && !allCountries.some(c => 
          normalizeCountryName(c.name) === normalizeCountryName(geoCountry.name)
        )) {
          allCountries.push(geoCountry);
        }
      });

      // Trier par nom d'affichage
      this.countries = allCountries
        .filter(country => country.name && country.displayName)
        .sort((a, b) => a.displayName.localeCompare(b.displayName, 'fr'));

      this.loaded = true;
      return this.countries;
    } catch (error) {
      console.error('Erreur lors du chargement des pays:', error);
      // En cas d'erreur, retourner les pays par défaut
      this.countries = this.defaultCountries;
      this.loaded = true;
      return this.countries;
    }
  }

  // Obtenir la liste des pays (avec cache)
  async getCountries(): Promise<Country[]> {
    return await this.loadCountries();
  }

  // Obtenir les noms des pays pour les selects
  async getCountryNames(): Promise<string[]> {
    const countries = await this.getCountries();
    return countries.map(country => country.displayName);
  }

  // Rechercher un pays par nom
  async findCountryByName(name: string): Promise<Country | null> {
    const countries = await this.getCountries();
    const normalizedName = normalizeCountryName(name);
    
    return countries.find(country => 
      normalizeCountryName(country.name) === normalizedName ||
      normalizeCountryName(country.displayName) === normalizedName
    ) || null;
  }

  // Obtenir les pays les plus populaires (pour affichage prioritaire)
  async getPopularCountries(): Promise<Country[]> {
    const countries = await this.getCountries();
    const popularNames = [
      'Madagascar', 'France', 'Maurice', 'Réunion', 'Comores', 'Seychelles',
      'Afrique du Sud', 'États-Unis', 'Royaume-Uni', 'Allemagne', 'Italie', 'Espagne'
    ];
    
    return countries.filter(country => 
      popularNames.some(popular => 
        normalizeCountryName(country.displayName) === normalizeCountryName(popular)
      )
    );
  }
}

// Instance singleton
export const paysService = new PaysService();

// Hook pour utiliser les pays dans les composants React
export function useCountries() {
  const [countries, setCountries] = React.useState<Country[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoading(true);
        const countriesList = await paysService.getCountries();
        setCountries(countriesList);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des pays');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  return { countries, loading, error };
}

// Import React pour le hook
import React from 'react';
