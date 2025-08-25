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
       accentColor: "text-green-500 dark:text-green-400 bg-green-500/10 dark:bg-green-400/10",
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
      accentColor: "text-purple-500 dark:text-purple-400 bg-purple-500/10 dark:bg-purple-400/10",
    },
    {
      title: "Départs du jour",
      value: "18",
      percentage: "-2",
      isTrendingUp: false, // Une baisse des départs peut être neutre ou positive selon le contexte (plus longue durée de séjour)
      footerText: "Chambres libérées",
      footerDescription: "Total des départs prévus aujourd'hui",
      icon: IconDoorExit,
      iconColorClass: "text-red-500", // Couleur de l'icône
      accentColor: "text-red-500 dark:text-red-400 bg-red-500/10 dark:bg-red-400/10",
    },
    {
      title: "Taux d'occupation",
      value: "85%",
      percentage: "+4.0%",
      isTrendingUp: true,
      footerText: "Taux d'occupation actuel",
      footerDescription: "Occupation moyenne sur la semaine",
      icon: IconHotelService,
      accentColor: "text-blue-500 bg-gradient-to-b from-blue-500/10 to-blue-400/10 dark:bg-gradient-to-b from-blue-500/10 to-blue-400/10",
      // Couleur de l'icône
      
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
          iconColorClass={data.iconColorClass} 
          cardClasses={data.accentColor} // Passer la couleur d'accent à MetricCard
          />
      ))}
    </div>
  );
}