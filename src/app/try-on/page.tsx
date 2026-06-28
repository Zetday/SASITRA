"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Upload, Download, RefreshCw, CheckCircle, Shirt } from "lucide-react";
import confetti from "canvas-confetti";
import { useDatabase, TryOnResult } from "../../store/useDatabase";
import { Navbar } from "../../components/shared/Navbar";
import { Footer } from "../../components/shared/Footer";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";

export default function TryOnPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-bg-cream text-text-dark items-center justify-center">
        <Navbar />
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary my-4"></div>
        <Footer />
      </div>
    }>
      <TryOnContent />
    </Suspense>
  );
}

function TryOnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser, motifs, addTryOnResult } = useDatabase();

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/auth?redirect=/try-on");
    }
  }, [currentUser, router]);

  // Query Params Loading
  const queryMotif = searchParams.get("motif");
  const queryColors = searchParams.get("colors");

  // State Management
  const [selectedMotifId, setSelectedMotifId] = useState(queryMotif || "hiris-gagatas");
  const [colors, setColors] = useState({
    background: "#FAF3E0",
    main: "#8B1A1A",
    accent: "#C5960C",
    jelujur: "#3D1C0B"
  });

  const [prevSelectedMotifId, setPrevSelectedMotifId] = useState<string | null>(null);
  const [prevQueryColors, setPrevQueryColors] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<"shirt" | "scarf">("shirt");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Generating states
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [resultImage, setResultImage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync colors from motif or query string when they change
  if (selectedMotifId !== prevSelectedMotifId || queryColors !== prevQueryColors) {
    setPrevSelectedMotifId(selectedMotifId);
    setPrevQueryColors(queryColors);

    let targetColors = {
      background: "#FAF3E0",
      main: "#8B1A1A",
      accent: "#C5960C",
      jelujur: "#3D1C0B"
    };

    let hasTarget = false;

    if (queryColors) {
      const parts = queryColors.split("_");
      if (parts.length === 4) {
        targetColors = {
          background: `#${parts[0]}`,
          main: `#${parts[1]}`,
          accent: `#${parts[2]}`,
          jelujur: `#${parts[3]}`
        };
        hasTarget = true;
      }
    }

    if (!hasTarget) {
      const activeMotif = motifs.find(m => m.id === selectedMotifId);
      if (activeMotif) {
        targetColors = {
          main: activeMotif.warna_tradisional[0] || "#8B1A1A",
          accent: activeMotif.warna_tradisional[1] || "#C5960C",
          background: activeMotif.warna_tradisional[2] || "#FAF3E0",
          jelujur: activeMotif.warna_tradisional[3] || "#3D1C0B"
        };
      }
    }

    setColors(targetColors);
  }

  const activeMotif = motifs.find(m => m.id === selectedMotifId) || motifs[0];

  // Image Upload Handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        alert("Ukuran file melebihi batas maksimal 10MB!");
        return;
      }
      setPreviewUrl(URL.createObjectURL(file));
      setResultImage(null);
    }
  };

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  // AI Simulation Generator
  const handleGenerate = () => {
    if (!previewUrl) return;
    setIsGenerating(true);
    setProgress(0);
    setProgressMsg("Mendeteksi siluet tubuh dan posisi leher...");

    const messages = [
      { p: 15, m: "Mendeteksi siluet tubuh dan posisi leher..." },
      { p: 40, m: "Memetakan pola kain Sasirangan sesuai lekukan tubuh..." },
      { p: 70, m: "Melakukan rendering serat tekstil kain..." },
      { p: 90, m: "Menyesuaikan pencahayaan AI agar menyatu dengan foto..." },
      { p: 100, m: "Proses Fitting Selesai!" }
    ];

    let currentMsgIdx = 0;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 5;
        
        // Update messages
        if (currentMsgIdx < messages.length - 1 && next >= messages[currentMsgIdx + 1].p) {
          currentMsgIdx++;
          setProgressMsg(messages[currentMsgIdx].m);
        }

        if (next >= 100) {
          clearInterval(interval);
          generateCompositeImage();
        }
        return next;
      });
    }, 150);
  };

  // Drawing composite onto HTML5 Canvas
  const generateCompositeImage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !previewUrl) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const userImg = new window.Image();
    userImg.src = previewUrl;
    userImg.crossOrigin = "anonymous";

    userImg.onload = () => {
      // Set canvas size equal to portrait standard
      canvas.width = 600;
      canvas.height = 800;

      // Draw user image scaled to fill portrait canvas
      const imgWidth = userImg.width;
      const imgHeight = userImg.height;
      const ratio = Math.max(600 / imgWidth, 800 / imgHeight);
      const newWidth = imgWidth * ratio;
      const newHeight = imgHeight * ratio;
      const xOffset = (600 - newWidth) / 2;
      const yOffset = (800 - newHeight) / 2;

      ctx.clearRect(0, 0, 600, 800);
      ctx.drawImage(userImg, xOffset, yOffset, newWidth, newHeight);

      // Now we draw the garment overlay.
      // We will create a CanvasPattern containing our custom colored motif
      const patternCanvas = document.createElement("canvas");
      patternCanvas.width = 40;
      patternCanvas.height = 40;
      const pCtx = patternCanvas.getContext("2d");
      
      if (pCtx) {
        // Draw motif tile onto helper pattern canvas
        pCtx.fillStyle = colors.background;
        pCtx.fillRect(0, 0, 40, 40);

        // Simple SVG-like drawings for pattern replication
        activeMotif.paths.forEach((path) => {
          let fill = "transparent";
          let stroke = "none";
          if (path.role === "main") fill = colors.main;
          else if (path.role === "accent") fill = colors.accent;
          else if (path.role === "jelujur") stroke = colors.jelujur;

          pCtx.fillStyle = fill;
          pCtx.strokeStyle = stroke;
          pCtx.lineWidth = path.strokeWidth ? path.strokeWidth * 0.4 : 1;
          
          // Render a small vector drawing inside 40x40 grid
          pCtx.beginPath();
          if (activeMotif.id === "hiris-gagatas") {
            pCtx.moveTo(20, 4); pCtx.lineTo(36, 20); pCtx.lineTo(20, 36); pCtx.lineTo(4, 20); pCtx.closePath();
          } else if (activeMotif.id === "gigi-haruan") {
            pCtx.moveTo(0, 0); pCtx.lineTo(10, 10); pCtx.lineTo(0, 20); pCtx.lineTo(10, 30); pCtx.lineTo(0, 40);
          } else { // Wavy leaves / organic paths
            pCtx.arc(20, 20, 10, 0, Math.PI * 2);
          }
          if (fill !== "transparent") pCtx.fill();
          if (stroke !== "none") pCtx.stroke();
        });
      }

      // Draw the product cut-out
      const garmentPattern = ctx.createPattern(patternCanvas, "repeat");
      if (garmentPattern) {
        ctx.fillStyle = garmentPattern;
        
        ctx.save();
        ctx.beginPath();
        
        if (selectedProduct === "shirt") {
          // Centered Shirt outline path on the user's chest area
          // Neck is around x: 300, y: 350. Chest stretches down.
          ctx.moveTo(300, 370); // Collar base center
          ctx.lineTo(360, 350); // Right neck collar corner
          ctx.lineTo(480, 380); // Right shoulder
          ctx.lineTo(540, 480); // Right sleeve cuff
          ctx.lineTo(480, 520); // Right sleeve underarm
          ctx.lineTo(460, 800); // Right bottom shirt
          ctx.lineTo(140, 800); // Left bottom shirt
          ctx.lineTo(120, 520); // Left sleeve underarm
          ctx.lineTo(60, 480);  // Left sleeve cuff
          ctx.lineTo(120, 380); // Left shoulder
          ctx.lineTo(240, 350); // Left neck collar corner
          ctx.closePath();
          ctx.fill();

          // Overlay lines for realism (Collar folds, buttons, shade)
          ctx.strokeStyle = "#1C1917";
          ctx.lineWidth = 4;
          
          // Draw collar folds
          ctx.beginPath();
          ctx.moveTo(240, 350); ctx.lineTo(300, 370); ctx.lineTo(360, 350);
          ctx.moveTo(240, 350); ctx.lineTo(300, 420); ctx.lineTo(360, 350);
          ctx.stroke();

          // Draw buttons line
          ctx.beginPath();
          ctx.moveTo(300, 420); ctx.lineTo(300, 800);
          ctx.strokeStyle = colors.main;
          ctx.lineWidth = 6;
          ctx.stroke();

          // Draw small buttons
          ctx.fillStyle = colors.accent;
          for (let y = 460; y <= 760; y += 80) {
            ctx.beginPath();
            ctx.arc(300, y, 5, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          // Scarf draped around shoulders
          ctx.moveTo(240, 320);
          ctx.bezierCurveTo(240, 300, 360, 300, 360, 320);
          ctx.bezierCurveTo(400, 400, 420, 550, 400, 750);
          ctx.lineTo(340, 750);
          ctx.bezierCurveTo(360, 550, 300, 400, 240, 320);
          ctx.closePath();
          ctx.fill();

          // Scarf details
          ctx.strokeStyle = colors.main;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(240, 320);
          ctx.bezierCurveTo(240, 300, 360, 300, 360, 320);
          ctx.stroke();

          // Draw Fringes at the bottom
          ctx.strokeStyle = colors.accent;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          for (let x = 345; x <= 395; x += 6) {
            ctx.moveTo(x, 750);
            ctx.lineTo(x, 770);
          }
          ctx.stroke();
        }
        ctx.restore();
      }

      // Convert canvas to Data URL and set result
      const dataUrl = canvas.toDataURL("image/png");
      setResultImage(dataUrl);
      setIsGenerating(false);

      // Save to Zustand mock DB try-on history
      const newResult: TryOnResult = {
        id: `tryon-${Date.now()}`,
        userId: currentUser?.id || "guest",
        motifId: selectedMotifId,
        fotoAsliUrl: previewUrl,
        fotoHasilUrl: dataUrl,
        warnaDipilih: colors.main,
        jenisProduk: selectedProduct === "shirt" ? "Kemeja" : "Selendang",
        status: "COMPLETED",
        created_at: new Date().toISOString()
      };
      addTryOnResult(newResult);

      // Trigger Celebration Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    };
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.download = `sasitra-tryon-${activeMotif.id}-${selectedProduct}.png`;
    link.href = resultImage;
    link.click();
  };

  const handleReset = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setPreviewUrl(null);
    setResultImage(null);
    setProgress(0);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-cream text-text-dark items-center justify-center">
        <Navbar />
        <p className="text-sm font-semibold animate-pulse">Menghubungkan ke Halaman Masuk...</p>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-cream text-text-dark">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-6 pt-32 pb-24 flex flex-col gap-10">
        
        {/* Header Title */}
        <div className="flex flex-col gap-3 text-center md:text-left max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-primary text-xs font-bold uppercase tracking-wider w-max mx-auto md:mx-0">
            <Shirt className="h-3.5 w-3.5" /> Virtual Fitting Room
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-primary">
            Virtual Try-On AI Studio
          </h1>
          <p className="text-sm md:text-base text-text-dark/70">
            Unggah foto Anda, pilih motif Sasirangan, kustomisasi warnanya, lalu saksikan kecerdasan buatan memasangkan pakaian Sasirangan ke foto Anda secara instan.
          </p>
        </div>

        {/* Studio Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: Photo Upload & Visualizer */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <Card className="bg-white border border-secondary/15 p-6 flex flex-col gap-6 items-center justify-center min-h-112.5 relative overflow-hidden">
              
              {/* HIDDEN CANVAS FOR IMAGE BLENDING */}
              <canvas ref={canvasRef} className="hidden" />

              {!previewUrl ? (
                /* 1. Upload Dropzone */
                <div
                  onClick={triggerUploadClick}
                  className="w-full flex-1 flex flex-col items-center justify-center border-4 border-dashed border-secondary/20 hover:border-primary/40 rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 bg-bg-cream/20 hover:bg-bg-cream/40 min-h-87.5"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="h-16 w-16 rounded-full bg-secondary/15 border border-secondary/20 flex items-center justify-center text-primary mb-6 shadow-sm">
                    <Upload className="h-7 w-7" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-text-dark">
                    Unggah Foto Setengah Badan Anda
                  </h3>
                  <p className="text-xs text-text-dark/65 max-w-xs leading-relaxed mt-2">
                    Seret dan lepas file foto Anda di sini, atau klik untuk memilih file dari komputer Anda (Format PNG, JPG, maks. 10MB).
                  </p>
                  <div className="mt-6 flex gap-2 items-center text-[10px] text-accent-brown/80 font-bold uppercase tracking-wider bg-secondary/10 px-4 py-2 rounded-xl">
                    💡 Tips: Gunakan foto menghadap ke depan dengan latar polos
                  </div>
                </div>
              ) : isGenerating ? (
                /* 2. Generating Progress Screen */
                <div className="w-full flex flex-col items-center justify-center gap-6 py-12">
                  <div className="relative h-24 w-24 flex items-center justify-center">
                    <RefreshCw className="h-12 w-12 text-primary animate-spin" />
                    <div className="absolute inset-0 border-4 border-dashed border-secondary/35 rounded-full animate-[spin_10s_linear_infinite]" />
                  </div>
                  
                  <div className="flex flex-col items-center gap-1.5 text-center">
                    <h3 className="font-serif text-lg font-bold text-primary">
                      AI Sedang Menggambar Pakaian Anda...
                    </h3>
                    <p className="text-xs text-text-dark/60 font-semibold uppercase tracking-wider animate-pulse">
                      {progressMsg}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full max-w-sm h-3 bg-secondary/10 rounded-full overflow-hidden border border-secondary/15">
                    <div
                      className="h-full bg-primary transition-all duration-300 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-secondary-dark">{progress}%</span>
                </div>
              ) : resultImage ? (
                /* 3. Output Result View */
                <div className="w-full flex flex-col gap-5 items-center">
                  <div className="relative rounded-2xl overflow-hidden border border-secondary/25 shadow-2xl max-w-sm aspect-3/4 bg-bg-cream/40">
                    <Image src={resultImage} alt="Try On Result" fill sizes="(max-width: 640px) 100vw, 384px" className="object-cover" />
                    <div className="absolute bottom-4 left-4 bg-green-600/90 text-text-light text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg backdrop-blur-sm border border-green-500/30">
                      <CheckCircle className="h-3.5 w-3.5" /> Berhasil Di-render
                    </div>
                  </div>

                  <div className="flex gap-3 w-full max-w-sm">
                    <Button onClick={handleDownload} className="flex-1 shadow-md">
                      <Download className="mr-2 h-4 w-4" /> Unduh Foto
                    </Button>
                    <Button onClick={handleReset} variant="outline" className="px-5 border-secondary/25 text-text-dark">
                      Ulangi Fitting
                    </Button>
                  </div>
                </div>
              ) : (
                /* 4. Crop Preview / Ready to Generate */
                <div className="w-full flex flex-col gap-6 items-center">
                  <div className="relative rounded-2xl overflow-hidden border border-secondary/25 shadow-md max-w-sm aspect-3/4 bg-bg-cream/40">
                    <Image src={previewUrl} alt="Preview Upload" fill sizes="(max-width: 640px) 100vw, 384px" className="object-cover" />
                    {/* Floating guide template representing body placement */}
                    <div className="absolute inset-0 border-2 border-dashed border-primary/25 rounded-2xl flex flex-col items-center justify-center pointer-events-none opacity-80">
                      <div className="w-28 h-28 rounded-full border-2 border-dashed border-secondary/35 mb-2 -mt-15" />
                      <div className="w-48 h-56 rounded-t-3xl border-2 border-dashed border-secondary/35" />
                    </div>
                  </div>

                  <div className="flex gap-3 w-full max-w-sm">
                    <Button onClick={handleGenerate} className="flex-1 shadow-lg">
                      <Shirt className="mr-2 h-5 w-5" /> Jalankan Fitting
                    </Button>
                    <Button onClick={handleReset} variant="ghost" className="text-red-600 hover:bg-red-50">
                      Batal
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* RIGHT COLUMN: Parameters Selectors */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* 1. Product Selection */}
            <Card className="bg-white border border-secondary/15 p-5 flex flex-col gap-4">
              <h3 className="font-serif font-bold text-base text-primary">
                1. Pilih Jenis Busana
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedProduct("shirt")}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${
                    selectedProduct === "shirt"
                      ? "border-primary bg-primary/5 text-primary font-bold shadow-md"
                      : "border-secondary/20 hover:border-primary/30 text-text-dark/70"
                  }`}
                >
                  <span className="text-2xl">👔</span>
                  <span className="text-xs uppercase tracking-wide">Kemeja Pria/Wanita</span>
                </button>

                <button
                  onClick={() => setSelectedProduct("scarf")}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${
                    selectedProduct === "scarf"
                      ? "border-primary bg-primary/5 text-primary font-bold shadow-md"
                      : "border-secondary/20 hover:border-primary/30 text-text-dark/70"
                  }`}
                >
                  <span className="text-2xl">🧣</span>
                  <span className="text-xs uppercase tracking-wide">Selendang Bahu</span>
                </button>
              </div>
            </Card>

            {/* 2. Motif Selection */}
            <Card className="bg-white border border-secondary/15 p-5 flex flex-col gap-4">
              <h3 className="font-serif font-bold text-base text-primary">
                2. Pilih Motif Sasirangan
              </h3>
              
              <Select
                label="Pilih Katalog Motif"
                value={selectedMotifId}
                onChange={(e) => setSelectedMotifId(e.target.value)}
                options={motifs.map(m => ({ value: m.id, label: `${m.nama_motif} (${m.kategori})` }))}
              />

              {/* Mini motif preview box */}
              <div className="flex items-center gap-4 bg-bg-cream/40 rounded-xl p-3 border border-secondary/10 mt-1">
                <div className="h-14 w-14 rounded-lg bg-white border border-secondary/15 p-1.5 flex items-center justify-center shrink-0">
                  <svg viewBox={activeMotif.viewBox || "0 0 100 100"} className="w-full h-full">
                    {activeMotif.paths.map((path, idx) => {
                      let fill = "transparent";
                      let stroke = "none";
                      if (path.role === "background") fill = colors.background;
                      else if (path.role === "main") fill = colors.main;
                      else if (path.role === "accent") fill = colors.accent;
                      else if (path.role === "jelujur") stroke = colors.jelujur;

                      return (
                        <path
                          key={idx}
                          d={path.d}
                          fill={fill}
                          stroke={stroke}
                          strokeWidth={path.strokeWidth}
                          strokeDasharray={path.strokeDasharray}
                          fillRule={path.fillRule}
                        />
                      );
                    })}
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-primary uppercase">{activeMotif.kategori}</span>
                  <span className="text-sm font-bold text-text-dark">{activeMotif.nama_motif}</span>
                  <span className="text-xs text-text-dark/60 italic truncate max-w-50">{activeMotif.makna_filosofi}</span>
                </div>
              </div>
            </Card>

            {/* 3. Color Customizer */}
            <Card className="bg-white border border-secondary/15 p-5 flex flex-col gap-4">
              <h3 className="font-serif font-bold text-base text-primary">
                3. Sesuaikan Warna Pola
              </h3>
              
              <div className="grid grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-text-dark/60 uppercase">Background</span>
                  <div className="flex items-center gap-2 border border-secondary/20 rounded-xl px-2 py-1 bg-bg-cream/10">
                    <input
                      type="color"
                      value={colors.background}
                      onChange={(e) => setColors(prev => ({ ...prev, background: e.target.value }))}
                      className="w-6 h-6 rounded-full cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-[10px] font-mono font-bold uppercase">{colors.background}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-text-dark/60 uppercase">Utama</span>
                  <div className="flex items-center gap-2 border border-secondary/20 rounded-xl px-2 py-1 bg-bg-cream/10">
                    <input
                      type="color"
                      value={colors.main}
                      onChange={(e) => setColors(prev => ({ ...prev, main: e.target.value }))}
                      className="w-6 h-6 rounded-full cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-[10px] font-mono font-bold uppercase">{colors.main}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-text-dark/60 uppercase">Aksen</span>
                  <div className="flex items-center gap-2 border border-secondary/20 rounded-xl px-2 py-1 bg-bg-cream/10">
                    <input
                      type="color"
                      value={colors.accent}
                      onChange={(e) => setColors(prev => ({ ...prev, accent: e.target.value }))}
                      className="w-6 h-6 rounded-full cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-[10px] font-mono font-bold uppercase">{colors.accent}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-text-dark/60 uppercase">Jelujur</span>
                  <div className="flex items-center gap-2 border border-secondary/20 rounded-xl px-2 py-1 bg-bg-cream/10">
                    <input
                      type="color"
                      value={colors.jelujur}
                      onChange={(e) => setColors(prev => ({ ...prev, jelujur: e.target.value }))}
                      className="w-6 h-6 rounded-full cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-[10px] font-mono font-bold uppercase">{colors.jelujur}</span>
                  </div>
                </div>
              </div>
            </Card>

          </div>

        </div>
      </main>
    </div>
  );
}
