import { OrthographicCamera } from "@react-three/drei";

export function MiniMapCamera() {
  return (
    <OrthographicCamera
      makeDefault={false}
      position={[0, 150, 0]} // Vue du dessus
      zoom={20}
      rotation={[-Math.PI / 2, 0, 0]}
    />
  );
}

