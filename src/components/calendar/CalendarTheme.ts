// src/components/RoomCalendar/CalendarTheme.ts
import { cva } from "class-variance-authority";

export const calendarWrapper = cva("rounded-lg border shadow-sm", {
  variants: {
    theme: {
      light: "bg-white text-black",
      dark: "bg-background text-white border-muted",
    },
  },
  defaultVariants: {
    theme: "light",
  },
});

export const eventStyle = cva("rounded px-2 py-1 text-xs font-medium", {
  variants: {
    status: {
      default: "bg-muted text-foreground",
      confirmée: "bg-green-500/20 text-green-800 dark:text-green-200",
      en_attente: "bg-yellow-400/20 text-yellow-700 dark:text-yellow-100",
      annulée: "bg-red-400/20 text-red-700 dark:text-red-200",
    },
  },
  defaultVariants: {
    status: "default",
  },
});
