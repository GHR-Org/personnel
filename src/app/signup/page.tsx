"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, getStoredUser } from "@/lib/func/api/auth"
import { SignupForm } from "@/components/form/SignupForm"
import { redirectByRole } from "@/components/auth-guard"
import { Loading } from "@/components/ui/loading"

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      // Vérifier si l'utilisateur est déjà connecté
      if (isAuthenticated()) {
        const user = getStoredUser()
        if (user) {
          // Rediriger vers l'interface appropriée selon le rôle
          redirectByRole(user, router)
          return
        }
      }
      // Si pas connecté, afficher le formulaire d'inscription
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  // Afficher un loading pendant la vérification
  if (isLoading) {
    return <Loading message="*" />
  }

  return <SignupForm />
}
