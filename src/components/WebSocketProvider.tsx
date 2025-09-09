/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { eventBus } from "@/utils/eventBus";

const WsCtx = createContext<boolean>(false);
export const useWsReady = () => useContext(WsCtx);
 const WS_URL =process.env.NEXT_PUBLIC_WEBSOCKET_URL;


export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { user, accessToken } = useAuth() as any;
  const wsRef = useRef<WebSocket | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const reconnectAttemptsRef = useRef<number>(0);
  const reconnectTimerRef = useRef<any>(null);
  const keepAliveTimerRef = useRef<any>(null);
  const manuallyClosedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!user) return;
    const etabId = (user as any)?.etablissement_id || user?.id;
    if (!etabId) return;

    // Construire l'URL en se référant strictement au backend: /ws/notifications/{etablissement_id}
    // Ajouter le token JWT en query si disponible (référence souvent utilisée côté FastAPI WS)
    const url = `${WS_URL}/${etabId}`; // Backend n'exige pas de token pour WS

    const clearTimers = () => {
      if (reconnectTimerRef.current) { clearTimeout(reconnectTimerRef.current); reconnectTimerRef.current = null; }
      if (keepAliveTimerRef.current) { clearInterval(keepAliveTimerRef.current); keepAliveTimerRef.current = null; }
    };

    const scheduleReconnect = () => {
      if (!navigator.onLine) return; // attendre retour en ligne
      const attempt = ++reconnectAttemptsRef.current;
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 15000); // 1s,2s,4s,8s,15s max
      reconnectTimerRef.current = setTimeout(() => {
        connect();
      }, delay);
    };

    const connect = () => {
      try {
        // fermer précédent si existant
        if (wsRef.current) {
          if (wsRef.current.readyState === WebSocket.OPEN) {
            // déjà connecté
            return;
          }
          try { wsRef.current.close(1000); } catch {}
        }
        manuallyClosedRef.current = false;

        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
          setIsReady(true);
          reconnectAttemptsRef.current = 0;
          clearTimers();
          // Keepalive simple (texte) toutes 10s pour maintenir la connexion côté serveur
          keepAliveTimerRef.current = setInterval(() => {
            try {
              if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send("ping");
              }
            } catch {}
          }, 10000);
          // Premier ping immédiat pour satisfaire les serveurs qui attendent un receive
          try { ws.send("hello"); } catch {}
        };

        ws.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data || "{}");
            const event = data?.event;
            const payload = data?.payload;
            if (event) {
              eventBus.emit(event, payload);
              eventBus.emit("*", { event, payload });
            }
          } catch {}
        };

        ws.onerror = () => {
          // laisser onclose gérer la reconnexion
        };

        ws.onclose = (ev) => {
          setIsReady(false);
          wsRef.current = null;
          clearTimers();
          // Log minimal pour diagnostiquer codes de fermeture
          try { console.warn(`[WS] closed code=${ev.code} reason=${ev.reason || ""}`); } catch {}
          // Reconnecter sauf si fermeture volontaire (cleanup)
          if (!manuallyClosedRef.current) {
            scheduleReconnect();
          }
        };
      } catch {
        scheduleReconnect();
      }
    };

    // première connexion
    connect();

    // listeners réseau pour relancer à la reconnexion réseau
    const handleOnline = () => {
      if (!wsRef.current) scheduleReconnect();
    };
    const handleOffline = () => {
      if (wsRef.current) {
        try { wsRef.current.close(); } catch {}
      }
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearTimers();
      if (wsRef.current) {
        try { manuallyClosedRef.current = true; wsRef.current.close(1000); } catch {}
        wsRef.current = null;
      }
      setIsReady(false);
      reconnectAttemptsRef.current = 0;
    };
  }, [user?.id]);

  return <WsCtx.Provider value={isReady}>{children}</WsCtx.Provider>;
}
