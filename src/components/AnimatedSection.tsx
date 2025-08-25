'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function AnimatedSection({ children }: { children: React.ReactNode }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%', // Déclenche l'animation lorsque le haut de la section est à 80% de la fenêtre d'affichage
            toggleActions: 'play none none none',
            once: true, // L'animation ne se déclenche qu'une seule fois
          },
        }
      );
    }
  }, []);

  return <div ref={sectionRef}>{children}</div>;
}