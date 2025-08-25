/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import { Compass } from "./Compass";

export function MiniCompass() {
  const { gl, size, camera } = useThree();
  const compassScene = useRef(new THREE.Scene());
  const compassCamera = useRef(new THREE.PerspectiveCamera(50, 1, 0.1, 10));
  const compassRenderer = useRef<THREE.WebGLRenderer | null>(null);
  const compassContainer = useRef<HTMLDivElement | null>(null);

  useFrame(() => {
    const renderer = gl;
    if (!renderer) return;

    const width = size.width;
    const height = size.height;

    // Positionne et oriente la boussole
    compassCamera.current.position.copy(camera.position).normalize().multiplyScalar(2);
    compassCamera.current.up.copy(camera.up);
    compassCamera.current.lookAt(0, 0, 0);

    // On garde l'affichage principal intact
    renderer.autoClear = false;

    // Définir la zone de rendu de la boussole (en bas à droite)
    const viewSize = 100; // px
    renderer.clearDepth(); // Permet de dessiner par-dessus
    renderer.setScissorTest(true);
    renderer.setScissor(width - viewSize - 16, 16, viewSize, viewSize);
    renderer.setViewport(width - viewSize - 16, 16, viewSize, viewSize);

    renderer.render(compassScene.current, compassCamera.current);
    renderer.setScissorTest(false);
  });

  // Initialise la boussole une seule fois
  React.useEffect(() => {
    compassScene.current.clear();

    const compass = new THREE.Group();
    compass.add(new THREE.AxesHelper(0.8)); // Ou <Compass /> si tu préfères

    compassScene.current.add(compass);
  }, []);

  return null; // Pas d'affichage React, juste rendu direct via Three.js
}
