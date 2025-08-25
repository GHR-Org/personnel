/* eslint-disable @typescript-eslint/no-unused-vars */
import { useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import React from "react";
import { Compass } from "./Compass";
import * as THREE from "three";



export function CompassViewport() {
  const { gl, scene, size } = useThree();
  const aspect = size.width / size.height;

  const compassCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  compassCamera.position.set(2, 2, 2);
  compassCamera.lookAt(0, 0, 0);
  compassCamera.updateProjectionMatrix();

  React.useEffect(() => {
    // On peut ici créer une scène dédiée si besoin,
    // ou juste afficher un groupe Compass dans la même scène.
  }, []);

  // On utilise la fonction onAfterRender ou un render personnalisé pour dessiner la boussole

  return (
    <>
      {/* Tu peux mettre le groupe Compass ici */}
      <group position={[0, 0, 0]}>
        <Compass />
      </group>
    </>
  );
}
