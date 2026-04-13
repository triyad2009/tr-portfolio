import { Html, Sphere } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import * as THREE from "three";
import { useIsMobile } from "../../hooks/use-mobile";
import { useSound } from "../../hooks/useSound";

// ─── Skills Data ──────────────────────────────────────────────────────────────
const SKILLS = [
  { name: "React", color: "#61dafb" },
  { name: "TypeScript", color: "#3178c6" },
  { name: "JavaScript", color: "#f7df1e" },
  { name: "Three.js", color: "#00f5ff" },
  { name: "GSAP", color: "#88ce02" },
  { name: "Tailwind", color: "#38bdf8" },
  { name: "Figma", color: "#f24e1e" },
  { name: "HTML/CSS", color: "#e34f26" },
  { name: "Node.js", color: "#339933" },
  { name: "WebGL", color: "#a78bfa" },
] as const;

// ─── Orbiting Sphere ──────────────────────────────────────────────────────────
interface OrbitingSphereProps {
  skill: (typeof SKILLS)[number];
  index: number;
  total: number;
}

function OrbitingSphere({ skill, index, total }: OrbitingSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { play } = useSound();

  // Each orbit has unique radius, tilt, speed
  const radius = 1.6 + (index % 3) * 0.5;
  const tilt = (index * 17) % 60; // degrees
  const speed = 0.18 + (index % 5) * 0.07;
  const phaseOffset = (index / total) * Math.PI * 2;

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current) return;
    const t = state.clock.elapsedTime;
    const angle = phaseOffset + t * speed;
    groupRef.current.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle * 0.4) * 0.6,
      Math.sin(angle) * radius * Math.cos((tilt * Math.PI) / 180),
    );
    meshRef.current.rotation.y = t * 0.8;
  });

  const color = new THREE.Color(skill.color);

  return (
    <group ref={groupRef}>
      <Sphere
        ref={meshRef}
        args={[hovered ? 0.14 : 0.095, 16, 16]}
        onPointerEnter={() => {
          setHovered(true);
          play("hover");
        }}
        onPointerLeave={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 3.5 : 1.8}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>

      {/* Label via Drei Html */}
      <Html
        center
        distanceFactor={6}
        style={{ pointerEvents: "none" }}
        position={[0, hovered ? 0.28 : 0.22, 0]}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: hovered ? "11px" : "9px",
            color: hovered ? skill.color : `${skill.color}cc`,
            textShadow: hovered
              ? `0 0 8px ${skill.color}, 0 0 16px ${skill.color}88`
              : `0 0 4px ${skill.color}66`,
            whiteSpace: "nowrap",
            letterSpacing: "0.1em",
            transition: "all 0.2s",
            userSelect: "none",
          }}
        >
          {skill.name}
        </span>
      </Html>

      {/* Glow point light */}
      <pointLight
        color={skill.color}
        intensity={hovered ? 1.2 : 0.4}
        distance={1.2}
      />
    </group>
  );
}

// ─── Center Core ──────────────────────────────────────────────────────────────
function CenterCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!coreRef.current || !ringRef.current) return;
    const t = state.clock.elapsedTime;
    coreRef.current.rotation.y = t * 0.3;
    coreRef.current.rotation.z = t * 0.1;
    ringRef.current.rotation.z = t * 0.4;
    ringRef.current.rotation.x = t * 0.2;
    // Pulse scale
    const pulse = 1 + Math.sin(t * 1.5) * 0.04;
    coreRef.current.scale.setScalar(pulse);
  });

  return (
    <group>
      {/* Core sphere */}
      <Sphere ref={coreRef} args={[0.32, 32, 32]}>
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={1.2}
          roughness={0.05}
          metalness={0.9}
          transparent
          opacity={0.85}
          wireframe={false}
        />
      </Sphere>

      {/* Wireframe shell */}
      <Sphere args={[0.38, 12, 12]}>
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#7c3aed"
          emissiveIntensity={0.6}
          transparent
          opacity={0.15}
          wireframe
        />
      </Sphere>

      {/* Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.015, 8, 64]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Core glow */}
      <pointLight color="#00f5ff" intensity={2.5} distance={4} />
    </group>
  );
}

// ─── Orbit Lines ──────────────────────────────────────────────────────────────
function OrbitLine({ index }: { index: number }) {
  const lineRef = useRef<THREE.Mesh>(null);
  const radius = 1.6 + (index % 3) * 0.5;
  const tilt = (index * 17) % 60;

  useFrame((state) => {
    if (!lineRef.current) return;
    lineRef.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <mesh
      ref={lineRef}
      rotation={[((tilt * Math.PI) / 180) * 0.3, 0, (tilt * Math.PI) / 180]}
    >
      <torusGeometry args={[radius, 0.004, 4, 96]} />
      <meshStandardMaterial
        color="#00f5ff"
        emissive="#00f5ff"
        emissiveIntensity={0.3}
        transparent
        opacity={0.12}
      />
    </mesh>
  );
}

// ─── Scene Root ───────────────────────────────────────────────────────────────
function OrbitScene() {
  const sceneRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!sceneRef.current) return;
    sceneRef.current.rotation.y = state.clock.elapsedTime * 0.06;
  });

  return (
    <group ref={sceneRef}>
      <CenterCore />
      {[0, 1, 2].map((i) => (
        <OrbitLine key={`orbit-line-${i}`} index={i} />
      ))}
      {SKILLS.map((skill, i) => (
        <OrbitingSphere
          key={`skill-sphere-${skill.name}`}
          skill={skill}
          index={i}
          total={SKILLS.length}
        />
      ))}
    </group>
  );
}

// ─── 3D Canvas ────────────────────────────────────────────────────────────────
function SkillsOrbit() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full max-w-[500px] mx-auto"
      style={{ height: 500 }}
    >
      {/* Glow backdrop */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.75 0.31 262 / 0.08) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />
      <Canvas
        camera={{ position: [0, 2.5, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={0.6} color="#7c3aed" />
        <pointLight position={[-5, -3, -5]} intensity={0.4} color="#00f5ff" />
        <OrbitScene />
      </Canvas>
    </motion.div>
  );
}

// ─── Skill Card ───────────────────────────────────────────────────────────────
interface SkillCardProps {
  skill: (typeof SKILLS)[number];
  index: number;
}

function SkillCard({ skill, index }: SkillCardProps) {
  const [hovered, setHovered] = useState(false);
  const { play } = useSound();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.02 }}
      onHoverStart={() => {
        setHovered(true);
        play("hover");
      }}
      onHoverEnd={() => setHovered(false)}
      className="glassmorphic rounded-xl p-4 border transition-all duration-300 cursor-default flex items-center gap-3 min-h-[56px]"
      style={{
        borderColor: hovered
          ? `${skill.color}60`
          : "oklch(0.75 0.31 262 / 0.08)",
        boxShadow: hovered
          ? `0 0 18px ${skill.color}30, 0 0 36px ${skill.color}12, inset 0 0 12px ${skill.color}08`
          : "none",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
      data-ocid={`skill-card-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
    >
      {/* Color dot */}
      <div
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{
          background: skill.color,
          boxShadow: hovered
            ? `0 0 8px ${skill.color}`
            : `0 0 4px ${skill.color}80`,
          transition: "box-shadow 0.3s",
        }}
      />
      <span
        className="font-mono text-sm tracking-wider"
        style={{
          color: hovered ? skill.color : "oklch(0.85 0.02 262)",
          transition: "color 0.3s",
        }}
      >
        {skill.name}
      </span>
    </motion.div>
  );
}

// ─── Mobile Skills Grid ───────────────────────────────────────────────────────
function MobileSkillsGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {SKILLS.map((skill, i) => (
        <SkillCard
          key={`skill-card-mobile-${skill.name}`}
          skill={skill}
          index={i}
        />
      ))}
    </div>
  );
}

// ─── Section Title ────────────────────────────────────────────────────────────
function SectionTitle() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="text-center mb-16"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="font-mono text-xs text-primary tracking-[0.4em] uppercase mb-4"
      >
        {"// SKILLS"}
      </motion.div>

      <h2 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-black tracking-tighter text-glow-cyan leading-none mb-3">
        MY SKILLS
      </h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.35 }}
        className="font-body text-muted-foreground text-base tracking-widest uppercase"
      >
        Technologies I Work With
      </motion.p>

      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="mt-6 mx-auto h-px w-32 bg-primary/40"
        style={{ boxShadow: "0 0 8px oklch(0.75 0.31 262 / 0.5)" }}
      />
    </motion.div>
  );
}

// ─── SkillsSection ────────────────────────────────────────────────────────────
export default function SkillsSection() {
  const isMobile = useIsMobile();

  return (
    <section
      id="skills"
      className="relative min-h-screen py-24 overflow-hidden"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, oklch(0.08 0.015 262 / 0.6) 40%, oklch(0.09 0.02 280 / 0.5) 70%, transparent 100%)",
        }}
      />

      {/* Ambient particles */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 80%, oklch(0.75 0.31 262 / 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, oklch(0.68 0.25 303 / 0.05) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <SectionTitle />

        {isMobile ? (
          // Mobile: no 3D, just grid
          <MobileSkillsGrid />
        ) : (
          // Desktop/Tablet: 3D orbit left, grid right
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* 3D Orbit canvas */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <SkillsOrbit />
            </div>

            {/* Skills grid */}
            <div className="w-full lg:w-1/2">
              <motion.p
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="font-body text-muted-foreground text-sm mb-6 leading-relaxed"
              >
                Each technology in my arsenal — hover over the orbiting spheres
                to explore, or browse the cards below.
              </motion.p>
              <div className="grid grid-cols-2 gap-3">
                {SKILLS.map((skill, i) => (
                  <SkillCard
                    key={`skill-card-${skill.name}`}
                    skill={skill}
                    index={i}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
