// app/parametres/layout.tsx
"use client";

import * as React from "react";
import SiteHeader from "@/components/SiteHeader";
export default function ParametresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full">

      {/* Contenu principal des paramètres */}
      <SiteHeader />
      <div className="flex-1 p-8 mt-12">
       
        {children}
      </div>
    </div>
  );
}