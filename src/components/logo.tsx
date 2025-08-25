import { cn } from '../lib/utils'
import React from 'react';
import Image from 'next/image'; // Importez le composant Image de Next.js
import { useTheme } from 'next-themes'; // Importez le hook de thème

export const Logo = ({ className }: { className?: string }) => {
    // Utilisez le hook useTheme pour obtenir le thème actuel
    const { theme } = useTheme();

    // Déterminez la source de l'image en fonction du thème
    const imageSrc = theme === 'dark' ? '/logo/dark.png' : '/logo/white.png';

    return (
        // La balise `<img>` est remplacée par le composant `Image` de Next.js
        <Image
            src={imageSrc}
            alt="Logo GHR Inc."
            width={60} 
            height={50}
            className={cn('inline-block', className)}
        />
    )
}
