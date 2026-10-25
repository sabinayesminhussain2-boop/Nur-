import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  ContactShadows,
  Environment,
  Lightformer,
} from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitType } from "three-stdlib";

function Car({
  id,
  color,
  wheel,
  interior,
  onReady,
  cutaway,
}: {
  id: string;
  color: string;
  wheel: string;
  interior: string;
  onReady: () => void;
  cutaway: boolean;
}) {
  const { scene } = useGLTF(`/models/${id}.glb`);
  const { invalidate } = useThree();
  const model = useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse((o) => {
      if (o instanceof THREE.Mesh) o.material = o.material.clone();
    });
    return copy;
  }, [scene]);
  useEffect(() => {
    model.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      if (o.name === "roof" || o.material.name === "glass")
        o.visible = !cutaway;
      if (o.material.name === "paint") o.material.color.set(color);
      if (o.material.name === "wheel")
        o.material.color.set(
          wheel === "Forged"
            ? "#dfb97a"
            : wheel === "Performance"
              ? "#555963"
              : "#b9bcc4",
        );
      if (o.name.startsWith("wheel_"))
        o.visible = o.name.startsWith(`wheel_${wheel}_`);
      if (o.material.name === "interior")
        o.material.color.set(
          interior === "Cognac"
            ? "#b68158"
            : interior === "Chalk"
              ? "#e6e1d6"
              : "#17171a",
        );
    });
    invalidate();
    onReady();
  }, [model, color, wheel, interior, invalidate, onReady, cutaway]);
  useEffect(
    () => () => {
      model.traverse((o) => {
        if (o instanceof THREE.Mesh) o.material.dispose();
      });
    },
    [model],
  );
  return <primitive object={model} />;
}
function Camera({ view, revision }: { view: string; revision: number }) {
  const ref = useRef<OrbitType>(null);
  const { camera, invalidate, gl } = useThree();
  const apply = useMemo(
    () => (command: string) => {
      const controls = ref.current;
      if (!controls) return;
      const views: Record<string, [number, number, number]> = {
        Front: [-7, 2, 0],
        Side: [0, 1.8, 7],
        Rear: [7, 2, 0],
        Reset: [-5, 2.8, 5],
        Interior: [0.1, 2.8, 3.6],
      };
      if (views[command]) {
        camera.position.set(...views[command]);
        controls.target.set(0, 0.65, 0);
      } else {
        const offset = camera.position.clone().sub(controls.target);
        const spherical = new THREE.Spherical().setFromVector3(offset);
        if (command === "ZoomIn")
          spherical.radius = THREE.MathUtils.clamp(
            spherical.radius * 0.85,
            3.5,
            10,
          );
        if (command === "ZoomOut")
          spherical.radius = THREE.MathUtils.clamp(
            spherical.radius / 0.85,
            3.5,
            10,
          );
        if (command === "Left") spherical.theta -= 0.18;
        if (command === "Right") spherical.theta += 0.18;
        if (command === "Up")
          spherical.phi = Math.max(0.15, spherical.phi - 0.12);
        if (command === "Down")
          spherical.phi = Math.min(Math.PI / 2 - 0.02, spherical.phi + 0.12);
        camera.position.copy(
          new THREE.Vector3().setFromSpherical(spherical).add(controls.target),
        );
      }
      controls.update();
      invalidate();
    },
    [camera, invalidate],
  );
  useEffect(() => {
    apply(view);
  }, [apply, view, revision]);
  useEffect(() => {
    const element = gl.domElement;
    element.tabIndex = 0;
    element.setAttribute(
      "aria-label",
      "Interactive concept vehicle. Arrow keys rotate; plus and minus zoom; Home resets.",
    );
    const keys: Record<string, string> = {
      ArrowLeft: "Left",
      ArrowRight: "Right",
      ArrowUp: "Up",
      ArrowDown: "Down",
      "+": "ZoomIn",
      "=": "ZoomIn",
      "-": "ZoomOut",
      Home: "Reset",
    };
    const keydown = (event: KeyboardEvent) => {
      if (keys[event.key]) {
        event.preventDefault();
        apply(keys[event.key]);
      }
    };
    element.addEventListener("keydown", keydown);
    return () => element.removeEventListener("keydown", keydown);
  }, [gl, apply]);
  return (
    <OrbitControls
      ref={ref}
      makeDefault
      enablePan={false}
      minDistance={3.5}
      maxDistance={10}
      maxPolarAngle={Math.PI / 2 - 0.02}
    />
  );
}
export default function Viewer({
  id,
  color,
  wheel,
  interior,
  lighting,
  view,
  revision,
  onReady,
  onFailure,
}: {
  id: string;
  color: string;
  wheel: string;
  interior: string;
  lighting: string;
  view: string;
  revision: number;
  onReady: () => void;
  onFailure: () => void;
}) {
  const studioColor =
    lighting === "Pink studio"
      ? "#ff65b4"
      : lighting === "Cool night"
        ? "#869bff"
        : "#ffffff";
  return (
    <>
      <Canvas
        frameloop="demand"
        dpr={[1, 1.6]}
        camera={{ position: [-5, 2.8, 5], fov: 38 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#101014"]} />
        <ambientLight intensity={0.7} />
        <hemisphereLight args={["#e8e4ff", "#39333c", 2]} />
        <directionalLight position={[-3, 6, 4]} intensity={4} />
        <directionalLight
          position={[2, 3, -4]}
          color={studioColor}
          intensity={5}
        />
        <pointLight position={[-4, 2, -2]} intensity={12} />
        <Suspense fallback={null}>
          <Environment key={lighting} resolution={128} frames={1}>
            <Lightformer
              intensity={4}
              position={[0, 5, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[10, 5, 1]}
            />
            <Lightformer
              intensity={3}
              position={[-5, 2, 0]}
              rotation={[0, Math.PI / 2, 0]}
              scale={[4, 2, 1]}
            />
            <Lightformer
              intensity={2}
              color={studioColor}
              position={[2, 3, -4]}
              scale={[7, 3, 1]}
            />
          </Environment>
          <Car
            id={id}
            color={color}
            wheel={wheel}
            interior={interior}
            onReady={onReady}
            cutaway={view === "Interior"}
          />
          <ContactShadows
            key={id}
            position={[0, 0.005, 0]}
            opacity={0.55}
            scale={12}
            blur={2.5}
            far={4}
            frames={1}
          />
        </Suspense>
        <gridHelper
          args={[20, 40, "#28212b", "#1c1a21"]}
          position={[0, -0.01, 0]}
        />
        <Camera view={view} revision={revision} />
        <ContextHealth onFailure={onFailure} />
      </Canvas>
    </>
  );
}

function ContextHealth({ onFailure }: { onFailure: () => void }) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onFailure]);
  return null;
}
export function clearVehicle(id: string) {
  useGLTF.clear(`/models/${id}.glb`);
}
