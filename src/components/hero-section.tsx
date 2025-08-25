import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { TextEffect } from '@/components/ui/text-effect'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { HeroHeader } from '@/components/header'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: "spring",
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
} as const

export default function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden relative">
                {/* Ajout du conteneur de la vidéo d'arrière-plan.
                  - `absolute inset-0`: positionne le conteneur sur l'intégralité de la section.
                  - `-z-20`: place la vidéo sous le contenu principal.
                  - `overflow-hidden`: évite les barres de défilement si la vidéo est plus grande.
                */}
                <div className="absolute inset-0 -z-20 overflow-hidden">
                    {/* La balise vidéo.
                      - `source src`: pointe vers le fichier vidéo dans le dossier public.
                      - `autoPlay`: lance la lecture automatiquement.
                      - `loop`: répète la vidéo en boucle.
                      - `muted`: désactive le son pour une meilleure expérience utilisateur.
                      - `playsInline`: permet à la vidéo de jouer sur les appareils mobiles sans passer en mode plein écran.
                      - `object-cover`: s'assure que la vidéo couvre tout le conteneur sans être déformée.
                      - `w-full h-full`: s'assure que la vidéo prend toute la taille du conteneur.
                    */}
                    <video
                        className="w-full h-full object-cover"
                        src="/video/HotelBG.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                </div>

                {/* Les effets de fond visuels sont désormais superposés à la vidéo.
                  Ajuster leur opacité ou leur couleur peut être nécessaire pour qu'ils se marient bien avec la vidéo.
                  J'ai laissé la classe `relative` sur la balise `main` pour que les éléments à l'intérieur
                  soient positionnés correctement par rapport à la vidéo en arrière-plan.
                */}
                <div
                    aria-hidden
                    className="absolute inset-0 isolate hidden opacity-100 contain-strict lg:block">
                    <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
                </div>
                
                <section>
                    <div className="relative pt-24 md:pt-36">
                        {/* Ce `AnimatedGroup` est maintenant inutile car son seul enfant était un fragment vide */}
                        {/* <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            delayChildren: 1,
                                        },
                                    },
                                },
                                item: {
                                    hidden: {
                                        opacity: 0,
                                        y: 20,
                                    },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            type: 'spring',
                                            bounce: 0.3,
                                            duration: 2,
                                        },
                                    },
                                },
                            }}
                            className="absolute inset-0 -z-20"
                        >
                            <></>
                        </AnimatedGroup> */}
                        
                        <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"></div>
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants}>
                                    <Link
                                        href="#nouvelles"
                                        className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                                        <span className="text-foreground text-sm">Découvrez nos dernières mises à jour pour la gestion hôtelière !</span>
                                        <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                                        <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </AnimatedGroup>

                                <TextEffect
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    as="h1"
                                    className="mt-8 text-balance sm:text-4xl text-4xl md:text-7xl lg:mt-16 xl:text-[5.25rem] text-gray-900 dark:text-white">
                                    Simplifiez la Gestion de votre Hôtel avec GHR Inc.
                                </TextEffect>
                                <TextEffect
                                    per="line"
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    delay={0.5}
                                    as="p"
                                    className="mx-auto mt-8 max-w-2xl text-balance text-lg text-gray-700 dark:text-gray-300">
                                    Notre application tout-en-un révolutionne la gestion des réservations, des chambres et du personnel, pour une expérience client et une efficacité opérationnelle inégalées.
                                </TextEffect>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                                    <>
                                        <div
                                            key={1}
                                            className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                                            <Button
                                                asChild
                                                size="lg"
                                                className="rounded-xl px-5 text-base">
                                                <Link href="/inscription">
                                                    <span className="text-nowrap">Découvrir l&apos;Application</span>
                                                </Link>
                                            </Button>
                                        </div>
                                        <Button
                                            key={2}
                                            asChild
                                            size="lg"
                                            variant="ghost"
                                            className="h-10.5 rounded-xl px-5">
                                            <Link href="/contact#demo">
                                                <span className="text-nowrap">Demander une démo</span>
                                            </Link>
                                        </Button>
                                    </>
                                </AnimatedGroup>
                            </div>
                        </div>

                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}>
                            <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                                <div
                                    aria-hidden
                                    className="bg-linear-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                                />
                                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                                    <Image
                                        className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
                                        src="/image/ghr-app-dark.png"
                                        alt="Interface de l'application GHR Inc. (Mode Sombre)"
                                        width={2700}
                                        height={1440}
                                        priority
                                    />
                                    <Image
                                        className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden"
                                        src="/image/ghr-app-light.png"
                                        alt="Interface de l'application GHR Inc. (Mode Clair)"
                                        width={2700}
                                        height={1440}
                                        priority
                                    />
                                </div>
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>
            </main>
        </>
    )
}