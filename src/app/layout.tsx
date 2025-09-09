/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/layout.tsx

import type { Metadata } from "next";
import { Montserrat, Montserrat_Alternates } from "next/font/google";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme_provider";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import { AuthProvider } from "@/contexts/AuthContext";

// Initialisez la police Montserrat avec sa propre variable
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

// Initialisez la police Montserrat_Alternates avec sa propre variable
const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  variable: "--font-montserrat-alternates",
  weight: ["400", "700"], // Il est recommandé de définir plusieurs poids
});

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin-sans",
  weight: ["400", "700"], // Il est recommandé de définir plusieurs poids
  style: ["normal", "italic"], // Inclure les styles nécessaires
});

export const metadata: Metadata = {
  title: "GHR Inc. - Gestion Hotêlière et Restauration",
  description:
    "GHR Inc. - Votre assistance de Gestion Hotêlière et Restauration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${josefinSans.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ReactQueryProvider>
              {children}
            </ReactQueryProvider>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}