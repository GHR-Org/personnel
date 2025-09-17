/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
// src/app/maintenance/documentation/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";

// Définition d'un type pour nos documents de formation
interface DocCardProps {
  title: string;
  description: string;
  youtubeUrl: string;
}

// Données de base pour nos cartes de documentation
const documentationData: DocCardProps[] = [
  {
    title: "Tutoriel 1 : Créer un équipement",
    description: "Apprenez les étapes pour ajouter un nouvel équipement à votre base de données.",
    youtubeUrl: "https://www.youtube.com/embed/ZP7T6WAK3Ow",
  },
  {
    title: "Tutoriel 2 : Gérer les incidents",
    description: "Comment signaler un incident et le lier à un équipement spécifique.",
    youtubeUrl: "https://www.youtube.com/embed/d_WjOBeLVn0",
  },
  {
    title: "Tutoriel 3 : Assignation d'interventions",
    description: "Un guide pour assigner des interventions aux membres de votre équipe.",
    youtubeUrl: "https://www.youtube.com/embed/_AR-yX_GIuc",
  },
];

// Composant pour la documentation textuelle
const TextDocumentation = () => (
  <section className="space-y-6">
    <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">Guide rapide de la plateforme</h2>
    <p className="text-muted-foreground">
      Cette section a été conçue pour vous fournir des informations essentielles sur le fonctionnement de l'application de gestion de maintenance, de la création d'équipements à la résolution des incidents.
    </p>
    <div className="w-full flex justify-center py-4">
        <img
          src="/image/documentation/technicien/dashboard.png"
          alt="Capture d'écran de la liste des équipements"
          className="rounded-md border shadow-sm max-w-full h-auto"
        />
      </div>
      <p className="text-sm italic text-center text-muted-foreground">
        Capture d'écran de la page de gestion des équipements.
      </p>

    <div className="space-y-4">
      <h3 className="text-xl font-semibold">1. La gestion des équipements </h3>
      <p>
        Votre base de données d'équipements est le cœur de cette application. Chaque équipement doit être renseigné avec précision, incluant son **nom**, son **type**, sa **localisation** et son **statut** actuel. Le statut est un élément clé : il peut être <span className="font-semibold text-green-500">"Fonctionnel"</span>, <span className="font-semibold text-yellow-500">"En Maintenance"</span>, <span className="font-semibold text-red-500">"Hors service"</span> ou <span className="font-semibold text-red-500">"En panne"</span>. Une fois créé, un équipement peut être mis à jour ou supprimé à tout moment.
      </p>
      {/* SECTION POUR LA CAPTURE D'ÉCRAN */}
      <div className="w-full flex justify-center py-4">
        <img
          src="/image/documentation/Technicien/Equipement/Table.png" 
          alt="Capture d'écran de la liste des équipements"
          className="rounded-md border shadow-sm max-w-full h-auto"
        />
      </div>
      <p className="text-sm italic text-center text-muted-foreground">
        Vous verrez ici les listes des équipements ainsi que les status des équipements.
      </p>
      <div className="w-full flex justify-center py-4">
        <img
          src="/image/documentation/Technicien/Equipement/AddEquipement.png" 
          alt="Capture d'écran de la liste des équipements"
          className="rounded-md border shadow-sm max-w-full h-auto"
        />
      </div>
      <p className="text-sm italic text-center text-muted-foreground">
        En cliquant sur le bouton <span className="text-lg text-primary"> Ajouter un équipement </span>, le formulaire s'affiche et vous pourriez ajouter les informations au sujet des équipements.
      </p>
    </div>

    <Separator />

    <div className="space-y-4">
      <h3 className="text-xl font-semibold">2. Le cycle de vie d'un incident </h3>
      <p>
        Lorsqu'un problème survient, un nouvel incident est créé. Ce processus déclenche automatiquement un changement de statut de l'équipement concerné, qui passe de "Fonctionnel" à **"En panne"**. Chaque incident est catégorisé par une sévérité (Faible, Moyen, Élevé) et son statut passe de **"Ouvert"** à **"En cours"** puis à **"Fermé"** au fur et à mesure que les interventions progressent.
      </p>
      {/* SECTION POUR LA CAPTURE D'ÉCRAN */}
      <div className="w-full flex justify-center py-4">
        <img
          src="/images/create-incident.png" // Remplacez par le chemin de votre image
          alt="Capture d'écran du formulaire de création d'incident"
          className="rounded-md border shadow-sm max-w-full h-auto"
        />
      </div>
      <p className="text-sm italic text-center text-muted-foreground">
        Capture d'écran du formulaire pour déclarer un nouvel incident.
      </p>
    </div>

    <Separator />

    <div className="space-y-4">
      <h3 className="text-xl font-semibold">3. De l'intervention à la résolution </h3>
      <p>
        Une intervention est l'action corrective liée à un incident. En créant une intervention, l'équipement passe à l'état **"En Maintenance"**. Une fois que le technicien a résolu le problème et mis à jour le statut de l'intervention à **"Terminée"**, le système est programmé pour faire deux choses importantes en cascade :
      </p>
      <ul className="list-disc list-inside space-y-2 pl-4 text-muted-foreground">
        <li>L'incident lié est automatiquement marqué comme **"Fermé"**.</li>
        <li>Le statut de l'équipement est réinitialisé à **"Fonctionnel"**, restaurant son état normal.</li>
      </ul>
      {/* SECTION POUR LA CAPTURE D'ÉCRAN */}
      <div className="w-full flex justify-center py-4 gap-3">
        <img
          src="/images/completed-intervention.png" // Remplacez par le chemin de votre image
          alt="Capture d'écran d'une intervention terminée"
          className="rounded-md border shadow-sm max-w-full h-auto"
        />
        <img
          src="/images/completed-intervention.png" // Remplacez par le chemin de votre image
          alt="Capture d'écran d'une intervention terminée"
          className="rounded-md border shadow-sm max-w-full h-auto"
        />
        <img
          src="/images/completed-intervention.png" // Remplacez par le chemin de votre image
          alt="Capture d'écran d'une intervention terminée"
          className="rounded-md border shadow-sm max-w-full h-auto"
        />
      </div>
      <p className="text-sm italic text-center text-muted-foreground">
        Exemple de statut mis à jour après la clôture d'une intervention.
      </p>
    </div>
  </section>
);

const DocumentationPage = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-start gap-4 mb-8">
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
          Centre de documentation
        </h1>
        <p className="text-lg text-muted-foreground">
          Retrouvez ici tous les tutoriels vidéos pour utiliser l‘application de gestion de maintenance.
        </p>
      </div>

      <Separator className="my-6" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {documentationData.map((doc, index) => (
          <Card key={index} className="flex flex-col overflow-hidden">
            <CardHeader>
              <CardTitle>{doc.title}</CardTitle>
              <CardDescription>{doc.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <AspectRatio ratio={16 / 9} className="bg-muted">
                <iframe
                  src={doc.youtubeUrl}
                  title={doc.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-md object-cover"
                />
              </AspectRatio>
            </CardContent>
          </Card>
        ))}
      </div>
      <Separator className="my-10" />
      <TextDocumentation />
    </div>
  );
};

export default DocumentationPage;