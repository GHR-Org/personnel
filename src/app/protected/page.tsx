"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, getStoredUser } from "@/lib/func/api/auth"
import { redirectByRole } from "@/components/auth-guard"
import { Loading } from "@/components/ui/loading"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProtectedPage() {
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
      // Si pas connecté, rediriger vers login
      router.push("/login")
    }

    checkAuth()
  }, [router])

  // Afficher un loading pendant la vérification
  if (isLoading) {
    return <Loading message="" />
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Page Protégée</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cette page nécessite une authentification.</p>
        </CardContent>
      </Card>
    </div>
  )
} 