// components/settings/general/GeneralSettingsForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { accentColors, AccentColor } from "@/lib/accent";
import { fontSizes, FontSizeOption } from "@/lib/font-size"; // Importez vos tailles de police

export function GeneralSettingsForm() {
  const [username, setUsername] = useState("utilisateur_exemple");
  const [email, setEmail] = useState("exemple@domaine.com");
  const [language, setLanguage] = useState("fr");
  const { theme, setTheme } = useTheme();

  const [selectedAccent, setSelectedAccent] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedAccentColor") || "blue";
    }
    return "blue";
  });

  // Nouveau état pour la taille de police sélectionnée
  const [selectedFontSize, setSelectedFontSize] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedFontSize") || "medium"; // 'medium' par défaut
    }
    return "medium";
  });

  // Effet pour appliquer la couleur d'accentuation
  useEffect(() => {
    const root = document.documentElement;
    const currentAccent = accentColors.find(
      (color) => color.id === selectedAccent
    );

    if (currentAccent) {
      root.classList.remove(...accentColors.map((color) => `accent-${color.id}`));
      root.classList.add(`accent-${currentAccent.id}`);

      for (const [key, value] of Object.entries(currentAccent.colors)) {
        root.style.setProperty(key, value);
      }
      localStorage.setItem("selectedAccentColor", selectedAccent);
    }
  }, [selectedAccent]);

  // Nouveau effet pour appliquer la taille de police
  useEffect(() => {
    const root = document.documentElement;
    const currentFontSize = fontSizes.find(
      (size) => size.id === selectedFontSize
    );

    if (currentFontSize) {
      root.style.setProperty("--font-size-base", currentFontSize.value);
      localStorage.setItem("selectedFontSize", selectedFontSize);
    }
  }, [selectedFontSize]); // Déclenche l'effet lorsque selectedFontSize change

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Paramètres généraux sauvegardés :", {
      username,
      email,
      language,
      selectedAccent,
      selectedFontSize, // Incluez la taille de police dans le log
    });
    // Ici, vous enverriez les données à votre API/base de données
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ... (Section Informations du Compte) ... */}
      <div>
        <h3 className="text-lg font-medium">Informations du Compte</h3>
        <p className="text-sm text-muted-foreground">
          Mettez à jour les informations de base de votre compte.
        </p>
        <Separator className="my-4" />
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Nom d'utilisateur
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
              disabled
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium">Préférences</h3>
        <p className="text-sm text-muted-foreground">
          Gérez vos préférences d'application.
        </p>
        <Separator className="my-4" />
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="language" className="text-right">
              Langue
            </Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language" className="col-span-3">
                <SelectValue placeholder="Sélectionner une langue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="theme" className="text-right">
              Thème de l'interface
            </Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="theme" className="col-span-3">
                <SelectValue placeholder="Sélectionner un thème" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Clair</SelectItem>
                <SelectItem value="dark">Sombre</SelectItem>
                <SelectItem value="system">Système</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="accent-color" className="text-right">
              Couleur d'accentuation
            </Label>
            <Select value={selectedAccent} onValueChange={setSelectedAccent}>
              <SelectTrigger id="accent-color" className="col-span-3">
                <SelectValue placeholder="Sélectionner une couleur" />
              </SelectTrigger>
              <SelectContent>
                {accentColors.map((colorOption) => (
                  <SelectItem key={colorOption.id} value={colorOption.id}>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: `hsl(${colorOption.colors['--accent-base']?.replace(' ', ', ')})`
                        }}
                      ></span>
                      {colorOption.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Nouveau champ pour la taille de police */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="font-size" className="text-right">
              Taille de police
            </Label>
            <Select value={selectedFontSize} onValueChange={setSelectedFontSize}>
              <SelectTrigger id="font-size" className="col-span-3">
                <SelectValue placeholder="Sélectionner une taille" />
              </SelectTrigger>
              <SelectContent>
                {fontSizes.map((sizeOption) => (
                  <SelectItem key={sizeOption.id} value={sizeOption.id}>
                    {sizeOption.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button type="submit">Sauvegarder les changements</Button>
    </form>
  );
}