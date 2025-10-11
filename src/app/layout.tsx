// src/app/layout.tsx
import type { Metadata } from "next";
import { Montserrat} from "next/font/google";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme_provider";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import ThemeClassProvider from "@/contexts/ThemeClassProvider";

// Initialisation de la police Montserrat avec sa propre variable
const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
});

// Initialisation de la police JoseFin_Sans avec sa propre variable

const josefinSans = Josefin_Sans({
    subsets: ["latin"],
    variable: "--font-josefin-sans",
    weight: ["400", "700"],
    style: ["normal", "italic"],
});

export const metadata: Metadata = {
    title: "GHR Inc. - Gestion Hotêlière et Restauration",
    description: "GHR Inc. - Votre assistance de Gestion Hotêlière et Restauration",
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
                    <ReactQueryProvider>
                    {/* Appel à l'AuhtProvider pour la vérification des rôles */}
                    <AuthProvider>
                            <ThemeClassProvider />
                            {children}
                    </AuthProvider> 
                    </ReactQueryProvider>
                </ThemeProvider>
                <Toaster />
            </body>
        </html>
    );
}