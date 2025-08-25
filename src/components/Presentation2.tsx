import React from "react";
import { OrdiCanvas } from "@/components/OrdiCanvas";

const OrdiSection = () => {
  return (
    <div className="min-h-screen container place-self-center p-3xl flex items-center justify-center">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6 py-12">
        {/* Section de droite : PhoneCanvas */}
        <div className="relative h-96 md:h-auto">
          <OrdiCanvas />
        </div>
        <div className="flex flex-col justify-center text-center md:text-left">
          <h2 className="text-4xl font-bold mb-6">
            GHR Admin : Le Cœur de Votre Gestion Hôtelière
          </h2>
          <p className="text-lg leading-relaxed">
            Centralisez la gestion de votre personnel, le suivi des activités et
            l&apos;administration de votre établissement avec le module GHR Admin.
            Conçu pour les gestionnaires, il vous offre une vue d&apos;ensemble
            complète et vous permet de contrôler les réservations, les
            disponibilités des chambres et les tâches quotidiennes. Gagnez en
            efficacité et en contrôle, le tout depuis une interface unique,
            puissante et accessible.
          </p>
        </div>
      </div>
    </div>
  );
};
export default OrdiSection;
