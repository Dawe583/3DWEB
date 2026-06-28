import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Icosahedron } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

// Skips the WebGL canvas on small/touch screens — it's ambient decoration, not
// core content, and isn't worth the GPU/battery cost on mobile.
function useCanRender3D() {
  const [canRender, setCanRender] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches
  );

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => setCanRender(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return canRender;
}

const ACCENT_A = "#818cf8"; // indigo
const ACCENT_B = "#c084fc"; // purple

/** Shared pointer (-1..1), scroll progress (0..1) and a scroll-velocity kick,
 *  all updated outside the R3F loop. Velocity accumulates from raw scroll deltas
 *  (now eased by Lenis) and is bled back to zero each frame inside Field, so a
 *  fast flick spins the crystals and they settle as you stop — tying the 3D
 *  layer directly to the feel of the page scroll. */
function useInput() {
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);
  const velocity = useRef(0);

  useEffect(() => {
    let lastY = window.scrollY;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? y / max : 0;
      // Accumulate a small rotational impulse proportional to scroll speed.
      velocity.current += (y - lastY) * 0.0006;
      lastY = y;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return { pointer, scroll, velocity };
}

type CrystalSpec = {
  position: [number, number, number];
  scale: number;
  detail: number;
  speed: number;
  distort: number;
  floatSpeed: number;
};

// Scattered toward the edges so they're visible in the margins around centred
// content, at varied depths for parallax.
const CRYSTALS: CrystalSpec[] = [
  { position: [-5.4, 1.6, -3], scale: 1.1, detail: 12, speed: 1.2, distort: 0.36, floatSpeed: 1.3 },
  { position: [5.6, -1.2, -3.5], scale: 1.3, detail: 12, speed: 1.0, distort: 0.32, floatSpeed: 1.1 },
  { position: [3.4, 3.4, -4], scale: 0.85, detail: 8, speed: 1.5, distort: 0.42, floatSpeed: 1.7 },
  { position: [-3.6, -3.4, -4], scale: 0.8, detail: 6, speed: 1.6, distort: 0.45, floatSpeed: 1.8 },
  { position: [0, 0.4, -8], scale: 1.7, detail: 12, speed: 0.8, distort: 0.3, floatSpeed: 1.0 },
];

function Crystal({ spec }: { spec: CrystalSpec }) {
  const spinRef = useRef<THREE.Group>(null);

  // Each crystal keeps a slow life of its own on top of the Float bob, so the
  // facets and wireframe catch the light from constantly shifting angles.
  useFrame((_, delta) => {
    const g = spinRef.current;
    if (!g) return;
    g.rotation.y += delta * spec.speed * 0.18;
    g.rotation.x += delta * spec.speed * 0.07;
  });

  return (
    <Float speed={spec.floatSpeed} rotationIntensity={0.5} floatIntensity={0.9} position={spec.position}>
      <group ref={spinRef} scale={spec.scale}>
        <Icosahedron args={[1, spec.detail]}>
          <MeshDistortMaterial
            color={ACCENT_A}
            emissive={ACCENT_B}
            emissiveIntensity={0.18}
            roughness={0.2}
            metalness={0.85}
            distort={spec.distort}
            speed={spec.speed}
          />
        </Icosahedron>
        <Icosahedron args={[1.06, 2]}>
          <meshBasicMaterial color={ACCENT_A} wireframe transparent opacity={0.1} />
        </Icosahedron>
      </group>
    </Float>
  );
}

/** Whole-group eases toward the cursor and rotates/sinks with page scroll, so
 *  every section stays visually tied to the one before it. A slow constant yaw
 *  keeps the field alive even when the user isn't moving. */
function Field() {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer, scroll, velocity } = useInput();
  const baseYaw = useRef(0);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    // Constant drift + a decaying impulse from how fast the page is scrolling.
    baseYaw.current += delta * 0.03 + velocity.current;
    velocity.current = THREE.MathUtils.lerp(velocity.current, 0, 0.08);
    group.rotation.y = THREE.MathUtils.lerp(
      group.rotation.y,
      baseYaw.current + pointer.current.x * 0.35 + scroll.current * 1.4,
      0.05
    );
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, pointer.current.y * 0.22, 0.05);
    // Cursor parallax shift + a gentle sink as you scroll, deepening the depth.
    group.position.x = THREE.MathUtils.lerp(group.position.x, pointer.current.x * 0.6, 0.05);
    group.position.y = THREE.MathUtils.lerp(group.position.y, -pointer.current.y * 0.4 + scroll.current * 2.5, 0.05);
  });

  return (
    <group ref={groupRef}>
      {CRYSTALS.map((spec, i) => (
        <Crystal key={i} spec={spec} />
      ))}
    </group>
  );
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 5, 6]} intensity={140} color={ACCENT_A} />
      <pointLight position={[-7, -4, 3]} intensity={110} color={ACCENT_B} />
      <pointLight position={[0, 6, -4]} intensity={60} color="#ffffff" />
      <directionalLight position={[0, 0, 8]} intensity={1.0} color="#ffffff" />
    </>
  );
}

/**
 * Site-wide 3D ambient layer. Lives fixed behind all content (above the flat
 * AmbientBackground gradient, below the page) so its glowing low-poly crystals
 * show through every dark margin and section as you scroll, reacting to the
 * cursor and scroll position. Replaces nothing structural — purely additive depth.
 */
export default function Scene3DBackground() {
  const canRender = useCanRender3D();
  const dpr = useMemo<[number, number]>(() => [1, 1.6], []);

  // On mobile the canvas is skipped entirely (perf). On desktop it always runs
  // live — this calm, non-flashing ambient drift is the kind of motion the
  // codebase already exempts from reduced-motion (see .allow-motion in index.css).
  if (!canRender) return null;

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6, delay: 0.3 }}
      style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }}
    >
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 9], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        frameloop="always"
      >
        <Suspense fallback={null}>
          <SceneLights />
          <Field />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}
