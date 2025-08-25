/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { TextureLoader, Mesh, MeshStandardMaterial } from "three";

function ModelWithScreen() {
  const gltf = useGLTF("/models/Iphone.glb");
  const screenTexture = useLoader(TextureLoader, "/image/screenshot.jpg");

  let screenMesh: Mesh | null = null;
  
  // Parcourir le modèle pour trouver la première maille (Mesh)
  gltf.scene.traverse((child) => {
    if ((child as any).isMesh && screenMesh === null) {
      screenMesh = child as Mesh;
    }
  });

  // Assigner la texture si une maille a été trouvée
  if (screenMesh) {
    const material = screenMesh.material as MeshStandardMaterial;
    if (material) {
      material.map = screenTexture;
      material.needsUpdate = true;
    }
  }

  return <primitive object={gltf.scene} scale={0.2} />;
}

export const PhoneCanvas = () => {
  return (
    <div className="relative w-auto h-[100vh]">
      <Canvas shadows camera={{ position: [0, 0, 3], fov: 60 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <Suspense fallback={null}>
          <ModelWithScreen />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={true}
          rotateSpeed={2}
          maxPolarAngle={Math.PI}
          minPolarAngle={0}
          minDistance={3.5}
          maxDistance={5}
        />
      </Canvas>
    </div>
  );
};