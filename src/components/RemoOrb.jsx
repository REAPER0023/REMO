import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function RemoBall() {
  const ballRef = useRef(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (ballRef.current) {
      // Gentle floating
      ballRef.current.position.y =
        Math.sin(time * 0.8) * 0.08;

      // Very subtle movement
      ballRef.current.rotation.y =
        Math.sin(time * 0.35) * 0.06;

      ballRef.current.rotation.x =
        Math.sin(time * 0.25) * 0.025;
    }
  });

  return (
    <group ref={ballRef}>

      {/* =================================
          MAIN GLOSSY REMO BODY
      ================================= */}

      <mesh scale={[1, 0.97, 1]}>

        <sphereGeometry
          args={[1.35, 96, 96]}
        />

        <meshPhysicalMaterial
        color="#6424b8"

         roughness={0.18}
          metalness={0.08}

          clearcoat={1}
          clearcoatRoughness={0.04}

          transmission={0.08}
          thickness={0.5}

          sheen={0.4}
          sheenColor="#c084fc"

          iridescence={0.15}
          iridescenceIOR={1.3}
        />

      </mesh>


      {/* =================================
          SOFT OUTER PURPLE GLOW
      ================================= */}

      <mesh scale={[1.04, 1.01, 1.04]}>

        <sphereGeometry
          args={[1.35, 64, 64]}
        />

        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.055}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />

      </mesh>


      {/* =================================
          LEFT EYE
      ================================= */}

      <mesh
        position={[-0.31, 0.25, 1.28]}
        scale={[0.72, 1.15, 0.35]}
      >

        <sphereGeometry
        args={[0.15, 48, 48]}
        />

        <meshPhysicalMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1.8}

          roughness={0.08}
          metalness={0}

          clearcoat={1}
        />

      </mesh>


      {/* =================================
          RIGHT EYE
      ================================= */}

      <mesh
        position={[0.31, 0.25, 1.28]}
        scale={[0.72, 1.15, 0.35]}
      >

        <sphereGeometry
          args={[0.17, 48, 48]}
        />

        <meshPhysicalMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1.8}

          roughness={0.08}
          metalness={0}

          clearcoat={1}
        />

      </mesh>


      {/* =================================
          EYE GLOW
      ================================= */}

      <pointLight
        position={[-0.32, 0.28, 1.35]}
        intensity={0.45}
        distance={1.2}
        color="#ffffff"
      />

      <pointLight
        position={[0.32, 0.28, 1.35]}
        intensity={0.45}
        distance={1.2}
        color="#ffffff"
      />

    </group>
  );
}


function RemoOrb() {
  return (
    <div className="remo-3d-container">

      <Canvas
        camera={{
          position: [0, 0, 4],
          fov: 42,
        }}

        gl={{
          antialias: true,
          alpha: true,
        }}

        dpr={[1, 2]}
      >

        {/* =================================
            ATMOSPHERIC LIGHTING
        ================================= */}

        <ambientLight
          intensity={0.28}
        />


        {/* Main soft light */}

        <directionalLight
          position={[-3, 4, 5]}
          intensity={2.8}
          color="#ffffff"
        />


        {/* Purple side light */}

        <pointLight
          position={[-3, 0, 3]}
          intensity={4}
          distance={6}
          color="#8b5cf6"
        />


        {/* Magenta rim light */}

        <pointLight
          position={[3, -1, 2]}
          intensity={3}
          distance={5}
          color="#c026d3"
        />


        {/* Soft blue/purple bottom light */}

        <pointLight
          position={[0, -3, 2]}
          intensity={1.5}
          distance={5}
          color="#4c1d95"
        />


        <RemoBall />

      </Canvas>

    </div>
  );
}

export default RemoOrb;