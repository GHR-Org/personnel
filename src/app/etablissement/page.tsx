"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Building2, 
  Users, 
  Bed, 
  Utensils, 
  Settings, 
  BarChart3,
  Plus,
  Edit,
  Trash2
} from "lucide-react"
import { toast } from "sonner"

interface EstablishmentData {
  id: number
  nom: string
  type: string
  statut: string
  chambres: number
  personnel: number
  reservations: number
  revenus: number
}

export default function EtablissementPage() {
  const [establishment, setEstablishment] = useState<EstablishmentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simuler le chargement des données de l'établissement
    setTimeout(() => {
      setEstablishment({
        id: 1,
        nom: "Hôtel Royal Madagascar",
        type: "Hôtel et Restaurant",
        statut: "Actif",
        chambres: 45,
        personnel: 12,
        reservations: 28,
        revenus: 12500000
      })
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!establishment) {
    return <div>Erreur de chargement</div>
  }

  return (
    <div className="w-full min-w-0 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gestion de l'Établissement</h1>
        <p className="text-muted-foreground">
          Interface de gestion pour {establishment.nom}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chambres</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{establishment.chambres}</div>
            <p className="text-xs text-muted-foreground">
              Chambres disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personnel</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{establishment.personnel}</div>
            <p className="text-xs text-muted-foreground">
              Employés actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{establishment.reservations}</div>
            <p className="text-xs text-muted-foreground">
              Réservations actives
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {establishment.revenus.toLocaleString()} Ar
            </div>
            <p className="text-xs text-muted-foreground">
              Ce mois
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="chambres" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chambres">Gestion des Chambres</TabsTrigger>
          <TabsTrigger value="personnel">Gestion du Personnel</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="chambres" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gestion des Chambres</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une Chambre
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Gérez les chambres de votre établissement. Ajoutez de nouvelles chambres 
                lors de constructions ou rénovations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }, (_, i) => (
                  <Card key={i} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Chambre {i + 1}</h3>
                      <Badge variant="secondary">Disponible</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Type: Standard | Prix: 50,000 Ar
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3 mr-1" />
                        Modifier
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personnel" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gestion du Personnel</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un Employé
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Gérez le personnel de votre établissement. Ajoutez, modifiez ou supprimez 
                des employés selon vos besoins.
              </p>
              
              <div className="space-y-4">
                {[
                  { nom: "Jean Dupont", role: "Réceptionniste", statut: "Actif" },
                  { nom: "Marie Martin", role: "Caissier", statut: "Actif" },
                  { nom: "Pierre Durand", role: "Technicien", statut: "Actif" },
                  { nom: "Sophie Bernard", role: "RH", statut: "Actif" },
                ].map((personnel, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{personnel.nom}</h3>
                      <p className="text-sm text-muted-foreground">{personnel.role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{personnel.statut}</Badge>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3 mr-1" />
                        Modifier
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Services de l'Établissement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Configurez les services offerts par votre établissement.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Restaurant</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Service de restauration
                  </p>
                  <Button size="sm" variant="outline">
                    <Settings className="h-3 w-3 mr-1" />
                    Configurer
                  </Button>
                </Card>
                
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Spa & Bien-être</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Services de relaxation
                  </p>
                  <Button size="sm" variant="outline">
                    <Settings className="h-3 w-3 mr-1" />
                    Configurer
                  </Button>
                </Card>
                
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Transport</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Service de navette
                  </p>
                  <Button size="sm" variant="outline">
                    <Settings className="h-3 w-3 mr-1" />
                    Configurer
                  </Button>
                </Card>
                
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Événements</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Salles de réunion
                  </p>
                  <Button size="sm" variant="outline">
                    <Settings className="h-3 w-3 mr-1" />
                    Configurer
                  </Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistiques" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques de l'Établissement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Consultez les statistiques de performance de votre établissement.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Taux d'occupation</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Ce mois</span>
                      <span className="font-semibold">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ce trimestre</span>
                      <span className="font-semibold">82%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cette année</span>
                      <span className="font-semibold">75%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Revenus</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Ce mois</span>
                      <span className="font-semibold">12.5M Ar</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ce trimestre</span>
                      <span className="font-semibold">38.2M Ar</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cette année</span>
                      <span className="font-semibold">145.8M Ar</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 