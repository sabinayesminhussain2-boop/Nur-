// Original simplified concept geometry. Not manufacturer-provided CAD.
import * as T from "three";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import fs from "node:fs";
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((b) => {
      this.result = b;
      this.onloadend?.();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((b) => {
      this.result =
        "data:application/octet-stream;base64," +
        Buffer.from(b).toString("base64");
      this.onloadend?.();
    });
  }
};
for (const [id, suv] of [
  ["porsche", false],
  ["bmw", false],
  ["amg", false],
  ["urus", true],
]) {
  const group = new T.Group();
  const paint = new T.MeshStandardMaterial({
    name: "paint",
    color: "#f45ca8",
    metalness: 0.75,
    roughness: 0.24,
  });
  const dark = new T.MeshStandardMaterial({
    name: "trim",
    color: "#101115",
    metalness: 0.3,
    roughness: 0.34,
  });
  const glass = new T.MeshStandardMaterial({
    name: "glass",
    color: "#121c24",
    metalness: 0.08,
    roughness: 0.13,
    transparent: true,
    opacity: 0.3,
    depthWrite: false,
  });
  const rim = new T.MeshStandardMaterial({
    name: "wheel",
    color: "#b9bcc4",
    metalness: 0.85,
    roughness: 0.2,
  });
  const interior = new T.MeshStandardMaterial({
    name: "interior",
    color: "#b68158",
    roughness: 0.7,
  });
  const light = new T.MeshStandardMaterial({
    color: "#ffffff",
    emissive: "#ffffff",
    emissiveIntensity: 3,
  });
  const rear = new T.MeshStandardMaterial({
    color: "#ee264a",
    emissive: "#ee264a",
    emissiveIntensity: 2,
  });
  function mesh(g, m, x = 0, y = 0, z = 0) {
    const a = new T.Mesh(g, m);
    a.position.set(x, y, z);
    group.add(a);
    return a;
  }
  function box(w, h, d, m, x, y, z) {
    return mesh(new T.BoxGeometry(w, h, d), m, x, y, z);
  }
  function profile(points, depth, mat) {
    const shape = new T.Shape();
    points.forEach(([x, y], i) =>
      i ? shape.lineTo(x, y) : shape.moveTo(x, y),
    );
    shape.closePath();
    const g = new T.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.06,
      bevelSegments: 3,
      steps: 1,
    });
    g.translate(0, 0, -depth / 2);
    return mesh(g, mat);
  }
  profile(
    [
      [-2.15, 0.46],
      [id === "amg" ? -2.38 : -2.18, suv ? 0.9 : 0.68],
      [-1.85, suv ? 1.08 : 0.86],
      [-0.85, suv ? 1.14 : 0.94],
      [0.8, suv ? 1.14 : 0.96],
      [1.88, suv ? 1.08 : 0.86],
      [2.12, suv ? 0.9 : 0.68],
      [2.12, 0.44],
    ],
    1.75,
    paint,
  );
  const top = suv ? 1.76 : id === "amg" ? 1.3 : 1.38;
  const cabinShift = id === "amg" ? 0.24 : id === "bmw" ? -0.1 : 0;
  profile(
    [
      [-0.9 + cabinShift, suv ? 1.14 : 0.94],
      [-0.42 + cabinShift, top],
      [0.67 + cabinShift, top],
      [1.28 + cabinShift, suv ? 1.14 : 0.94],
    ],
    1.4,
    glass,
  );
  box(1.08, 0.055, 1.46, paint, 0.13 + cabinShift, top + 0.025, 0).name =
    "roof";
  for (const z of [-0.75, 0.75]) {
    let pillar = box(0.055, 0.55, 0.06, paint, -0.64, 1.15, z);
    pillar.rotation.z = -0.64;
    box(0.065, 0.47, 0.06, paint, 0.55, 1.16, z);
    box(0.28, 0.09, 0.08, paint, -0.63, 1.02, z * 1.3);
    box(2.85, 0.09, 0.12, dark, 0, 0.39, z * 1.17);
    box(0.24, 0.025, 0.04, rim, 0.35, 0.92, z * 1.18);
  }
  for (const x of [-1.36, 1.38])
    for (const z of [-0.93, 0.93]) {
      const tire = mesh(
        new T.CylinderGeometry(0.43, 0.43, 0.27, 40),
        dark,
        x,
        0.45,
        z,
      );
      tire.rotation.x = Math.PI / 2;
      const wh = mesh(
        new T.CylinderGeometry(0.32, 0.32, 0.285, 32),
        dark,
        x,
        0.45,
        z,
      );
      wh.rotation.x = Math.PI / 2;
      const ring = mesh(
        new T.TorusGeometry(0.3, 0.025, 8, 40),
        rim,
        x,
        0.45,
        z + Math.sign(z) * 0.15,
      );
      for (const [style, count, width] of [
        ["Sport", 5, 0.065],
        ["Performance", 10, 0.025],
        ["Forged", 7, 0.04],
      ]) {
        for (let i = 0; i < count; i++) {
          const angle = (i * Math.PI * 2) / count;
          const spoke = box(
            width,
            0.235,
            0.03,
            rim,
            x + Math.sin(angle) * 0.175,
            0.45 + Math.cos(angle) * 0.175,
            z + Math.sign(z) * 0.158,
          );
          spoke.rotation.z = -angle;
          spoke.name = `wheel_${style}_${x}_${z}_${i}`;
          if (style === "Performance") {
            const twin = box(
              0.019,
              0.235,
              0.03,
              rim,
              x + Math.sin(angle + 0.12) * 0.175,
              0.45 + Math.cos(angle + 0.12) * 0.175,
              z + Math.sign(z) * 0.158,
            );
            twin.rotation.z = -angle - 0.12;
            twin.name = `wheel_${style}_twin_${x}_${z}_${i}`;
          }
        }
      }
      const hub = mesh(
        new T.CylinderGeometry(0.07, 0.07, 0.31, 16),
        rim,
        x,
        0.45,
        z,
      );
      hub.rotation.x = Math.PI / 2;
    }
  for (const z of [-0.61, 0.61]) {
    box(0.045, 0.1, 0.36, light, -2.18, 0.72, z);
    box(0.04, 0.08, 0.45, rear, 2.16, 0.75, z);
    box(0.08, 0.18, 0.39, dark, -2.18, 0.48, z);
    box(0.05, 0.14, 0.3, dark, 2.18, 0.43, z);
  }
  box(0.06, 0.2, 0.65, dark, -2.2, 0.5, 0);
  box(0.12, 0.05, 1.88, dark, -2.18, 0.35, 0);
  box(0.1, 0.06, 1.85, dark, 2.15, 0.36, 0);
  for (const z of [-0.43, 0.43]) {
    box(0.38, 0.4, 0.42, interior, 0.32, 0.98, z);
    box(0.42, 0.12, 0.46, interior, 0.03, 0.84, z);
  }
  // Variant-specific original details; still deliberately simplified concepts.
  if (id === "bmw") {
    for (const z of [-0.2, 0.2]) box(0.08, 0.34, 0.3, dark, -2.23, 0.64, z);
    for (const z of [-0.92, 0.92]) box(0.38, 0.08, 0.035, dark, -0.95, 0.85, z);
  }
  if (id === "amg") {
    box(0.06, 0.27, 1.1, dark, -2.4, 0.57, 0);
    for (let z = -0.48; z <= 0.48; z += 0.12)
      box(0.075, 0.23, 0.018, rim, -2.44, 0.57, z);
    for (const z of [-0.92, 0.92]) box(0.4, 0.09, 0.04, dark, -0.9, 0.84, z);
  }
  if (suv) {
    for (const z of [-0.7, 0.7]) box(0.07, 0.04, 0.39, light, -2.2, 0.98, z);
    for (const z of [-0.85, 0.85]) box(1.2, 0.035, 0.04, dark, 0.35, 1.84, z);
    box(0.28, 0.04, 1.6, paint, 1.45, 1.58, 0);
  }
  if (id === "porsche") {
    for (const z of [-0.65, 0.65]) {
      const lamp = mesh(
        new T.SphereGeometry(0.15, 20, 14),
        light,
        -2.15,
        0.84,
        z,
      );
      lamp.scale.set(0.35, 1, 0.8);
    }
    box(0.045, 0.04, 1.5, rear, 2.16, 0.83, 0);
    for (const z of [-0.58, 0.58]) box(0.08, 0.43, 0.07, dark, 1.65, 1.05, z);
    box(0.42, 0.06, 2.05, paint, 1.65, 1.29, 0);
  }
  const buffer = await new GLTFExporter().parseAsync(group, { binary: true });
  fs.writeFileSync(`public/models/${id}.glb`, Buffer.from(buffer));
}
