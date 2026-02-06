// @ts-nocheck
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  ContactShadows, 
  Float, 
  Html
} from '@react-three/drei';
import * as THREE from 'three';

// Augment global JSX.IntrinsicElements for R3F elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
      spotLight: any;
      group: any;
      mesh: any;
      boxGeometry: any;
      planeGeometry: any;
      cylinderGeometry: any;
      meshStandardMaterial: any;
      meshPhysicalMaterial: any;
      meshBasicMaterial: any;
      [elemName: string]: any;
    }
  }
}

interface PodProps {
  series: 'S' | 'M' | 'L';
  allowInteraction?: boolean;
}

const PodGeometry: React.FC<PodProps> = ({ series, allowInteraction = true }) => {
  const groupRef = useRef<THREE.Group>(null);
  const doorRef = useRef<THREE.Group>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Dimensions based on series
  // Height is constant ~2.2m (scaled to 2.2 units)
  const height = 2.2;
  const width = series === 'S' ? 1.2 : series === 'M' ? 2.0 : 2.4;
  const depth = series === 'L' ? 2.0 : 1.2;
  
  // Animate door opening
  useFrame((state, delta) => {
    if (doorRef.current) {
      const targetRotation = isOpen ? -Math.PI / 2.5 : 0;
      doorRef.current.rotation.y = THREE.MathUtils.lerp(
        doorRef.current.rotation.y,
        targetRotation,
        delta * 2
      );
    }
  });

  const handlePointerOver = () => {
    document.body.style.cursor = 'pointer';
  };
  
  const handlePointerOut = () => {
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: any) => {
    if (!allowInteraction) return;
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <group ref={groupRef}>
      {/* Floating animation for subtle life */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <group>
          {/* Main Shell (Back, Top, Bottom, Sides) */}
          {/* Using a collection of boxes to form the frame */}
          
          {/* Back Wall */}
          <mesh position={[0, 0, -depth / 2]} receiveShadow castShadow>
            <boxGeometry args={[width, height, 0.1]} />
            <meshStandardMaterial 
              color="#F8F9FA" 
              metalness={0.6} 
              roughness={0.2} 
            />
          </mesh>

          {/* Top Cap */}
          <mesh position={[0, height / 2, 0]} receiveShadow castShadow>
            <boxGeometry args={[width, 0.1, depth]} />
            <meshStandardMaterial color="#343A40" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Bottom Base */}
          <mesh position={[0, -height / 2, 0]} receiveShadow castShadow>
            <boxGeometry args={[width, 0.1, depth]} />
            <meshStandardMaterial color="#343A40" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Side Left */}
          <mesh position={[-width / 2, 0, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.1, height, depth]} />
            <meshStandardMaterial color="#F8F9FA" metalness={0.6} roughness={0.2} />
          </mesh>

          {/* Side Right */}
          <mesh position={[width / 2, 0, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.1, height, depth]} />
            <meshStandardMaterial color="#F8F9FA" metalness={0.6} roughness={0.2} />
          </mesh>

          {/* Interior (Fake interior box) */}
          <mesh position={[0, 0, 0]}>
             <boxGeometry args={[width - 0.2, height - 0.2, depth - 0.2]} />
             <meshStandardMaterial color="#e2e8f0" side={THREE.BackSide} />
          </mesh>
          
          {/* Interior Light Strip simulation */}
          <mesh position={[0, height/2 - 0.1, 0]} rotation={[Math.PI/2, 0, 0]}>
            <planeGeometry args={[width - 0.4, depth - 0.4]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
          <pointLight position={[0, 0.5, 0]} intensity={1} distance={3} color="#fff1e6" />


          {/* Door Group - Pivot at the side */}
          <group 
            ref={doorRef} 
            position={[width / 2 - 0.05, 0, depth / 2]}
            onClick={allowInteraction ? handleClick : undefined}
            onPointerOver={allowInteraction ? handlePointerOver : undefined}
            onPointerOut={allowInteraction ? handlePointerOut : undefined}
          >
            {/* The Door Pivot Offset */}
            <group position={[-width / 2, 0, 0]}> 
                {/* Door Frame */}
                <mesh position={[width/2, 0, 0]}>
                   <boxGeometry args={[width - 0.1, height - 0.1, 0.05]} />
                   <meshPhysicalMaterial 
                      transparent 
                      transmission={0.95} 
                      roughness={0} 
                      thickness={0.1}
                      color="#ffffff"
                   />
                </mesh>
                
                {/* Door Handle */}
                <mesh position={[0.2, 0, 0.05]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.4]} />
                    <meshStandardMaterial color="#333" />
                </mesh>

                {/* Interactive Hint Label attached to door */}
                {allowInteraction && (
                  <Html position={[width/2, 0.2, 0.1]} center transform distanceFactor={5}>
                      <div 
                        className={`px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] rounded-full whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
                      >
                        Click to Open
                      </div>
                  </Html>
                )}
            </group>
          </group>

        </group>
      </Float>
    </group>
  );
};

const ThreePod: React.FC<PodProps> = ({ series, allowInteraction = true }) => {
  return (
    <div className="w-full h-full relative bg-slate-100/50">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[3, 1, 4]} fov={50} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize={1024} 
        />
        
        {/* Environment for reflections */}
        <Environment preset="city" />

        {/* The Pod */}
        <PodGeometry series={series} allowInteraction={allowInteraction} />

        {/* Ground Shadows */}
        <ContactShadows position={[0, -1.2, 0]} opacity={0.4} scale={10} blur={2.5} far={4.5} />
        
        {/* Controls */}
        <OrbitControls 
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 2}
            enablePan={false}
            minDistance={2}
            maxDistance={8}
        />
      </Canvas>
      
      <div className="absolute bottom-4 left-4 pointer-events-none">
        <p className="text-xs text-slate-400 font-mono">
           Model: {series}-Series<br/>
           {allowInteraction && "Interactive Preview"}
        </p>
      </div>
    </div>
  );
};

export default ThreePod;