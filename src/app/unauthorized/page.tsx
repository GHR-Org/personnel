"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, getStoredUser } from "@/lib/func/api/auth"
import { redirectByRole } from "@/components/auth-guard"
import { Loading } from "@/components/ui/loading"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function UnauthorizedPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuth = () => {
      // Vérifier si l'utilisateur est connecté
      if (isAuthenticated()) {
        const userData = getStoredUser()
        if (userData) {
          setUser(userData)
          // Rediriger vers l'interface appropriée selon le rôle
          redirectByRole(userData, router)
          return
        }
      }
      // Si pas connecté, afficher la page d'erreur
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  // Afficher un loading pendant la vérification
  if (isLoading) {
    return <Loading message="" />
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-600">
            Accès non autorisé
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
          </p>
          <div className="space-y-2">
            <Button 
              onClick={() => router.push("/login")} 
              className="w-full"
            >
              Se connecter
            </Button>
            <Button 
              onClick={() => router.push("/")} 
              variant="outline" 
              className="w-full"
            >
              Retour à l'accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 