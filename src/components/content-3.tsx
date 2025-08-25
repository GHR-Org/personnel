import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function ContentSection() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
                {/* La structure de la grille est déplacée pour englober l'image et le texte */}
                <div className="grid gap-6 md:grid-cols-2 md:gap-12 items-center"> {/* Ajout de items-center pour aligner verticalement */}
                    {/* Image à gauche */}
                    <img
                        className="rounded-(--radius) grayscale w-full h-auto" // `w-full h-auto` pour s'assurer qu'elle remplit sa colonne et garde ses proportions
                        src="/image/business.png"
                        alt="Bureau moderne avec un ordinateur portable et des documents, symbolisant la gestion efficace"
                        height={400}
                        width={800}
                        loading="lazy"
                    />

                    {/* Contenu à droite */}
                    <div className="space-y-6">
                        {/* Le titre h2 existant de la colonne de texte est maintenant le titre principal */}
                        <h2 className="text-4xl font-medium">L&apos;écosystème GHR Inc. : Votre partenaire pour une gestion simplifiée et efficace.</h2>
                        <p>
                            GHR Inc. ne se limite pas à une simple application. Nous avons bâti un écosystème complet qui rassemble nos solutions, produits et plateformes pour vous offrir une expérience de gestion intégrée et innovante.
                            Que vous soyez une petite entreprise ou une grande organisation, GHR Inc. est conçu pour optimiser vos opérations.
                        </p>

                        <Button
                            asChild
                            variant="secondary"
                            size="sm"
                            className="gap-1 pr-1.5">
                            <Link href="/about">
                                <span>Découvrir GHR Inc.</span>
                                <ChevronRight className="size-2" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
