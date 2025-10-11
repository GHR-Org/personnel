"use client";

import NotFound404 from "../../../components/404";

// import { Alert } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSlot,
// } from "@/components/ui/input-otp";
// import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
// import { Label } from "@/components/ui/label";
// import { useAuth } from "@/hooks/useAuth";
// import { Etablissement } from "@/types/etablissement";
// import { useEffect, useState } from "react";
// import {
//   fetchCountries,
//   typeOptions,
//   validateCodePostal,
//   validateEmail,
//   validatePassword,
//   validatePhone,
//   validateSiteWeb,
// } from "@/lib/constants";
// import CountrySelect from "@/components/ContrySelect";
// import { useRouter } from "next/navigation";

// export default function RegisterPage() {
//   const [step, setStep] = useState<1 | 2>(1);
//   const [data, setData] = useState<Etablissement | null>({
//     nom: "",
//     adresse: "",
//     ville: "",
//     pays: "",
//     code_postal: "",
//     telephone: "",
//     email: "",
//     site_web: "",
//     description: "",
//     type_: "Hotelerie",
//     mot_de_passe: "",
//     logo: "",
//     statut: "Inactive",
//   });
//   const [code, setCode] = useState("");
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState("");
//   const [apiError, setApiError] = useState("");
//   const [countries, setCountries] = useState<{ name: string; flag: string }[]>(
//     []
//   );
//   const [countriesLoading, setCountriesLoading] = useState(true);
//   const { sendVerifyCode, registerEtablissement } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     setCountriesLoading(true);
//     fetchCountries()
//       .then(setCountries)
//       .finally(() => setCountriesLoading(false));
//   }, []);

//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     setData({ ...data, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: "" });
//   };

//   const validateStep1 = () => {
//     const newErrors: { [key: string]: string } = {};
//     if (!data.nom) newErrors.nom = "Nom requis";
//     if (!data.adresse) newErrors.adresse = "Adresse requise";
//     if (!data.ville) newErrors.ville = "Ville requise";
//     if (!data.pays) newErrors.pays = "Pays requis";
//     if (!validateCodePostal(data.code_postal))
//       newErrors.code_postal = "Code postal invalide";
//     if (!validatePhone(data.telephone))
//       newErrors.telephone = "Téléphone invalide";
//     if (!validateEmail(data.email)) newErrors.email = "Email invalide";
//     if (data.site_web && !validateSiteWeb(data.site_web))
//       newErrors.site_web = "Site web invalide";
//     if (!data.description) newErrors.description = "Description requise";
//     if (!validatePassword(data.mot_de_passe))
//       newErrors.mot_de_passe = "Mot de passe trop court (min 8)";
//     if (!data.logo) newErrors.logo = "Logo requis (URL)";
//     return newErrors;
//   };

//   const handleStep1Submit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setApiError("");
//     setSuccess("");
//     const errs = validateStep1();
//     if (Object.keys(errs).length) {
//       setErrors(errs);
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await sendVerifyCode({ email: data.email });
//       if (res?.message) {
//         setSuccess(res.message);
//         setStep(2);
//       } else {
//         setSuccess("Un code de vérification a été envoyé à votre email.");
//         setStep(2);
//       }
//     } catch (err: any) {
//       setApiError(
//         err.message || "Erreur lors de l'envoi du code de vérification"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStep2Submit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setApiError("");
//     if (!code) {
//       setErrors({ code: "Code requis" });
//       return;
//     }
//     setLoading(true);
//     try {
//       await registerEtablissement({ data, code });
//       setSuccess("Inscription réussie ! Vous pouvez vous connecter.");
//       router.push("/etablissement/login");
//     } catch (err: any) {
//       setApiError(err.message || "Erreur lors de l'inscription");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-background px-4">
//       <Card className="w-full max-w-lg p-8 shadow-lg border border-border bg-card">
//         <h2 className="text-2xl font-bold mb-6 text-primary">
//           Inscription Établissement
//         </h2>
//         {success && (
//           <Alert className="mb-4" variant="success">
//             {success}
//           </Alert>
//         )}
//         {apiError && (
//           <Alert className="mb-4" variant="destructive">
//             {apiError}
//           </Alert>
//         )}
//         {step === 1 && (
//           <form
//             onSubmit={handleStep1Submit}
//             className="space-y-4 animate-in fade-in duration-500"
//           >
//             <div>
//               <Label htmlFor="nom">Nom</Label>
//               <Input
//                 name="nom"
//                 value={data.nom}
//                 onChange={handleChange}
//                 placeholder="Nom de l'établissement"
//                 required
//               />
//               {errors.nom && (
//                 <span className="text-destructive text-sm">{errors.nom}</span>
//               )}
//             </div>
//             <div>
//               <Label htmlFor="adresse">Adresse</Label>
//               <Input
//                 name="adresse"
//                 value={data.adresse}
//                 onChange={handleChange}
//                 placeholder="Adresse"
//                 required
//               />
//               {errors.adresse && (
//                 <span className="text-destructive text-sm">
//                   {errors.adresse}
//                 </span>
//               )}
//             </div>
//             <div className="flex gap-2">
//               <div className="flex-1">
//                 <Label htmlFor="ville">Ville</Label>
//                 <Input
//                   name="ville"
//                   value={data.ville}
//                   onChange={handleChange}
//                   placeholder="Ville"
//                   required
//                 />
//                 {errors.ville && (
//                   <span className="text-destructive text-sm">
//                     {errors.ville}
//                   </span>
//                 )}
//               </div>
//               <div className="flex-1">
//                 <Label htmlFor="pays">Pays</Label>
//                 {countriesLoading ? (
//                   <div className="flex items-center gap-2 text-muted-foreground py-2">
//                     Chargement des pays...
//                   </div>
//                 ) : (
//                   <CountrySelect
//                     countries={countries}
//                     value={data.pays}
//                     onChange={(val) => {
//                       setData({ ...data, pays: val });
//                       setErrors({ ...errors, pays: "" });
//                     }}
//                   />
//                 )}
//                 {errors.pays && (
//                   <span className="text-destructive text-sm">
//                     {errors.pays}
//                   </span>
//                 )}
//               </div>
//             </div>
//             <div className="flex gap-2">
//               <div className="flex-1">
//                 <Label htmlFor="code_postal">Code Postal</Label>
//                 <Input
//                   name="code_postal"
//                   value={data.code_postal}
//                   onChange={handleChange}
//                   placeholder="Code postal"
//                   required
//                 />
//                 {errors.code_postal && (
//                   <span className="text-destructive text-sm">
//                     {errors.code_postal}
//                   </span>
//                 )}
//               </div>
//               <div className="flex-1">
//                 <Label htmlFor="telephone">Téléphone</Label>
//                 <Input
//                   name="telephone"
//                   value={data.telephone}
//                   onChange={handleChange}
//                   placeholder="Téléphone"
//                   required
//                 />
//                 {errors.telephone && (
//                   <span className="text-destructive text-sm">
//                     {errors.telephone}
//                   </span>
//                 )}
//               </div>
//             </div>
//             <div>
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 name="email"
//                 value={data.email}
//                 onChange={handleChange}
//                 placeholder="Email"
//                 required
//                 type="email"
//               />
//               {errors.email && (
//                 <span className="text-destructive text-sm">{errors.email}</span>
//               )}
//             </div>
//             <div>
//               <Label htmlFor="site_web">Site Web</Label>
//               <Input
//                 name="site_web"
//                 value={data.site_web}
//                 onChange={handleChange}
//                 placeholder="Site web"
//               />
//               {errors.site_web && (
//                 <span className="text-destructive text-sm">
//                   {errors.site_web}
//                 </span>
//               )}
//             </div>
//             <div>
//               <Label htmlFor="description">Description</Label>
//               <textarea
//                 name="description"
//                 value={data.description}
//                 onChange={handleChange}
//                 placeholder="Description"
//                 className="w-full border rounded px-2 py-2 bg-background text-foreground"
//                 required
//               />
//               {errors.description && (
//                 <span className="text-destructive text-sm">
//                   {errors.description}
//                 </span>
//               )}
//             </div>
//             <div>
//               <Label htmlFor="type_">Type</Label>
//               <select
//                 name="type_"
//                 value={data.type_}
//                 onChange={handleChange}
//                 className="w-full border rounded px-2 py-2 bg-background text-foreground"
//               >
//                 {typeOptions.map((t) => (
//                   <option key={t} value={t}>
//                     {t}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <Label htmlFor="mot_de_passe">Mot de passe</Label>
//               <Input
//                 name="mot_de_passe"
//                 value={data.mot_de_passe}
//                 onChange={handleChange}
//                 placeholder="Mot de passe"
//                 type="password"
//                 required
//               />
//               {errors.mot_de_passe && (
//                 <span className="text-destructive text-sm">
//                   {errors.mot_de_passe}
//                 </span>
//               )}
//             </div>
//             <div>
//               <Label htmlFor="logo">Logo (URL)</Label>
//               <Input
//                 name="logo"
//                 value={data.logo}
//                 onChange={handleChange}
//                 placeholder="URL du logo"
//                 required
//               />
//               {errors.logo && (
//                 <span className="text-destructive text-sm">{errors.logo}</span>
//               )}
//             </div>
//             <Button type="submit" className="w-full" disabled={loading}>
//               {loading ? "Envoi..." : "Envoyer le code de vérification"}
//             </Button>
//           </form>
//         )}
//         {step === 2 && (
//           <form
//             onSubmit={handleStep2Submit}
//             className="space-y-4 animate-in fade-in duration-500"
//           >
//             <div>
//               <Label htmlFor="code">Code de vérification</Label>
//               <InputOTP
//                 value={code}
//                 onChange={(val) => {
//                   setCode(val);
//                   setErrors({ ...errors, code: "" });
//                 }}
//                 maxLength={6}
//                 pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
//                 name="code"
//                 autoFocus
//               >
//                 <InputOTPGroup>
//                   <InputOTPSlot index={0} />
//                   <InputOTPSlot index={1} />
//                   <InputOTPSlot index={2} />
//                   <InputOTPSlot index={3} />
//                   <InputOTPSlot index={4} />
//                   <InputOTPSlot index={5} />
//                 </InputOTPGroup>
//               </InputOTP>
//               {errors.code && (
//                 <span className="text-destructive text-sm">{errors.code}</span>
//               )}
//             </div>
//             <Button type="submit" className="w-full" disabled={loading}>
//               {loading ? "Inscription..." : "Valider et s'inscrire"}
//             </Button>
//           </form>
//         )}
//       </Card>
//     </div>
//   );
// }

export default RegisterPage(){
  return (
    <>
    <NotFound404 />
    </>
  )

}