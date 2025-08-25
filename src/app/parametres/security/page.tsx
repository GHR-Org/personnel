// app/parametres/security/page.tsx
// Le layout est déjà géré par app/parametres/layout.tsx

import { ChangePasswordForm } from "@/components/setting/ChangePasswordForm";
// Vous pourriez avoir d'autres composants de sécurité ici (2FA, historique, etc.)
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SecuritySettingsPage() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight mb-6">Sécurité</h1>
      <div className="mx-8">
        <ChangePasswordForm />
      

      {/* Optionnel: Ajoutez d'autres sections de sécurité ici */}
      
      <Separator className="my-8" />
      <div>
        <h3 className="text-lg font-medium">Authentification à deux facteurs (2FA)</h3>
        <p className="text-sm text-muted-foreground">
          Ajoutez une couche de sécurité supplémentaire à votre compte.
        </p>
        <Button className="mt-4">Activer la 2FA</Button>
      </div>

      <Separator className="my-8" />
      <div>
        <h3 className="text-lg font-medium">Historique des connexions</h3>
        <p className="text-sm text-muted-foreground">
          Examinez les appareils et les emplacements où vous vous êtes connecté.
        </p>
        <Button variant="outline" className="mt-4">Voir l'historique</Button>
      </div>
     </div>
    </>
  );
}