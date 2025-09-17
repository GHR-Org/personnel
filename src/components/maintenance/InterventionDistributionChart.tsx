"use client";

import { useAppStore, Intervention } from "@/lib/stores/maintenance_store"; // Assurez-vous d'importer le type Intervention
import { useMemo, useState } from "react"; // <-- NOUVEAU : Import de useState
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { InterventionModal } from "./InterventionModal"; // <-- NOUVEAU : Import du modal

// Définition des couleurs pour chaque statut d'intervention
const COLORS = {
  "Planifiée": "#8884d8", // Bleu violet
  "En cours": "#ffc658", // Jaune orangé
  "Terminée": "#82ca9d", // Vert
  "Annulée": "#ff7300", // Orange foncé
};

// Interface pour les données du graphique
interface ChartData {
  name: string;
  value: number;
}

export const InterventionDistributionChart = () => {
  // On récupère les interventions depuis le store
  const { interventions } = useAppStore();

  // NOUVEAU : États pour le modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [filteredInterventions, setFilteredInterventions] = useState<
    Intervention[]
  >([]);

  // On utilise useMemo pour optimiser
  const chartData = useMemo(() => {
    const statusCounts = {
      "Planifiée": 0,
      "En cours": 0,
      "Terminée": 0,
      "Annulée": 0,
    };
    interventions.forEach((intervention) => {
      if (intervention.status in statusCounts) {
        statusCounts[intervention.status as keyof typeof statusCounts]++;
      }
    });
    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [interventions]);

  // NOUVEAU : Fonction de gestion du clic sur une part
  const handleSegmentClick = (data: ChartData) => {
    if (data.value === 0) {
        return; // Ne rien faire si le segment est vide
    }
    setSelectedStatus(data.name);
    const filteredList = interventions.filter(
      (i) => i.status === data.name
    );
    setFilteredInterventions(filteredList);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedStatus(null);
    setFilteredInterventions([]);
  };

  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label={(entry) => `${entry.name} (${entry.value})`}
            onClick={(data) => handleSegmentClick(data as ChartData)} // <-- NOUVEAU : Le gestionnaire de clic
            style={{ cursor: "pointer" }} // <-- Ajoute un curseur cliquable
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.name as keyof typeof COLORS]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      {/* NOUVEAU : Affichage conditionnel du modal */}
      <InterventionModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        status={selectedStatus}
        interventions={filteredInterventions}
      />
    </>
  );
};