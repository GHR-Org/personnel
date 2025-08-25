// app/(manager)/manager/restaurant/page.tsx

import RoomPreviewCanvas from "@/components/3D/RoomPreviewCanvas";


export default function RestaurantPreviewPage() {
  return (
    <div className="w-full h-[calc(100vh-4rem)] p-4 mt-12">
      <h1 className="text-2xl font-bold mb-4">Aperçu de la salle du restaurant</h1>
      <div className="border rounded-lg overflow-hidden h-[80vh]">
        <RoomPreviewCanvas />
      </div>
    </div>
  );
}
