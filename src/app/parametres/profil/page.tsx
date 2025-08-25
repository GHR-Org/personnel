// app/settings/profile/page.tsx

import { ProfileForm } from "@/components/setting/ProfileForm";
export default function ProfileSettingsPage() {
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Profil de l'utilisateur</h2>
        <div className="space-x-6 mx-6">
            <ProfileForm />
        </div>
    </div>
  );
}