// app/settings/general/page.tsx

import { GeneralSettingsForm } from "@/components/setting/GeneraLSettingForm";


export default function Page() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Paramètres Généraux</h1>
      <div className="mx-8">
        <GeneralSettingsForm />
      </div>
    </div>
  );
}