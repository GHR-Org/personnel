/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/forgot-password/page.tsx
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils"; // Assurez-vous que ce chemin est correct pour votre utilitaire cn
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // Pour les notifications
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"; // Composants Carousel de Shadcn UI

// Assurez-vous que InputOTP est correctement importé ou créez-le si inexistant
// Si vous utilisez le composant InputOTP de Shadcn UI :
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

// Si vous avez un useAuth hook personnalisé qui expose ces fonctions
import { useAuth } from "@/hooks/useAuth"; 

/**
 * Interface pour les données du token JWT, si nécessaire (peut être réutilisée de LoginForm)
 */
interface JwtUserData {
  sub: string;
  email: string;
  role: string;
  exp?: number;
  [key: string]: any;
}

/**
 * Composant pour la page de réinitialisation de mot de passe.
 * Utilise un carrousel stepper pour guider l'utilisateur à travers les étapes:
 * 1. Saisie de l'email pour envoyer le code.
 * 2. Saisie du code OTP reçu.
 * 3. Saisie du nouveau mot de passe (implémentation simplifiée, pourrait être une 3ème étape de carousel).
 */
export default function ForgotPasswordPage() {
  // --- États du composant ---
  const [loading, setLoading] = useState(false); // Indique si une opération est en cours
  const [email, setEmail] = useState(""); // État pour l'email de l'utilisateur
  const [otp, setOtp] = useState(""); // État pour le code OTP
  const [newPassword, setNewPassword] = useState(""); // État pour le nouveau mot de passe
  const [confirmPassword, setConfirmPassword] = useState(""); // État pour la confirmation du nouveau mot de passe

  const [apiError, setApiError] = useState(""); // Erreurs provenant de l'API
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({}); // Erreurs de validation côté client

  // État et ref pour le carrousel (stepper)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentStep, setCurrentStep] = useState(0); // Index de l'étape actuelle du carrousel

  const router = useRouter(); // Instance du routeur Next.js
  const { requestPasswordReset, resetPassword } = useAuth(); // Fonctions d'authentification du hook useAuth

  // Met à jour l'étape actuelle du carrousel lorsque l'API change
  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    setCurrentStep(carouselApi.selectedScrollSnap()); // Initialise l'étape actuelle
    carouselApi.on("select", () => {
      setCurrentStep(carouselApi.selectedScrollSnap()); // Met à jour l'étape lors du changement
    });
  }, [carouselApi]);

  // --- Fonctions de validation ---

  /**
   * Valide le champ email.
   */
  const validateEmail = () => {
    const errors: { [key: string]: string } = {};
    if (!email) {
      errors.email = "L'adresse e-mail est requise.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "L'adresse e-mail n'est pas valide.";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Valide le champ OTP.
   */
  const validateOtp = () => {
    const errors: { [key: string]: string } = {};
    if (!otp) {
      errors.otp = "Le code OTP est requis.";
    } else if (otp.length !== 6) { // Assurez-vous que la longueur correspond à votre exigence
      errors.otp = "Le code OTP doit comporter 6 chiffres.";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Valide les champs du nouveau mot de passe.
   */
  const validateNewPassword = () => {
    const errors: { [key: string]: string } = {};
    if (!newPassword) {
      errors.newPassword = "Le nouveau mot de passe est requis.";
    } else if (newPassword.length < 6) { // Exemple de règle de mot de passe
      errors.newPassword = "Le mot de passe doit contenir au moins 6 caractères.";
    }
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // --- Fonctions de soumission des étapes ---

  /**
   * Gère la soumission de l'étape 1 (demande de réinitialisation de mot de passe via email).
   */
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setValidationErrors({});

    if (!validateEmail()) {
      return;
    }

    setLoading(true);
    try {
      // Appelle la fonction de l'API pour envoyer le code de réinitialisation
      await requestPasswordReset({ email });
      toast.success("Un code de vérification a été envoyé à votre adresse e-mail.");
      carouselApi?.scrollNext(); // Passe à l'étape suivante du carrousel
    } catch (err: any) {
      setApiError(err.message || "Erreur lors de l'envoi du code. Veuillez réessayer.");
      toast.error(err.message || "Erreur lors de l'envoi du code.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gère la soumission de l'étape 2 (vérification du code OTP et définition du nouveau mot de passe).
   */
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setValidationErrors({});

    if (!validateOtp()) { // Valide l'OTP
      return;
    }
    if (!validateNewPassword()) { // Valide le nouveau mot de passe
      return;
    }

    setLoading(true);
    try {
      // Appelle la fonction de l'API pour réinitialiser le mot de passe
      await resetPassword({ token: otp, newPassword }); // Assurez-vous que votre API attend 'token' et 'newPassword'
      toast.success("Votre mot de passe a été réinitialisé avec succès !");
      router.push("/login"); // Redirige vers la page de connexion après succès
    } catch (err: any) {
      setApiError(err.message || "Erreur lors de la réinitialisation. Le code OTP est peut-être invalide ou expiré.");
      toast.error(err.message || "Échec de la réinitialisation du mot de passe.");
    } finally {
      setLoading(false);
    }
  };

  // --- Rendu du composant (JSX) ---
  return (
    <div className="flex relative h-screen justify-center items-center  bg-gray-50 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-md overflow-hidden shadow-lg h-1/2 flex flex-col">
        <CardHeader className="flex flex-col items-center text-center pb-4">
          <h1 className="text-2xl font-bold">Réinitialiser le mot de passe</h1>
          <p className="text-muted-foreground text-balance">
            Veuillez suivre les étapes pour réinitialiser votre mot de passe.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {/* Carrousel pour les étapes */}
          <Carousel setApi={setCarouselApi} opts={{ watchDrag: false }}>
            <CarouselContent>
              {/* Première étape : Saisie de l'email */}
              <CarouselItem>
                <form onSubmit={handleRequestReset} className="p-6 md:p-8 space-y-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Votre adresse e-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setValidationErrors((prev) => ({ ...prev, email: "" })); // Efface l'erreur en tapant
                      }}
                      required
                      disabled={loading}
                    />
                    {validationErrors.email && (
                      <p className="text-sm text-red-500">{validationErrors.email}</p>
                    )}
                  </div>
                  {apiError && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                      {apiError}
                    </div>
                  )}
                  <Button type="submit" className="w-full text-white" disabled={loading}>
                    {loading ? "Envoi du code..." : "Envoyer le code de réinitialisation"}
                  </Button>
                </form>
              </CarouselItem>

              {/* Deuxième étape : Saisie du code OTP et nouveau mot de passe */}
              <CarouselItem>
                <form onSubmit={handleResetPassword} className="p-6 md:p-8 space-y-6">
                  <div className="grid gap-3 text-center">
                    <Label htmlFor="otp-input">Entrez le code de vérification</Label>
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => {
                        setOtp(value);
                        setValidationErrors((prev) => ({ ...prev, otp: "" }));
                      }}
                      id="otp-input"
                      disabled={loading}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    {validationErrors.otp && (
                      <p className="text-sm text-red-500">{validationErrors.otp}</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-2">
                      Un code à 6 chiffres a été envoyé à {email || "votre adresse e-mail"}.
                    </p>
                    {/* Option pour renvoyer le code (peut nécessiter une logique de timer) */}
                    <Button variant="link" size="sm" type="button" disabled={loading}>
                      Renvoyer le code
                    </Button>
                  </div>

                  {/* Nouveau mot de passe */}
                  <div className="grid gap-3">
                    <Label htmlFor="new-password">Nouveau mot de passe</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setValidationErrors((prev) => ({ ...prev, newPassword: "" }));
                      }}
                      required
                      disabled={loading}
                    />
                    {validationErrors.newPassword && (
                      <p className="text-sm text-red-500">{validationErrors.newPassword}</p>
                    )}
                  </div>

                  {/* Confirmation du nouveau mot de passe */}
                  <div className="grid gap-3">
                    <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setValidationErrors((prev) => ({ ...prev, confirmPassword: "" }));
                      }}
                      required
                      disabled={loading}
                    />
                    {validationErrors.confirmPassword && (
                      <p className="text-sm text-red-500">{validationErrors.confirmPassword}</p>
                    )}
                  </div>

                  {apiError && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                      {apiError}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
                  </Button>
                </form>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </CardContent>
        <CardFooter className="flex justify-between p-6">
          {/* Bouton Précédent (visible seulement à partir de la 2ème étape) */}
          {currentStep > 0 && (
            <Button variant="outline" onClick={() => carouselApi?.scrollPrev()} disabled={loading}>
              Précédent
            </Button>
          )}
          {/* Bouton Suivant (désactivé ou caché car le passage se fait via la soumission du formulaire) */}
          {/* Le bouton suivant n'est pas affiché ici car le passage à l'étape suivante est géré par `carouselApi?.scrollNext()` après succès de la soumission */}
        </CardFooter>
      </Card>
    </div>
  );
}