/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
// On importe les types de matériaux génériques pour plus de flexibilité
import { TextureLoader, Mesh, MeshStandardMaterial, Object3D, Material, Texture } from "three"; 

// 🎯 Le nom de la maille de l'écran dans votre fichier GLTF. 
// À AJUSTER si le nom dans votre modèle est différent (ex: 'Display', 'Phone_Screen', etc.)
const SCREEN_MESH_NAME = 'Screen'; 


function ModelWithScreen() {
  const gltf = useGLTF("/models/Iphone.glb");
  const screenTexture = useLoader(TextureLoader, "/image/screenshot.jpg");

  let screenMesh: Mesh | null = null;
  
  // 1. CIBLAGE PRÉCIS : Utiliser getObjectByName est plus fiable que traverse pour cibler un objet précis.
  // getObjectByName retourne un Object3D, on l'assure d'être un Mesh.
  const foundObject = gltf.scene.getObjectByName(SCREEN_MESH_NAME);
  
  if (foundObject && (foundObject as Mesh).isMesh) {
    screenMesh = foundObject as Mesh;
  }
  
  // 2. Assigner la texture si la maille de l'écran a été trouvée
  if (screenMesh) {
    const material = screenMesh.material;
    
    // Gérer les cas où l'objet a un seul matériau ou plusieurs matériaux
    if (Array.isArray(material)) {
        // Si c'est un tableau, vous devez savoir quel index est l'écran. 
        // C'est rare pour les écrans, mais si c'est le cas, remplacez 0 par l'index correct.
        const screenMaterial = material[0] as Material & { map: Texture | null }; 

        if (screenMaterial) {
            screenMaterial.map = screenTexture;
            screenMaterial.needsUpdate = true;
        }
        
    } else if (material) {
        // C'est un matériau simple. On le type pour ajouter la propriété 'map'
        const singleMaterial = material as Material & { map: Texture | null };
        
        singleMaterial.map = screenTexture;
        singleMaterial.needsUpdate = true;
    }
  }

  // J'ai mis scale={0.2} pour revenir à la valeur initiale (vous aviez mis 1, mais 0.2 était là avant)
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