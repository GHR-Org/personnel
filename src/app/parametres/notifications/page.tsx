// app/parametres/notifications/page.tsx
// Le layout est déjà géré par app/parametres/layout.tsx

import { NotificationForm } from "@/components/setting//NotificationForm";

export default function NotificationSettingsPage() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight mb-6">Notifications</h1>
      <div className="mx-8">
        <p className="text-gray-600 mb-4">
          Gérez vos préférences de notification ici. Vous pouvez choisir de
          recevoir des notifications par email, SMS, ou via l'application.
        </p>
        <NotificationForm />
      </div>
    </>
  );
}
