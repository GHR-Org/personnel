/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; 

import { useEffect, useState } from "react"; 
import { useRouter } from "next/navigation"; 
import { cn } from "@/lib/utils"; 
import { Button } from "@/components/ui/button"; 
import { Card, CardContent } from "@/components/ui/card"; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; 
import { toast } from "sonner"; 
import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";

/**
 * Composant de formulaire de connexion pour le personnel.
 * Gère la saisie des identifiants, la validation, la soumission et la redirection.
 */
export function LoginForm({
  className, // 
  ...props // 
}: React.ComponentProps<"div">) {
  // --- Gestion des états locaux du composant ---
  const [loading, setLoading] = useState(false); 
  const [formData, setFormData] = useState({ email: "", password: "" }); 
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({}); 
  const [apiError, setApiError] = useState(""); 
  const [showPassword, setShowPassword] = useState(false); 

  const router = useRouter(); 
  const { loginPersonnel } = useAuth(); 
  const {theme} = useTheme()
  const [logoSrc, setLogoSrc] = useState('/logo/dark.png');
          useEffect(() => {
            if (theme === 'dark') {
              setLogoSrc('/logo/dark.png');
            } else {
              setLogoSrc('/logo/white.png');
            }
          }, [theme]);

  // --- Fonctions de gestion des événements ---

  /**
   * Gère les changements dans les champs de saisie (email et mot de passe).
   * Met à jour l'état `formData` et efface les erreurs de validation/API pour le champ modifié.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // Destructure le nom et la valeur du champ
    setFormData((prevData) => ({ ...prevData, [name]: value })); // Met à jour le champ spécifique dans formData
    setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Efface l'erreur de validation pour ce champ
    setApiError(""); // Efface l'erreur API (si l'utilisateur recommence à taper)
  };

  /**
   * Gère le basculement de l'affichage du mot de passe.
   */
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  /**
   * Valide les champs du formulaire avant la soumission.
   * Retourne un objet contenant les erreurs si des champs sont invalides.
   */
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) {
      newErrors.email = "L'adresse e-mail est requise.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'adresse e-mail n'est pas valide.";
    }
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis.";
    }
    return newErrors;
  };

  /**
   * Gère la soumission du formulaire de connexion.
   * Effectue la validation, appelle l'API de connexion, et gère les redirections ou les erreurs.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le comportement par défaut du formulaire (rechargement de page)
    setApiError(""); // Réinitialise l'erreur de l'API à chaque nouvelle soumission
    toast.info("Connexion en cours..."); // Affiche un toast d'information

    const errors = validate(); // Exécute la validation côté client
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors); // Met à jour l'état des erreurs de validation
      return; // Arrête la fonction si des erreurs de validation sont présentes
    }

    setLoading(true); // Active l'état de chargement pendant la soumission
    try {
      // 1. Appelle la fonction de connexion pour obtenir les tokens
      await loginPersonnel(formData, router); // Cette fonction stocke déjà les tokens dans le localStorage

      // 2. Récupère les informations détaillées de l'utilisateur (Personnel)
    } catch (error: any) {
      setLoading(false); // Désactive l'état de chargement
      setApiError(error.message || "Une erreur est survenue lors de la connexion."); // Met à jour l'état de l'erreur API
      toast.error(error.message || "Une erreur est survenue lors de la connexion."); // Aff
    }
  };

  // --- Rendu du composant (JSX) ---
  return (
    <div
      className={cn("flex flex-col bg-gray-50 dark:bg-gray-950 gap-6 w-4xl md:w-4xl sm:w-lg", className)}
      {...props}
    >
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Formulaire de connexion */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              {/* En-tête du formulaire */}
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bon retour parmi nous !</h1>
                <p className="text-muted-foreground text-balance">
                  Connectez-vous à votre compte GHR Inc.
                </p>
              </div>

              {/* Affichage de l'erreur générale de l'API */}
              {apiError && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {apiError}
                </div>
              )}

              {/* Champ Email */}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email" // Nom du champ pour l'état `formData`
                  placeholder="admin@ghr.com"
                  value={formData.email} // Valeur contrôlée par l'état
                  onChange={handleChange} // Gestionnaire de changement
                  required // Rendu requis par le navigateur
                  disabled={loading} // Désactivé pendant le chargement
                />
                {/* Affichage de l'erreur de validation spécifique à l'email */}
                {validationErrors.email && (
                  <p className="text-sm text-red-500">{validationErrors.email}</p>
                )}
              </div>

              {/* Champ Mot de passe avec fonctionnalité d'affichage/masquage */}
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Mot de passe</Label>
                  <a
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"} // Type dynamique basé sur l'état
                    name="password" // Nom du champ pour l'état `formData`
                    value={formData.password} // Valeur contrôlée par l'état
                    onChange={handleChange} // Gestionnaire de changement
                    required // Rendu requis par le navigateur
                    disabled={loading} // Désactivé pendant le chargement
                    className="pr-10" // Ajoute un padding à droite pour laisser de la place à l'icône
                  />
                  <Button
                    type="button" // Important pour éviter de soumettre le formulaire
                    variant="ghost"
                    size="sm"
                    className="absolute inset-y-0 right-0 h-full px-3 text-muted-foreground hover:bg-transparent"
                    onClick={handleTogglePasswordVisibility}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {/* Affichage de l'erreur de validation spécifique au mot de passe */}
                {validationErrors.password && (
                  <p className="text-sm text-red-500">{validationErrors.password}</p>
                )}
              </div>

              {/* Bouton de soumission */}
              <Button type="submit" className="w-full text-white" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"} {/* Texte dynamique selon l'état de chargement */}
              </Button>
            </div>
          </form>

          {/* Section image latérale (visible sur les grands écrans) */}
          <div className="hidden bg-muted md:block relative">
            <img
              alt="background"
              className="w-full h-full object-cover animate-pulse" // Remplir l'espace et assombrir l'image
              src={logoSrc} // Chemin de l'image de fond
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}