import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

export default function Pricing() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-6xl px-6">
                <div className="mx-auto max-w-2xl space-y-6 text-center">
                    <h1 className="text-center text-4xl font-semibold lg:text-5xl">Des tarifs qui évoluent avec vous</h1>
                    <p>
                        Découvrez nos plans tarifaires conçus pour s'adapter à la taille et aux besoins de votre entreprise,
                        de la petite structure aux grandes organisations.
                    </p>
                </div>

                <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
                    {/* Plan Gratuit */}
                    <Card className="flex flex-col justify-between">
                        <CardHeader>
                            <CardTitle className="font-medium">Gratuit</CardTitle>
                            <span className="my-3 block text-2xl font-semibold">0 € / mois</span>
                            <CardDescription className="text-sm">Pour commencer</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <hr className="border-dashed" />

                            <ul className="list-outside space-y-3 text-sm">
                                {['Tableau de bord basique', 'Jusqu\'à 10 enregistrements/mois', 'Support par email', 'Accès limité aux rapports standards', '1 utilisateur', 'Fonctionnalités de base', 'Mises à jour limitées', 'Communauté en ligne'].map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-2">
                                        <Check className="size-3" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            
                        </CardContent>
                        <CardFooter>
                            <Button
                                variant="outline"
                                className="w-full">
                                <Link href="/signup">Commencer gratuitement</Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Plan Pro (Populaire) */}
                    <Card className="relative">
                        <span className="bg-linear-to-br/increasing absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full from-purple-400 to-amber-300 px-3 py-1 text-xs font-medium text-amber-950 ring-1 ring-inset ring-white/20 ring-offset-1 ring-offset-gray-950/5">Populaire</span>

                        <div className="flex flex-col justify-between h-full">
                            <CardHeader>
                                <CardTitle className="font-medium">Pro</CardTitle>
                                <span className="my-3 block text-2xl font-semibold">19 € / mois</span>
                                <CardDescription className="text-sm">Par utilisateur actif</CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <hr className="border-dashed" />
                                <ul className="list-outside space-y-3 text-sm">
                                    {['Toutes les fonctionnalités du plan Gratuit', 'Jusqu\'à 15 utilisateurs', 'Support prioritaire email & chat', 'Accès aux modèles avancés', 'Accès mobile et tablette', '10 rapports personnalisés/mois', 'Mises à jour produit continues', 'Fonctionnalités de sécurité avancées'].map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-2">
                                            <Check className="size-3" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    asChild
                                    className="w-full">
                                    <Link href="/signup?plan=pro">Choisir le plan Pro</Link>
                                </Button>
                            </CardFooter>
                        </div>
                    </Card>

                    {/* Plan Entreprise (ou Avancé) */}
                    <Card className="flex flex-col justify-between">
                        <CardHeader>
                            <CardTitle className="font-medium">Entreprise</CardTitle> {/* Ou "Premium", "Business" */}
                            <span className="my-3 block text-2xl font-semibold">49 € / mois</span> {/* Ajustez le prix */}
                            <CardDescription className="text-sm">Pour équipes & grandes entreprises</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <hr className="border-dashed" />

                            <ul className="list-outside space-y-3 text-sm">
                                {/* Les éléments du plan "Startup" dans votre code original n'étaient pas très différents du plan "Pro".
                                    Ici, je propose des fonctionnalités distinctives pour un plan de niveau supérieur. */}
                                {['Toutes les fonctionnalités du plan Pro', 'Utilisateurs illimités', 'Stockage cloud illimité', 'Support téléphonique dédié 24/7', 'Rapports entièrement personnalisables', 'Gestion des rôles et permissions avancée', 'Intégrations illimitées & API', 'Formation et accompagnement personnalisés', 'Tableaux de bord multi-entreprises'].map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-2">
                                        <Check className="size-3" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>

                        <CardFooter className="mt-auto place-item-end">
                            <Button
                                asChild
                                variant="outline"
                                className="w-full">
                                <Link href="/contact">Contactez-nous</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </section>
    )
}
