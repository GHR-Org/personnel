// src/styles/calendar-theme.ts
import { cva } from "class-variance-authority";

export const calendarStyles = {
  calendarWrapper: "w-full text-sm font-sans",

  dayHeader: cva("py-2 px-3 text-center font-medium border-b", {
    variants: {
      theme: {
        light: "bg-muted text-muted-foreground",
        dark: "bg-muted text-muted-foreground",
      },
    },
  }),

  dayBackground: cva("border", {
    variants: {
      theme: {
        light: "border-gray-200",
        dark: "border-gray-700",
      },
    },
  }),

  timeSlot: cva("min-h-[2.5rem] border-t", {
    variants: {
      theme: {
        light: "border-gray-200",
        dark: "border-gray-700",
      },
    },
  }),

  event: cva("rounded px-2 py-1 text-xs hover:bg-primary/90 transition", {
    variants: {
      theme: {
        light: "bg-primary text-white",
        dark: "bg-primary text-white",
      },
    },
  }),

  today: cva("bg-accent", {
    variants: {
      theme: {
        light: "bg-accent",
        dark: "bg-accent",
      },
    },
  }),
};
