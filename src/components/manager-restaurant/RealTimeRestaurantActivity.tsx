"use client"

import {
  Clock,
  X,
  Activity,
  CheckCircle2,
  AlertCircle,
  BarChart2,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import clsx from "clsx"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import { Button } from "../ui/button"

type ActivityType = "info" | "success" | "warning"

interface ActivityItem {
  id: string
  message: string
  timestamp: Date
  type: ActivityType
}

interface Props {
  role: "serveur" | "cuisinier" | "manager"
}

export function RealTimeRestaurantActivitySidebar({ role }: Props) {
  const [open, setOpen] = useState(false)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [filterType, setFilterType] = useState<ActivityType | "all">("all")
  const { theme } = useTheme()

  // Simulation d'activités
  useEffect(() => {
    if (!open) return

    const interval = setInterval(() => {
      const newActivity = generateRandomActivity()
      setActivities((prev) => [newActivity, ...prev.slice(0, 19)])
    }, 5000)

    return () => clearInterval(interval)
  }, [open])

  function generateRandomActivity(): ActivityItem {
    const samples: Omit<ActivityItem, "id" | "timestamp">[] = [
      { message: "Commande #103 livrée", type: "success" },
      { message: "Plat 'Soupe de poisson' en préparation", type: "info" },
      { message: "Commande #104 refusée", type: "warning" },
      { message: "Client table 6 a demandé une carafe d'eau", type: "info" },
      { message: "Menu du dîner modifié", type: "warning" },
      { message: "Commande #105 acceptée", type: "success" },
    ]

    const activity = samples[Math.floor(Math.random() * samples.length)]
    return {
      ...activity,
      id: Math.random().toString(36).substring(2),
      timestamp: new Date(),
    }
  }

  function iconForType(type: ActivityType) {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      default:
        return <Clock className="w-5 h-5 text-blue-500" />
    }
  }

  // Statistiques calculées
  const stats = useMemo(() => {
    const today = new Date()
    const filtered = activities.filter((a) => {
      const date = new Date(a.timestamp)
      return (
        date.toDateString() === today.toDateString()
      )
    })

    return {
      total: filtered.length,
      parType: {
        info: filtered.filter((a) => a.type === "info").length,
        success: filtered.filter((a) => a.type === "success").length,
        warning: filtered.filter((a) => a.type === "warning").length,
      },
    }
  }, [activities])

  const filteredActivities =
    filterType === "all"
      ? activities
      : activities.filter((a) => a.type === filterType)

  return (
    <>
      {/* Bouton flottant */}
      <Button
        onClick={() => setOpen(true)}
        className={clsx(
          "fixed bottom-18 right-6 z-50 rounded-full w-12 h-12 p-3 shadow-lg transition",
          theme === "dark"
            ? "bg-indigo-600 text-white hover:bg-indigo-700"
            : "bg-indigo-500 text-white hover:bg-indigo-600"
        )}
      >
        <Activity className="w-10 h-10 animate-pulse" />
      </Button>

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-zinc-900 z-50 shadow-lg border-l transition-transform duration-300 ease-in-out flex flex-col",
          open ? "translate-x-0" : "translate-x-full",
          theme === "dark" ? "border-zinc-700" : "border-zinc-200"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-zinc-700">
          <div>
            <h2 className="font-semibold text-lg dark:text-white">Activité en temps réel</h2>
            <p className="text-xs text-muted-foreground">Rôle : {role}</p>
          </div>
          <Button
            onClick={() => setOpen(false)}
            className="rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 p-1 transition"
          >
            <X className="w-5 h-5 text-gray-800 dark:text-gray-200" />
          </Button>
        </div>

        {/* Filtres */}
        <div className="flex gap-2 p-3 px-4 overflow-x-auto">
          <Badge
            variant={filterType === "all" ? "default" : "outline"}
            onClick={() => setFilterType("all")}
            className="cursor-pointer"
          >
            Tous
          </Badge>
          {(["info", "success", "warning"] as ActivityType[]).map((type) => (
            <Badge
              key={type}
              variant={filterType === type ? "default" : "outline"}
              onClick={() => setFilterType(type)}
              className="capitalize cursor-pointer"
            >
              {type === "info"
                ? "Infos"
                : type === "success"
                ? "Succès"
                : "Avertissements"}
            </Badge>
          ))}
        </div>

        {/* Liste */}
        <ul className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 text-sm text-gray-800 dark:text-gray-100">
          {filteredActivities.length === 0 ? (
            <li className="italic text-muted-foreground">Aucune activité</li>
          ) : (
            filteredActivities.map(({ id, message, timestamp, type }) => (
              <li
                key={id}
                className={clsx(
                  "flex items-start gap-3 p-3 rounded border-l-4 shadow-sm",
                  type === "success" && "border-green-500 bg-green-50 dark:bg-green-900/20",
                  type === "warning" && "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
                  type === "info" && "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                )}
              >
                {iconForType(type)}
                <div className="flex-1">
                  <p className="font-medium">{message}</p>
                  <p className="text-xs text-muted-foreground">
                    {timestamp.toLocaleTimeString("fr-FR")}
                  </p>
                </div>
              </li>
            ))
          )}
        </ul>

        {/* Statistiques */}
        <div className="border-t p-4 space-y-4 bg-zinc-50 dark:bg-zinc-800 text-sm">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              Statistiques du jour
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white dark:bg-zinc-900 border rounded p-2">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-semibold">{stats.total}</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 border rounded p-2">
              <p className="text-xs text-muted-foreground">Infos</p>
              <p className="text-lg font-semibold">{stats.parType.info}</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 border rounded p-2">
              <p className="text-xs text-muted-foreground">Succès</p>
              <p className="text-lg font-semibold">{stats.parType.success}</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 border rounded p-2 col-span-3">
              <p className="text-xs text-muted-foreground">Avertissements</p>
              <p className="text-lg font-semibold">{stats.parType.warning}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
