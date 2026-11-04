/**
 * BlobAvatar v4: friendly pearl orb with a simple face, driven by audio volume.
 *
 * npm i three @react-three/fiber @react-three/drei
 * npm i -D @types/three
 *
 * <BlobAvatar analyser={analyser} thinking={busy && !speaking} />
 * Optional: simulate={speaking} fakes a mouth level when you have no analyser
 * (e.g. browser speechSynthesis).
 */
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

type Props = {
  analyser?: AnalyserNode | null;
  thinking?: boolean;
  simulate?: boolean;
  color?: string;
  size?: number | string;
};

const INK = "#2a2650";
const damp = THREE.MathUtils.damp;
const clamp = THREE.MathUtils.clamp;

function readLevel(analyser: AnalyserNode, buf: Uint8Array<ArrayBuffer>) {
  analyser.getByteTimeDomainData(buf);
  let sum = 0;
  for (let i = 0; i < buf.length; i++) {
    const v = (buf[i] - 128) / 128;
    sum += v * v;
  }
  return Math.min(1, Math.sqrt(sum / buf.length) * 4);
}

function Eye({ x, refObj }: { x: number; refObj: React.RefObject<THREE.Group> }) {
  return (
    <group ref={refObj} position={[x, 0.1, 0]}>
      <mesh>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color={INK} roughness={0.25} />
      </mesh>
      {/* single highlight */}
      <mesh position={[0.04, 0.05, 0.1]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function Blob({
  analyser,
  thinking,
  simulate,
  color,
}: {
  analyser?: AnalyserNode | null;
  thinking: boolean;
  simulate: boolean;
  color: string;
}) {
  const body = useRef<THREE.Group>(null!);
  const face = useRef<THREE.Group>(null!);
  const mat = useRef<any>(null);
  const smile = useRef<THREE.Mesh>(null!);
  const mouth = useRef<THREE.Mesh>(null!);
  const eyeL = useRef<THREE.Group>(null!);
  const eyeR = useRef<THREE.Group>(null!);

  const buf = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const level = useRef(0);
  const blink = useRef(0);
  const nextBlink = useRef(2);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;

    // audio level, smoothed
    let target = 0;
    if (analyser) {
      if (!buf.current || buf.current.length !== analyser.fftSize) {
        buf.current = new Uint8Array(analyser.fftSize);
      }
      target = readLevel(analyser, buf.current);
    }
    if (simulate) {
      target = 0.12 + 0.3 * Math.abs(Math.sin(t * 9)) * (0.6 + 0.4 * Math.sin(t * 3.1));
    }
    level.current = damp(level.current, target, 12, dt);
    const l = level.current;

    // body: float, sway, pulse
    body.current.position.y = Math.sin(t * 1.2) * 0.05;
    body.current.rotation.y = Math.sin(t * 0.5) * 0.1;
    body.current.scale.setScalar(1 + l * 0.1);

    // surface wobble
    if (mat.current) {
      mat.current.distort = Math.min(0.34, (thinking ? 0.24 : 0.14) + l * 0.28);
      mat.current.speed = (thinking ? 2.6 : 1.3) + l * 3;
    }

    // face drifts toward the pointer
    const px = state.pointer.x;
    const py = state.pointer.y;
    face.current.position.x = damp(face.current.position.x, px * 0.12, 4, dt);
    face.current.position.y = damp(face.current.position.y, -0.05 + py * 0.08, 4, dt);
    face.current.rotation.y = damp(face.current.rotation.y, px * 0.25, 4, dt);
    face.current.position.z = 1.1 + l * 0.04;
    face.current.rotation.z = thinking ? Math.sin(t * 2) * 0.06 : 0;

    // eyes glance up while thinking
    const eyeBaseY = thinking ? 0.15 : 0.1;
    eyeL.current.position.y = damp(eyeL.current.position.y, eyeBaseY, 6, dt);
    eyeR.current.position.y = damp(eyeR.current.position.y, eyeBaseY, 6, dt);

    // small smile when quiet, rounded open mouth when speaking
    const open = clamp((l - 0.04) * 3, 0, 1);
    smile.current.scale.setScalar(Math.max(0.001, 1 - open * 1.5));
    mouth.current.scale.set(0.5 + open * 0.8, Math.max(0.001, open), 1);

    // blink
    if (t > nextBlink.current) {
      blink.current = 1;
      nextBlink.current = t + 2 + Math.random() * 3;
    }
    blink.current = Math.max(0, blink.current - dt * 8);
    const eyeY = 1 - blink.current * 0.92;
    eyeL.current.scale.y = eyeY;
    eyeR.current.scale.y = eyeY;
  });

  return (
    <group ref={body}>
      <mesh>
        <icosahedronGeometry args={[1, 32]} />
        <MeshDistortMaterial
          ref={mat}
          color={color}
          roughness={0.45}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.4}
          iridescence={0.6}
          iridescenceIOR={1.4}
          iridescenceThicknessRange={[120, 420]}
          distort={0.14}
          speed={1.3}
        />
      </mesh>

      <group ref={face} position={[0, -0.05, 1.1]}>
        <Eye x={-0.34} refObj={eyeL} />
        <Eye x={0.34} refObj={eyeR} />

        {/* small resting smile, sits low: lower half of a ring */}
        <mesh ref={smile} position={[0, -0.22, 0]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.07, 0.018, 16, 32, Math.PI]} />
          <meshStandardMaterial color={INK} roughness={0.4} />
        </mesh>

        {/* open mouth while speaking */}
        <mesh ref={mouth} position={[0, -0.26, 0]}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial color={INK} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

export function BlobAvatar({
  analyser,
  thinking = false,
  simulate = false,
  color = "#e4e6ff",
  size = 320,
}: Props) {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas camera={{ position: [0, 0, 3.6], fov: 45 }} dpr={[1, 2]}>
        <Environment resolution={256}>
          <Lightformer
            form="rect"
            intensity={1.2}
            position={[0, 4, 3]}
            scale={[8, 3, 1]}
            color="#ffffff"
          />
          <Lightformer
            form="rect"
            intensity={1}
            position={[-5, 0, 2]}
            scale={[3, 6, 1]}
            color="#ff9ad5"
          />
          <Lightformer
            form="rect"
            intensity={1}
            position={[5, -1, 2]}
            scale={[3, 6, 1]}
            color="#7fd4ff"
          />
          <Lightformer
            form="ring"
            intensity={0.6}
            position={[0, -3, -4]}
            scale={4}
            color="#b9a6ff"
          />
        </Environment>
        <ambientLight intensity={0.7} />
        <Blob analyser={analyser} thinking={thinking} simulate={simulate} color={color} />
      </Canvas>
    </div>
  );
}
