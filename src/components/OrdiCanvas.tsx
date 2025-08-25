import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";

function Model() {
  const gltf = useGLTF("/models/laptop.glb");
  return <primitive object={gltf.scene} scale={0.06} />;
}

export const OrdiCanvas = () => {
  return (
    <div className="relative w-auto h-[80vh]">
      <Canvas shadows camera={{ position: [0, 0, 3], fov: 60 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <Suspense fallback={null}>
          <Model />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          rotateSpeed={2}
          maxPolarAngle={Math.PI}
          minPolarAngle={0}
          // Les propriétés de zoom sont en réalité des distances de la caméra
          minDistance={3.5} // Distance minimale de la caméra (plus proche = zoom avant)
          maxDistance={5}   // Distance maximale de la caméra (plus loin = zoom arrière)
        />
      </Canvas>
    </div>
  );
};