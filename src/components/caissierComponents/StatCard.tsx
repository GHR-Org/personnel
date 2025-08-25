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
      // Utilisation des variables CSS pour des couleurs modernes et cohérentes avec shadcn/ui/chart
      // Ces couleurs doivent être définies dans votre globals.css avec hsl(var(--chart-X))
      accentColor: "text-[hsl(var(--chart-1))] bg-[hsl(var(--chart-1))/10]", // Vert
    },
    {
      title: "Décaissement du jour",
      value: "Ar 120,000", // Exemple de montant décaissé
      percentage: "-5.0%",
      isTrendingUp: false, // La baisse du décaissement est souvent positive
      footerText: "Diminution par rapport à hier",
      footerDescription: "Total des fonds dépensés aujourd'hui",
      icon: IconWallet, // Icône de portefeuille pour le décaissement
      accentColor: "text-[hsl(var(--chart-5))] bg-[hsl(var(--chart-5))/10]", // Rouge/Orange
    },
    {
      title: "Factures générées",
      value: "75",
      percentage: "+8%",
      isTrendingUp: true,
      footerText: "Plus de factures que la veille",
      footerDescription: "Nombre total de factures émises",
      icon: IconReceipt, // Icône de facture
      accentColor: "text-[hsl(var(--chart-3))] bg-[hsl(var(--chart-3))/10]", // Bleu
    },
    {
      title: "Paiements par carte",
      value: "45",
      percentage: "+15%",
      isTrendingUp: true,
      footerText: "Augmentation des transactions par carte",
      footerDescription: "Nombre de paiements effectués via carte bancaire",
      icon: IconCreditCard, // Icône de carte bancaire
      accentColor: "text-[hsl(var(--chart-4))] bg-[hsl(var(--chart-4))/10]", // Violet
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
          // Ici, on passe la chaîne de classes directement à cardClasses
          cardClasses={data.accentColor}
          // Si votre MetricCard utilise iconColorClass séparément pour l'icône, passez-la aussi
          iconColorClass={data.accentColor.includes("text-") ? data.accentColor.split(" ")[0] : ""} // Extrait juste la classe text- pour l'icône si nécessaire
        />
      ))}
    </div>
  );
}