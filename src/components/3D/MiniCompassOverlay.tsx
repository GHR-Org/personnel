/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Canvas } from "@react-three/fiber";
import { Compass } from "./Compass";
import { OrthographicCamera } from "@react-three/drei";
import { MiniCompass } from "./MiniCompas";

export function MiniCompassOverlay() {
  return (
    <div className="absolute top-2 right-2 w-24 h-24 pointer-events-none z-50">
      <Canvas
        orthographic
        camera={{ zoom: 50, position: [2, 2, 2], up: [0, 1, 0], near: 0.1, far: 100 }}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} />
        <MiniCompass/>
      </Canvas>
    </div>
  );
}
