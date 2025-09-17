/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/votre-dossier/RestaurantDashboard.tsx
"use client"

import { OrderTracker } from "@/components/manager-restaurant/OrderTracker";
import { OrderCardStats } from "@/components/manager-restaurant/OrderCardStats";
import { MobileOrderTracker } from "@/components/manager-restaurant/MobileOrderTracker";

// Données de commandes factices
const data = [
  { statut: "en cours" },
  { statut: "livrée" },
  { statut: "En cours" },
  { statut: "payée" },
  { statut: "acceptée" },
  { statut: "refusée" },
  { statut: "livrée" },
  { statut: "payée" },
];

const getStatusCounts = (orders: any[]) => {
  return orders.reduce((acc: { [x: string]: any; }, order: { statut: string | number; }) => {
    acc[order.statut] = (acc[order.statut] || 0) + 1;
    return acc;
  }, {});
};

export default function CommandePage() {
  const statusCounts = getStatusCounts(data);
  const totalOrders = data.length;

  return (
    <section className="mt-14 w-full h-screen max-w-7xl mx-auto">
      <main className="space-y-8 w-full">
        
        {/* Section des cartes de statistiques */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <OrderCardStats
            title="Total des commandes"
            count={totalOrders}
            badgeText="Total"
            badgeVariant="default"
            change={2.5} // Exemple de changement
          />
          <OrderCardStats
            title="Commandes en cours"
            count={statusCounts["en cours"] || 0}
            badgeText="En cours"
            badgeVariant="secondary"
            change={2.5}
          />
          <OrderCardStats
            title="Commandes livrées"
            count={statusCounts["livrée"] || 0}
            badgeText="Livrée"
            badgeVariant="success"
            change={0}
          />
          <OrderCardStats
            title="Commandes refusées"
            count={statusCounts["refusée"] || 0}
            badgeText="Refusée"
            badgeVariant="destructive"
            change={-1.2}
          />
        </div>

        {/* Section du tableau des commandes */}
        <div className="bg-card text-card-foreground border rounded-xl shadow-lg p-6 col-span-full">
          <h2 className="text-xl font-bold">Commandes via les chambres</h2>
          <OrderTracker />
        </div>
        {/* Section du tableau des commandes */}
        <div className="bg-card text-card-foreground border rounded-xl shadow-lg p-6 col-span-full">
          <h2 className="text-xl font-bold">Commandes via en ligne</h2>
          <MobileOrderTracker />
        </div>
        
      </main>
    </section>
  );
}