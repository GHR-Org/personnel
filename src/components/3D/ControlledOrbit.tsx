import { OrbitControls } from "@react-three/drei";

export function ControlledOrbit() {
  return (
    <OrbitControls
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={5}
      maxDistance={50}
      onChange={(e) => {
        if (!e) return;
        const cam = e.target.object;
        const pos = cam.position;

        pos.x = Math.min(19, Math.max(-19, pos.x));
        pos.y = Math.min(9.9, Math.max(1, pos.y)); // plafond à 4.9 pour être juste sous le plafond
        pos.z = Math.min(19, Math.max(-19, pos.z));
      }}
    />
  );
}
