// src/components/providers/ReactQueryProvider.tsx
"use client"; // <--- C'est crucial ! Cela en fait un Client Component.

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Créez une nouvelle instance de QueryClient.
// Il est recommandé de la placer en dehors du composant pour qu'elle ne soit pas recréée à chaque rendu.
const queryClient = new QueryClient();

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}