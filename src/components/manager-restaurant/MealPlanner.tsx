"use client"

import { useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"

import { cn } from "@/lib/utils"

const menusByType = {
  "Petit Déjeuner": ["Oeufs brouillés", "Pain grillé", "Jus d'orange"],
  Déjeuner: ["Poulet rôti", "Riz parfumé", "Salade verte"],
  Dîner: ["Soupe de légumes", "Steak grillé", "Compote de pomme"],
}

export function MealPlanner() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [activeTab, setActiveTab] = useState<keyof typeof menusByType>("Petit Déjeuner")

  return (
    <>
    <h2 className="text-3xl font-extrabold tracking-tight text-center text-gray-900 dark:text-white mb-8">
        Planification des repas
    </h2>

    <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 space-y-8 lg:space-y-0 lg:flex flex-wrap lg:gap-8 justify-center">
      
      {/* Sélecteur de date avec mise en avant */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md p-4 bg-white dark:bg-gray-800 lg:flex-shrink-0 lg:max-w-xs">
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          locale={fr}
          modifiersClassNames={{
            selected: "bg-indigo-600 text-white hover:!bg-indigo-600 hover:!text-white",
            today: "font-semibold text-indigo-600 underline decoration-indigo-500 decoration-2",
          }}
          fromDate={new Date()}
          toDate={new Date(new Date().setMonth(new Date().getMonth() + 2))}
          className="text-sm p-2"
          fixedWeeks
        />
      </div>

      {/* Contenu des onglets */}
      <div className="flex-1 space-y-6">
        <Tabs
          defaultValue="Petit Déjeuner"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as keyof typeof menusByType)}
          className="w-full"
        >
          <TabsList className="bg-gray-100 dark:bg-gray-900 rounded-full shadow-md p-1 inline-flex mx-auto mb-6">
            {Object.keys(menusByType).map((type) => (
              <TabsTrigger
                key={type}
                value={type}
                className={cn(
                  "text-sm font-semibold rounded-full py-2 px-4 transition-colors duration-200",
                  activeTab === type
                    ? "bg-indigo-600 text-white shadow-md hover:text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                )}
              >
                {type}
              </TabsTrigger>
            ))}
          </TabsList>
        
        {Object.entries(menusByType).map(([type, plats]) => (
          <TabsContent key={type} value={type} className="space-y-4">
            <Card className="shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300 rounded-2xl">
              <CardHeader className="border-b dark:border-gray-700">
                <CardTitle className="text-xl font-bold">{type}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="list-disc list-inside space-y-2 text-gray-800 dark:text-gray-200 text-base">
                  {plats.map((plat, i) => (
                    <li key={i} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-default">
                      {plat}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
        {/* Date affichée */}
        <p className="text-center text-sm text-muted-foreground italic mt-6">
          Menus planifiés pour le{" "}
          <time dateTime={selectedDate?.toISOString()}>
            {selectedDate ? format(selectedDate, "PPPP", { locale: fr }) : "—"}
          </time>
        </p>
        </Tabs>
      </div>
    </div>
    </>
  )
}