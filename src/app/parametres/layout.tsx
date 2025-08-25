// app/parametres/layout.tsx
"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
export default function ParametresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex w-full">

      {/* Contenu principal des paramètres */}
      <SiteHeader />
      <div className="flex-1 p-8 mt-4">
        <div className="mb-8">
          <Button variant="default" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Revenir
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}