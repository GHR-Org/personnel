// components/settings/help/HelpSection.tsx
// Pas besoin de "use client" ici, sauf si vous ajoutez des fonctionnalités interactives complexes.
// L'Accordion de Shadcn UI est un client component, donc ce composant le sera aussi.
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; 
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link"; // Pour les liens

// Données des FAQ
const faqItems = [
  {
    value: "item-1",
    question: "Comment puis-je changer mon mot de passe ?",
    answer:
      "Vous pouvez changer votre mot de passe dans la section 'Sécurité' de vos paramètres. Cliquez sur 'Changer le mot de passe', puis suivez les instructions.",
  },
  {
    value: "item-2",
    question: "Comment modifier mes informations de profil ?",
    answer:
      "Vos informations de profil (nom, prénom, biographie) peuvent être mises à jour dans la section 'Profil' de vos paramètres.",
  },
  {
    value: "item-3",
    question: "Puis-je changer la langue de l'interface ?",
    answer:
      "Oui, vous pouvez choisir votre langue préférée ainsi que le thème de l'interface et la taille de police dans la section 'Général' de vos paramètres.",
  },
  {
    value: "item-4",
    question: "Comment contacter le support technique ?",
    answer:
      "Si votre question ne figure pas ici, vous pouvez nous contacter directement par e-mail à support@votreapp.com ou via notre formulaire de contact.",
  },
];

export function HelpSection() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium">Questions Fréquemment Posées (FAQ)</h3>
        <p className="text-sm text-muted-foreground">
          Trouvez des réponses rapides à vos questions courantes.
        </p>
        <Separator className="my-4" />
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium">Contacter le Support</h3>
        <p className="text-sm text-muted-foreground">
          Si vous ne trouvez pas la réponse à votre question, n'hésitez pas à nous contacter.
        </p>
        <Separator className="my-4" />
        <div className="flex flex-col gap-4">
          <p className="text-base">
            Envoyez-nous un e-mail à{" "}
            <Link href="mailto:support@votreapp.com" className="text-blue-500 hover:underline">
              support@votreapp.com
            </Link>
            .
          </p>
          <Button asChild>
            <Link href="/contact">Ou utilisez notre formulaire de contact</Link>
          </Button>
          {/* Vous pouvez aussi ajouter un numéro de téléphone si pertinent */}
          {/* <p className="text-base">Appelez-nous au : +123 456 7890</p> */}
        </div>
      </div>
    </div>
  );
}