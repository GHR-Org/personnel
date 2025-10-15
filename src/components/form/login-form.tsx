/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import "./login.css";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { loginPersonnel } = useAuth();
  const { theme } = useTheme();

  // logo adaptatif
  const [logoSrc, setLogoSrc] = useState("/logo/white.png");
  useEffect(() => {
    setLogoSrc(theme === "dark" ? "/logo/dark.png" : "/logo/white.png");
  }, [theme]);

  // refs pour GSAP
  const bgRef = useRef<HTMLDivElement | null>(null);
  const bg2Ref = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Initialise timeline GSAP
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "sine.inOut" } });

    // Rotation lente et translation pour le premier calque
    if (bgRef.current) {
      tl.to(bgRef.current, {
        rotation: 360,
        duration: 60,
        transformOrigin: "50% 50%",
        ease: "none",
      }, 0);

      // Animation de blur / position / opacity cyclique
      tl.to(bgRef.current, {
        filter: "blur(8px)",
        backgroundPosition: "20% 80%",
        duration: 10,
        yoyo: true,
        repeat: 1
      }, 0);
    }

    // Second calque: décalage et pulsation légère
    if (bg2Ref.current) {
      tl.to(bg2Ref.current, {
        rotation: -360,
        duration: 90,
        transformOrigin: "50% 50%",
        ease: "none",
      }, 0);

      tl.to(bg2Ref.current, {
        filter: "blur(4px)",
        opacity: 0.7,
        scale: 1.05,
        duration: 12,
        yoyo: true,
        repeat: 1
      }, 0.5);
    }

    // petite pulse sur la carte (subtle)
    if (cardRef.current) {
      tl.to(cardRef.current, {
        scale: 1.01,
        boxShadow: "0 30px 80px rgba(0,0,0,0.18)",
        duration: 6,
        yoyo: true,
        repeat: -1,
      }, 0);
    }

    tlRef.current = tl;

    return () => {
      // cleanup timeline
      tl.kill();
      tlRef.current = null;
    };
  }, []);

  // validation simple
  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.email) errors.email = "L'adresse e-mail est requise.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Adresse e-mail invalide.";
    if (!formData.password) errors.password = "Le mot de passe est requis.";
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setValidationErrors((p) => ({ ...p, [name]: "" }));
    setApiError("");
  };

  const handleTogglePassword = () => setShowPassword((p) => !p);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) return setValidationErrors(errors);
    setLoading(true);
    try {
      toast.info("Connexion en cours...");
      await loginPersonnel(formData, router);
    } catch (error: any) {
      setApiError(error.message || "Erreur de connexion");
      toast.error(error.message || "Erreur de connexion");
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "relative flex h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black transition-all duration-500",
        className
      )}
      {...props}
      aria-live="polite"
    >
      {/* GSAP background calques (absolutes) */}
      <div ref={bgRef} className="gsap-bg" aria-hidden="true" />
      <div ref={bg2Ref} className="gsap-bg-2" aria-hidden="true" />

      {/* Conteneur principal centré */}
      <div ref={cardRef} className="z-10 w-full max-w-5xl px-6">
        <Card className="card-rounded overflow-hidden border-0 shadow-2xl backdrop-blur-xl bg-white/70 dark:bg-gray-900/60">
          <CardContent className="grid md:grid-cols-2 p-0">
            {/* FORM */}
            <form onSubmit={handleSubmit} className="flex flex-col justify-center md:p-10 p-6">
              <div className="text-center mb-6">
                <img
                  src={logoSrc}
                  alt="Logo"
                  width={110}
                  height={110}
                  className="mx-auto mb-4"
                />
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                  Bienvenue sur <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500">GHR Inc.</span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Connectez-vous à votre espace professionnel
                </p>
              </div>

              {apiError && (
                <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-300/30 rounded-md">
                  {apiError}
                </div>
              )}

              <div className="mb-5">
                <Label htmlFor="email">Adresse e-mail</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@ghr.com"
                    className="pl-9"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    aria-invalid={!!validationErrors.email}
                    aria-describedby={validationErrors.email ? "email-error" : undefined}
                  />
                </div>
                {validationErrors.email && (
                  <p id="email-error" className="text-sm text-red-500 mt-1">{validationErrors.email}</p>
                )}
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <a
                    href="/forgot-password"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-9 pr-10"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    aria-invalid={!!validationErrors.password}
                    aria-describedby={validationErrors.password ? "password-error" : undefined}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleTogglePassword}
                    className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-transparent"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {validationErrors.password && (
                  <p id="password-error" className="text-sm text-red-500 mt-1">{validationErrors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:scale-[1.02] transition-transform duration-300"
                aria-disabled={loading}
              >
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>

            {/* Illustration côté droit */}
            <div className="hidden md:flex items-center justify-center rounded-lg h-full relative bg-gradient-to-br from-blue-600/80 to-purple-700/80 dark:from-blue-900/60 dark:to-purple-900/60">
              <img
                src="https://img.icons8.com/3d-fluency/400/lock--v1.png"
                alt="Connexion sécurisée"
                className="w-64 h-64 drop-shadow-2xl animate-float-slow"
                aria-hidden="true"
              />
              <div className="absolute bottom-6 text-white/80 text-sm text-center px-6">
                *Vos informations sont protégées et chiffrées
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
