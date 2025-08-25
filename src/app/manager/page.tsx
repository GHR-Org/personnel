// src/app/votre-dossier/RestaurantDashboard.tsx
// import {
//   MealPlanner
// } from "@/components/manager-restaurant/MealPlanner"
// import {
//   OrderTracker
// } from "@/components/manager-restaurant/OrderTracker"
import {
  PageHeader
} from "@/components/ui/PageHeader"
import MenuManager from "@/components/manager-restaurant/MenuManager"


export default function RestaurantDashboard() {
  return (
    <section className="p-4 pt-12 w-full h-screen max-w-7xl mx-auto">
      
        {/* En-tête de la page */}
        <PageHeader 
          title="Gestion de la restauration" 
          description="Gérez vos menus, planifiez les repas et suivez les commandes en cours."
        />
          {/* Section "Menus" - Style carte moderne */}
          
            <MenuManager />
    </section>
  )
}