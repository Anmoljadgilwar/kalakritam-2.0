import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { config } from '../../config/environment';
import { useUserAuth } from '../../contexts/UserAuthContext';
import { useNavigationWithLoading } from '../../hooks/useNavigationWithLoading';
import { useUsernameValidation } from '../ValidateUsername/ValidateUsername';
import { toast } from '../../utils/notifications.js';
import {
  FiArrowLeft, FiMusic, FiVolumeX, FiX, FiInfo, FiSun, FiMoon,
  FiChevronLeft, FiChevronRight, FiPlay, FiPause, FiMaximize2,
  FiEye, FiZoomIn
} from 'react-icons/fi';
import { MdDirectionsWalk, MdOutlineExplore, MdOutlineTour } from 'react-icons/md';
import { HiOutlineLightBulb } from 'react-icons/hi';
import './VirtualGallery.css';

// ─── Room Configuration ──────────────────────────────────────────────────────
const ROOM = { W: 38, D: 28, H: 5.2 };
const EYE_H = 1.75;

// ─── CORS-Safe URL for WebGL Textures ────────────────────────────────────────
// Three.js TextureLoader requires CORS headers for cross-origin images (WebGL
// security policy). In dev, the Vite server proxies /r2-proxy/* to the R2 CDN
// with CORS headers injected. In production the CDN is already same-origin.
const R2_CDN = 'https://pub-9cdd84716e0341ba9fa9c0b6875b5572.r2.dev';
const getWebGLSafeUrl = (url) => {
  if (!url) return null;
  // In dev mode, rewrite R2 CDN URLs to go through the Vite proxy
  if (!import.meta.env.PROD && url.includes(R2_CDN)) {
    return url.replace(R2_CDN, '/r2-proxy');
  }
  return url;
};

// Load a texture via fetch→blob so WebGL always gets a same-origin blob: URL
const loadTextureViaBlobUrl = (rawUrl, onLoad, onError) => {
  const safeUrl = getWebGLSafeUrl(rawUrl);
  if (!safeUrl) { onError(new Error('No URL')); return () => {}; }

  let blobUrl = null;
  let cancelled = false;

  fetch(safeUrl)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.blob();
    })
    .then(blob => {
      if (cancelled) return;
      blobUrl = URL.createObjectURL(blob);
      const loader = new THREE.TextureLoader();
      loader.load(
        blobUrl,
        (tex) => {
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.generateMipmaps = true;
          onLoad(tex);
          // Keep blobUrl alive while tex is alive — revoke on dispose
          tex.addEventListener('dispose', () => URL.revokeObjectURL(blobUrl));
        },
        undefined,
        (err) => {
          URL.revokeObjectURL(blobUrl);
          onError(err);
        }
      );
    })
    .catch(err => {
      if (!cancelled) onError(err);
    });

  return () => { cancelled = true; if (blobUrl) URL.revokeObjectURL(blobUrl); };
};

const getDynamicRoomConfig = (count) => {
  if (count <= 6)  return { spacing: 4.5, maxFront: 2, maxBack: 2, maxLeft: 1, maxRight: 1 };
  if (count <= 12) return { spacing: 5.0, maxFront: 4, maxBack: 4, maxLeft: 2, maxRight: 2 };
  return               { spacing: 5.5, maxFront: 7, maxBack: 7, maxLeft: 5, maxRight: 5 };
};

const getPaintingLayout = (artworks) => {
  if (!artworks.length) return [];
  const cfg = getDynamicRoomConfig(artworks.length);
  const { spacing, maxFront, maxBack, maxLeft, maxRight } = cfg;
  const h = 1.85;
  const layout = [];
  const slots = [];

  // Front wall (z = -D/2+0.18)
  for (let i = 0; i < maxFront; i++) {
    const x = (i - (maxFront - 1) / 2) * spacing;
    slots.push({ position: [x, h, -ROOM.D / 2 + 0.18], rotation: [0, 0, 0], lightPos: [x, h + 2.4, -ROOM.D / 2 + 2], cameraPos: [x, EYE_H, -ROOM.D / 2 + 3], lookAt: [x, h, -ROOM.D / 2 + 0.18], wall: 'front' });
  }
  // Back wall (z = D/2-0.18)
  for (let i = 0; i < maxBack; i++) {
    const x = (i - (maxBack - 1) / 2) * spacing;
    slots.push({ position: [x, h, ROOM.D / 2 - 0.18], rotation: [0, Math.PI, 0], lightPos: [x, h + 2.4, ROOM.D / 2 - 2], cameraPos: [x, EYE_H, ROOM.D / 2 - 3], lookAt: [x, h, ROOM.D / 2 - 0.18], wall: 'back' });
  }
  // Left wall (x = -W/2+0.18)
  for (let i = 0; i < maxLeft; i++) {
    const z = (i - (maxLeft - 1) / 2) * spacing;
    slots.push({ position: [-ROOM.W / 2 + 0.18, h, z], rotation: [0, Math.PI / 2, 0], lightPos: [-ROOM.W / 2 + 2, h + 2.4, z], cameraPos: [-ROOM.W / 2 + 3, EYE_H, z], lookAt: [-ROOM.W / 2 + 0.18, h, z], wall: 'left' });
  }
  // Right wall (x = W/2-0.18)
  for (let i = 0; i < maxRight; i++) {
    const z = (i - (maxRight - 1) / 2) * spacing;
    slots.push({ position: [ROOM.W / 2 - 0.18, h, z], rotation: [0, -Math.PI / 2, 0], lightPos: [ROOM.W / 2 - 2, h + 2.4, z], cameraPos: [ROOM.W / 2 - 3, EYE_H, z], lookAt: [ROOM.W / 2 - 0.18, h, z], wall: 'right' });
  }

  const total = Math.min(artworks.length, slots.length);
  for (let i = 0; i < total; i++) {
    layout.push({ id: artworks[i].id, artwork: artworks[i], ...slots[i] });
  }
  return layout;
};

// ─── Placeholder Canvas Texture ───────────────────────────────────────────────
const makePlaceholder = (title, artist) => {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 360;
  const ctx = c.getContext('2d');

  const g = ctx.createLinearGradient(0, 0, 512, 360);
  g.addColorStop(0, '#001a1a'); g.addColorStop(1, '#000808');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 360);

  ctx.strokeStyle = '#c38f21'; ctx.lineWidth = 5;
  ctx.strokeRect(14, 14, 484, 332);
  ctx.lineWidth = 1.5; ctx.strokeRect(22, 22, 468, 316);

  const corners = [[25,25],[484,25],[25,334],[484,334]];
  corners.forEach(([cx, cy]) => {
    const dx = cx < 256 ? 1 : -1, dy = cy < 180 ? 1 : -1;
    ctx.fillStyle = '#c38f21';
    ctx.fillRect(cx - (dx < 0 ? 16 : 0), cy - (dy < 0 ? 2 : 0), 16, 2);
    ctx.fillRect(cx - (dx < 0 ? 2 : 0), cy - (dy < 0 ? 16 : 0), 2, 16);
  });

  ctx.fillStyle = '#d4af85'; ctx.font = 'bold 11px serif';
  ctx.textAlign = 'center'; ctx.letterSpacing = '3px';
  ctx.fillText('K A L A K R I T A M', 256, 68);
  ctx.strokeStyle = 'rgba(195,143,33,0.25)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(140, 84); ctx.lineTo(372, 84); ctx.stroke();

  ctx.font = 'italic 22px serif'; ctx.fillStyle = '#ffffff';
  const words = (title || 'Exhibition Piece').split(' ');
  let line = '', y = 170;
  for (const word of words) {
    const test = line + word + ' ';
    if (ctx.measureText(test).width > 400 && line) {
      ctx.fillText(line.trim(), 256, y); line = word + ' '; y += 30;
    } else { line = test; }
  }
  ctx.fillText(line.trim(), 256, y);

  ctx.font = '13px serif'; ctx.fillStyle = '#c38f21';
  ctx.fillText(`— ${artist || 'Kalakritam Artist'} —`, 256, y + 48);

  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
};

// ─── Painting Mesh ────────────────────────────────────────────────────────────
const Painting = ({ layout, onSelect, isSelected, highlightColor }) => {
  const [tex, setTex] = useState(null);
  const frameRef = useRef();
  const { artwork, position, rotation } = layout;

  useEffect(() => {
    if (!artwork.imageUrl) {
      setTex(makePlaceholder(artwork.title, artwork.artist));
      return;
    }
    // Load via fetch→blob so the WebGL context always receives a same-origin
    // blob: URL regardless of dev/prod CORS configuration.
    const cancel = loadTextureViaBlobUrl(
      artwork.imageUrl,
      (t) => setTex(t),
      () => setTex(makePlaceholder(artwork.title, artwork.artist))
    );
    return cancel; // Cleanup: cancel pending fetch and revoke blob URL
  }, [artwork.imageUrl, artwork.title, artwork.artist]);

  useFrame((_, delta) => {
    if (!frameRef.current) return;
    const target = isSelected ? 1.08 : 1.0;
    frameRef.current.scale.lerp(new THREE.Vector3(target, target, target), 8 * delta);
  });

  const gold = isSelected ? '#ffe066' : '#c38f21';
  const emissiveI = isSelected ? 0.18 : 0.0;

  return (
    <group position={position} rotation={rotation} ref={frameRef}>
      {/* Spotlight above painting */}
      <spotLight
        position={[0, 2.8, 1.0]}
        target-position={[0, 0, 0]}
        intensity={isSelected ? 14 : 9}
        angle={0.38}
        penumbra={0.85}
        color="#fff3d0"
        castShadow
        distance={8}
        decay={2}
      />
      {/* Fixture cylinder */}
      <mesh position={[0, 2.65, 0.9]}>
        <cylinderGeometry args={[0.06, 0.09, 0.22, 8]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.95} roughness={0.05} />
      </mesh>

      {/* Outer gold frame */}
      <mesh castShadow>
        <boxGeometry args={[3.3, 2.3, 0.07]} />
        <meshStandardMaterial color={gold} roughness={0.18} metalness={0.82} emissive={gold} emissiveIntensity={emissiveI} />
      </mesh>
      {/* Frame bevels */}
      <mesh position={[0, 1.1, 0.035]}>
        <boxGeometry args={[3.3, 0.06, 0.08]} />
        <meshStandardMaterial color="#a8760f" metalness={0.9} roughness={0.12} />
      </mesh>
      <mesh position={[0, -1.1, 0.035]}>
        <boxGeometry args={[3.3, 0.06, 0.08]} />
        <meshStandardMaterial color="#a8760f" metalness={0.9} roughness={0.12} />
      </mesh>
      <mesh position={[-1.6, 0, 0.035]}>
        <boxGeometry args={[0.06, 2.3, 0.08]} />
        <meshStandardMaterial color="#a8760f" metalness={0.9} roughness={0.12} />
      </mesh>
      <mesh position={[1.6, 0, 0.035]}>
        <boxGeometry args={[0.06, 2.3, 0.08]} />
        <meshStandardMaterial color="#a8760f" metalness={0.9} roughness={0.12} />
      </mesh>

      {/* Canvas */}
      <mesh
        position={[0, 0, 0.06]}
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
      >
        <planeGeometry args={[3.0, 2.0]} />
        {tex
          ? <meshBasicMaterial map={tex} toneMapped={false} />
          : <meshStandardMaterial color="#001818" roughness={0.95} />
        }
      </mesh>

      {/* Selection glow ring */}
      {isSelected && (
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[3.5, 2.5]} />
          <meshBasicMaterial color="#ffe066" transparent opacity={0.06} />
        </mesh>
      )}
    </group>
  );
};

// ─── FPS Walk Controller ──────────────────────────────────────────────────────
const FPSController = ({ active, locked }) => {
  const { camera } = useThree();
  const keys = useRef({});

  useEffect(() => {
    if (!active) return;
    const down = (e) => { keys.current[e.code] = true; };
    const up   = (e) => { keys.current[e.code] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [active]);

  useFrame((_, dt) => {
    if (!active || !locked) return;
    const speed = 5.5 * dt;
    const dir = new THREE.Vector3(); camera.getWorldDirection(dir); dir.y = 0; dir.normalize();
    const right = new THREE.Vector3().copy(dir).applyAxisAngle(new THREE.Vector3(0,1,0), -Math.PI/2);
    const move = new THREE.Vector3();
    if (keys.current['KeyW'] || keys.current['ArrowUp'])    move.add(dir);
    if (keys.current['KeyS'] || keys.current['ArrowDown'])  move.sub(dir);
    if (keys.current['KeyD'] || keys.current['ArrowRight']) move.add(right);
    if (keys.current['KeyA'] || keys.current['ArrowLeft'])  move.sub(right);
    if (move.lengthSq() > 0) { move.normalize().multiplyScalar(speed); camera.position.add(move); }
    camera.position.x = Math.max(-ROOM.W/2+1, Math.min(ROOM.W/2-1, camera.position.x));
    camera.position.z = Math.max(-ROOM.D/2+1, Math.min(ROOM.D/2-1, camera.position.z));
    camera.position.y = EYE_H;
  });
  return null;
};

// ─── Camera Glide To Target ───────────────────────────────────────────────────
const GlideController = ({ target }) => {
  const { camera, controls } = useThree();
  
  useFrame((_, dt) => {
    if (!target) return;
    const s = THREE.MathUtils.clamp(4.5 * dt, 0, 1);
    
    // Smoothly interpolate camera position
    camera.position.lerp(new THREE.Vector3(...target.cameraPos), s);
    
    const lk = new THREE.Vector3(...target.lookAt);
    
    if (controls) {
      // If OrbitControls is active, interpolate its target to avoid fighting
      controls.target.lerp(lk, s);
      controls.update();
    } else {
      // Manual quaternion interpolation if controls are not active
      const dummy = new THREE.Object3D();
      dummy.position.copy(camera.position);
      dummy.lookAt(lk);
      camera.quaternion.slerp(dummy.quaternion, s);
    }
  });
  return null;
};

// ─── Room Environment ─────────────────────────────────────────────────────────
const ExhibitionRoom = ({ artworks, onSelect, selectedId, glideTarget, navMode, lightsOn }) => {
  const layout = useMemo(() => getPaintingLayout(artworks), [artworks]);

  // Floor tile pattern
  const floorTex = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 256; c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#100a06'; ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#150d08';
    for (let r = 0; r < 4; r++) for (let cl = 0; cl < 4; cl++) {
      if ((r + cl) % 2 === 0) ctx.fillRect(cl*64, r*64, 64, 64);
    }
    ctx.strokeStyle = 'rgba(195,143,33,0.12)'; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(i*64,0); ctx.lineTo(i*64,256); ctx.stroke(); }
    for (let i = 0; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(0,i*64); ctx.lineTo(256,i*64); ctx.stroke(); }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(10, 7);
    return t;
  }, []);

  const ambI = lightsOn ? 0.55 : 0.08;
  const dirI = lightsOn ? 0.35 : 0.03;

  return (
    <group>
      {/* Scene Lighting */}
      <ambientLight color="#fff8f0" intensity={ambI} />
      <directionalLight position={[4, 9, 4]} intensity={dirI} color="#fff5e0" castShadow />
      {/* Cool fill from top */}
      <directionalLight position={[-6, 8, -6]} intensity={lightsOn ? 0.12 : 0.0} color="#d0e8ff" />

      {/* Ceiling chandelier point lights */}
      {lightsOn && [[-10, 0], [0, 0], [10, 0], [-10, -8], [10, -8], [-10, 8], [10, 8]].map(([x, z], i) => (
        <pointLight key={i} position={[x, ROOM.H - 0.5, z]} intensity={1.8} distance={12} decay={2} color="#ffe8b0" />
      ))}

      {/* Per-painting spotlight */}
      {layout.map((item) => (
        <spotLight
          key={`sl-${item.id}`}
          position={item.lightPos}
          intensity={lightsOn ? 10 : 5}
          angle={0.42}
          penumbra={0.9}
          color="#fff3d0"
          castShadow={false}
          distance={9}
          decay={2}
        />
      ))}

      {/* Paintings */}
      {layout.map((item) => (
        <Painting
          key={item.id}
          layout={item}
          isSelected={selectedId === item.id}
          onSelect={() => onSelect(item)}
        />
      ))}

      {/* ── Floor ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM.W + 2, ROOM.D + 2]} />
        <meshStandardMaterial map={floorTex} roughness={0.18} metalness={0.55} />
      </mesh>
      {/* Gold skirting line */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[ROOM.W + 2, 0.03, ROOM.D + 2]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* ── Ceiling ── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM.H, 0]}>
        <planeGeometry args={[ROOM.W + 2, ROOM.D + 2]} />
        <meshStandardMaterial color="#060606" roughness={0.95} />
      </mesh>

      {/* Ceiling grid of track lights */}
      {[-12, -6, 0, 6, 12].map(x => (
        <mesh key={`trkx${x}`} position={[x, ROOM.H - 0.04, 0]}>
          <boxGeometry args={[0.12, 0.06, ROOM.D + 1]} />
          <meshStandardMaterial color="#111" metalness={0.9} roughness={0.08} />
        </mesh>
      ))}
      {[-8, 0, 8].map(z => (
        <mesh key={`trkz${z}`} position={[0, ROOM.H - 0.04, z]}>
          <boxGeometry args={[ROOM.W + 1, 0.06, 0.12]} />
          <meshStandardMaterial color="#111" metalness={0.9} roughness={0.08} />
        </mesh>
      ))}

      {/* ── Walls ── */}
      {/* Front */}
      <mesh position={[0, ROOM.H/2, -ROOM.D/2]}>
        <planeGeometry args={[ROOM.W, ROOM.H]} />
        <meshStandardMaterial color="#18201e" roughness={0.88} />
      </mesh>
      {/* Back */}
      <mesh position={[0, ROOM.H/2, ROOM.D/2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[ROOM.W, ROOM.H]} />
        <meshStandardMaterial color="#18201e" roughness={0.88} />
      </mesh>
      {/* Left */}
      <mesh position={[-ROOM.W/2, ROOM.H/2, 0]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[ROOM.D, ROOM.H]} />
        <meshStandardMaterial color="#18201e" roughness={0.88} />
      </mesh>
      {/* Right */}
      <mesh position={[ROOM.W/2, ROOM.H/2, 0]} rotation={[0, -Math.PI/2, 0]}>
        <planeGeometry args={[ROOM.D, ROOM.H]} />
        <meshStandardMaterial color="#18201e" roughness={0.88} />
      </mesh>

      {/* ── Gold wall crown molding ── */}
      {[
        { pos: [0, ROOM.H - 0.06, -ROOM.D/2 + 0.02], size: [ROOM.W, 0.12, 0.04] },
        { pos: [0, ROOM.H - 0.06, ROOM.D/2 - 0.02],  size: [ROOM.W, 0.12, 0.04] },
        { pos: [-ROOM.W/2 + 0.02, ROOM.H - 0.06, 0], size: [0.04, 0.12, ROOM.D] },
        { pos: [ROOM.W/2 - 0.02, ROOM.H - 0.06, 0],  size: [0.04, 0.12, ROOM.D] },
        { pos: [0, 0.12, -ROOM.D/2 + 0.02],           size: [ROOM.W, 0.24, 0.04] },
        { pos: [0, 0.12, ROOM.D/2 - 0.02],            size: [ROOM.W, 0.24, 0.04] },
        { pos: [-ROOM.W/2 + 0.02, 0.12, 0],           size: [0.04, 0.24, ROOM.D] },
        { pos: [ROOM.W/2 - 0.02, 0.12, 0],            size: [0.04, 0.24, ROOM.D] },
      ].map((m, i) => (
        <mesh key={`mold${i}`} position={m.pos}>
          <boxGeometry args={m.size} />
          <meshStandardMaterial color="#c38f21" metalness={0.85} roughness={0.15} />
        </mesh>
      ))}

      {/* ── Decorative wall panel strips ── */}
      {[-14, -7, 0, 7, 14].map(x => [
        [-ROOM.D/2 + 0.03, 0], [ROOM.D/2 - 0.03, Math.PI],
      ].map(([z, ry], j) => (
        <mesh key={`ws-${x}-${j}`} position={[x, ROOM.H/2, z]} rotation={[0, ry, 0]}>
          <boxGeometry args={[0.05, ROOM.H - 0.5, 0.025]} />
          <meshStandardMaterial color="#c38f21" metalness={0.7} roughness={0.3} transparent opacity={0.3} />
        </mesh>
      )))}

      {/* ── Central Columns ── */}
      {[[-7, -7], [7, -7], [-7, 7], [7, 7]].map(([cx, cz], i) => (
        <group key={`col${i}`} position={[cx, 0, cz]}>
          <mesh position={[0, ROOM.H/2, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, ROOM.H, 12]} />
            <meshStandardMaterial color="#1c2828" roughness={0.65} metalness={0.35} />
          </mesh>
          {/* Column base */}
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.35, 0.38, 0.3, 12]} />
            <meshStandardMaterial color="#c38f21" metalness={0.85} roughness={0.15} />
          </mesh>
          {/* Column capital */}
          <mesh position={[0, ROOM.H - 0.15, 0]}>
            <cylinderGeometry args={[0.35, 0.28, 0.28, 12]} />
            <meshStandardMaterial color="#c38f21" metalness={0.85} roughness={0.15} />
          </mesh>
        </group>
      ))}

      {/* ── Central Display Plinth ── */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.35, 1.5, 1.1, 24]} />
          <meshStandardMaterial color="#0d1a1a" roughness={0.7} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[1.6, 1.7, 0.04, 24]} />
          <meshStandardMaterial color="#c38f21" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 1.11, 0]}>
          <cylinderGeometry args={[1.5, 1.35, 0.04, 24]} />
          <meshStandardMaterial color="#c38f21" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Central sculpture placeholder sphere */}
        <mesh position={[0, 1.75, 0]} castShadow>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial color="#c38f21" metalness={0.95} roughness={0.05} />
        </mesh>
        <pointLight position={[0, 1.8, 0]} intensity={lightsOn ? 3 : 0.8} distance={6} decay={2} color="#ffe8a0" />
      </group>

      {/* ── Viewing Benches ── */}
      {[[0, -10], [0, 10]].map(([bx, bz], i) => (
        <group key={`bench${i}`} position={[bx, 0, bz]} rotation={[0, i === 0 ? 0 : Math.PI, 0]}>
          <mesh position={[0, 0.36, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.8, 0.72, 0.95]} />
            <meshStandardMaterial color="#0b1313" roughness={0.75} />
          </mesh>
          <mesh position={[0, 0.72, 0]}>
            <boxGeometry args={[3.9, 0.1, 1.05]} />
            <meshStandardMaterial color="#c38f21" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.77, 0]} castShadow>
            <boxGeometry args={[3.7, 0.1, 0.85]} />
            <meshStandardMaterial color="#1a3030" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Controllers */}
      <GlideController target={glideTarget} />
    </group>
  );
};

// ─── Keyboard Layout Pill ─────────────────────────────────────────────────────
const KeyCap = ({ k }) => (
  <span style={{
    display:'inline-flex', alignItems:'center', justifyContent:'center',
    background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.25)',
    borderRadius:'5px', padding:'2px 7px', fontFamily:'monospace', fontSize:'0.75rem',
    color:'#fff', lineHeight:'1.4', margin:'0 2px'
  }}>{k}</span>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const VirtualGallery = () => {
  const { username } = useParams();
  const { navigateWithLoading } = useNavigationWithLoading();
  const { isAuthenticated, user } = useUserAuth();
  useUsernameValidation('gallery');

  const [artworks, setArtworks]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [navMode, setNavMode]           = useState('orbit'); // 'orbit' | 'walk'
  const [fpsLocked, setFpsLocked]       = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [glideTarget, setGlideTarget]   = useState(null);
  const [lightsOn, setLightsOn]         = useState(true);
  const [showGuide, setShowGuide]       = useState(true);
  const [tourMode, setTourMode]         = useState(false);
  const [tourIdx, setTourIdx]           = useState(0);
  const plcRef = useRef(null);
  const tourTimer = useRef(null);
  const layout = useMemo(() => getPaintingLayout(artworks), [artworks]);

  // ── Fetch artworks ──
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${config.apiBaseUrl}/gallery?page=1&limit=28`);
        const data = await res.json();
        if (data.success && data.data) {
          setArtworks(data.data.map(item => ({
            ...item,
            imageUrl: config.transformImageUrl(item.image_url || item.imageUrl)
          })));
        } else { setError('Failed to load exhibition data.'); }
      } catch (e) { setError('Connection failure. Please try again.'); }
      finally { setLoading(false); }
    })();
  }, []);

  // ── Tour mode ──
  useEffect(() => {
    if (!tourMode || !layout.length) { clearInterval(tourTimer.current); return; }
    const advance = () => setTourIdx(i => (i + 1) % layout.length);
    tourTimer.current = setInterval(advance, 4200);
    return () => clearInterval(tourTimer.current);
  }, [tourMode, layout.length]);

  useEffect(() => {
    if (tourMode && layout.length > 0) {
      const item = layout[tourIdx % layout.length];
      setSelectedItem(item);
      setGlideTarget(item);
    }
  }, [tourMode, tourIdx, layout]);

  // ── Handlers ──
  const handleSelect = useCallback((item) => {
    setSelectedItem(item);
    setGlideTarget(item);
    setNavMode('orbit');
    setTourMode(false);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedItem(null);
    setGlideTarget(null);
  }, []);

  const handleNavPrev = useCallback(() => {
    if (!layout.length) return;
    const cur = layout.findIndex(l => l.id === selectedItem?.id);
    const ni = (cur - 1 + layout.length) % layout.length;
    handleSelect(layout[ni]);
  }, [layout, selectedItem, handleSelect]);

  const handleNavNext = useCallback(() => {
    if (!layout.length) return;
    const cur = layout.findIndex(l => l.id === selectedItem?.id);
    const ni = (cur + 1) % layout.length;
    handleSelect(layout[ni]);
  }, [layout, selectedItem, handleSelect]);

  const handleInquire = () => {
    if (!selectedItem) return;
    const subj = encodeURIComponent(`Inquiry: ${selectedItem.artwork.title}`);
    const msg  = encodeURIComponent(`Hello, I am interested in "${selectedItem.artwork.title}" by ${selectedItem.artwork.artist}.`);
    const base = (username && isAuthenticated) ? `/u/${username}/contact` : '/contact';
    navigateWithLoading(`${base}?subject=${subj}&message=${msg}`);
  };

  const handleBackToGallery = () => {
    const base = (username && isAuthenticated) ? `/u/${username}/gallery` : '/gallery';
    navigateWithLoading(base);
  };

  const switchToWalk = () => {
    setNavMode('walk');
    setGlideTarget(null);
    setSelectedItem(null);
    setTourMode(false);
    toast.info('Click the 3D scene to lock your mouse. Use W/A/S/D to walk. Press ESC to unlock.');
  };

  // ── Loading ──
  if (loading) return (
    <div className="vg-loading">
      <div className="vg-loading-inner">
        <div className="vg-spinner" />
        <p className="vg-loading-title">Preparing Exhibition</p>
        <p className="vg-loading-sub">Setting up your 3D art experience...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="vg-error">
      <div className="vg-error-inner">
        <div className="vg-error-icon">⚠️</div>
        <h2>Exhibition Unavailable</h2>
        <p>{error}</p>
        <button onClick={handleBackToGallery} className="vg-error-btn">← Return to Gallery</button>
      </div>
    </div>
  );

  return (
    <div className="vg-root">
      {/* ── 3D Canvas ── */}
      <Canvas
        shadows
        camera={{ position: [0, EYE_H, 8], fov: 62, near: 0.05, far: 200 }}
        className="vg-canvas"
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      >
        <ExhibitionRoom
          artworks={artworks}
          onSelect={handleSelect}
          selectedId={selectedItem?.id}
          glideTarget={glideTarget}
          navMode={navMode}
          lightsOn={lightsOn}
        />
        {navMode === 'orbit' && (
          <OrbitControls
            enableZoom
            enablePan={false}
            maxPolarAngle={Math.PI / 2 - 0.04}
            minDistance={1.5}
            maxDistance={22}
            makeDefault
          />
        )}
        {navMode === 'walk' && (
          <>
            <PointerLockControls
              ref={plcRef}
              onLock={() => setFpsLocked(true)}
              onUnlock={() => setFpsLocked(false)}
            />
            <FPSController active={navMode === 'walk'} locked={fpsLocked} />
          </>
        )}
      </Canvas>

      {/* ═══════════════════════════════════════════════════
          HUD LAYER
      ═══════════════════════════════════════════════════ */}

      {/* ── Top Header ── */}
      <header className="vg-header" onPointerDown={e => e.stopPropagation()}>
        <div className="vg-header-left">
          <button className="vg-pill vg-back-pill" onClick={handleBackToGallery}>
            <FiArrowLeft size={14} />
            <span>Gallery</span>
          </button>
          <div className="header-brand" style={{ transform: 'scale(0.8)', transformOrigin: 'left center' }} onClick={handleBackToGallery}>
            <h1 className="kalakritam-title">Kalakritam</h1>
            <div className="header-subtitle">Manifesting Through Arts</div>
          </div>
        </div>
        <div className="vg-header-right">
          <button
            className={`vg-pill vg-light-pill ${lightsOn ? 'active' : ''}`}
            onClick={() => setLightsOn(p => !p)}
            title={lightsOn ? 'Dim Lights' : 'Turn On Lights'}
          >
            {lightsOn ? <HiOutlineLightBulb size={15} /> : <FiMoon size={15} />}
            <span>{lightsOn ? 'Lit' : 'Dim'}</span>
          </button>
          <button
            className={`vg-pill vg-tour-pill ${tourMode ? 'active' : ''}`}
            onClick={() => { setTourMode(p => !p); setTourIdx(0); }}
            title="Auto Tour"
          >
            {tourMode ? <FiPause size={14} /> : <MdOutlineTour size={15} />}
            <span>{tourMode ? 'Stop Tour' : 'Auto Tour'}</span>
          </button>
        </div>
      </header>

      {/* ── Bottom Nav Bar ── */}
      <nav className="vg-nav-bar" onPointerDown={e => e.stopPropagation()}>
        <div className="vg-nav-modes">
          <button
            className={`vg-nav-btn ${navMode === 'orbit' ? 'active' : ''}`}
            onClick={() => { setNavMode('orbit'); }}
          >
            <MdOutlineExplore size={16} />
            <span>Orbit</span>
          </button>
          <button
            className={`vg-nav-btn ${navMode === 'walk' ? 'active' : ''}`}
            onClick={switchToWalk}
          >
            <MdDirectionsWalk size={16} />
            <span>Walk</span>
          </button>
        </div>

        <div className="vg-nav-divider" />

        {/* Artwork navigation arrows (when one selected) */}
        {selectedItem && (
          <div className="vg-artwork-nav">
            <button className="vg-arrow-btn" onClick={handleNavPrev} title="Previous artwork">
              <FiChevronLeft size={18} />
            </button>
            <span className="vg-artwork-counter">
              {layout.findIndex(l => l.id === selectedItem.id) + 1} / {layout.length}
            </span>
            <button className="vg-arrow-btn" onClick={handleNavNext} title="Next artwork">
              <FiChevronRight size={18} />
            </button>
          </div>
        )}

        <div className="vg-nav-divider" />

        <button
          className="vg-nav-btn vg-guide-toggle"
          onClick={() => setShowGuide(p => !p)}
        >
          <FiInfo size={15} />
          <span>Help</span>
        </button>
      </nav>

      {/* ── Walk Mode Overlay ── */}
      {navMode === 'walk' && !fpsLocked && (
        <div className="vg-walk-overlay" onPointerDown={e => e.stopPropagation()}>
          <div className="vg-walk-hint">
            <MdDirectionsWalk size={28} />
            <p>Click anywhere in the scene to start walking</p>
            <p className="vg-walk-hint-sub">Use <KeyCap k="W"/> <KeyCap k="A"/> <KeyCap k="S"/> <KeyCap k="D"/> to move · <KeyCap k="ESC"/> to exit</p>
          </div>
        </div>
      )}

      {/* ── Active Walk Mode Hint ── */}
      {navMode === 'walk' && fpsLocked && (
        <div className="vg-walk-active-hint">
          <p>Press <KeyCap k="ESC"/> to exit walk mode</p>
        </div>
      )}

      {/* ── Controls Guide ── */}
      {showGuide && (
        <div className="vg-guide" onPointerDown={e => e.stopPropagation()}>
          <div className="vg-guide-header">
            <FiInfo size={13} style={{ color: '#c38f21' }} />
            <span>Controls</span>
            <button className="vg-guide-close" onClick={() => setShowGuide(false)}><FiX size={12} /></button>
          </div>
          <ul className="vg-guide-list">
            <li><span className="vg-guide-label">Select artwork</span><span className="vg-guide-val">Click any painting</span></li>
            <li><span className="vg-guide-label">Look around</span><span className="vg-guide-val">Drag mouse (Orbit)</span></li>
            <li><span className="vg-guide-label">Zoom</span><span className="vg-guide-val">Scroll wheel</span></li>
            {navMode === 'walk' ? (
              <>
                <li><span className="vg-guide-label">Move</span><span className="vg-guide-val"><KeyCap k="W"/><KeyCap k="A"/><KeyCap k="S"/><KeyCap k="D"/></span></li>
                <li><span className="vg-guide-label">Release cursor</span><span className="vg-guide-val"><KeyCap k="ESC"/></span></li>
              </>
            ) : (
              <li><span className="vg-guide-label">Pan view</span><span className="vg-guide-val">Right-click + drag</span></li>
            )}
            <li><span className="vg-guide-label">Auto Tour</span><span className="vg-guide-val">Top-right button</span></li>
            <li><span className="vg-guide-label">Toggle Lights</span><span className="vg-guide-val">Top-right button</span></li>
          </ul>
        </div>
      )}

      {/* ── Artwork Detail Panel ── */}
      {selectedItem && (
        <aside className="vg-detail-panel" onPointerDown={e => e.stopPropagation()}>
          {/* Thumbnail */}
          {selectedItem.artwork.imageUrl && (
            <div className="vg-detail-thumb-wrap">
              <img
                src={selectedItem.artwork.imageUrl}
                alt={selectedItem.artwork.title}
                className="vg-detail-thumb"
                onError={e => { e.target.style.display = 'none'; }}
              />
              <div className="vg-detail-thumb-overlay">
                <FiZoomIn size={18} />
              </div>
            </div>
          )}
          {/* Info */}
          <div className="vg-detail-body">
            <span className="vg-detail-badge">
              <FiEye size={10} /> Now Viewing
            </span>
            <h3 className="vg-detail-title">{selectedItem.artwork.title}</h3>
            <p className="vg-detail-artist">by {selectedItem.artwork.artist || 'Unknown Artist'}</p>

            <div className="vg-detail-meta">
              {selectedItem.artwork.medium && (
                <div className="vg-meta-row">
                  <span className="vg-meta-k">Medium</span>
                  <span className="vg-meta-v">{selectedItem.artwork.medium}</span>
                </div>
              )}
              {selectedItem.artwork.year && (
                <div className="vg-meta-row">
                  <span className="vg-meta-k">Year</span>
                  <span className="vg-meta-v">{selectedItem.artwork.year}</span>
                </div>
              )}
              {selectedItem.artwork.category && (
                <div className="vg-meta-row">
                  <span className="vg-meta-k">Category</span>
                  <span className="vg-meta-v">{selectedItem.artwork.category}</span>
                </div>
              )}
              {selectedItem.artwork.price && (
                <div className="vg-meta-row vg-price-row">
                  <span className="vg-meta-k">Price</span>
                  <span className="vg-meta-v vg-price">{selectedItem.artwork.price}</span>
                </div>
              )}
            </div>

            {selectedItem.artwork.description && (
              <p className="vg-detail-desc">{selectedItem.artwork.description}</p>
            )}
          </div>

          <div className="vg-detail-actions">
            <button className="vg-inquire-btn" onClick={handleInquire}>Make an Inquiry</button>
            <button className="vg-resume-btn" onClick={handleClose}>
              <MdOutlineExplore size={14} /> Resume Tour
            </button>
          </div>

          <button className="vg-detail-close" onClick={handleClose}><FiX size={14} /></button>
        </aside>
      )}

      {/* ── Artwork count badge ── */}
      <div className="vg-count-badge" onPointerDown={e => e.stopPropagation()}>
        {layout.length} Artworks on Display
      </div>
    </div>
  );
};

export default VirtualGallery;
