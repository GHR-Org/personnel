
import { ChartAreaInteractive } from "@/components/receptionComponents/chart-area-interactive";
import { SectionCards } from "@/components/receptionComponents/Receptioncards";
import {RoomCalendar} from "@/components/calendar/RoomCalendar";

export default function Page() {
  return (
    <>
      <div className="@container/main flex pt-[8vh] flex-1 flex-col gap-8 py-4 md:gap-10 md:py-6">

        {/* Section: Aperçu Général (SectionCards) */}
        <section>
          <div className="mb-6 px-4 lg:px-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
              Aperçu Général
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Visualisez les indicateurs clés de performance et les statistiques importantes en un coup d&apos;œil.
            </p>
          </div>
          <div className="px-4 lg:px-6">
            <SectionCards/>
          </div>
        </section>

        {/* Section: Calendrier des Chambres (RoomCalendar) */}
        <section>
          
          <div className="px-4 lg:px-6">
            <RoomCalendar/>
          </div>
        </section>


        {/* Section: Analyse des Tendances (ChartAreaInteractive) */}
        <section>
          <div className="mb-6 px-4 lg:px-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
              Analyse des Tendances
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Explorez les évolutions et les schémas de vos données à travers une visualisation interactive.
            </p>
          </div>
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive/>
          </div>
        </section>

      </div>
    </>
  );
}