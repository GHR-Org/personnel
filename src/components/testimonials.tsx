import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Testimonials() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-6xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <h2 className="text-4xl font-medium lg:text-5xl">Créée par des experts, adoptée par des milliers d&apos;entreprises</h2>
                    <p>
                        GHR Inc. est plus qu&apos;une simple application ; c&apos;est un écosystème complet qui soutient et accompagne les entreprises dans leur croissance et leur innovation.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-rows-2">
                    {/* Témoignage 1 (grand format) */}
                    <Card className="grid grid-rows-[auto_1fr] gap-8 sm:col-span-2 sm:p-6 lg:row-span-2">
                        <CardHeader>
                            {/* Option 1: Garder un logo générique ou retirer si pas pertinent pour GHR Inc.
                                Si vous avez des logos de partenaires ou clients, mettez-les ici.
                                Sinon, cette section peut être omise si les témoignages suffisent.
                            */}
                            <img
                                className="h-6 w-fit dark:invert"
                                src="/image/logo-entreprise-generique.svg" // Exemple: un logo générique ou un logo de secteur d'activité
                                alt="Logo Entreprise X" // Adaptez l'alt text
                                height="24"
                                width="auto"
                                loading="lazy"
                            />
                        </CardHeader>
                        <CardContent>
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p className="text-xl font-medium">
                                    &quot;GHR Inc. a révolutionné la façon dont nous gérons nos opérations. L&apos;interface est intuitive et les fonctionnalités sont si complètes qu&apos;elles ont considérablement accéléré nos processus.
                                    C&apos;est un véritable atout pour toute entreprise soucieuse d&apos;efficacité.&quot;
                                </p>

                                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src={getAvatarImage('shekinah')} // Utilisation d'une fonction d'aide pour les avatars
                                            alt="Profil de Sophie Dubois"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>SD</AvatarFallback>
                                    </Avatar>

                                    <div>
                                        <cite className="text-sm font-medium">Sophie Dubois</cite>
                                        <span className="text-muted-foreground block text-sm">Directrice des Opérations, InnovCorp</span>
                                    </div>
                                
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>

                    {/* Témoignage 2 */}
                    <Card className="md:col-span-2">
                        <CardContent className="h-full pt-6">
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p className="text-xl font-medium">
                                    &quot;La simplicité et la puissance de GHR Inc. sont remarquables. Plus besoin de jongler entre mille outils, tout est centralisé. Un gain de temps considérable pour toute mon équipe. Je recommande vivement !&quot;
                                </p>

                                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src={getAvatarImage('jonathan')}
                                            alt="Profil de Marc Lemaire"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>ML</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <cite className="text-sm font-medium">Marc Lemaire</cite>
                                        <span className="text-muted-foreground block text-sm">Responsable Administratif, Alpha Solutions</span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>

                    {/* Témoignage 3 */}
                    <Card>
                        <CardContent className="h-full pt-6">
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p>
                                    &quot;Le support client de GHR Inc. est exceptionnel ! Toujours réactif et à l&apos;écoute, ils nous ont aidé à tirer le meilleur parti de l&apos;application. Une équipe vraiment dédiée à la réussite de ses clients.&quot;
                                </p>

                                <div className="grid items-center gap-3 [grid-template-columns:auto_1fr]">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src={getAvatarImage('yucel')}
                                            alt="Profil de Chloé Martin"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>CM</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <cite className="text-sm font-medium">Chloé Martin</cite>
                                        <span className="text-muted-foreground block text-sm">Chef de Projet, Beta Conseil</span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>

                    {/* Témoignage 4 */}
                    <Card className="card variant-mixed">
                        <CardContent className="h-full pt-6">
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p>
                                    &quot;Grâce à GHR Inc., nous avons rationalisé nos processus internes et amélioré la collaboration entre nos équipes. L&apos;investissement a été rapidement rentabilisé par les gains de productivité !&ldquo;
                                </p>

                                <div className="grid grid-cols-[auto_1fr] gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src={getAvatarImage('rodrigo')}
                                            alt="Profil de David Lambert"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>DL</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">David Lambert</p>
                                        <span className="text-muted-foreground block text-sm">PDG, Delta Solutions</span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

// Fonction d'aide pour gérer les chemins d'images d'avatars
// Ceci est un exemple, vous devriez idéalement stocker vos propres avatars
// ou utiliser un service comme Gravatar pour des images réelles.
const getAvatarImage = (name: string) => {
    switch (name) {
        case 'shekinah':
            return 'https://images.unsplash.com/photo-1573497161742-f857731a55f9?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // Image professionnelle féminine
        case 'jonathan':
            return 'https://images.unsplash.com/photo-1544723795-3fb6469e380e?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // Image professionnelle masculine
        case 'yucel':
            return 'https://images.unsplash.com/photo-1521119989667-aebe8cd82d38?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // Autre image professionnelle
        case 'rodrigo':
            return 'https://images.unsplash.com/photo-1560250097-0b91e96d6741?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // Autre image professionnelle
        default:
            return 'https://via.placeholder.com/150'; // Placeholder par défaut
    }
};
