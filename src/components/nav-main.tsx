// components/nav-main.tsx (Exemple adapté)
import * as React from "react"
import Link from "next/link" // Assurez-vous d'utiliser votre composant Link approprié
import type { IconProps } from "@tabler/icons-react"

// Définition du type pour un élément de navigation TRANSFORMÉ
interface TransformedNavItem {
  name: string; // Ou title, selon ce que vous choisissez d'utiliser pour l'affichage
  url: string;
  icon?: React.ComponentType<IconProps>; // L'icône est maintenant un composant
  items?: TransformedNavItem[]; // Pour les sous-éléments
  isActive?: boolean; // Si vous utilisez cette prop
  // ... d'autres props si elles sont pertinentes pour votre navigation
}

// Définition des props pour NavMain
interface NavMainProps {
  items: TransformedNavItem[];
  className?: string; // Pour d'éventuelles classes CSS
}

export function NavMain({ items, className }: NavMainProps) {
  return (
    <nav className={className}>
      <ul className="space-y-1">
        {items.map((item) => {
          const IconComponent = item.icon; // L'icône est déjà le composant

          return (
            <li key={item.url + item.name}> {/* Utilisation d'une clé plus robuste */}
              <Link
                href={item.url}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted"
                // Ajoutez ici des classes pour l'état actif si nécessaire
              >
                {IconComponent && <IconComponent className="size-5" />}
                <span>{item.name}</span> {/* Afficher 'name' */}
              </Link>
              {/* Si vous avez des sous-menus, vous les rendriez ici, potentiellement en utilisant le même composant de manière récursive ou un autre composant */}
              {item.items && item.items.length > 0 && (
                <ul className="ml-4 mt-1 space-y-1">
                  {item.items.map(subItem => (
                    <li key={subItem.url + subItem.name}>
                      <Link href={subItem.url} className="flex items-center space-x-2 p-1.5 rounded-md text-sm hover:bg-muted">
                        {subItem.icon && <subItem.icon className="size-4" />}
                        <span>{subItem.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
