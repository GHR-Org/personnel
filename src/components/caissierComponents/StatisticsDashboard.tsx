// components/caissierComponents/StatisticsDashboard.tsx
"use client";

import * as React from "react";
import { useMemo } from "react";
import { mockInvoices } from "@/lib/mock-invoices"; // Vos données mockées
import { InvoiceFormData } from "@/schemas/invoice";
import { MetricCard } from "@/components/Metricard"; // <-- Gardez cet import
import { RevenueChart } from "./RevenueChart";
import { PaidInvoicesCircleChart } from "./PaidInvoicesCircleChart";
import {
  IconReceipt2,
  IconCashBanknote,
  IconCalculator,
  IconChecklist,
} from "@tabler/icons-react";
import { ChartAreaInteractive } from "../receptionComponents/chart-area-interactive";

interface DailyRevenue {
  date: string;
  revenue: number;
}

export function StatisticsDashboard() {
  const invoices: InvoiceFormData[] = mockInvoices;

  const stats = useMemo(() => {
    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter(inv => inv.paymentStatus === "Payée");
    const totalPaidInvoices = paidInvoices.length;

    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalTaxCollected = paidInvoices.reduce((sum, inv) => sum + inv.taxAmount, 0);

    const revenueByDayMap = new Map<string, number>();
    paidInvoices.forEach(inv => {
      const date = inv.dateIssued;
      const currentRevenue = revenueByDayMap.get(date) || 0;
      revenueByDayMap.set(date, currentRevenue + inv.totalAmount);
    });

    const dailyRevenueData: DailyRevenue[] = Array.from(revenueByDayMap.entries())
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      totalInvoices,
      totalPaidInvoices,
      totalRevenue,
      totalTaxCollected,
      dailyRevenueData,
    };
  }, [invoices]);

  // Définir les données pour les MetricCards avec les mêmes conventions de couleur que SectionCards
  const metricCardData = [
    {
      title: "Total Factures",
      value: stats.totalInvoices.toString(),
      description: "Nombre total de factures enregistrées.",
      icon: IconReceipt2,
      // Utilisation des couleurs directes comme dans votre SectionCards
      accentColor: "text-blue-500 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-400/10",
    },
    {
      title: "Factures Payées",
      value: stats.totalPaidInvoices.toString(),
      description: "Nombre de factures dont le paiement est complet.",
      icon: IconChecklist,
      accentColor: "text-green-500 dark:text-green-400 bg-green-500/10 dark:bg-green-400/10",
    },
    {
      title: "Revenus Totaux",
      value: stats.totalRevenue.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' }),
      description: "Revenus générés par les factures payées.",
      icon: IconCashBanknote,
      accentColor: "text-yellow-500 dark:text-yellow-400 bg-yellow-500/10 dark:bg-yellow-400/10", // Jaune/Orange pour le revenu
    },
    {
      title: "Taxes Collectées",
      value: stats.totalTaxCollected.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' }),
      description: "Montant total des taxes collectées sur les factures payées.",
      icon: IconCalculator,
      accentColor: "text-purple-500 dark:text-purple-400 bg-purple-500/10 dark:bg-purple-400/10",
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Statistiques</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricCardData.map((data, index) => (
          <MetricCard
            key={index}
            title={data.title}
            value={data.value}
            // Ces props sont requises par MetricCard mais peuvent être neutres ici
            percentage="0%" // Pas de pourcentage de tendance pour ces stats
            isTrendingUp={true} // Valeur par défaut, n'a pas d'impact si le pourcentage est "0%"
            footerText={data.description} // La description est utilisée comme texte de pied de page
            footerDescription="" // Pas de description de pied de page supplémentaire
            icon={data.icon}
            // Passez les classes de couleur directement via cardClasses
            cardClasses={data.accentColor}
            // Si MetricCard a une prop iconColorClass séparée pour l'icône, elle peut être extraite ainsi:
            iconColorClass={data.accentColor.includes("text-") ? data.accentColor.split(" ")[0] : ""}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
        <div className="col-span-1 md:col-span-4">
          <RevenueChart data={stats.dailyRevenueData} />
        </div>
        <div className="col-span-1 md:col-span-3">
          <PaidInvoicesCircleChart
            totalInvoices={stats.totalInvoices}
            totalPaidInvoices={stats.totalPaidInvoices}
          />
        </div>
      </div>
      {/* Section pour le graphique interactif */}
              <section>
                <div className="mb-6 px-4 lg:px-6">
                  <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
                    Analyse des Tendances
                  </h2>
                  <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                    Explorez les évolutions et les schémas de vos données à travers une visualisation interactive.
                  </p>
                </div>
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>
              </section>
      
    </div>
  );
}