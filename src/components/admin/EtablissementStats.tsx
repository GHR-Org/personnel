"use client"

import React from "react"
import { Building, TrendingUp, Users, Bed, MapPin } from "lucide-react"
import { StatisticsCard } from "@/components/admin/statistics-card"
import { Etablissement } from "@/types/etablissement"

interface EtablissementStatsProps {
  etablissements: Etablissement[]
}

export function EtablissementStats({ etablissements }: EtablissementStatsProps) {
  // Calculer les statistiques
  const stats = {
    total: etablissements.length,
    hotels: etablissements.filter(e => e.type_ === "Hotelerie").length,
    restaurants: etablissements.filter(e => e.type_ === "Restauration").length,
    hotelRestaurants: etablissements.filter(e => e.type_ === "Hotelerie et Restauration").length,
    actifs: etablissements.filter(e => e.statut === "Activer").length,
    totalChambres: etablissements.reduce((sum, e) => sum + (e.nb_chambres || 0), 0),
    totalClients: etablissements.reduce((sum, e) => sum + (e.nb_clients || 0), 0),
    tauxOccupationMoyen: etablissements.length > 0 
      ? etablissements.reduce((sum, e) => sum + (e.taux_occupation || 0), 0) / etablissements.length 
      : 0,
    // Statistiques géographiques
    villesUniques: new Set(etablissements.map(e => e.ville)).size,
    paysUniques: new Set(etablissements.map(e => e.pays)).size,
    // Établissements récents (30 derniers jours)
    recents30Jours: etablissements.filter(e => {
      const dateCreation = new Date(e.created_at)
      const date30Jours = new Date()
      date30Jours.setDate(date30Jours.getDate() - 30)
      return dateCreation >= date30Jours
    }).length
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <StatisticsCard
        title="Total Établissements"
        value={stats.total}
        subtitle="Tous types confondus"
        icon={<Building className="h-5 w-5 text-black dark:text-white" />}
      />
      <StatisticsCard
        title="Hôtels"
        value={stats.hotels}
        subtitle="Établissements hôteliers"
        icon={<Building className="h-5 w-5 text-black dark:text-white" />}
      />
      <StatisticsCard
        title="Restaurants"
        value={stats.restaurants}
        subtitle="Établissements de restauration"
        icon={<Building className="h-5 w-5 text-black dark:text-white" />}
      />
      <StatisticsCard
        title="Hôtels-Restaurants"
        value={stats.hotelRestaurants}
        subtitle="Établissements mixtes"
        icon={<Building className="h-5 w-5 text-black dark:text-white" />}
      />
      <StatisticsCard
        title="Établissements Actifs"
        value={stats.actifs}
        subtitle={`${((stats.actifs / (stats.total || 1)) * 100).toFixed(1)}% du total`}
        icon={<TrendingUp className="h-5 w-5 text-black dark:text-white" />}
      />
      
      {/* Statistiques supplémentaires pour les écrans plus larges */}
      <div className="hidden xl:block">
        <StatisticsCard
          title="Total Chambres"
          value={stats.totalChambres}
          subtitle="Dans tous les hôtels"
          icon={<Bed className="h-5 w-5 text-black dark:text-white" />}
        />
      </div>
      <div className="hidden xl:block">
        <StatisticsCard
          title="Total Clients"
          value={stats.totalClients}
          subtitle="Tous établissements confondus"
          icon={<Users className="h-5 w-5 text-black dark:text-white" />}
        />
      </div>
      <div className="hidden xl:block">
        <StatisticsCard
          title="Taux d'Occupation"
          value={`${stats.tauxOccupationMoyen.toFixed(1)}%`}
          subtitle="Moyenne générale"
          icon={<TrendingUp className="h-5 w-5 text-black dark:text-white" />}
        />
      </div>
      <div className="hidden xl:block">
        <StatisticsCard
          title="Villes Couvertes"
          value={stats.villesUniques}
          subtitle="Répartition géographique"
          icon={<MapPin className="h-5 w-5 text-black dark:text-white" />}
        />
      </div>
      <div className="hidden xl:block">
        <StatisticsCard
          title="Nouveaux (30j)"
          value={stats.recents30Jours}
          subtitle="Établissements récents"
          icon={<TrendingUp className="h-5 w-5 text-black dark:text-white" />}
        />
      </div>
    </div>
  )
} 