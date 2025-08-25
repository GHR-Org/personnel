"use client"

import { useState, useEffect } from "react"
import { isAuthenticated, getStoredUser, getStoredToken, clearStoredTokens } from "@/lib/func/api/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { redirectByRole } from "@/components/auth-guard"
import { useRouter } from "next/navigation"
import { Loading } from "@/components/ui/loading"

export default function TestPage() {
  const [authStatus, setAuthStatus] = useState<any>(null)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  useEffect(() => {
    const initializePage = () => {
      addLog("Page de test chargée")
      checkAuthStatus()
      setIsLoading(false)
    }

    initializePage()
  }, [])

  const checkAuthStatus = () => {
    addLog("Vérification du statut d'authentification...")
    
    const isAuth = isAuthenticated()
    const user = getStoredUser()
    const token = getStoredToken()

    addLog(`isAuthenticated(): ${isAuth}`)
    addLog(`Token présent: ${!!token}`)
    addLog(`User présent: ${!!user}`)

    if (user) {
      addLog(`Rôle utilisateur: ${user.role}`)
      addLog(`Email utilisateur: ${user.email}`)
    }

    setAuthStatus({
      isAuthenticated: isAuth,
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      currentPath: window.location.pathname
    })

    setUserInfo(user)
  }

  const handleLogout = () => {
    addLog("Déconnexion...")
    clearStoredTokens()
    checkAuthStatus()
  }

  const handleRedirect = () => {
    if (userInfo) {
      addLog(`Redirection vers l'interface pour le rôle: ${userInfo.role}`)
      redirectByRole(userInfo, router)
    }
  }

  const handleGoToLogin = () => {
    addLog("Redirection vers /login")
    router.push("/login")
  }

  const handleGoToAdmin = () => {
    addLog("Redirection vers /admin")
    router.push("/admin")
  }

  if (isLoading) {
    return <Loading message="Chargement de la page de test..." />
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Page de Test - Authentification</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Statut d'authentification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Authentifié :</strong> {authStatus?.isAuthenticated ? "✅ Oui" : "❌ Non"}</p>
              <p><strong>Token présent :</strong> {authStatus?.hasToken ? "✅ Oui" : "❌ Non"}</p>
              <p><strong>Longueur du token :</strong> {authStatus?.tokenLength || 0}</p>
              <p><strong>Page actuelle :</strong> {authStatus?.currentPath}</p>
            </div>
            <div className="mt-4 space-x-2">
              <Button onClick={checkAuthStatus} size="sm">
                Actualiser
              </Button>
              <Button onClick={handleLogout} variant="destructive" size="sm">
                Déconnexion
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations utilisateur</CardTitle>
          </CardHeader>
          <CardContent>
            {userInfo ? (
              <div className="space-y-2">
                <p><strong>ID :</strong> {userInfo.sub}</p>
                <p><strong>Email :</strong> {userInfo.email}</p>
                <p><strong>Rôle :</strong> {userInfo.role}</p>
                <p><strong>Expiration :</strong> {userInfo.exp ? new Date(userInfo.exp * 1000).toLocaleString() : "N/A"}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">Aucun utilisateur connecté</p>
            )}
            <div className="mt-4 space-x-2">
              <Button onClick={handleRedirect} size="sm" disabled={!userInfo}>
                Rediriger selon rôle
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Actions de test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-x-2">
            <Button onClick={handleGoToLogin} variant="outline">
              Aller à /login
            </Button>
            <Button onClick={handleGoToAdmin} variant="outline">
              Aller à /admin
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Logs de débogage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-4 rounded-md max-h-64 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="text-sm font-mono">
                {log}
              </div>
            ))}
          </div>
          <Button 
            onClick={() => setLogs([])} 
            variant="outline" 
            size="sm" 
            className="mt-2"
          >
            Effacer les logs
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}