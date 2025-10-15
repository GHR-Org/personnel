import {
  IconCash, 
  IconReceipt, 
  IconCreditCard, 
  IconWallet 
} from "@tabler/icons-react"
import { MetricCard } from "@/components/Metricard";
import * as React from "react"; // Nécessaire si on définit le type localement

// 🎯 Le même type que dans MetricCard.tsx pour garantir la cohérence
type IconType = React.ComponentType<any>; 

interface CardData {
  title: string;
  value: string;
  percentage: string;
  isTrendingUp: boolean;
  footerText: string;
  footerDescription: string;
  icon: IconType; // Type simplifié
  accentColor: string; 
}

export function SectionCards() {
  // 💡 Assigner le tableau au type CardData[] pour vérifier la conformité
  const cardData: CardData[] = [ 
    {
      title: "Encaissement du jour",
      value: "Ar 985,000",
      percentage: "+12.5%",
      isTrendingUp: true,
      footerText: "Augmentation par rapport à hier",
      footerDescription: "Total des fonds reçus aujourd'hui",
      icon: IconCash,
      accentColor: "text-green-500 dark:text-green-400 bg-green-500/10 dark:bg-green-400/10",
    },
    {
      title: "Décaissement du jour",
      value: "Ar 120,000",
      percentage: "-5.0%",
      isTrendingUp: false,
      footerText: "Diminution par rapport à hier",
      footerDescription: "Total des fonds dépensés aujourd'hui",
      icon: IconWallet,
      accentColor: "text-red-500 dark:text-red-400 bg-red-500/10 dark:bg-red-400/10",
    },
    {
      title: "Factures générées",
      value: "75",
      percentage: "+8%",
      isTrendingUp: true,
      footerText: "Plus de factures que la veille",
      footerDescription: "Nombre total de factures émises",
      icon: IconReceipt,
      accentColor: "text-blue-500 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-400/10",
    },
    {
      title: "Paiements par carte",
      value: "45",
      percentage: "+15%",
      isTrendingUp: true,
      footerText: "Augmentation des transactions par carte",
      footerDescription: "Nombre de paiements effectués via carte bancaire",
      icon: IconCreditCard,
      accentColor: "text-purple-500 dark:text-purple-400 bg-purple-500/10 dark:bg-purple-400/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cardData.map((data, index) => (
        <MetricCard
          key={index}
          title={data.title}
          value={data.value}
          percentage={data.percentage}
          isTrendingUp={data.isTrendingUp}
          footerText={data.footerText}
          footerDescription={data.footerDescription}
          icon={data.icon}
          // On passe l'accentColor à cardClasses (ou à iconColorClass si la prop est renommée dans MetricCard.tsx)
          cardClasses={data.accentColor}
        />
      ))}
    </div>
  );
}