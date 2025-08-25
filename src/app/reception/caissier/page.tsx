// admin/dashboard-page.tsx
// Importez votre nouveau layout
import { ChartAreaInteractive } from "@/components/receptionComponents/chart-area-interactive"

import { SectionCards } from "@/components/caissierComponents/Caissecards"

import { CashRegisterLogTable } from "@/components/caissierComponents/CashRegisterLogTable"

export default function Page() {
  return (
    <>
      <div className="@container/main flex flex-1 flex-col gap-8 py-4 md:gap-10 md:py-6"> {/* Augmente le gap pour l'espacement des sections */}

        {/* Section pour les cartes de résumé */}
        <section>
          <div className="mb-6 px-4 lg:px-6"> {/* Marge en bas pour espacer du contenu suivant */}
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
              Aperçu Général
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Visualisez les indicateurs clés de performance et les statistiques importantes en un coup d&apos;œil.
            </p>
          </div>
          <div className="px-4 lg:px-6"> {/* Conserve le padding du composant */}
            <SectionCards />
          </div>
        </section>

        
        {/* Section pour le tableau de données */}
        <section>
          <div className="mb-6 px-4 lg:px-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
              Détail des Opérations
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Consultez et gérez l&apos;ensemble des données brutes avec des options de tri et de filtrage.
            </p>
          </div>
          <div className="px-4 lg:px-6"> {/* Applique le padding autour de la DataTable */}
            <CashRegisterLogTable />
          </div>
        </section>
        

      </div>
    </>
  )
}