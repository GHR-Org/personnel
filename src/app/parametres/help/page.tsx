// app/parametres/help/page.tsx
// Le layout est déjà géré par app/parametres/layout.tsx

import { HelpSection } from "@/components/setting/HelpSection";

export default function HelpSettingsPage() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight mb-6">Aide</h1>
      <div className="mx-8">
        <p className="text-gray-600 mb-4">
          Trouvez des réponses à vos questions fréquentes ou contactez notre support.
        </p>
        <HelpSection />
        </div>
    </>
  );
}