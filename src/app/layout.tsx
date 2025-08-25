
// src/app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme_provider";
import { Toaster } from "@/components/ui/sonner";

// Importez votre nouveau fournisseur de React Query
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GHR Inc. - Gestion Hotêlière et Restauration",
  description:
    "GHR Inc. - Votre assistance de Gestion Hotêlière et Restauration",
};

// Supprimez cette ligne : const queryClient = new QueryClient();
// L'instance de QueryClient sera créée dans le ReactQueryProvider.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider >
            <ReactQueryProvider> {/* Utilisez votre nouveau fournisseur ici */}
            {children}
          </ReactQueryProvider>
          <Toaster />
          </AuthProvider>
          
        </ThemeProvider>
      </body>
    </html>
  );
}