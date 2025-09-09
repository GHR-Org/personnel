// hooks/useWebSocket.ts

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * Hook personnalisé pour la gestion de la connexion WebSocket.
 *
 * @param url L'URL du serveur WebSocket.
 * @returns Un objet contenant l'instance du socket, les messages reçus et l'état de la connexion.
 */
export const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(url);
    } catch (error) {
      console.error("Failed to create WebSocket instance:", error);
      setIsConnected(false);
      return;
    }

    ws.onopen = () => {
      console.log('Connexion WebSocket établie.');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      setLastMessage(event);
      toast.success("Nouvelle notification reçue");
    };

    ws.onclose = () => {
      console.log('Connexion WebSocket fermée.');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('Erreur WebSocket:', error);
      setIsConnected(false);
    };

    setSocket(ws);

    // Fonction de nettoyage pour fermer la connexion
    return () => {
      if (ws) {
        // Condition pour fermer le socket uniquement s'il est ouvert ou en cours d'ouverture
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close();
        }
      }
    };
  }, [url]);

  return { socket, lastMessage, isConnected };
};