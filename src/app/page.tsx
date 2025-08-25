"use client";

import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";
import LogoCloud from "@/components/logo-cloud";
import Pricing from "@/components/pricing";
import Testimonials from "@/components/testimonials";
import FeaturesSection from "@/components/features";
import PresentationSection from "@/components/Presentation";
import OrdiSection from "@/components/Presentation2";
import { AnimatedSection } from "@/components/AnimatedSection"; // Import du composant

export default function Home() {
  return (
    <>
      <HeroSection />
      <AnimatedSection>
        <FeaturesSection />
      </AnimatedSection>
      <AnimatedSection>
        <PresentationSection />
      </AnimatedSection>
      <AnimatedSection>
        <OrdiSection />
      </AnimatedSection>
      <AnimatedSection>
        <Pricing />
      </AnimatedSection>
      <AnimatedSection>
        <Testimonials />
      </AnimatedSection>
      <AnimatedSection>
        <LogoCloud />
      </AnimatedSection>
      <AnimatedSection>
        <FooterSection />
      </AnimatedSection>
    </>
  );
}