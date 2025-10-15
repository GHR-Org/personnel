"use client";

import { getStoredUser, getStoredToken } from "@/lib/func/api/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebugPage() {
  const user = getStoredUser();
  const token = getStoredToken();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Debug - Données d&apos;authentification</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Token</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {token ? token : "Aucun token trouvé"}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Données utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {user ? JSON.stringify(user, null, 2) : "Aucun utilisateur trouvé"}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Propriétés importantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div><strong>Role:</strong> {user?.role || "Non défini"}</div>
            <div><strong>ID:</strong> {user?.id || "Non défini"}</div>
            <div><strong>Email:</strong> {user?.email || "Non défini"}</div>
            <div><strong>Nom:</strong> {user?.nom || user?.name || "Non défini"}</div>
            <div><strong>etablissement_id:</strong> {user?.etablissement_id || "Non défini"}</div>
            <div><strong>etablissementId:</strong> {user?.etablissementId || "Non défini"}</div>
            <div><strong>establishment_id:</strong> {user?.establishment_id || "Non défini"}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 