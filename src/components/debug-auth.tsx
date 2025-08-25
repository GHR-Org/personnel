"use client"

import { useEffect, useState } from "react"
import { getStoredUser, getStoredToken, isAuthenticated } from "@/lib/func/api/auth"
import { decodeJWT } from "@/lib/utils"

export function DebugAuth() {
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    const user = getStoredUser()
    const token = getStoredToken()
    const isAuth = isAuthenticated()
    
    let decodedToken = null
    if (token) {
      try {
        decodedToken = decodeJWT(token)
      } catch (e) {
        console.error("Erreur décodage token:", e)
      }
    }

    setDebugInfo({
      isAuthenticated: isAuth,
      hasToken: !!token,
      hasUser: !!user,
      user: user,
      tokenExpiry: decodedToken?.exp ? new Date(decodedToken.exp * 1000).toLocaleString() : null,
      currentTime: new Date().toLocaleString(),
      currentPath: window.location.pathname,
      userAgent: navigator.userAgent
    })
  }, [])

  if (!debugInfo) return null

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Debug Auth</h3>
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  )
} 