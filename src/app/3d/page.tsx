"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Check, Layers, Move, ZoomIn } from "lucide-react";
import confetti from "canvas-confetti";
import { Navbar } from "../../components/shared/Navbar";
import { useDatabase } from "../../store/useDatabase";

// 12 3D Products configuration metadata from Jelajah 3D page
interface ProductConfig {
  id: string;
  label: string;
  stageLabel: string;
  file: string;
  materialHints: string[];
  badge: string;
  scaleFactor?: number;
  positionX?: number;
  positionY?: number;
  rotationY?: number;
  textureRepeat?: number;
  cameraView?: {
    x: number;
    y: number;
    z: number;
    targetY: number;
  };
}

const PRODUCTS: Record<string, ProductConfig> = {
  shirt: {
    id: "shirt",
    label: "Baju",
    stageLabel: "Pakaian",
    file: "/models/shirt.glb",
    materialHints: ["shirt_fabric"],
    badge: "Material: Shirt_Fabric",
    positionY: -0.24,
    textureRepeat: 1.0
  },
  bag: {
    id: "bag",
    label: "Tas",
    stageLabel: "Tas",
    file: "/models/bag.glb",
    materialHints: ["bag_fabric"],
    badge: "Material: Bag_Fabric",
    scaleFactor: 0.80,
    positionY: -0.12,
    textureRepeat: 1.45
  },
  totebag: {
    id: "totebag",
    label: "Tote Bag",
    stageLabel: "Tote Bag",
    file: "/models/totebag.glb",
    materialHints: ["bag_fabric"],
    badge: "Material: Bag_Fabric",
    scaleFactor: 0.70,
    positionY: 0.05,
    textureRepeat: 1.35
  },
  schoolbag: {
    id: "schoolbag",
    label: "Tas Sekolah",
    stageLabel: "Tas Sekolah",
    file: "/models/schoolbag.glb",
    materialHints: ["schoolbag_fabric", "bag_gray main"],
    badge: "Material: SchoolBag_Fabric",
    rotationY: Math.PI,
    scaleFactor: 0.72,
    positionY: -0.12,
    textureRepeat: 1.35
  },
  pillow: {
    id: "pillow",
    label: "Bantal",
    stageLabel: "Bantal",
    file: "/models/pillow.glb",
    materialHints: ["cushion_fabric"],
    badge: "Material: Cushion_Fabric",
    rotationY: Math.PI / 2.5,
    scaleFactor: 1.65,
    positionX: -0.35,
    positionY: -0.10,
    textureRepeat: 1.35,
    cameraView: {
      x: 0,
      y: 0.80,
      z: 1.5,
      targetY: 0.34
    }
  },
  curtain: {
    id: "curtain",
    label: "Tirai",
    stageLabel: "Tirai",
    file: "/models/curtain.glb",
    materialHints: ["curtain_fabric"],
    badge: "Material: Curtain_Fabric",
    scaleFactor: 0.78,
    positionY: -0.22,
    textureRepeat: 1.20
  },
  wallart: {
    id: "wallart",
    label: "Wall Art",
    stageLabel: "Wall Art",
    file: "/models/wallart.glb",
    materialHints: ["wallart_fabric"],
    badge: "Material: WallArt_Fabric",
    scaleFactor: 0.98,
    positionY: -0.12,
    textureRepeat: 1.10,
    cameraView: {
      x: 0,
      y: 0.48,
      z: 4.1,
      targetY: 0.40
    }
  },
  hat: {
    id: "hat",
    label: "Topi",
    stageLabel: "Topi",
    file: "/models/hat.glb",
    materialHints: ["hat_fabric"],
    badge: "Material: Hat_Fabric",
    scaleFactor: 0.82,
    positionY: -0.38,
    textureRepeat: 1.35
  },
  lamp: {
    id: "lamp",
    label: "Lampu",
    stageLabel: "Lampu",
    file: "/models/lamp.glb",
    materialHints: ["lamp_fabric"],
    badge: "Material: Lamp_Fabric",
    scaleFactor: 0.76,
    positionY: -0.28,
    textureRepeat: 1.75
  },
  shoes: {
    id: "shoes",
    label: "Sepatu",
    stageLabel: "Sepatu",
    file: "/models/shoes.glb",
    materialHints: ["shoe_fabric"],
    badge: "Material: Shoe_Fabric",
    rotationY: -Math.PI / 4,
    scaleFactor: 0.88,
    positionY: -0.12,
    textureRepeat: 1.45,
    cameraView: {
      x: 0,
      y: 1.18,
      z: 4.2,
      targetY: 0.22
    }
  },
  sandal: {
    id: "sandal",
    label: "Sandal",
    stageLabel: "Sandal",
    file: "/models/sandal.glb",
    materialHints: ["sandal_fabric"],
    badge: "Material: Sandal_Fabric",
    rotationY: -Math.PI / 5,
    scaleFactor: 0.78,
    positionY: -0.16,
    textureRepeat: 1.45,
    cameraView: {
      x: 0,
      y: 1.95,
      z: 4.2,
      targetY: 0.22
    }
  },
  pants: {
    id: "pants",
    label: "Celana",
    stageLabel: "Celana",
    file: "/models/pants.glb",
    materialHints: ["pants_fabric"],
    badge: "Material: Pants_Fabric",
    scaleFactor: 0.82,
    positionY: -0.20,
    textureRepeat: 1.20,
    cameraView: {
      x: 0,
      y: 0.78,
      z: 5.1,
      targetY: 0.42
    }
  }
};

const PRODUCT_LIST = Object.values(PRODUCTS);

// Helper function to render the custom product select menu icon
const getProductIconPath = (productId: string) => {
  switch (productId) {
    case "shirt":
      return <path d="M8 4 4 7l2 4 2-1v10h8V10l2 1 2-4-4-3-2 3h-4L8 4Z" />;
    case "bag":
      return (
        <>
          <path d="M5 8h14l1 12H4L5 8Z" />
          <path d="M8 8V6a4 4 0 0 1 8 0v2" />
        </>
      );
    case "totebag":
      return (
        <>
          <path d="M5 8h14l1 12H4L5 8Z" />
          <path d="M8 8c0-5 8-5 8 0" />
        </>
      );
    case "schoolbag":
      return (
        <>
          <path d="M7 6h10l2 4v10H5V10l2-4Z" />
          <path d="M9 6V4h6v2M8 12h8v5H8z" />
        </>
      );
    case "pillow":
      return (
        <>
          <path d="M5 5c4 1 10 1 14 0 1 4 1 10 0 14-4-1-10-1-14 0-1-4-1-10 0-14Z" />
          <path d="M8 8c2 2 6 2 8 0M8 16c2-2 6-2 8 0" />
        </>
      );
    case "curtain":
      return (
        <>
          <path d="M4 4h16M6 4v16M12 4v16M18 4v16" />
          <path d="M6 7c2 2 4 2 6 0 2 2 4 2 6 0" />
        </>
      );
    case "wallart":
      return (
        <>
          <rect x="4" y="4" width="16" height="16" rx="1" />
          <path d="m7 16 3-3 2 2 3-4 2 5" />
        </>
      );
    case "hat":
      return (
        <>
          <path d="M5 13c0-5 3-8 8-8 3 0 5 2 6 5l-2 4H5v-1Z" />
          <path d="M5 14c-3 0-4 2-1 3h15" />
        </>
      );
    case "lamp":
      return <path d="M8 10h8l-2-5h-4l-2 5ZM12 10v8M8 20h8" />;
    case "shoes":
      return <path d="M4 15c3 0 5-2 6-5 2 2 4 4 8 4l2 4H4v-3Z" />;
    case "sandal":
      return <path d="M5 18c4 2 10 2 14 0 0-5-1-8-5-10l-2 3-2-3c-4 2-5 5-5 10Z" />;
    case "pants":
      return <path d="M6 4h12l-1 16h-4l-1-8-1 8H7L6 4Z" />;
    default:
      return <path d="M8 4 4 7l2 4 2-1v10h8V10l2 1 2-4-4-3-2 3h-4L8 4Z" />;
  }
};

// 20 Traditional motifs
const MOTIF_LIST = [
  { id: "hiris-pudak", name: "Hiris Pudak", file: "01_Hiris_Pudak.png" },
  { id: "kembang-kacang", name: "Kembang Kacang", file: "02_Kembang_Kacang.png" },
  { id: "bayam-raja", name: "Bayam Raja", file: "03_Bayam_Raja.png" },
  { id: "kulat-karikit", name: "Kulat Karikit", file: "04_Kulat_Karikit.png" },
  { id: "ombak-sinapur-karang", name: "Ombak Sinapur Karang", file: "05_Ombak_Sinapur_Karang.png" },
  { id: "bintang-behambur", name: "Bintang Behambur", file: "06_Bintang_Behambur.png" },
  { id: "naga-balimbur", name: "Naga Balimbur", file: "07_Naga_Balimbur.png" },
  { id: "jajumputan", name: "Jajumputan", file: "08_Jajumputan.png" },
  { id: "turun-dayang", name: "Turun Dayang", file: "09_Turun_Dayang.png" },
  { id: "kembang-tampuk-manggis", name: "Kembang Tampuk Manggis", file: "10_Kembang_Tampuk_Manggis.png" },
  { id: "daun-jaruju", name: "Daun Jaruju", file: "11_Daun_Jaruju.png" },
  { id: "kangkung-kaombakan", name: "Kangkung Kaombakan", file: "12_Kangkung_Kaombakan.png" },
  { id: "gigi-haruan", name: "Gigi Haruan", file: "13_Gigi_Haruan.png" },
  { id: "kambang-sakaki", name: "Kambang Sakaki", file: "14_Kambang_Sakaki.png" },
  { id: "ular-lidi", name: "Ular Lidi", file: "15_Ular_Lidi.png" },
  { id: "mayang-maurai", name: "Mayang Maurai", file: "16_Mayang_Maurai.png" },
  { id: "ramak-sahang", name: "Ramak Sahang", file: "17_Ramak_Sahang.png" },
  { id: "gelombang", name: "Gelombang", file: "18_Gelombang.png" },
  { id: "daun-katu", name: "Daun Katu", file: "19_Daun_Katu.png" },
  { id: "hiris-gagatas", name: "Hiris Gagatas", file: "20_Hiris_Gagatas.png" }
];

// 4 Color presets
const COLOR_PRESETS = [
  { colors: ["#8E1015", "#D89016", "#3B1A0A"] }, // Preset 1
  { colors: ["#355E2B", "#C8921D", "#7B311E"] }, // Preset 2
  { colors: ["#54265E", "#D18020", "#4A2A12"] }, // Preset 3
  { colors: ["#6A1A13", "#AB5A1A", "#432617"] }  // Preset 4
];

// Product Base Colors
const BASE_PRODUCT_COLORS = [
  { id: "cream", label: "Cream", value: "#FBF5E8" },
  { id: "sage", label: "Hijau Sasirangan", value: "#C6D3B0" },
  { id: "sand", label: "Beige Hangat", value: "#E3D0BC" }
];

// Image processing helpers
function makeTransparentMask(image: HTMLImageElement): HTMLCanvasElement {
  const raw = document.createElement("canvas");
  const maxWidth = 520;
  const scale = Math.min(1, maxWidth / image.width);
  raw.width = Math.max(1, Math.round(image.width * scale));
  raw.height = Math.max(1, Math.round(image.height * scale));

  const rawCtx = raw.getContext("2d", { willReadFrequently: true });
  if (!rawCtx) return raw;

  rawCtx.clearRect(0, 0, raw.width, raw.height);
  rawCtx.drawImage(image, 0, 0, raw.width, raw.height);

  const pixels = rawCtx.getImageData(0, 0, raw.width, raw.height);
  let minX = raw.width;
  let minY = raw.height;
  let maxX = -1;
  let maxY = -1;

  for (let index = 0; index < pixels.data.length; index += 4) {
    const r = pixels.data[index];
    const g = pixels.data[index + 1];
    const b = pixels.data[index + 2];
    const sourceAlpha = pixels.data[index + 3];
    const luminance = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);

    // Extract dark lines as mask, turn white background transparent
    const ink = Math.max(0, Math.min(1, (250 - luminance) / 105));
    const x = (index / 4) % raw.width;
    const y = Math.floor((index / 4) / raw.width);

    pixels.data[index] = 255;
    pixels.data[index + 1] = 255;
    pixels.data[index + 2] = 255;
    pixels.data[index + 3] = Math.round(sourceAlpha * ink);

    if (pixels.data[index + 3] > 20) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  rawCtx.putImageData(pixels, 0, 0);

  if (maxX < minX || maxY < minY) return raw;

  const padding = 5;
  const cropX = Math.max(0, minX - padding);
  const cropY = Math.max(0, minY - padding);
  const cropW = Math.min(raw.width - cropX, (maxX - minX + 1) + (padding * 2));
  const cropH = Math.min(raw.height - cropY, (maxY - minY + 1) + (padding * 2));

  const cropped = document.createElement("canvas");
  cropped.width = Math.max(1, cropW);
  cropped.height = Math.max(1, cropH);
  const croppedCtx = cropped.getContext("2d");
  if (croppedCtx) {
    croppedCtx.drawImage(raw, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
  }

  return cropped;
}

function createTintedStamp(mask: HTMLCanvasElement | HTMLImageElement, width: number, height: number, color: string): HTMLCanvasElement {
  const stamp = document.createElement("canvas");
  stamp.width = Math.max(1, Math.round(width));
  stamp.height = Math.max(1, Math.round(height));
  const stampCtx = stamp.getContext("2d");
  if (!stampCtx) return stamp;

  stampCtx.clearRect(0, 0, stamp.width, stamp.height);
  stampCtx.drawImage(mask, 0, 0, stamp.width, stamp.height);
  stampCtx.globalCompositeOperation = "source-in";
  stampCtx.fillStyle = color;
  stampCtx.fillRect(0, 0, stamp.width, stamp.height);
  stampCtx.globalCompositeOperation = "source-over";

  return stamp;
}

export default function Customizer3DPage() {
  const { currentUser } = useDatabase();

  // Active configurations state
  const [selectedProductId, setSelectedProductId] = useState("shirt");
  const [selectedMotifId, setSelectedMotifId] = useState("ombak-sinapur-karang");
  const [colors, setColors] = useState<string[]>([...COLOR_PRESETS[0].colors]);
  const [baseColor, setBaseColor] = useState("#FBF5E8");
  const [customBaseColor, setCustomBaseColor] = useState("#C88433");
  const [baseColorMode, setBaseColorMode] = useState<"preset" | "custom">("preset");
  const [motifScale, setMotifScale] = useState(85);
  const [motifRotation, setMotifRotation] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  // Interaction states
  const [hoveredMotif, setHoveredMotif] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("Memuat baju...");
  const [modelLoadedToggle, setModelLoadedToggle] = useState(0);

  // References for Three.js engine elements
  const viewerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRootRef = useRef<THREE.Group | THREE.Object3D | null>(null);
  const productMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const currentTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const textureRequestIdRef = useRef<number>(0);
  const imageCacheRef = useRef<Map<string, Promise<HTMLImageElement>>>(new Map());
  const customBaseColorInputRef = useRef<HTMLInputElement>(null);

  // Cached motif image loading
  const loadMotifImage = (src: string): Promise<HTMLImageElement> => {
    if (imageCacheRef.current.has(src)) {
      return imageCacheRef.current.get(src)!;
    }
    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new window.Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
    imageCacheRef.current.set(src, promise);
    return promise;
  };

  // 1. Mount Three.js Viewer Scene & Canvas
  useEffect(() => {
    if (!viewerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 400);
    camera.position.set(0, 1.35, 4.7);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize(viewerRef.current.clientWidth, viewerRef.current.clientHeight);
    viewerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.autoRotate = true; // Initial value synchronized by the subsequent useEffect
    controls.autoRotateSpeed = 1.05;
    controls.target.set(0, 0.55, 0);
    controls.minDistance = 1.75;
    controls.maxDistance = 12;
    controlsRef.current = controls;

    // Stop auto-rotate on user manual drag interaction
    const handleControlsStart = () => {
      setAutoRotate(false);
    };
    controls.addEventListener("start", handleControlsStart);

    // Scenic illumination lights
    scene.add(new THREE.HemisphereLight(0xfff7ea, 0x310306, 2.35));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(4.5, 5.5, 5.2);
    scene.add(keyLight);

    const warmFill = new THREE.DirectionalLight(0xffc65a, 1.35);
    warmFill.position.set(-4, 2.4, -2);
    scene.add(warmFill);

    const rimLight = new THREE.DirectionalLight(0xfff0c5, 1.0);
    rimLight.position.set(0, 3, -5);
    scene.add(rimLight);

    // Animation frames loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Canvas size responsiveness
    const handleResize = () => {
      if (!viewerRef.current || !rendererRef.current || !cameraRef.current) return;
      const width = viewerRef.current.clientWidth;
      const height = viewerRef.current.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      controls.removeEventListener("start", handleControlsStart);
      controls.dispose();
      
      if (modelRootRef.current && sceneRef.current) {
        sceneRef.current.remove(modelRootRef.current);
      }
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  // 2. Synchronize Auto-rotation controls
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // 3. Load Selected GLB Product Model
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const product = PRODUCTS[selectedProductId];
    if (!product) return;

    // Clean up past loaded assets in Three.js heap
    textureRequestIdRef.current += 1;
    if (currentTextureRef.current) {
      currentTextureRef.current.dispose();
      currentTextureRef.current = null;
    }
    if (modelRootRef.current) {
      scene.remove(modelRootRef.current);
      modelRootRef.current.traverse((child: THREE.Object3D) => {
        if (!(child as THREE.Mesh).isMesh) return;
        const mesh = child as THREE.Mesh;
        mesh.geometry?.dispose();
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((m: THREE.Material) => m?.dispose());
      });
      modelRootRef.current = null;
    }
    productMaterialsRef.current = [];

    const loader = new GLTFLoader();
    loader.load(
      product.file,
      (gltf) => {
        const modelRoot = gltf.scene;
        modelRootRef.current = modelRoot;

        productMaterialsRef.current = [];
        modelRoot.traverse((child: THREE.Object3D) => {
          if (!(child as THREE.Mesh).isMesh || !(child as THREE.Mesh).material) return;
          const mesh = child as THREE.Mesh;
          const sourceMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          const clonedMaterials = sourceMaterials.map((sourceMaterial: THREE.Material) => {
            const cloned = sourceMaterial.clone() as THREE.MeshStandardMaterial;
            const materialName = (sourceMaterial.name || "").toLowerCase();
            if (product.materialHints.some((hint) => materialName.includes(hint))) {
              productMaterialsRef.current.push(cloned);
            }
            return cloned;
          });
          mesh.material = Array.isArray(mesh.material) ? clonedMaterials : clonedMaterials[0];
        });

        scene.add(modelRoot);

        // Compute centering and sizing bounding boxes
        const box = new THREE.Box3().setFromObject(modelRoot);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        modelRoot.position.sub(center);
        modelRoot.position.y += size.y / 2;

        const maxSize = Math.max(size.x, size.y, size.z);
        const scaleFactor = product.scaleFactor || 1;
        modelRoot.scale.setScalar((2.35 / maxSize) * scaleFactor);
        modelRoot.position.y += product.positionY || 0;
        modelRoot.position.x += product.positionX || 0;

        modelRoot.rotation.y = product.rotationY || 0;

        const newBox = new THREE.Box3().setFromObject(modelRoot);
        const newSize = new THREE.Vector3();
        newBox.getSize(newSize);

        const view = product.cameraView;
        if (cameraRef.current && controlsRef.current) {
          if (view) {
            cameraRef.current.position.set(view.x, newSize.y * view.y, view.z);
            controlsRef.current.target.set(0, newSize.y * view.targetY, 0);
          } else {
            cameraRef.current.position.set(0, newSize.y * 0.52, 4.7);
            controlsRef.current.target.set(0, newSize.y * 0.38, 0);
          }
          controlsRef.current.update();
        }

        setStatusText(
          productMaterialsRef.current.length
            ? `${product.label} aktif · ${productMaterialsRef.current.length} material kain terdeteksi`
            : `${product.label} aktif · material kain belum terdeteksi`
        );

        // Toggle texture generation to run
        setModelLoadedToggle(prev => prev + 1);
      },
      undefined,
      (error) => {
        console.error(error);
        setStatusText(`Gagal memuat ${product.file.split("/").pop()}`);
      }
    );
  }, [selectedProductId]);

  // 4. Dynamic Motif Canvas Texture Builder and Applicator
  useEffect(() => {
    if (productMaterialsRef.current.length === 0) return;

    const requestId = ++textureRequestIdRef.current;
    const selectedMotif = MOTIF_LIST.find(m => m.id === selectedMotifId) || MOTIF_LIST[0];
    const motifSrc = `/assets/motif_sasirangan/folder/01_Motif_Dasar/${selectedMotif.file}`;

    const updateTexture = async () => {
      try {
        const image = await loadMotifImage(motifSrc);
        if (requestId !== textureRequestIdRef.current) return;

        const mask = makeTransparentMask(image);

        // Create tile composition canvas
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const [primary, accent, deep] = colors;
        const fabricBase = baseColor;

        // Calculate size based on scale slider (scaled from 45% - 190% to pixel range)
        const motifWidth = Math.max(76, Math.min(230, 150 * (motifScale / 100)));
        const naturalHeight = motifWidth * (mask.height / mask.width);
        const motifHeight = Math.max(24, naturalHeight);

        // Layered pattern stamps (layered colors offsets)
        const stamps = [
          createTintedStamp(mask, motifWidth, motifHeight, primary),
          createTintedStamp(mask, motifWidth, motifHeight, accent),
          createTintedStamp(mask, motifWidth, motifHeight, deep)
        ];

        const angle = motifRotation * Math.PI / 180;

        // Draw fabric base color
        ctx.fillStyle = fabricBase;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Translate and Rotate pattern
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        const gapX = motifWidth * 0.16;
        const gapY = motifHeight * 0.72;
        const stepX = motifWidth + gapX;
        const stepY = motifHeight + gapY;

        for (let row = -2, y = -motifHeight; y < canvas.height + motifHeight; row += 1, y += stepY) {
          for (let column = -2, x = -motifWidth; x < canvas.width + motifWidth; column += 1, x += stepX) {
            const offset = row % 2 ? stepX * 0.47 : 0;
            const stampIndex = Math.abs((row * 2) + column) % stamps.length;
            ctx.drawImage(stamps[stampIndex], x + offset, y);
          }
        }

        ctx.restore();

        // Convert canvas context to ThreeJS texture
        const nextTexture = new THREE.CanvasTexture(canvas);
        nextTexture.colorSpace = THREE.SRGBColorSpace;
        nextTexture.wrapS = THREE.RepeatWrapping;
        nextTexture.wrapT = THREE.RepeatWrapping;

        if (rendererRef.current) {
          nextTexture.anisotropy = rendererRef.current.capabilities.getMaxAnisotropy();
        }

        const product = PRODUCTS[selectedProductId];
        const repeat = product?.textureRepeat || 1;
        nextTexture.repeat.set(repeat, repeat);
        nextTexture.needsUpdate = true;

        const previousTexture = currentTextureRef.current;
        currentTextureRef.current = nextTexture;

        // Map texture onto Three.js materials
        productMaterialsRef.current.forEach((material: THREE.MeshStandardMaterial) => {
          material.map = nextTexture;
          material.normalMap = null;
          material.bumpMap = null;
          material.roughnessMap = null;
          material.metalnessMap = null;
          material.aoMap = null;
          material.alphaMap = null;
          material.displacementMap = null;
          material.emissiveMap = null;

          material.vertexColors = false;
          if (material.color) material.color.set(0xffffff);
          if (material.emissive) material.emissive.set(0x000000);
          if ("emissiveIntensity" in material) material.emissiveIntensity = 0;
          if ("roughness" in material) material.roughness = 0.65;
          if ("metalness" in material) material.metalness = 0;
          material.transparent = false;
          material.opacity = 1;
          material.needsUpdate = true;
        });

        if (previousTexture) {
          previousTexture.dispose();
        }
      } catch (err) {
        console.error("Gagal mengupdate tekstur:", err);
      }
    };

    updateTexture();
  }, [selectedProductId, selectedMotifId, colors, baseColor, motifScale, motifRotation, modelLoadedToggle]);

  // Color changes handlers
  const handleColorChange = (index: number, value: string) => {
    const updated = [...colors];
    updated[index] = value;
    setColors(updated);
  };

  const applyPreset = (presetColors: string[]) => {
    setColors([...presetColors]);
  };

  const handleBaseColorChange = (colorValue: string) => {
    setBaseColor(colorValue.toUpperCase());
    setBaseColorMode("preset");
  };

  const handleCustomBaseColorChange = (colorValue: string) => {
    const formattedColor = colorValue.toUpperCase();
    setCustomBaseColor(formattedColor);
    setBaseColor(formattedColor);
    setBaseColorMode("custom");
  };

  // Capture current 3D WebGL buffer and download mockup
  const handleDownload = () => {
    if (!currentUser) {
      window.alert("Unduh desain tersedia setelah pengguna masuk ke akun SASITRA.");
      return;
    }

    const renderer = rendererRef.current;
    if (!renderer) return;

    // Trigger success confetti animation
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = 1200;
    exportCanvas.height = 800;
    const eCtx = exportCanvas.getContext("2d");

    if (eCtx) {
      const bgImg = new window.Image();
      bgImg.crossOrigin = "anonymous";
      bgImg.src = "/assets/studio-bg.png";
      bgImg.onload = () => {
        // Draw spotlight background
        eCtx.drawImage(bgImg, 0, 0, 1200, 800);

        // Overlay Three.js WebGL capture centered
        const webglCanvas = renderer.domElement;
        const size = Math.min(800, webglCanvas.height);
        const xOffset = (1200 - size) / 2;
        const yOffset = (800 - size) / 2;

        eCtx.drawImage(webglCanvas, xOffset, yOffset, size, size);

        // Download trigger
        const link = document.createElement("a");
        const product = PRODUCTS[selectedProductId];
        const selectedMotif = MOTIF_LIST.find(m => m.id === selectedMotifId) || MOTIF_LIST[0];
        link.download = `sasitra-3d-${product.id}-${selectedMotif.name.toLowerCase().replace(/\s+/g, "-")}.png`;
        link.href = exportCanvas.toDataURL("image/png");
        link.click();
      };
      bgImg.onerror = () => {
        // Fallback to raw webgl download if bg fails
        const webglCanvas = renderer.domElement;
        const link = document.createElement("a");
        const product = PRODUCTS[selectedProductId];
        const selectedMotif = MOTIF_LIST.find(m => m.id === selectedMotifId) || MOTIF_LIST[0];
        link.download = `sasitra-3d-${product.id}-${selectedMotif.name.toLowerCase().replace(/\s+/g, "-")}.png`;
        link.href = webglCanvas.toDataURL("image/png");
        link.click();
      };
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-bg-cream text-text-dark select-none">
      <Navbar />

      <main className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden mt-20 relative custom-3d-bg">
        
        {/* ========================================================
            LEFT SIDEBAR: PILIH MOTIF (Light Frosted Glass)
            ======================================================== */}
        <section className="w-full lg:w-80 bg-[#FFFDF9]/85 backdrop-blur-md border-r border-secondary/15 flex flex-col h-120 lg:h-full shrink-0 relative z-10">
          <div className="p-5 border-b border-secondary/15 shrink-0 bg-transparent">
            <div className="flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-[#A97340] shrink-0" />
              <h2 className="font-serif font-bold text-lg text-primary tracking-wide uppercase">
                Pilih Motif
              </h2>
            </div>
            <p className="font-sans text-[11px] text-text-dark/65 mt-1 leading-relaxed">
              Pilih motif favorit Anda untuk diterapkan pada produk
            </p>
          </div>

          {/* Motif Card Grid with hover text name overlay */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-transparent">
            <div className="grid grid-cols-2 gap-3.5">
              {MOTIF_LIST.map((motif) => {
                const isSelected = selectedMotifId === motif.id;
                return (
                  <button
                    key={motif.id}
                    onClick={() => setSelectedMotifId(motif.id)}
                    onMouseEnter={() => setHoveredMotif(motif.id)}
                    onMouseLeave={() => setHoveredMotif(null)}
                    className={`relative aspect-square rounded-2xl bg-[#FAF6EE] border-2 flex items-center justify-center overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer ${
                      isSelected 
                        ? "border-[#A37F55] scale-[0.98] ring-3 ring-[#A37F55]/15" 
                        : "border-secondary/15 hover:border-secondary/35"
                    }`}
                  >
                    {/* Full repeated motif pattern */}
                    <div 
                      className={`absolute inset-0 transition-opacity duration-300 ${
                        hoveredMotif === motif.id ? "opacity-30" : "opacity-95"
                      }`}
                      style={{
                        backgroundImage: `url('/assets/motif_sasirangan/folder/01_Motif_Dasar/${motif.file}')`,
                        backgroundRepeat: "repeat",
                        backgroundPosition: "center",
                        backgroundSize: "120px 120px",
                      }}
                    />

                    {/* Dark text overlay visible on hovered card */}
                    <AnimatePresence>
                      {hoveredMotif === motif.id && (
                        <motion.div 
                          className="absolute inset-0 bg-black/55 backdrop-blur-[1px] flex items-center justify-center p-2 text-center z-10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <span className="font-sans text-[10px] font-bold text-[#FFFDF9] tracking-wide leading-tight">
                            {motif.name}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Golden checkmark for active item */}
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 h-4 w-4 bg-[#A37F55] rounded-full flex items-center justify-center shadow-sm">
                        <Check className="h-2.5 w-2.5 text-[#FFFDF9]" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            CENTER PANEL: SPOTLIGHT CANVAS STAGE
            ======================================================== */}
        <section className="flex-1 flex flex-col items-center justify-center relative p-4 md:p-8 h-100 sm:h-120 md:h-150 lg:h-full overflow-hidden bg-transparent">
          
          {/* Active Product Title Capsule top center */}
          <div className="absolute top-6 z-20 flex flex-col items-center gap-2">
            <div className="bg-[#713034]/95 border-2 border-[#A37F55] px-8 py-2.5 rounded-full shadow-2xl backdrop-blur-md min-w-44 text-center">
              <span className="font-serif text-white font-bold text-base tracking-widest uppercase">
                {PRODUCTS[selectedProductId]?.stageLabel || "Studio 3D"}
              </span>
            </div>
          </div>

          {/* Product Base Colors Selector Swatches floating top left */}
          <div className="absolute top-6 left-6 z-25 flex gap-2">
            {BASE_PRODUCT_COLORS.map((c) => {
              const isActive = baseColorMode === "preset" && baseColor === c.value.toUpperCase();
              return (
                <button
                  key={c.id}
                  onClick={() => handleBaseColorChange(c.value)}
                  className={`w-7 h-7 rounded-full border-2 cursor-pointer shadow-md transition-all duration-200 hover:scale-105 ${
                    isActive ? "border-[#A37F55] scale-110" : "border-white/80"
                  }`}
                  title={`Warna Produk: ${c.label}`}
                  aria-label={`Warna Produk: ${c.label}`}
                >
                  <div className="w-full h-full rounded-full" style={{ backgroundColor: c.value }} />
                </button>
              );
            })}

            {/* Custom base color picker */}
            <button
              onClick={() => customBaseColorInputRef.current?.click()}
              className={`w-7 h-7 rounded-full border-2 cursor-pointer shadow-md transition-all duration-200 hover:scale-105 flex items-center justify-center ${
                baseColorMode === "custom" ? "border-[#A37F55] scale-110" : "border-white/80"
              }`}
              style={{
                background: "conic-gradient(from 0deg, red, yellow, green, cyan, blue, magenta, red)"
              }}
              title="Pilih warna produk sendiri"
              aria-label="Pilih warna produk sendiri"
            >
              <div 
                className="w-4 h-4 rounded-full border border-white"
                style={{
                  backgroundColor: baseColorMode === "custom" ? customBaseColor : "transparent",
                  opacity: baseColorMode === "custom" ? 1 : 0
                }}
              />
            </button>
            <input 
              ref={customBaseColorInputRef}
              type="color" 
              value={customBaseColor} 
              onChange={(e) => handleCustomBaseColorChange(e.target.value)}
              className="hidden"
            />
          </div>

          {/* 3D Canvas container with premium animation */}
          <div className="relative w-full max-w-md md:max-w-lg aspect-square flex items-center justify-center">
            {/* Viewer WebGL Mount Point */}
            <div ref={viewerRef} className="w-full h-full min-h-75 z-10 cursor-grab active:cursor-grabbing outline-none" />
          </div>

          {/* Auto Rotate Control Button */}
          <button 
            onClick={() => setAutoRotate(!autoRotate)}
            className={`absolute bottom-6 left-6 z-25 flex items-center gap-2 px-3.5 py-2 rounded-full border-2 text-[10px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-md hover:scale-105 ${
              autoRotate 
                ? "bg-[#D29A2C] border-[#F6D783] text-white" 
                : "bg-[#713034]/90 border-[#A37F55] text-[#FFF5DA]"
            }`}
            aria-label="Aktifkan atau nonaktifkan putar otomatis"
          >
            <svg className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M20 12a8 8 0 1 1-2.34-5.66"></path>
              <path d="M20 4v6h-6"></path>
            </svg>
            <span>Putar: {autoRotate ? "ON" : "OFF"}</span>
          </button>

          {/* Interaction Tip */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-black/45 border border-white/10 px-4 py-2 rounded-full pointer-events-none text-white font-sans text-[10px] md:text-xs font-medium tracking-wide flex items-center gap-3 shadow-2xl backdrop-blur-sm">
            <span className="flex items-center gap-1.5">
              <Move className="w-3.5 h-3.5 text-white/80" />
              <span>Drag untuk memutar</span>
            </span>
            <span className="opacity-40">|</span>
            <span className="flex items-center gap-1.5">
              <ZoomIn className="w-3.5 h-3.5 text-white/80" />
              <span>Scroll untuk zoom</span>
            </span>
          </div>

          <span id="statusText" className="sr-only" aria-live="polite">
            {statusText}
          </span>
        </section>

        {/* ========================================================
            RIGHT SIDEBAR: PANEL KONTROL (Light Frosted Glass Panel)
            ======================================================== */}
        <section className="w-full lg:w-96 bg-[#FFFDF9]/85 backdrop-blur-md border-l border-secondary/15 flex flex-col h-auto lg:h-full shrink-0 overflow-y-auto custom-scrollbar p-6 gap-6 z-10">
          
          {/* Pilih Produk Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="font-sans text-xs font-bold text-text-dark/75 uppercase tracking-wider">
              Pilih Produk
            </label>
            <div className="relative">
              <svg 
                viewBox="0 0 24 24" 
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#A97340] z-10 fill-none stroke-current"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {getProductIconPath(selectedProductId)}
              </svg>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedProductId(val);
                  setStatusText(`Memuat ${PRODUCTS[val]?.label.toLowerCase()}...`);
                }}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-secondary/20 bg-white/90 font-sans text-sm font-bold text-text-dark shadow-sm outline-none focus:border-[#A97340] transition-all cursor-pointer appearance-none backdrop-blur-sm"
              >
                {PRODUCT_LIST.map(p => (
                  <option key={p.id} value={p.id} className="bg-white text-text-dark">
                    {p.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-text-dark/60 h-0 w-0" />
            </div>
          </div>

          {/* Customizer Panel */}
          <div className="bg-white/90 backdrop-blur-lg border border-secondary/15 rounded-2xl p-5 shadow-md flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 flex items-center justify-center shrink-0">
                <Image src="/assets/decoration/3d_decor_1.png" alt="Kustomisasi" width={54} height={52} className="object-contain" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-serif font-bold text-md text-black">
                  Kustomisasi Produk
                </h3>
                <span className="font-sans text-[10px] text-[#D6911A] font-medium">
                  Atur tampilan produk Anda
                </span>
              </div>
            </div>

            {/* Warna Motif Pickers */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center gap-2">
                <div className="h-px bg-secondary/10 flex-1" />
                <span className="font-sans text-[10px] font-bold text-secondary-dark uppercase tracking-wider">
                  Warna Motif
                </span>
                <div className="h-px bg-secondary/10 flex-1" />
              </div>
              <div className="flex justify-center gap-4.5 mt-1">
                {colors.map((color, idx) => (
                  <div key={idx} className="relative group">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => handleColorChange(idx, e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full z-10"
                      aria-label={`Warna ${idx === 0 ? "utama" : idx === 1 ? "aksen" : "dasar"}`}
                    />
                    <div 
                      className="h-10 w-16 rounded-lg border-2 border-secondary/15 shadow-inner transition-transform group-hover:scale-105"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Preset Warna */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center gap-2">
                <div className="h-px bg-secondary/10 flex-1" />
                <span className="font-sans text-[10px] font-bold text-secondary-dark uppercase tracking-wider">
                  Preset Warna
                </span>
                <div className="h-px bg-secondary/10 flex-1" />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {COLOR_PRESETS.map((preset, idx) => {
                  const presetString = preset.colors.join(",").toUpperCase();
                  const currentString = colors.join(",").toUpperCase();
                  const isMatch = presetString === currentString;
                  return (
                    <button
                      key={idx}
                      onClick={() => applyPreset(preset.colors)}
                      className={`flex gap-1.5 p-2 bg-neutral-50/50 rounded-xl border items-center justify-between cursor-pointer transition-all duration-200 ${
                        isMatch 
                          ? "border-[#A37F55] bg-[#A37F55]/5 shadow-sm" 
                          : "border-secondary/15 hover:border-secondary/35"
                      }`}
                    >
                      <div className="flex gap-1">
                        {preset.colors.map((c, cIdx) => (
                          <div key={cIdx} className="h-4.5 w-4.5 rounded-full border border-black/10" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <div className={`h-4 w-4 rounded-full flex items-center justify-center border ${
                        isMatch ? "bg-[#A37F55] border-[#A37F55]" : "border-secondary/35 bg-white"
                      }`}>
                        {isMatch && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ukuran Motif (Scale Slider) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-sans text-[11px] font-bold text-[#713034] uppercase tracking-wider">
                  Ukuran Motif
                </span>
                <span className="font-mono text-[10px] font-bold text-text-dark/70">{motifScale}%</span>
              </div>
              <div className="relative flex items-center">
                <input
                  type="range"
                  min="45"
                  max="190"
                  value={motifScale}
                  onChange={(e) => setMotifScale(parseInt(e.target.value))}
                  className="w-full h-1 bg-secondary/15 rounded-lg appearance-none cursor-pointer accent-[#713034]"
                />
              </div>
              <span className="font-sans text-[9px] text-text-dark/45 font-medium -mt-1">
                Atur besar kecil motif pada produk Anda.
              </span>
            </div>

            {/* Arah Motif (Rotation Slider) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-sans text-[11px] font-bold text-[#713034] uppercase tracking-wider">
                  Arah Motif
                </span>
                <span className="font-mono text-[10px] font-bold text-text-dark/70">{motifRotation}°</span>
              </div>
              <div className="relative flex items-center">
                <input
                  type="range"
                  min="-45"
                  max="45"
                  value={motifRotation}
                  onChange={(e) => setMotifRotation(parseInt(e.target.value))}
                  className="w-full h-1 bg-secondary/15 rounded-lg appearance-none cursor-pointer accent-[#713034]"
                />
              </div>
              <span className="font-sans text-[9px] text-text-dark/45 font-medium -mt-1">
                Atur kemiringan arah motif pada produk Anda.
              </span>
            </div>

          </div>

          {/* Unduh button layout */}
          <div className="flex flex-col gap-2.5 mt-auto">
            <button
              onClick={handleDownload}
              className={`w-full py-4 rounded-xl font-serif text-base font-bold tracking-widest uppercase shadow-lg transition-all duration-300 flex items-center justify-center gap-3 border-2 cursor-pointer ${
                currentUser 
                  ? "bg-[#713034] border-[#A37F55] hover:bg-[#A37F55] hover:text-[#713034] hover:border-[#713034] text-white hover:scale-[1.02]" 
                  : "bg-white/5 border-secondary/15 text-text-dark/30 cursor-not-allowed"
              }`}
              disabled={!currentUser}
            >
              <Download className="h-4.5 w-4.5" />
              <span>Unduh Desain</span>
            </button>
          </div>

        </section>

      </main>
      
      {/* Scrollbar and custom background styling injected inline */}
      <style jsx global>{`
        .custom-3d-bg {
          background-image: url('/assets/background/background_8.png');
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(163, 127, 85, 0.25);
          border-radius: 99px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(163, 127, 85, 0.45);
        }
      `}</style>
    </div>
  );
}
