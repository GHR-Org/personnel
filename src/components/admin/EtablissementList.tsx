"use client"

import React from "react"
import { 
  Edit, 
  Trash2, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Eye
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Etablissement } from "@/types/etablissement"

interface EtablissementListProps {
  etablissements: Etablissement[]
  loading: boolean
  onRefresh: () => void
  onEdit: (etablissement: Etablissement) => void
  onDelete: (id: number) => void
}

export function EtablissementList({ 
  etablissements, 
  loading, 
  onRefresh,
  onEdit,
  onDelete
}: EtablissementListProps) {

  // Supprimer un établissement
  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet établissement ?")) return
    onDelete(id)
  }

  // Voir les détails d'un établissement
  const handleView = (etab: Etablissement) => {
    // TODO: Implémenter la vue détaillée
    console.log("Voir les détails de", etab.nom)
  }

  return (
    <div className="space-y-6">
      {/* Liste des établissements */}
      <Card>
        <CardHeader>
          <CardTitle>
            Établissements ({etablissements.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : etablissements.length === 0 ? (
            <Alert>
              <Building className="h-4 w-4" />
              <AlertDescription>
                Aucun établissement trouvé.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {etablissements.map((etab) => (
                <div key={etab.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{etab.nom}</h3>
                        <Badge variant={etab.statut === "Activer" ? "default" : "secondary"}>
                          {etab.statut}
                        </Badge>
                        <Badge variant="outline">{etab.type_}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {etab.ville}, {etab.pays}
                        </div>
                        {etab.telephone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {etab.telephone}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {etab.email}
                        </div>
                      </div>
                      {etab.nb_chambres !== undefined && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {etab.nb_chambres} chambres • {etab.nb_clients || 0} clients • 
                          Taux d'occupation: {etab.taux_occupation || 0}%
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(etab)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(etab)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(etab.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 