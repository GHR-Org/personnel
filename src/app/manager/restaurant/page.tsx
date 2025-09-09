// app/(manager)/manager/restaurant/page.tsx
"use client";
import RoomPreviewCanvas from "@/components/3D/RoomPreviewCanvas";
import { Button } from "@/components/ui/button";
import { useFurnitureStore } from "@/lib/stores/furniture-store";
import { IconRefresh } from "@tabler/icons-react";
import { useRouter } from "next/navigation";


export default function RestaurantPreviewPage() {
  const loadFromDatabase = useFurnitureStore((s) => s.loadFromDatabase);
  const router = useRouter();
  const refreshRoom = (e: { preventDefault: () => void; }) => {
    // Logique pour rafraîchir la salle (recharger les données, etc.)
    e.preventDefault();
    loadFromDatabase();
  };
  const handleClick = () => {
    router.push("/manager/personnalisation");
  }
  
  return (
    <div className="w-full h-[calc(100vh-4rem)] p-4 mt-12">
      <div className="flex items-center flex-row justify-between mb-4">
        <h1 className="text-2xl font-bold mb-4">Aperçu de la salle du restaurant</h1>
        <div className="flex items-center">
          <Button variant="outline" className="flex items-center justify-center" onClick={refreshRoom}>
            <IconRefresh className="mr-2 h-4 w-6" />
          </Button>
          <Button variant="default" className="ml-2" onClick={handleClick}>
            Modifier la Salle 
          </Button>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden h-[80vh]">
        <RoomPreviewCanvas />
      </div>
    </div>
  );
}
