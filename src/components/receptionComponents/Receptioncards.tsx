import {
  IconTrendingDown,
  IconTrendingUp,
  IconCalendarEvent, // Icône pour les événements/réservations
  IconDoorEnter, // Icône pour les arrivées
  IconDoorExit, // Icône pour les départs
  IconHotelService // Icône pour l'occupation ou les services
} from "@tabler/icons-react";
import { MetricCard } from "@/components/Metricard";

export function SectionCards() {
  const cardData = [
    {
      title: "Réservations totales",
      value: "1,520",
      percentage: "+7.2%",
      isTrendingUp: true,
      footerText: "Augmentation ce mois-ci",
      footerDescription: "Nombre total de réservations actives",
      icon: IconCalendarEvent,
      iconColorClass: "text-blue-500", // Couleur de l'icône
      // Nouvelles classes pour la carte elle-même
      cardClasses: "bg-gradient-to-t from-blue-50/50 to-white dark:from-blue-950/20 dark:to-background shadow-blue-500/10",
    },
    {
      title: "Arrivées du jour",
      value: "25",
      percentage: "+3",
      isTrendingUp: true,
      footerText: "Nouveaux clients attendus",
      footerDescription: "Total des arrivées prévues aujourd'hui",
      icon: IconDoorEnter,
      iconColorClass: "text-green-500", // Couleur de l'icône
      cardClasses: "bg-gradient-to-t from-green-50/50 to-white dark:from-green-950/20 dark:to-background shadow-green-500/10",
    },
    {
      title: "Départs du jour",
      value: "18",
      percentage: "-2",
      isTrendingUp: false,
      footerText: "Chambres libérées",
      footerDescription: "Total des départs prévus aujourd'hui",
      icon: IconDoorExit,
      iconColorClass: "text-red-500", // Couleur de l'icône
      cardClasses: "bg-gradient-to-t from-red-50/50 to-white dark:from-red-950/20 dark:to-background shadow-red-500/10",
    },
    {
      title: "Taux d'occupation",
      value: "85%",
      percentage: "+4.0%",
      isTrendingUp: true,
      footerText: "Taux d'occupation actuel",
      footerDescription: "Occupation moyenne sur la semaine",
      icon: IconHotelService,
      iconColorClass: "text-purple-500", // Couleur de l'icône
      cardClasses: "bg-gradient-to-t from-purple-50/50 to-white dark:from-purple-950/20 dark:to-background shadow-purple-500/10",
    },
  ];

  return (
    // Suppression des classes génériques de dégradé et d'ombre du div parent
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
          iconColorClass={data.iconColorClass}
          cardClasses={data.cardClasses} 
        />
      ))}
    </div>
  );
}