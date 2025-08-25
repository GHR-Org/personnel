// admin/page.tsx (ou la page spécifique où vous voulez ce contenu)
import { ChartAreaInteractive } from "@/components/receptionComponents/chart-area-interactive"
import { DataTable } from "@/components/receptionComponents/data-table"
import { SectionCards } from "@/components/section-cards"

// Importez les données spécifiques à cette page
import data from "./data.json" // Assurez-vous que le chemin est correct

export default function Page() { // Renommé 'DashboardPage' pour plus de clarté
  return (
    <>
      <div className="@container/main flex flex-1 flex-col gap-8 py-4 md:gap-10 md:py-6"> {/* Augmente le gap pour l'espacement des sections */}

        {/* Section pour les cartes de résumé de direction */}
        <section>
          <div className="mb-6 px-4 lg:px-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
              Tableau de Bord Exécutif
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Obtenez un aperçu stratégique des indicateurs clés et des performances globales de l&apos;entreprise.
            </p>
          </div>
          <div className="px-4 lg:px-6"> {/* Conserve le padding du composant */}
            <SectionCards /> {/* Supposons que SectionCards affiche des métriques de haut niveau ici */}
          </div>
        </section>

        {/* Section pour le graphique interactif de direction */}
        <section>
          <div className="mb-6 px-4 lg:px-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
              Analyse des Tendances et Projections
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Évaluez les tendances à long terme et les projections financières pour des décisions éclairées.
            </p>
          </div>
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive /> {/* Supposons que ChartAreaInteractive affiche des analyses de performances financières ou opérationnelles ici */}
          </div>
        </section>

        {/* Section pour le tableau de données détaillé de direction */}
        <section>
          <div className="mb-6 px-4 lg:px-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
              Données Opérationnelles Détaillées
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Accédez aux rapports détaillés et aux informations essentielles pour une gestion approfondie.
            </p>
          </div>
          <div className="px-4 lg:px-6">
            <DataTable data={data} />
          </div>
        </section>

      </div>
    </>
  )
}