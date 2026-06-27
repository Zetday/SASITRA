"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Heart, SlidersHorizontal, Sparkles } from "lucide-react";
import { useDatabase } from "../../store/useDatabase";
import { Navbar } from "../../components/shared/Navbar";
import { Footer } from "../../components/shared/Footer";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

export default function EnsiklopediaPage() {
  const router = useRouter();
  const { motifs, currentUser, favorites, toggleFavorite } = useDatabase();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Sync state with URL search parameters on load
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const searchParam = params.get("search");
      const kategoriParam = params.get("kategori");
      if (searchParam) {
        setSearchQuery(decodeURIComponent(searchParam));
      }
      if (kategoriParam) {
        setSelectedCategory(decodeURIComponent(kategoriParam));
      }
    }
  }, []);

  const categories = [
    { value: "ALL", label: "Semua Kategori" },
    { value: "FLORA", label: "Flora" },
    { value: "FAUNA", label: "Fauna" },
    { value: "GEOMETRIS", label: "Geometris" },
    { value: "ALAM", label: "Bentang Alam" },
    { value: "LAINNYA", label: "Lainnya" }
  ];

  // Filtering motifs based on search and category
  const filteredMotifs = useMemo(() => {
    return motifs.filter((m) => {
      // Filter draft status unless admin is viewing (or simply show all published ones)
      if (m.status !== "PUBLISHED") return false;

      const matchesSearch =
        m.nama_motif.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.makna_filosofi.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "ALL" || m.kategori === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [motifs, searchQuery, selectedCategory]);

  const handleFavoriteClick = (e: React.MouseEvent, motifId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
      // Prompt user to login
      alert("Silakan masuk (login) terlebih dahulu untuk menyimpan motif favorit!");
      router.push("/auth?redirect=/ensiklopedia");
      return;
    }
    toggleFavorite(motifId);
  };

  const isFavorited = (motifId: string) => {
    return favorites.includes(motifId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-cream text-text-dark">
      <Navbar />

      {/* Hero Search Header */}
      <header className="pt-32 pb-16 px-6 bg-linear-to-b from-accent-cream to-bg-cream text-center border-b border-secondary/15 relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 bg-jelujur-pattern opacity-5 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto flex flex-col gap-5 relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-primary text-xs font-bold uppercase tracking-wider w-max mx-auto">
            <Sparkles className="h-3.5 w-3.5" /> Warisan Agung Kalimantan
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl font-extrabold text-primary">
            Ensiklopedia Motif Sasirangan
          </h1>
          
          <p className="text-sm md:text-base text-text-dark/75 max-w-xl mx-auto">
            Jelajahi basis data komprehensif puluhan motif kain tradisional khas suku Banjar lengkap dengan sejarah, makna filosofis, dan modifikasi warnanya.
          </p>

          {/* Search Box */}
          <div className="max-w-xl w-full mx-auto mt-4 relative">
            <Input
              type="text"
              placeholder="Cari nama motif, arti, atau filosofi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-3.5 bg-white border border-secondary/20 shadow-lg text-sm rounded-2xl w-full"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-dark/40" />
          </div>
        </div>
      </header>

      {/* Main Catalog Section */}
      <section className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col gap-10">
        
        {/* Category Filter Tabs */}
        <div className="flex flex-col gap-4 border-b border-secondary/15 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-text-dark/60 uppercase tracking-wider">
            <SlidersHorizontal className="h-3.5 w-3.5 text-primary" /> Filter Kategori
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-text-light shadow-md"
                      : "bg-white text-text-dark/75 hover:bg-primary/5 hover:text-primary border border-secondary/10"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Motif Catalog Grid */}
        {filteredMotifs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredMotifs.map((motif) => (
              <Link key={motif.id} href={`/ensiklopedia/${motif.id}`}>
                <Card
                  hoverable
                  className="group h-full flex flex-col gap-5 bg-white border border-secondary/10 hover:border-primary/20 p-5 relative overflow-hidden"
                >
                  {/* Favorite button on the card */}
                  <button
                    onClick={(e) => handleFavoriteClick(e, motif.id)}
                    className="absolute top-4 right-4 z-20 h-9 w-9 rounded-full bg-white/80 hover:bg-white border border-secondary/15 flex items-center justify-center shadow-md transition-all duration-300 active:scale-90"
                    title={isFavorited(motif.id) ? "Hapus dari Favorit" : "Simpan ke Favorit"}
                  >
                    <Heart
                      className={`h-4.5 w-4.5 transition-colors ${
                        isFavorited(motif.id)
                          ? "fill-red-600 stroke-red-600"
                          : "text-text-dark/40 hover:text-red-500"
                      }`}
                    />
                  </button>

                  {/* SVG Motif Thumbnail */}
                  <div className="aspect-square w-full rounded-xl overflow-hidden border border-secondary/10 bg-bg-cream/30 p-4 flex items-center justify-center transition-all duration-500 group-hover:bg-bg-cream/60 group-hover:scale-101">
                    <svg viewBox={motif.viewBox || "0 0 100 100"} className="w-full h-full drop-shadow-sm">
                      {motif.paths.map((path, idx) => {
                        let fill = "transparent";
                        let stroke = "none";
                        if (path.role === "background") fill = motif.warna_tradisional[2] || "#FAF3E0";
                        else if (path.role === "main") fill = motif.warna_tradisional[0] || "#8B1A1A";
                        else if (path.role === "accent") fill = motif.warna_tradisional[1] || "#C5960C";
                        else if (path.role === "jelujur") stroke = motif.warna_tradisional[3] || "#3D1C0B";

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

                  {/* Text details */}
                  <div className="flex flex-col gap-1.5 mt-auto">
                    <span className="text-[9px] font-bold text-secondary-dark bg-secondary/10 px-2 py-0.5 rounded-full uppercase tracking-wider w-max">
                      {motif.kategori}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-text-dark group-hover:text-primary transition-colors">
                      {motif.nama_motif}
                    </h3>
                    <p className="text-xs text-text-dark/70 line-clamp-2 leading-relaxed">
                      {motif.makna_filosofi}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-white/40 border border-dashed border-secondary/25 rounded-3xl p-8 max-w-lg mx-auto flex flex-col items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-secondary/10 flex items-center justify-center text-primary border border-secondary/20">
              <Search className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-serif text-lg font-bold text-primary">
                Motif Tidak Ditemukan
              </h3>
              <p className="text-xs text-text-dark/65 leading-relaxed">
                Tidak ada motif Sasirangan yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo; atau filter kategori yang Anda pilih. Coba bersihkan pencarian atau ganti filter.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("ALL");
              }}
              className="mt-2 text-xs font-bold text-primary hover:underline"
            >
              Bersihkan Pencarian & Filter
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
