/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import * as THREE from 'three';
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF, ScrollControls, Scroll } from '@react-three/drei';
import HeroSection from '@/components/hero-section';
import FeaturesSection from '@/components/features';
import ContentSection from '@/components/content-3';
import PresentationSection from '@/components/Presentation';
import Pricing from '@/components/pricing';
import Testimonials from '@/components/testimonials';
import LogoCloud from '@/components/logo-cloud';
import FooterSection from '@/components/footer';
import { Mesh } from 'three';

// Définissez le type pour le résultat de useGLTF
interface GLTFResult {
  nodes: { [key: string]: Mesh };
  materials: { [key: string]: THREE.Material };
  scene: THREE.Object3D;
  animations: THREE.AnimationClip[];
}

function Model() {
  const gltf = useGLTF('/models/Iphone.glb') as unknown as GLTFResult;
  // Vous pouvez ajuster la taille ici si nécessaire
  return <primitive object={gltf.scene} scale={0.2} />;
}

export default function SceneContainer() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 3], fov: 60 }}
      className="!fixed inset-0 w-screen h-screen"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />

      <Suspense fallback={null}>
        {/* Le nombre de pages doit correspondre à la hauteur de votre contenu */}
        <ScrollControls pages={7} damping={0.1}>
          <Scroll>
            <Model />
          </Scroll>

          <Scroll html>
            <main className="relative z-10">
              <HeroSection />
              <FeaturesSection />
              <ContentSection />
              <PresentationSection />
              <Pricing />
              <Testimonials />
              <LogoCloud />
              <FooterSection />
            </main>
          </Scroll>
        </ScrollControls>
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}