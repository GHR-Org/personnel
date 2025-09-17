"use client";
import RoomPreviewCanvas from "@/components/3D/RoomPreviewCanvas";
import { Button } from "@/components/ui/button";
import { useFurnitureStore } from "@/lib/stores/furniture-store";
import { IconRefresh } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
// Importation des composants Tabs de Shadcn
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Room2DPlan from "@/components/2D/Room2DPlan";
import { TableView } from "@/components/2D/TableView";
import { PreviewModal } from "@/components/3D/PreviewModal";


export default function RestaurantPreviewPage() {
  const loadFromDatabase = useFurnitureStore((s) => s.loadFromDatabase);
  const router = useRouter();

  const refreshRoom = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    loadFromDatabase();
  };

  const handleClick = () => {
    router.push("/manager/personnalisation");
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] p-4 mt-12">
      <div className="flex items-center flex-row justify-between mb-4">
        <h1 className="text-2xl font-bold">Aperçu de la salle du restaurant</h1>
        <div className="flex items-center">
          <Button variant="outline" className="flex items-center justify-center" onClick={refreshRoom}>
            <IconRefresh className="mr-2 h-4 w-6" />
          </Button>
          <Button variant="default" className="ml-2" onClick={handleClick}>
            Modifier la Salle
          </Button>
        </div>
      </div>
      
      {/* Intégration des onglets ici */}
      <Tabs defaultValue="3D" className="w-full h-[calc(100vh-14rem)]">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="3D">Plan 3D</TabsTrigger>
          <TabsTrigger value="2D">Plan 2D</TabsTrigger>
          <TabsTrigger value="cards">Cartes</TabsTrigger>
        </TabsList>
        <TabsContent value="3D" className="border rounded-lg overflow-hidden h-full">
          <RoomPreviewCanvas />
        </TabsContent>
        <TabsContent value="2D">
          {/* Ici, on mettra le composant pour le plan 2D */}
           <Room2DPlan width={800} height={600} />
        </TabsContent>
        <TabsContent value="cards">
          {/* Ici, on mettra le composant pour les cartes */}
          <TableView />
        </TabsContent>
      </Tabs>
      <PreviewModal />
    </div>
  );
}