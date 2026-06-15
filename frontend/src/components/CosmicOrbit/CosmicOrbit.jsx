import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import './CosmicOrbit.css';

// Helper to create a circular glowing texture for particles (removes blocky squares)
const createGlowTexture = (colorStr, glowColorStr) => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  
  // Radial gradient
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, colorStr);
  gradient.addColorStop(0.2, colorStr);
  gradient.addColorStop(0.5, glowColorStr);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

// TWINKLING STARS
function Stars({ count = 800 }) {
  const pointsRef = useRef();

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Position inside a large sphere
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 15 + Math.random() * 25; // distance from center
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      
      sz[i] = 0.5 + Math.random() * 1.5;
    }
    return [pos, sz];
  }, [count]);

  const starTexture = useMemo(() => createGlowTexture('#ffffff', 'rgba(255, 255, 255, 0.3)'), []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    // Rotate stars slowly in background
    pointsRef.current.rotation.y = time * 0.002;
    pointsRef.current.rotation.x = time * 0.001;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.15}
        map={starTexture}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// GLOWING ASTROLABE WIREFRAME (METALLIC ARMILLARY SPHERES)
function Astrolabe({ position, scale = 1.0, speed = 0.15 }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime() * speed;
    groupRef.current.rotation.x = time * 0.3;
    groupRef.current.rotation.y = time;
    groupRef.current.rotation.z = time * 0.15;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Outer Meridian Ring */}
      <mesh>
        <torusGeometry args={[1.5, 0.03, 16, 100]} />
        <meshStandardMaterial 
          color="#c38f21" 
          metalness={0.9} 
          roughness={0.15} 
          emissive="#c38f21" 
          emissiveIntensity={0.4} 
        />
      </mesh>
      {/* Equatorial Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.47, 0.03, 16, 100]} />
        <meshStandardMaterial 
          color="#ffe066" 
          metalness={0.9} 
          roughness={0.15} 
          emissive="#ffe066" 
          emissiveIntensity={0.5} 
        />
      </mesh>
      {/* Tilted Zodiac Ring */}
      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[1.44, 0.025, 16, 100]} />
        <meshStandardMaterial 
          color="#c38f21" 
          metalness={0.95} 
          roughness={0.1} 
          emissive="#ffe066" 
          emissiveIntensity={0.4} 
        />
      </mesh>
      {/* Inner Armillary Sphere (Warped Dodecahedron) */}
      <mesh>
        <dodecahedronGeometry args={[1.0, 0]} />
        <meshStandardMaterial 
          color="#ffe066" 
          wireframe={true} 
          metalness={0.9} 
          roughness={0.15} 
          emissive="#ffe066"
          emissiveIntensity={0.6}
        />
      </mesh>
      {/* Center core */}
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color="#ffe066" 
          emissive="#ffe066"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}

// PARTICLES CLOUD FOR ORBITS
function ParticleRing({ radius, color, speed = 0.05, count = 800, ringWidth = 0.5, ringThickness = 0.08, tilt = [0.45, 0.25, 0] }) {
  const pointsRef = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.02;
      const r = radius + (Math.random() - 0.5) * ringWidth;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * ringThickness;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pos;
  }, [count, radius, ringWidth, ringThickness]);

  const glowColor = color === '#ffe066' ? 'rgba(255, 224, 102, 0.35)' : 
                    color === '#00c3c3' ? 'rgba(0, 195, 195, 0.35)' : 'rgba(195, 143, 33, 0.35)';
  const ringTexture = useMemo(() => createGlowTexture(color, glowColor), [color, glowColor]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = time * speed;
  });

  return (
    <points ref={pointsRef} rotation={tilt}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.12}
        map={ringTexture}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// SOLID GLOWING RING BAND
function SolidGlowingRing({ radius, width = 0.015, color = '#ffe066', opacity = 0.4, tilt = [0.45, 0.25, 0] }) {
  return (
    <mesh rotation={tilt}>
      <torusGeometry args={[radius, width, 16, 120]} />
      <meshStandardMaterial 
        color={color} 
        metalness={0.9} 
        roughness={0.1} 
        emissive={color} 
        emissiveIntensity={0.8}
        transparent={true}
        opacity={opacity}
      />
    </mesh>
  );
}

// RUNES ON ORBITS RING
function RuneRing({ radius, speed = 0.05, count = 24, tilt = [0.45, 0.25, 0] }) {
  const groupRef = useRef();

  const runes = useMemo(() => [
    'ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ', 'ᛠ', 'ᛡ', 'ᛢ', 'ᛣ'
  ], []);

  // Generate textures for the runes
  const textures = useMemo(() => {
    return runes.map(char => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fillRect(0, 0, 128, 128);
      
      ctx.shadowColor = '#ffe066';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#ffe066';
      ctx.font = 'bold 88px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(char, 64, 64);
      
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    });
  }, [runes]);

  const items = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const texture = textures[i % textures.length];
      arr.push({ position: [x, 0, z], texture });
    }
    return arr;
  }, [count, radius, textures]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * speed;
  });

  return (
    <group ref={groupRef} rotation={tilt}>
      {items.map((item, idx) => (
        <sprite key={idx} position={item.position} scale={[0.42, 0.42, 1]}>
          <spriteMaterial map={item.texture} transparent={true} opacity={0.85} blending={THREE.AdditiveBlending} />
        </sprite>
      ))}
    </group>
  );
}

// ORBITING 3D PLANET
function OrbitingPlanet({ radius, speed, size, color, emissive, emissiveIntensity, hasRings = false, tilt = [0.45, 0.25, 0] }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * speed;
  });

  return (
    <group ref={groupRef} rotation={tilt}>
      <group position={[radius, 0, 0]}>
        {/* Planet Sphere */}
        <mesh>
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial
            color={color}
            roughness={0.4}
            metalness={0.6}
            emissive={emissive}
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>
        
        {/* Optional Ring system */}
        {hasRings && (
          <mesh rotation={[Math.PI / 3.5, 0, 0]}>
            <torusGeometry args={[size * 1.8, size * 0.05, 8, 64]} />
            <meshStandardMaterial 
              color="#ffe066" 
              metalness={0.9} 
              roughness={0.15} 
              emissive="#ffe066" 
              emissiveIntensity={0.5} 
            />
          </mesh>
        )}
      </group>
    </group>
  );
}

// MAIN CAMERA PARALLAX SCENE
function Scene() {
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    // Smooth camera parallax
    const targetX = mouseRef.current.x * 2.0;
    const targetY = mouseRef.current.y * 1.0;
    
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 3.5 + targetY, 0.04);
    state.camera.lookAt(0, 0, 0);
  });

  const tiltAngle = [0.45, 0.25, 0];

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={3.0} color="#ffe066" />
      <directionalLight position={[-5, 5, -5]} intensity={1.5} color="#00a3a3" />
      
      {/* Soft circular glowing stars */}
      <Stars count={800} />
      
      {/* Left Astrolabe (floating on the left side) */}
      <Astrolabe position={[-5.8, 1.2, -2.5]} scale={1.0} speed={0.12} />
      
      {/* Right Astrolabe (larger, floating on the right side) */}
      <Astrolabe position={[6.0, -1.0, -2.5]} scale={1.2} speed={0.08} />
      
      {/* Orbit 1: Inner Gold Ring */}
      <SolidGlowingRing radius={4.0} color="#c38f21" opacity={0.35} tilt={tiltAngle} />
      <ParticleRing radius={4.0} color="#c38f21" speed={0.08} count={320} tilt={tiltAngle} />
      <OrbitingPlanet 
        radius={4.0} 
        speed={0.08} 
        size={0.18} 
        color="#9b2226" 
        emissive="#ca6702" 
        emissiveIntensity={0.4} 
        tilt={tiltAngle} 
      />

      {/* Orbit 2: Middle Gold Ring with Runes & Saturn */}
      <SolidGlowingRing radius={6.2} color="#ffe066" opacity={0.55} tilt={tiltAngle} />
      <ParticleRing radius={6.2} color="#ffe066" speed={0.05} count={640} tilt={tiltAngle} />
      <RuneRing radius={6.2} speed={0.05} count={24} tilt={tiltAngle} />
      <OrbitingPlanet 
        radius={6.2} 
        speed={0.05} 
        size={0.38} 
        color="#002b28" 
        emissive="#ffe066" 
        emissiveIntensity={0.25} 
        hasRings={true} 
        tilt={tiltAngle} 
      />

      {/* Orbit 3: Outer Teal Ring with Runes & Blue Planet */}
      <SolidGlowingRing radius={8.5} color="#00c3c3" opacity={0.45} tilt={tiltAngle} />
      <ParticleRing radius={8.5} color="#00c3c3" speed={-0.03} count={480} tilt={tiltAngle} />
      <RuneRing radius={8.5} speed={-0.03} count={32} tilt={tiltAngle} />
      <OrbitingPlanet 
        radius={8.5} 
        speed={-0.03} 
        size={0.25} 
        color="#005f73" 
        emissive="#0a9396" 
        emissiveIntensity={0.35} 
        tilt={tiltAngle} 
      />
    </>
  );
}

export default function CosmicOrbit() {
  return (
    <div className="cosmic-orbit-container">
      <Canvas
        camera={{ position: [0, 3.5, 11], fov: 60 }}
        style={{ pointerEvents: 'none' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
