import React from "react";
import { PhoneCanvas } from "@/components/3D/PhoneCanvas";

const PresentationSection = () => {
  return (
    <div className="min-h-screen place-self-center w-full px-1/5 sm:px-0 md-p-x0 flex items-center justify-center">
      <div className="max-w-5xl mx-auto flex flex-row gap-8 justify-between py-12">
        {/* Section de gauche : Titre et Paragraphe */}
        <div className="flex flex-col justify-center text-center md:text-left">
          <h2 className="text-4xl font-bold mb-6">
            GHR Client : Votre Porte d&apos;Entrée vers des Expériences Uniques
          </h2>
          <p className="text-lg leading-relaxed">
            Découvrez une nouvelle manière de voyager avec l&apos;application
            GHR Client. Parcourez facilement les hôtels partenaires de GHR Inc.,
            trouvez l&apos;hébergement parfait pour votre prochain séjour et
            réservez en quelques clics. Plus besoin de multiples applications,
            GHR Client vous permet non seulement de faire des réservations, mais
            aussi de passer des commandes de services directement depuis votre
            téléphone, pour une expérience client fluide et sans tracas. Votre
            prochain voyage commence ici.
          </p>
        </div>

        {/* Section de droite : PhoneCanvas */}
        <div className="relative h-96 md:h-auto">
          <PhoneCanvas />
        </div>
      </div>
    </div>
  );
};
export default PresentationSection;
