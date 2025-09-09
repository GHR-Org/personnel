// ============================================================================
// HOOK NOTIFICATIONS
// src/hooks/useNotifications.ts
// ============================================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { notificationService, Notification } from "@/services/notifications";
import { User } from "@/types";
import { toast } from "sonner";
import { eventBus } from "@/utils/eventBus";
import { useWsReady } from "@/components/WebSocketProvider";

// Interface étendue pour les notifications avec informations de filtrage
interface NotificationWithFilter extends Notification {
  shouldHide?: boolean;
  actionUrl?: string;
}

// Déduire un type d'entité depuis le nom d'évènement
const getTypeFromEvent = (event?: string): string | undefined => {
  if (!event) return undefined;
  const e = event.toLowerCase();
  if (e.startsWith("conge")) return "conge";
  if (e.startsWith("personnel")) return "personnel";
  if (e.startsWith("chambre")) return "chambre";
  if (e.startsWith("plat")) return "plat";
  if (e.startsWith("produit")) return "produit";
  if (e.startsWith("reservation")) return "reservation";
  return undefined;
};

// Fonctions utilitaires pour le filtrage et les liens
const getUserActionKey = (userId: number, action: string, timestamp: string) => {
  return `${userId}_${action}_${new Date(timestamp).getTime()}`;
};

const shouldHideNotification = (notification: Notification, userId: number): boolean => {
  // Récupérer les actions récentes de l'utilisateur depuis le localStorage
  const recentActions = JSON.parse(localStorage.getItem('user_recent_actions') || '[]');

  // Analyser le message pour déterminer si c'est une action de l'utilisateur actuel
  const message = notification.message.toLowerCase();

  // Patterns pour identifier les actions de l'utilisateur actuel
  const userActionPatterns = [
    /vous avez/i,
    /votre/i,
    /vous/i,
    new RegExp(`utilisateur.*${userId}`, 'i')
  ];

  // Vérifier si le message contient des patterns indiquant une action de l'utilisateur
  const isUserAction = userActionPatterns.some(pattern => pattern.test(message));

  // Si c'est une action récente de l'utilisateur, la masquer
  if (isUserAction) {
    const actionKey = getUserActionKey(userId, 'action', notification.date);
    return recentActions.includes(actionKey);
  }

  return false;
};

const generateActionUrl = (notification: Notification): string | undefined => {
  const message = notification.message.toLowerCase();

  // Générer des URLs basées sur le type de notification
  if (message.includes('chambre')) {
    return '/chambres';
  } else if (message.includes('réservation') || message.includes('reservation')) {
    return '/reservations';
  } else if (message.includes('plat')) {
    return '/plats';
  } else if (message.includes('personnel')) {
    return '/personnels';
  } else if (message.includes('produit')) {
    return '/etats/produits';
  } else if (message.includes('congé') || message.includes('conge')) {
    return '/conges';
  }

  return undefined;
};

export function useNotifications(user: User | null) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const isConnected = useWsReady();

  const etablissementId = useMemo(() => user?.etablissement_id || user?.id, [user?.etablissement_id, user?.id]);

  // Récupérer les notifications initiales
  const fetchNotifications = useCallback(async (): Promise<Notification[]> => {
    if (!etablissementId) {
      setLoading(false);
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const list = await notificationService.getByEtablissement(etablissementId);
      return list as unknown as Notification[];
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      return [];
    } finally {
      setLoading(false);
    }
  }, [etablissementId]);

  // Gestion centralisée des événements
  const applyEvent = useCallback((message: any) => {
    const { event, payload } = message || {};
    if (!event) return;

    setNotifications(prevInput => {
      const current = Array.isArray(prevInput) ? prevInput : [];
      let updated = [...current];

      switch (event) {
        case 'notification_created': {
          if (payload && !updated.find((n: any) => n.id === payload.id)) {
            // Conserver métadonnées si fournies
            updated = [{
              ...payload,
              entity_type: payload?.entity_type || getTypeFromEvent(payload?.event) || undefined,
              entity_id: payload?.entity_id ?? payload?.ref_id ?? undefined,
            }, ...updated];
            toast.info(payload.message, {
              duration: 5000,
              action: {
                label: "Voir",
                onClick: () => {
                  const btn = document.querySelector('[aria-label="Voir les notifications"]') as HTMLElement;
                  btn?.click();
                },
              },
            });
          }
          break;
        }
        case 'notification_updated':
        case 'notification_patch': {
          if (payload?.id) {
            updated = updated.map((n: any) => n.id === payload.id ? { ...n, lu: true } : n);
          }
          break;
        }
        case 'notification_deleted':
        case 'notification_delete': {
          if (payload?.id) {
            updated = updated.filter((n: any) => n.id !== payload.id);
          }
          break;
        }
        // Événements transverses qui génèrent une notification
        case 'chambre_create':
        case 'chambre_update':
        case 'chambre_delete':
        case 'reservation':
        case 'reservation_patch':
        case 'reservation_delete':
        case 'plat_create':
        case 'plat_update':
        case 'plat_delete':
        case 'personnel_create':
        case 'personnel_update':
        case 'personnel_delete':
        case 'produit_create':
        case 'produit_update':
        case 'produit_delete':
        case 'stock_update':
        case 'conge_create':
        case 'conge_update':
        case 'conge_delete': {
          if (payload?.message) {
            const newNotification: any = {
              id: Date.now() + Math.random(),
              message: payload.message,
              lu: false,
              date: new Date().toISOString(),
              etablissement_id: etablissementId || 0,
              entity_type: 'conge',
              entity_id: payload?.id ?? payload?.entity_id,
            };
            const exists = updated.find((n: any) => n.message === newNotification.message && Math.abs(new Date(n.date).getTime() - new Date(newNotification.date).getTime()) < 5000);
            if (!exists) {
              updated = [newNotification, ...updated];
              toast.info(newNotification.message, {
                duration: 4000,
                action: {
                  label: "Voir",
                  onClick: () => {
                    const btn = document.querySelector('[aria-label="Voir les notifications"]') as HTMLElement;
                    btn?.click();
                  },
                },
              });
            }
          }
          break;
        }
        case 'personnel_create':
        case 'personnel_update':
        case 'personnel_delete':
        case 'chambre_create':
        case 'chambre_update':
        case 'chambre_delete':
        case 'plat_create':
        case 'plat_update':
        case 'plat_delete':
        case 'produit_create':
        case 'produit_update':
        case 'produit_delete':
        case 'reservation':
        case 'reservation_patch':
        case 'reservation_delete':
        case 'stock_update': {
          if (payload?.message) {
            const inferredType = getTypeFromEvent(event);
            const newNotification: any = {
              id: Date.now() + Math.random(),
              message: payload.message,
              lu: false,
              date: new Date().toISOString(),
              etablissement_id: etablissementId || 0,
              entity_type: payload?.entity_type || inferredType,
              entity_id: payload?.id ?? payload?.entity_id,
            };
            const exists = updated.find((n: any) => n.message === newNotification.message && Math.abs(new Date(n.date).getTime() - new Date(newNotification.date).getTime()) < 5000);
            if (!exists) {
              updated = [newNotification, ...updated];
              toast.info(newNotification.message, {
                duration: 4000,
                action: {
                  label: "Voir",
                  onClick: () => {
                    const btn = document.querySelector('[aria-label="Voir les notifications"]') as HTMLElement;
                    btn?.click();
                  },
                },
              });
            }
          }
          break;
        }
        default:
          break;
      }

      return updated as Notification[];
    });

    setLastUpdate(Date.now());
  }, [etablissementId]);

  // Abonnement EventBus
  useEffect(() => {
    const off1 = eventBus.on('notification_created', applyEvent);
    const off2 = eventBus.on('notification_updated', applyEvent);
    const off3 = eventBus.on('notification_patch', applyEvent);
    const off4 = eventBus.on('notification_deleted', applyEvent);
    const off5 = eventBus.on('notification_delete', applyEvent);
    // Wildcard si besoin d’écouter tout
    const offAll = eventBus.on('*', applyEvent);
    return () => { off1(); off2(); off3(); off4(); off5(); offAll(); };
  }, [applyEvent]);

  // Initialisation des données (une seule fois)
  useEffect(() => {
    if (etablissementId && !initialDataLoaded) {
      fetchNotifications().then(list => {
        setNotifications(Array.isArray(list) ? list : []);
        setInitialDataLoaded(true);
        setLastUpdate(Date.now());
      });
    }
  }, [etablissementId, initialDataLoaded, fetchNotifications]);

  // Marquer une notification comme lue
  const markAsRead = useCallback(async (notificationId: number) => {
    if (!etablissementId) return;

    try {
      await notificationService.updateReadStatus(notificationId);
      setNotifications(prev => prev.map((n: any) => n.id === notificationId ? { ...n, lu: true } : n));
      setLastUpdate(Date.now());
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error(errorMessage);
    }
  }, [etablissementId]);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(async () => {
    if (!etablissementId) return;

    try {
      const unreadNotifications = notifications.filter((n: any) => !n.lu);
      await Promise.all(unreadNotifications.map((n: any) => notificationService.updateReadStatus(n.id)));
      setNotifications(prev => prev.map((n: any) => ({ ...n, lu: true })));
      setLastUpdate(Date.now());
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error(errorMessage);
    }
  }, [etablissementId, notifications]);

  // Supprimer une notification
  const deleteNotification = useCallback(async (notificationId: number) => {
    if (!etablissementId) return;

    try {
      await notificationService.delete(notificationId);
      setNotifications(prev => prev.filter((n: any) => n.id !== notificationId));
      setLastUpdate(Date.now());
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error(errorMessage);
    }
  }, [etablissementId]);

  // Supprimer toutes les notifications
  const clearAllNotifications = useCallback(async () => {
    if (!etablissementId) return;

    try {
      await Promise.all(notifications.map((n: any) => notificationService.delete(n.id)));
      setNotifications(() => []);
      setLastUpdate(Date.now());
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error(errorMessage);
    }
  }, [etablissementId, notifications]);

  // Calculer le nombre de notifications non lues
  const unreadCount = useMemo(() => notifications.filter((n: any) => !n.lu).length, [notifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    isConnected,
    lastUpdate,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  };
}
