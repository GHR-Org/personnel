/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// ============================================================================
// PANNEAU DE NOTIFICATIONS
// ============================================================================

"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  IconBell,
  IconClock,
  IconRefresh,
  IconCheck,
  IconTrash,
  IconExternalLink,
  IconFilter,
  IconSortDescending,
  IconSettings,
  IconChevronDown,
  IconChevronUp,
  IconBed,
  IconCalendar,
  IconChefHat,
  IconUsers,
  IconPackage,
  IconCalendarOff,
  IconUser,
  IconShoppingCart,
} from "@tabler/icons-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Notification } from "@/services/notifications";
import React, { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { eventBus } from "@/utils/eventBus";

// Fonctions utilitaires pour le filtrage et les liens
const shouldHideNotification = (message: string, userId: number): boolean => {
  // Analyser le message pour déterminer si c'est une action de l'utilisateur actuel
  const lowerMessage = message.toLowerCase();

  // Patterns pour identifier les actions de l'utilisateur actuel
  const userActionPatterns = [
    /vous avez/i,
    /votre/i,
    /vous/i,
    new RegExp(`utilisateur.*${userId}`, 'i'),
    /action effectuée/i,
    /modifié par vous/i,
    /créé par vous/i,
    /supprimé par vous/i
  ];

  // Vérifier si le message contient des patterns indiquant une action de l'utilisateur
  return userActionPatterns.some(pattern => pattern.test(lowerMessage));
};

// Formater le message pour l'affichage utilisateur
const formatNotificationMessage = (message: string): string => {
  let m = message;
  // Normaliser les enums comme Conge(r)Status.APPROUVER -> approuvé
  m = m.replace(/(Cong[eé]r?e?Status|CongeStatus)\.(APPROUVER|APPROVE|APPROUVÉ|APPROUVEE)/gi, "approuvé");
  m = m.replace(/(Cong[eé]r?e?Status|CongeStatus)\.(REFUSER|REJET[EÉ]?)/gi, "refusé");
  m = m.replace(/(Cong[eé]r?e?Status|CongeStatus)\.(EN[_ ]?ATTENTE|PENDING)/gi, "en attente");
  // Remplacer des underscores techniques éventuels
  m = m.replace(/_/g, " ");
  return m;
};

const generateActionUrl = (message: string): string | undefined => {
  const lower = message.toLowerCase();

  // Essayer d'extraire un identifiant simple s'il est mentionné (ex: #123, id 123)
  const idMatch = lower.match(/#\s?(\d+)|\bid\s?(\d+)/i);
  const id = idMatch ? (idMatch[1] || idMatch[2]) : undefined;

  // Routes existantes et sûres du projet
  if (lower.includes('chambre')) {
    return '/chambres' + (id ? `?id=${id}` : '');
  }
  if (lower.includes('réservation') || lower.includes('reservation')) {
    return '/reservations' + (id ? `?id=${id}` : '');
  }
  if (lower.includes('plat')) {
    return '/plats' + (id ? `?id=${id}` : '');
  }
  if (lower.includes('personnel')) {
    return '/personnels' + (id ? `?id=${id}` : '');
  }
  if (lower.includes('produit')) {
    return '/etats/produits' + (id ? `?id=${id}` : '');
  }
  if (lower.includes('congé') || lower.includes('conge')) {
    return '/conges' + (id ? `?id=${id}` : '');
  }
  if (lower.includes('client')) {
    // Si la page clients n'existe pas, mieux vaut renvoyer vers dashboard ou rester sur place
    return '/dashboard';
  }
  if (lower.includes('commande')) {
    // Par défaut renvoyer vers reservations (restaurant non garanti)
    return '/reservations';
  }

  return undefined;
};

// Types de notifications et leurs icônes
const getNotificationType = (message: string): string => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('chambre')) return 'chambre';
  if (lowerMessage.includes('réservation') || lowerMessage.includes('reservation')) return 'reservation';
  if (lowerMessage.includes('plat')) return 'plat';
  if (lowerMessage.includes('personnel')) return 'personnel';
  if (lowerMessage.includes('produit')) return 'produit';
  if (lowerMessage.includes('congé') || lowerMessage.includes('conge')) return 'conge';
  if (lowerMessage.includes('client')) return 'client';
  if (lowerMessage.includes('commande')) return 'commande';

  return 'general';
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'chambre': return IconBed;
    case 'reservation': return IconCalendar;
    case 'plat': return IconChefHat;
    case 'personnel': return IconUsers;
    case 'produit': return IconPackage;
    case 'conge': return IconCalendarOff;
    case 'client': return IconUser;
    case 'commande': return IconShoppingCart;
    default: return IconBell;
  }
};

const getNotificationColor = (type: string): string => {
  switch (type) {
    case 'chambre': return 'text-blue-600';
    case 'reservation': return 'text-green-600';
    case 'plat': return 'text-orange-600';
    case 'personnel': return 'text-purple-600';
    case 'produit': return 'text-indigo-600';
    case 'conge': return 'text-red-600';
    case 'client': return 'text-teal-600';
    case 'commande': return 'text-pink-600';
    default: return 'text-gray-600';
  }
};

// Regroupement par période
const getTimePeriod = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Aujourd'hui";
  if (diffInDays === 1) return "Hier";
  if (diffInDays <= 7) return "Cette semaine";
  if (diffInDays <= 30) return "Ce mois-ci";

  return "Plus ancien";
};

// Regroupement des notifications similaires
const groupSimilarNotifications = (notifications: Notification[]) => {
  const groups: { [key: string]: Notification[] } = {};

  notifications.forEach(notification => {
    const type = getNotificationType(notification.message);
    const period = getTimePeriod(notification.date);
    const key = `${type}_${period}`;

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(notification);
  });

  return groups;
};

export function NotificationPanel() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const {
    notifications,
    unreadCount,
    loading: notificationsLoading,
    isConnected,
    refetch: refreshNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications(user);

  // États pour les filtres et le tri
  const [sortBy, setSortBy] = React.useState<'date' | 'type'>('date');
  const [filterType, setFilterType] = React.useState<string>('all');
  const [showUnreadOnly, setShowUnreadOnly] = React.useState<boolean>(false);
  const [groupByPeriod, setGroupByPeriod] = React.useState<boolean>(true);

  // Filtrer et trier les notifications
  const processedNotifications = useMemo(() => {
    if (!user?.id || !notifications) return [];

    let filtered = notifications.filter(notification =>
      !shouldHideNotification(notification.message, user.id)
    );

    // Appliquer le filtre par type
    if (filterType !== 'all') {
      filtered = filtered.filter(notification =>
        getNotificationType(notification.message) === filterType
      );
    }

    // Appliquer le filtre non lu seulement
    if (showUnreadOnly) {
      filtered = filtered.filter(notification => !notification.lu);
    }

    // Trier les notifications
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        const typeA = getNotificationType(a.message);
        const typeB = getNotificationType(b.message);
        return typeA.localeCompare(typeB);
      }
    });

    return filtered;
  }, [notifications, user?.id, filterType, showUnreadOnly, sortBy]);

  // Regrouper les notifications si activé
  const groupedNotifications = useMemo(() => {
    if (!groupByPeriod) return { 'all': processedNotifications };

    return groupSimilarNotifications(processedNotifications);
  }, [processedNotifications, groupByPeriod]);

  // Calculer le nombre de notifications non lues filtrées
  const filteredUnreadCount = useMemo(() => {
    return processedNotifications.filter(n => !n.lu).length;
  }, [processedNotifications]);

  const formatTimestamp = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );

      if (diffInMinutes < 1) return "À l'instant";
      if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
      if (diffInMinutes < 1440)
        return `Il y a ${Math.floor(diffInMinutes / 60)} h`;
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Date invalide";
    }
  };

  if (loading) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative h-9 w-9 rounded-full transition-all duration-300 ease-out",
            "hover:bg-muted",
            "focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "active:scale-95 transform",
            "shadow-sm",
            filteredUnreadCount > 0 &&
              "animate-pulse bg-accent"
          )}
          title={`${filteredUnreadCount} nouvelle(s) notification(s)`}
          aria-label="Voir les notifications"
        >
          <IconBell
            className={cn(
              "h-[1.2rem] w-[1.2rem] transition-all duration-300",
              filteredUnreadCount > 0
                ? "text-foreground scale-110"
                : "text-muted-foreground hover:text-foreground"
            )}
          />
          {filteredUnreadCount > 0 && (
            <Badge
              variant="default"
              className={cn(
                "absolute -top-1 -right-1 h-6 w-6 rounded-full p-0",
                "flex items-center justify-center text-xs font-bold",
                "bg-foreground text-background",
                "border-2 border-background",
                "shadow-sm",
                "transform hover:scale-110 transition-transform duration-200"
              )}
            >
              {filteredUnreadCount > 99 ? "99+" : filteredUnreadCount}
            </Badge>
          )}
          {isConnected && (
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-primary rounded-full border-2 border-background animate-pulse" />
          )}
          {/* Debug info en développement */}
          {process.env.NODE_ENV === "development" && (
            <div className="absolute -top-8 -right-2 text-xs bg-black text-white px-2 py-1 rounded opacity-75">
              WS: {isConnected ? "✅" : "❌"}
            </div>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[400px] sm:w-[500px] bg-background"
      >
        <SheetHeader className="space-y-4 pb-3 border-b border-border">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-muted rounded-full">
                <IconBell className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <SheetTitle className="text-lg font-semibold text-foreground">Notifications</SheetTitle>
                <div className="text-xs text-muted-foreground">
                  {processedNotifications.length === 0
                    ? "Aucune notification"
                    : `${processedNotifications.length} au total • ${filteredUnreadCount} non lue${filteredUnreadCount > 1 ? "s" : ""}`}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {processedNotifications.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllNotifications}
                  className={cn(
                    "h-9 px-4 text-xs rounded-full",
                    "transition-all duration-200 shadow-sm hover:shadow-md"
                  )}
                >
                  Tout effacer
                </Button>
              )}
            </div>
          </div>

          {/* Barre d'onglets simple: Tous / Non lus */}
          <div className="flex items-center justify-between">
            <div className="inline-flex rounded-lg border border-border p-1">
              <button
                type="button"
                onClick={() => setShowUnreadOnly(false)}
                className={cn(
                  "px-3 py-1 text-xs rounded-md",
                  !showUnreadOnly ? "bg-muted text-foreground" : "text-muted-foreground"
                )}
              >
                Tous
              </button>
              <button
                type="button"
                onClick={() => setShowUnreadOnly(true)}
                className={cn(
                  "px-3 py-1 text-xs rounded-md",
                  showUnreadOnly ? "bg-muted text-foreground" : "text-muted-foreground"
                )}
              >
                Non lus
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn("h-2 w-2 rounded-full", isConnected ? "bg-primary" : "bg-muted-foreground")}></div>
              {filteredUnreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead} className="h-7 text-xs">
                  Marquer tout lu
                </Button>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {notificationsLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground text-sm">
                Chargement des notifications...
              </p>
            </div>
          ) : processedNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <IconBell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-sm">
                Aucune notification pour le moment
              </p>
            </div>
          ) : (
            <div className="space-y-6 px-4">
              {Object.entries(groupedNotifications).map(([groupKey, groupNotifications]) => {
                if (groupNotifications.length === 0) return null;

                const [type, period] = groupKey.split('_');
                const IconComponent = getNotificationIcon(type);
                const iconColor = getNotificationColor(type);

                return (
                  <div key={groupKey} className="space-y-3">
                    {/* En-tête du groupe */}
                    <div className="flex items-center gap-3 px-3 py-2 bg-muted rounded-lg">
                      <IconComponent className={cn("h-4 w-4", iconColor)} />
                      <span className="text-sm font-medium text-foreground">
                        {type === 'all' ? 'Toutes les notifications' : `${type.charAt(0).toUpperCase() + type.slice(1)} • ${period}`}
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({groupNotifications.length})
                        </span>
                      </span>
                    </div>

                    {/* Notifications du groupe */}
                    <div className="space-y-3">
                      {groupNotifications.map((notification: Notification) => {
                        const actionUrl = generateActionUrl(notification.message);
                        const notificationType = getNotificationType(notification.message);
                        const TypeIcon = getNotificationIcon(notificationType);

                        return (
                          <div
                            key={notification.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                              // Métadonnées en priorité
                              const metaType = (notification as any)?.entity_type || getNotificationType(notification.message);
                              const metaId = (notification as any)?.entity_id as number | undefined;
                              // Fallback regex si pas d'ID
                              const idMatch = !metaId ? notification.message.toLowerCase().match(/#\s?(\d+)|\bid\s?(\d+)/i) : null;
                              const extractedId = metaId ?? (idMatch ? Number(idMatch[1] || idMatch[2]) : undefined);
                              const type = (metaType || notificationType) as string;
                              if (!notification.lu) {
                                try { markAsRead(notification.id); } catch {}
                              }
                              eventBus.emit('open_detail', {
                                type,
                                id: extractedId,
                                message: notification.message,
                                href: actionUrl || null,
                              });
                              setOpen(false);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                const metaType = (notification as any)?.entity_type || getNotificationType(notification.message);
                                const metaId = (notification as any)?.entity_id as number | undefined;
                                const idMatch = !metaId ? notification.message.toLowerCase().match(/#\s?(\d+)|\bid\s?(\d+)/i) : null;
                                const extractedId = metaId ?? (idMatch ? Number(idMatch[1] || idMatch[2]) : undefined);
                                const type = (metaType || notificationType) as string;
                                if (!notification.lu) {
                                  try { markAsRead(notification.id); } catch {}
                                }
                                eventBus.emit('open_detail', {
                                  type,
                                  id: extractedId,
                                  message: notification.message,
                                  href: actionUrl || null,
                                });
                                setOpen(false);
                              }
                            }}
                            className={cn(
                              "cursor-pointer block p-4 border rounded-xl transition-all duration-300 group relative overflow-hidden",
                              "hover:shadow-sm transform",
                              notification.lu
                                ? "bg-card border-border hover:bg-muted"
                                : "bg-accent border-border hover:bg-accent",
                              "backdrop-blur-sm"
                            )}
                          >

                            {/* Indicateur de notification non lue */}
                            {!notification.lu && (
                              <div className="absolute top-3 left-3 h-3 w-3 bg-primary rounded-full animate-pulse shadow-lg" />
                            )}

                            <div className="flex items-start justify-between gap-3">
                              <div
                                className={cn(
                                  "flex-1 min-w-0",
                                  !notification.lu && "ml-6"
                                )}
                              >
                                <div className="flex items-start gap-3">
                                  <TypeIcon className={cn("h-4 w-4 mt-0.5 flex-shrink-0", getNotificationColor(notificationType))} />
                                  <div className="flex-1 min-w-0">
                                    <p className={cn(
                                      "text-sm leading-relaxed break-words",
                                      notification.lu ? "text-muted-foreground" : "text-foreground font-medium"
                                    )}>
                                      {formatNotificationMessage(notification.message)}
                                    </p>
                                    <div className="flex items-center justify-between mt-3">
                                      <div className="flex items-center text-xs text-muted-foreground">
                                        <IconClock className="h-3 w-3 mr-2" />
                                        <span className="font-medium">
                                          {formatTimestamp(notification.date)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                {!notification.lu && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notification.id)}
                                    className={cn(
                                      "opacity-0 group-hover:opacity-100 transition-all duration-200",
                                      "h-8 w-8 p-0 rounded-full",
                                      "hover:bg-green-100 hover:text-green-600",
                                      "dark:hover:bg-green-950/30 dark:hover:text-green-400",
                                      "transform hover:scale-110"
                                    )}
                                    title="Marquer comme lu"
                                  >
                                    <IconCheck className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteNotification(notification.id)}
                                  className={cn(
                                    "opacity-0 group-hover:opacity-100 transition-all duration-200",
                                    "h-8 w-8 p-0 rounded-full",
                                    "hover:bg-red-100 hover:text-red-600",
                                    "dark:hover:bg-red-950/30 dark:hover:text-red-400",
                                    "transform hover:scale-110"
                                  )}
                                  title="Supprimer cette notification"
                                >
                                  <IconTrash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
