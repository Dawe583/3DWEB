import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Icosahedron } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { motion, type MotionValue } from "framer-motion";
import * as THREE from "three";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

// Skips the WebGL canvas on small/touch screens — it's a hero flourish, not core
// content, and isn't worth the GPU/battery cost on mobile.
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

/** Normalised pointer position (-1..1) across the whole window, so the scene keeps
 *  reacting even while it sits behind pointer-events:none content. */
function usePointerParallax() {
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return target;
}

const ACCENT_A = "#818cf8"; // indigo
const ACCENT_B = "#c084fc"; // purple

/** The hero centrepiece: a big glowing, distorting crystal. Solid emissive material
 *  (not transmission glass) so it reads clearly against the black page, with a
 *  wireframe shell that catches the light and sells the facets. Sized large enough
 *  that its silhouette glows around the edges of the centred video card. */
function Crystal({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const pointer = usePointerParallax();
  const scrollRef = useRef(0);

  useEffect(() => {
    const unsubscribe = scrollProgress.on("change", (v) => {
      scrollRef.current = v;
    });
    return unsubscribe;
  }, [scrollProgress]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    // Continuous spin, accelerated by scroll progress through the hero.
    group.rotation.y += delta * 0.2 + scrollRef.current * delta * 1.2;

    // Cursor parallax — eased tilt toward the pointer.
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, pointer.current.y * 0.4 + scrollRef.current * 0.6, 0.05);
    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, -pointer.current.x * 0.3, 0.05);

    // Shrinks + fades away as the hero scrolls out (mirrors the video shrink).
    const s = THREE.MathUtils.clamp(1 - scrollRef.current * 0.8, 0.2, 1);
    group.scale.setScalar(THREE.MathUtils.lerp(group.scale.x, s, 0.08));
  });

  return (
    <Float speed={1.6} rotationIntensity={0.5} floatIntensity={0.9}>
      <group ref={groupRef}>
        {/* Solid glowing core */}
        <Icosahedron args={[2.2, 12]}>
          <MeshDistortMaterial
            color={ACCENT_A}
            emissive={ACCENT_B}
            emissiveIntensity={0.35}
            roughness={0.15}
            metalness={0.85}
            distort={0.4}
            speed={1.6}
          />
        </Icosahedron>
        {/* Brighter wireframe shell, slightly larger, for crisp glowing facets */}
        <Icosahedron args={[2.32, 3]}>
          <meshBasicMaterial color={ACCENT_A} wireframe transparent opacity={0.18} />
        </Icosahedron>
      </group>
    </Float>
  );
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 4, 5]} intensity={120} color={ACCENT_A} />
      <pointLight position={[-6, -3, 2]} intensity={90} color={ACCENT_B} />
      <pointLight position={[0, 5, -5]} intensity={50} color="#ffffff" />
      <directionalLight position={[0, 0, 6]} intensity={1.2} color="#ffffff" />
    </>
  );
}

export default function HeroScene3D({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const reducedMotion = usePrefersReducedMotion();
  const canRender = useCanRender3D();
  const dpr = useMemo<[number, number]>(() => [1, 1.75], []);

  if (reducedMotion || !canRender) return null;

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, delay: 0.2 }}
      className="absolute inset-0 pointer-events-none"
    >
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <SceneLights />
          <Crystal scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}
