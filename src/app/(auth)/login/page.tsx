"use client";

import React from "react";
import { LoginForm } from "@/components/form/login-form";

export default function LoginPage() {

  return (
    // <div className="flex min-h-screen items-center justify-center bg-background px-4">
    //   <div className="w-full max-w-md p-8 shadow-lg border border-border bg-card">
    //     <h2 className="text-2xl font-bold mb-6 text-primary">
    //       Connexion Établissement
    //     </h2>
    //     {apiError && (
    //       <Alert className="mb-4" variant="destructive">
    //         {apiError}
    //       </Alert>
    //     )}
    //     <form
    //       onSubmit={handleSubmit}
    //       className="space-y-4 animate-in fade-in duration-500"
    //     >
    //       <div>
    //         <Label htmlFor="email">Email</Label>
    //         <Input
    //           name="email"
    //           value={data.email}
    //           onChange={handleChange}
    //           placeholder="Email"
    //           required
    //           type="email"
    //         />
    //         {errors.email && (
    //           <span className="text-destructive text-sm">{errors.email}</span>
    //         )}
    //       </div>
    //       <div>
    //         <Label htmlFor="password">Mot de passe</Label>
    //         <Input
    //           name="password"
    //           value={data.password}
    //           onChange={handleChange}
    //           placeholder="Mot de passe"
    //           type="password"
    //           required
    //         />
    //         {errors.password && (
    //           <span className="text-destructive text-sm">
    //             {errors.password}
    //           </span>
    //         )}
    //       </div>
    //       <Button type="submit" className="w-full" disabled={loading}>
    //         {loading ? "Connexion..." : "Se connecter"}
    //       </Button>
    //     </form>
    //   </div>
    // </div>
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
          <LoginForm />
    </div>
  );
}
