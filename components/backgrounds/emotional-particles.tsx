"use client";

import { useFrame } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function FloatingParticles() {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(96 * 3);

    for (let index = 0; index < 96; index += 1) {
      values[index * 3] = (Math.random() - 0.5) * 12;
      values[index * 3 + 1] = (Math.random() - 0.5) * 9;
      values[index * 3 + 2] = (Math.random() - 0.5) * 6;
    }

    return values;
  }, []);

  useFrame((state) => {
    if (!points.current) {
      return;
    }

    points.current.rotation.y = state.clock.elapsedTime * 0.02;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.16) * 0.08;
    points.current.position.x = THREE.MathUtils.lerp(
      points.current.position.x,
      state.pointer.x * 0.4,
      0.03
    );
    points.current.position.y = THREE.MathUtils.lerp(
      points.current.position.y,
      state.pointer.y * 0.28,
      0.03
    );
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#f7d2ba"
        size={0.06}
        transparent
        opacity={0.75}
        sizeAttenuation
      />
    </points>
  );
}

export function EmotionalParticles() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 opacity-60">
      <Canvas
        dpr={[1, 1.25]}
        gl={{ antialias: false, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 5], fov: 55 }}
      >
        <ambientLight intensity={1.4} />
        <FloatingParticles />
      </Canvas>
    </div>
  );
}
