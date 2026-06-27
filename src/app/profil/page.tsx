"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Sparkles, User as UserIcon, Calendar, Compass, Wand2, Download, Trash2, Eye } from "lucide-react";
import { useDatabase, TryOnResult } from "../../store/useDatabase";
import { Navbar } from "../../components/shared/Navbar";
import { Footer } from "../../components/shared/Footer";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Tabs } from "../../components/ui/Tabs";
import { Modal } from "../../components/ui/Modal";

export default function ProfilPage() {
  const router = useRouter();
  const { currentUser, motifs, favorites, tryOnResults, toggleFavorite, updateProfile } = useDatabase();

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/auth?redirect=/profil");
    }
  }, [currentUser, router]);

  // Tabs
  const [activeTab, setActiveTab] = useState("favorites");

  // Profile Form States
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(currentUser?.name || "");

  // Modal State for Try-On Details
  const [selectedTryOn, setSelectedTryOn] = useState<TryOnResult | null>(null);

  const [prevUserId, setPrevUserId] = useState(currentUser?.id);

  if (currentUser && currentUser.id !== prevUserId) {
    setPrevUserId(currentUser.id);
    setName(currentUser.name);
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-cream text-text-dark items-center justify-center">
        <Navbar />
        <p className="text-sm font-semibold animate-pulse">Menghubungkan ke Halaman Profil...</p>
        <Footer />
      </div>
    );
  }

  // Filter favorited motifs from DB catalog
  const favoriteMotifs = motifs.filter(m => favorites.includes(m.id) && m.status === "PUBLISHED");

  // Filter try-on results by current user
  const userTryOns = tryOnResults.filter(r => r.userId === currentUser.id);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateProfile(name.trim());
    setEditMode(false);
  };

  const handleUnfavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  const handleDownloadTryOn = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `sasitra-saved-fitting-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-cream text-text-dark">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-6 pt-32 pb-24 flex flex-col gap-10">
        
        {/* Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: User Card Info & Edit */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="bg-white border border-secondary/15 p-6 flex flex-col gap-6 items-center text-center shadow-lg relative overflow-hidden">
              <div className="absolute -right-2.5 -top-2.5 opacity-5 pointer-events-none">
                <UserIcon className="h-40 w-40 text-primary" />
              </div>

              {/* User Avatar */}
              <div className="relative h-28 w-28 rounded-full border-2 border-secondary overflow-hidden bg-bg-cream p-1.5 shadow-inner">
                <Image
                  src={currentUser.avatar_url || "https://api.dicebear.com/7.x/adventurer/svg"}
                  alt={currentUser.name}
                  width={112}
                  height={112}
                  className="rounded-full bg-white object-cover"
                />
              </div>

              {/* User Profile Form */}
              {!editMode ? (
                <div className="flex flex-col gap-1 w-full">
                  <h2 className="font-serif text-2xl font-extrabold text-primary">
                    {currentUser.name}
                  </h2>
                  <span className="text-xs font-semibold text-text-dark/50 tracking-wider">
                    {currentUser.email}
                  </span>
                  
                  <div className="mt-4 flex flex-col gap-2 bg-bg-cream/30 rounded-xl p-3 border border-secondary/10 text-left text-xs">
                    <div className="flex items-center gap-2 text-text-dark/70">
                      <Calendar className="h-3.5 w-3.5 text-secondary-dark" />
                      <span>Terdaftar: {new Date(currentUser.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-dark/70">
                      <Sparkles className="h-3.5 w-3.5 text-secondary-dark" />
                      <span>Tipe Akun: <strong className="text-primary">{currentUser.role === 'ADMIN' ? 'Administrator' : 'Pengguna Publik'}</strong></span>
                    </div>
                  </div>

                  <Button onClick={() => setEditMode(true)} variant="outline" size="sm" className="mt-4 border-secondary/35 text-text-dark">
                    Ubah Nama Profil
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="flex flex-col gap-3.5 w-full">
                  <Input
                    label="Nama Lengkap"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" className="flex-1">
                      Simpan
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => { setEditMode(false); setName(currentUser.name); }} className="text-red-600">
                      Batal
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>

          {/* RIGHT COLUMN: Saved Items (Favorites & Try-On History) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Navigation Tabs */}
            <Tabs
              options={[
                { id: "favorites", label: "Motif Favorit Saya", icon: <Heart className="h-4 w-4" /> },
                { id: "tryon", label: "Riwayat Fitting AI", icon: <Wand2 className="h-4 w-4" /> }
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
              className="w-full"
            />

            {/* Content Display based on active tab */}
            {activeTab === "favorites" ? (
              
              /* TAB 1: Favorited Motifs */
              favoriteMotifs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {favoriteMotifs.map((motif) => (
                    <Link key={motif.id} href={`/ensiklopedia/${motif.id}`}>
                      <Card hoverable className="group bg-white p-4 border border-secondary/15 relative flex flex-col gap-3">
                        {/* Unfavorite button */}
                        <button
                          onClick={(e) => handleUnfavorite(e, motif.id)}
                          className="absolute top-3 right-3 z-20 h-8 w-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center border border-red-200 transition-colors"
                          title="Hapus dari Favorit"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>

                        <div className="aspect-square w-full rounded-xl bg-bg-cream/30 p-3 border border-secondary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-bg-cream/50">
                          <svg viewBox={motif.viewBox || "0 0 100 100"} className="w-full h-full">
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
                                />
                              );
                            })}
                          </svg>
                        </div>

                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-bold text-secondary-dark uppercase">{motif.kategori}</span>
                          <h4 className="font-serif font-bold text-base text-text-dark group-hover:text-primary transition-colors truncate">
                            {motif.nama_motif}
                          </h4>
                          <p className="text-[11px] text-text-dark/60 line-clamp-2 leading-relaxed">
                            {motif.makna_filosofi}
                          </p>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                /* Empty Favorites State */
                <div className="text-center py-16 bg-white/40 border border-dashed border-secondary/25 rounded-3xl p-8 max-w-md mx-auto flex flex-col items-center gap-4 mt-4">
                  <Heart className="h-12 w-12 text-primary animate-pulse" />
                  <div className="flex flex-col gap-1">
                    <h3 className="font-serif text-lg font-bold text-primary">Belum Ada Motif Favorit</h3>
                    <p className="text-xs text-text-dark/65 leading-relaxed">
                      Anda belum menambahkan motif Sasirangan ke koleksi favorit. Kunjungi ensiklopedia kami untuk menemukan motif yang Anda sukai!
                    </p>
                  </div>
                  <Link href="/ensiklopedia">
                    <Button size="sm" className="mt-2">
                      <Compass className="mr-2 h-4 w-4" /> Cari Motif
                    </Button>
                  </Link>
                </div>
              )
            ) : (
              
              /* TAB 2: Try-On History */
              userTryOns.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
                  {userTryOns.map((result) => {
                    const rMotif = motifs.find(m => m.id === result.motifId);
                    return (
                      <Card
                        key={result.id}
                        onClick={() => setSelectedTryOn(result)}
                        className="group bg-white p-3 border border-secondary/15 relative flex flex-col gap-2.5 cursor-pointer hover:shadow-md hover:border-primary/25"
                      >
                        <div className="aspect-3/4 w-full rounded-xl overflow-hidden bg-bg-cream/40 border border-secondary/10 relative">
                          <Image
                            src={result.fotoHasilUrl}
                            alt="Fitting Result"
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-103"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Eye className="h-6 w-6 text-white" />
                          </div>
                        </div>

                        <div className="flex flex-col gap-0.5">
                          <h4 className="font-bold text-xs text-text-dark truncate">
                            {rMotif?.nama_motif || "Motif Kustom"}
                          </h4>
                          <span className="text-[10px] text-text-dark/50">
                            {result.jenisProduk} • {new Date(result.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                /* Empty Try-On State */
                <div className="text-center py-16 bg-white/40 border border-dashed border-secondary/25 rounded-3xl p-8 max-w-md mx-auto flex flex-col items-center gap-4 mt-4">
                  <Wand2 className="h-12 w-12 text-primary animate-bounce" />
                  <div className="flex flex-col gap-1">
                    <h3 className="font-serif text-lg font-bold text-primary">Belum Ada Riwayat Fitting</h3>
                    <p className="text-xs text-text-dark/65 leading-relaxed">
                      Anda belum pernah mencoba fitting pakaian virtual. Ayo unggah foto Anda dan ciptakan kreasi motif warna pakaian Sasirangan Anda!
                    </p>
                  </div>
                  <Link href="/try-on">
                    <Button size="sm" className="mt-2">
                      Coba AI Try-On
                    </Button>
                  </Link>
                </div>
              )
            )}

          </div>
        </div>

        {/* Try-On Result Preview Modal */}
        <Modal
          isOpen={!!selectedTryOn}
          onClose={() => setSelectedTryOn(null)}
          title="Pratinjau Hasil Fitting AI"
        >
          {selectedTryOn && (
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Image Frame */}
              <div className="w-full max-w-70 aspect-3/4 rounded-2xl overflow-hidden border border-secondary/25 bg-bg-cream/40 shadow-xl shrink-0 relative">
                <Image
                  src={selectedTryOn.fotoHasilUrl}
                  alt="Fitting High Res"
                  fill
                  sizes="280px"
                  className="object-cover"
                />
              </div>

              {/* Details and Actions */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest font-mono">
                    Detail Fitting Hasil AI
                  </span>
                  <h3 className="font-serif font-bold text-2xl text-text-dark">
                    {motifs.find(m => m.id === selectedTryOn.motifId)?.nama_motif || "Motif Kustom"}
                  </h3>
                  <span className="text-xs text-text-dark/60 font-semibold">
                    Diterapkan pada: <strong className="text-secondary-dark">{selectedTryOn.jenisProduk}</strong>
                  </span>
                </div>

                <div className="border-t border-secondary/15 pt-4 flex flex-col gap-2.5 text-xs text-text-dark/70">
                  <p>📅 <strong>Tanggal Render:</strong> {new Date(selectedTryOn.created_at).toLocaleString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  <p>👤 <strong>Status Fitting:</strong> <span className="text-green-600 font-bold">Sukses (Selesai)</span></p>
                </div>

                <div className="flex gap-3 mt-4 w-full">
                  <Button onClick={() => handleDownloadTryOn(selectedTryOn.fotoHasilUrl)} className="flex-1">
                    <Download className="mr-2 h-4 w-4" /> Unduh Gambar PNG
                  </Button>
                  <Button variant="ghost" onClick={() => setSelectedTryOn(null)} className="text-text-dark border border-secondary/25">
                    Tutup
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>

      </main>

      <Footer />
    </div>
  );
}
