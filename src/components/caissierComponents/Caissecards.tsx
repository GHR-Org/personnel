import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IconTrendingDown,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IconTrendingUp,
  IconCash, // Icône pour l'encaissement/décaissement
  IconReceipt, // Icône pour les factures
  IconCreditCard, // Icône pour les paiements par carte
  IconWallet // Une autre option pour le cash
} from "@tabler/icons-react"
import { MetricCard } from "@/components/Metricard";

export function SectionCards() {
  const cardData = [
    {
      title: "Encaissement du jour",
      value: "Ar 985,000", // Exemple de montant encaissé
      percentage: "+12.5%",
      isTrendingUp: true,
      footerText: "Augmentation par rapport à hier",
      footerDescription: "Total des fonds reçus aujourd'hui",
      icon: IconCash, // Icône de billets de banque pour l'encaissement
      // Couleur pour l'encaissement : par exemple, un vert moderne
      accentColor: "text-green-500 dark:text-green-400 bg-green-500/10 dark:bg-green-400/10",
      // Ou si vous utilisez vos variables CSS directement (pour le texte de l'icône, etc.)
      // accentColor: "text-[hsl(var(--chart-1))] bg-[hsl(var(--chart-1))/10]",
    },
    {
      title: "Décaissement du jour",
      value: "Ar 120,000", // Exemple de montant décaissé
      percentage: "-5.0%",
      isTrendingUp: false, // La baisse du décaissement est souvent positive
      footerText: "Diminution par rapport à hier",
      footerDescription: "Total des fonds dépensés aujourd'hui",
      icon: IconWallet, // Icône de portefeuille pour le décaissement
      // Couleur pour le décaissement : par exemple, un rouge ou orange discret
      accentColor: "text-red-500 dark:text-red-400 bg-red-500/10 dark:bg-red-400/10",
      // accentColor: "text-[hsl(var(--chart-2))] bg-[hsl(var(--chart-2))/10]",
    },
    {
      title: "Factures générées",
      value: "75",
      percentage: "+8%",
      isTrendingUp: true,
      footerText: "Plus de factures que la veille",
      footerDescription: "Nombre total de factures émises",
      icon: IconReceipt, // Icône de facture
      // Couleur pour les factures : par exemple, un bleu
      accentColor: "text-blue-500 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-400/10",
      // accentColor: "text-[hsl(var(--chart-3))] bg-[hsl(var(--chart-3))/10]",
    },
    {
      title: "Paiements par carte",
      value: "45",
      percentage: "+15%",
      isTrendingUp: true,
      footerText: "Augmentation des transactions par carte",
      footerDescription: "Nombre de paiements effectués via carte bancaire",
      icon: IconCreditCard, // Icône de carte bancaire
      // Couleur pour les paiements par carte : par exemple, un violet
      accentColor: "text-purple-500 dark:text-purple-400 bg-purple-500/10 dark:bg-purple-400/10",
      // accentColor: "text-[hsl(var(--chart-4))] bg-[hsl(var(--chart-4))/10]",
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
          // Passer la couleur d'accent à Metricard
          cardClasses={data.accentColor}
        />
      ))}
    </div>
  );
}