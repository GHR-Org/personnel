// src/components/ui/StarRatingDisplay.tsx
import React from 'react';
import { Star } from 'lucide-react'; // Assurez-vous d'avoir lucide-react installé

interface StarRatingDisplayProps {
  rating?: number; // La note, optionnelle, de 0 à 5
  maxStars?: number; // Nombre total d'étoiles à afficher (par défaut 5)
  size?: number; // Taille des icônes d'étoiles (par défaut 16)
  className?: string; // Classes Tailwind CSS additionnelles
}

const StarRatingDisplay: React.FC<StarRatingDisplayProps> = ({
  rating = 0,
  maxStars = 5,
  size = 16,
  className = '',
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5; // Vrai si la partie décimale est >= 0.5

  return (
    <div className={`flex items-center ${className}`}>
      {Array.from({ length: maxStars }).map((_, index) => {
        if (index < fullStars) {
          // Étoile pleine
          return <Star key={index} fill="currentColor" strokeWidth={0} size={size} className="text-yellow-400" />;
        } else if (index === fullStars && hasHalfStar) {
          // Étoile à moitié pleine (si Lucide supporte)
          // Lucide n'a pas d'icône "star-half" par défaut, donc nous allons simuler avec une étoile pleine et une vide.
          // Pour une vraie demi-étoile, vous auriez besoin d'une icône spécifique ou d'une approche CSS plus complexe.
          // Pour l'instant, on se contente de considérer la demi-étoile comme une étoile pleine pour la clarté.
          // Ou on pourrait afficher une étoile vide pour la partie non remplie après l'arrondi.
          // Simplifions en affichant une étoile pleine si >= 0.5 pour l'esthétique générale ou ajuster le visuel.
          // Pour une représentation plus précise, on pourrait utiliser un gradient CSS ou SVG.
          // Ici, je vais simplifier : si c'est >= 0.5, on affiche une étoile pleine, sinon vide.
          // Alternativement, pour être plus précis avec les demies:
          // Pour l'instant, on n'affichera que des étoiles pleines ou vides
          // (les bibliothèques d'icônes n'ont pas toujours de "star-half").
          // Pour une vraie demi-étoile, il faudrait un SVG ou un composant plus avancé.
          // Pour simplifier et ne pas complexifier ici, si rating est 3.5, on affichera 4 étoiles pleines, par exemple.
          // Si vous voulez être strict, on afficherait 3 pleines et 2 vides.
          // On peut arrondir intelligemment pour l'affichage visuel simple :
          const roundedRating = Math.round(rating);
          if (index < roundedRating) {
            return <Star key={index} fill="currentColor" strokeWidth={0} size={size} className="text-yellow-400" />;
          } else {
            return <Star key={index} size={size} className="text-gray-300" />; // Étoile vide
          }
        } else {
          // Étoile vide
          return <Star key={index} size={size} className="text-gray-300" />;
        }
      })}
    </div>
  );
};

export default StarRatingDisplay;