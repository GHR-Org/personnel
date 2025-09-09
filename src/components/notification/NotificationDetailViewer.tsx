"use client";

import React, { useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CongeDetail from "@/components/conge-detail";
import { useConges } from "@/hooks/useConges";
import { usePersonnels } from "@/hooks/usePersonnels";
import { useChambres } from "@/hooks/useChambres";
import { usePlats } from "@/hooks/usePlats";
import { useProduits } from "@/hooks/useProduits";
import { congesService } from "@/services/conges";
import { StatusConge } from "@/types";

interface NotificationDetailViewerProps {
  type?: string;
  id?: number;
  message?: string;
  onClose?: () => void;
}

export default function NotificationDetailViewer({ type, id, message, onClose }: NotificationDetailViewerProps) {
  const t = (type || "").toLowerCase();

  // Hooks de données par type
  const { data: conges = [] } = useConges();
  const { data: personnels = [] } = usePersonnels();
  const { data: chambres = [] } = useChambres();
  const { data: plats = [] } = usePlats();
  const { data: produits = [] } = useProduits();

  const entity = useMemo(() => {
    if (!id) return null as any;
    switch (t) {
      case "conge":
      case "congé":
        return (conges as any[]).find((c) => Number(c?.id) === id);
      case "personnel":
        return (personnels as any[]).find((p) => Number(p?.id) === id);
      case "chambre":
        return (chambres as any[]).find((c) => Number(c?.id) === id);
      case "plat":
        return (plats as any[]).find((p) => Number(p?.id) === id);
      case "produit":
        return (produits as any[]).find((p) => Number(p?.id) === id);
      default:
        return null;
    }
  }, [t, id, conges, personnels, chambres, plats, produits]);

  // Rendu spécifique Congé via composant dédié si possible
  if ((t === "conge" || t === "congé") && entity) {
    return (
      <div className="space-y-2">
        <CongeDetail
          conge={entity}
          onClose={onClose || (() => {})}
          onEdit={() => {}}
          onApprove={() => {}}
          onReject={() => {}}
          canEdit
          canApprove={entity?.status === StatusConge.EN_ATTENTE}
        />
      </div>
    );
  }

  // Rendus riches par type (hors congé)
  if (t === "personnel" && entity) {
    const p = entity as any;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><div className="text-muted-foreground">Nom</div><div className="font-medium">{p.last_name}</div></div>
          <div><div className="text-muted-foreground">Prénom</div><div className="font-medium">{p.first_name}</div></div>
          <div><div className="text-muted-foreground">Email</div><div>{p.email}</div></div>
          <div><div className="text-muted-foreground">Poste</div><div>{p.poste}</div></div>
          <div><div className="text-muted-foreground">Département</div><div>{p.departement}</div></div>
          <div><div className="text-muted-foreground">Statut</div><div><Badge variant="secondary">{p.statut}</Badge></div></div>
          {p.telephone && (<div><div className="text-muted-foreground">Téléphone</div><div>{p.telephone}</div></div>)}
          {p.adresse && (<div className="col-span-2"><div className="text-muted-foreground">Adresse</div><div>{p.adresse}</div></div>)}
        </div>
        <div className="flex justify-end"><Button variant="outline" onClick={onClose}>Fermer</Button></div>
      </div>
    );
  }

  if (t === "chambre" && entity) {
    const c = entity as any;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><div className="text-muted-foreground">Numéro</div><div className="font-medium">{c.numero}</div></div>
          <div><div className="text-muted-foreground">Catégorie</div><div>{c.categorie}</div></div>
          <div><div className="text-muted-foreground">Tarif</div><div>{Number(c.tarif)?.toLocaleString()} Ar</div></div>
          <div><div className="text-muted-foreground">État</div><div><Badge variant="secondary">{c.etat}</Badge></div></div>
          <div><div className="text-muted-foreground">Capacité</div><div>{c.capacite}</div></div>
          {c.description && (<div className="col-span-2"><div className="text-muted-foreground">Description</div><div>{c.description}</div></div>)}
        </div>
        <div className="flex justify-end"><Button variant="outline" onClick={onClose}>Fermer</Button></div>
      </div>
    );
  }

  if (t === "plat" && entity) {
    const p = entity as any;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><div className="text-muted-foreground">Nom</div><div className="font-medium">{p.nom}</div></div>
          <div><div className="text-muted-foreground">Catégorie</div><div>{p.categorie}</div></div>
          <div><div className="text-muted-foreground">Prix</div><div>{Number(p.prix)?.toLocaleString()} Ar</div></div>
          <div><div className="text-muted-foreground">Disponibilité</div><div><Badge variant={p.disponible ? "default" : "destructive"}>{p.disponible ? "Disponible" : "Indisponible"}</Badge></div></div>
          {p.description && (<div className="col-span-2"><div className="text-muted-foreground">Description</div><div>{p.description}</div></div>)}
        </div>
        <div className="flex justify-end"><Button variant="outline" onClick={onClose}>Fermer</Button></div>
      </div>
    );
  }

  if (t === "produit" && entity) {
    const p = entity as any;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><div className="text-muted-foreground">Nom</div><div className="font-medium">{p.nom}</div></div>
          <div><div className="text-muted-foreground">Quantité</div><div>{p.quantite}</div></div>
          <div><div className="text-muted-foreground">Seuil stock</div><div>{p.seuil_stock}</div></div>
          <div><div className="text-muted-foreground">Prix</div><div>{Number(p.prix)?.toLocaleString()} Ar</div></div>
          {p.description && (<div className="col-span-2"><div className="text-muted-foreground">Description</div><div>{p.description}</div></div>)}
        </div>
        <div className="flex justify-end"><Button variant="outline" onClick={onClose}>Fermer</Button></div>
      </div>
    );
  }

  // Rendu générique compact pour les autres types / fallback
  return (
    <div className="space-y-4">
      {/* En-tête */}
      <div className="space-y-1">
        <div className="text-sm text-muted-foreground">Type</div>
        <div className="text-base font-semibold capitalize">{t || "notification"}</div>
      </div>
      {message && (
        <div>
          <div className="text-sm text-muted-foreground">Message</div>
          <div className="text-sm">{message}</div>
        </div>
      )}
      <Separator />

      {id && !entity && (
        <div className="text-sm text-muted-foreground">Chargement ou élément introuvable (id: {id}).
          Assurez-vous que les données sont disponibles pour ce type.</div>
      )}

      {entity && (
        <div className="grid grid-cols-2 gap-3 text-sm">
          {Object.entries(entity).slice(0, 16).map(([k, v]) => (
            <div key={k} className="space-y-1">
              <div className="text-muted-foreground">{k}</div>
              <div className="break-words">
                {typeof v === "boolean" ? (
                  <Badge variant={v ? "default" : "secondary"}>{String(v)}</Badge>
                ) : typeof v === "number" ? (
                  <span>{v}</span>
                ) : typeof v === "string" ? (
                  <span>{v}</span>
                ) : Array.isArray(v) ? (
                  <span>[{v.length} items]</span>
                ) : v == null ? (
                  <span className="text-muted-foreground">-</span>
                ) : (
                  <span className="text-muted-foreground">{typeof v}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClose}>Fermer</Button>
      </div>
    </div>
  );
}
