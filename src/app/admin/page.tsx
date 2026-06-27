"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  ShieldAlert, BarChart3, Palette, Users, FileText, Plus, Search, 
  Edit3, Trash2, Power, PowerOff, Shield, User as UserIcon, CheckCircle2, Wand2 
} from "lucide-react";
import { useDatabase } from "../../store/useDatabase";
import { Motif } from "../../data/initialData";
import { Navbar } from "../../components/shared/Navbar";
import { Footer } from "../../components/shared/Footer";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Modal } from "../../components/ui/Modal";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { 
    currentUser, motifs, users, historyChapters, tryOnResults,
    addMotif, updateMotif, deleteMotif, toggleUserStatus, updateHistoryChapter, resetDatabase 
  } = useDatabase();

  // Guard check
  useEffect(() => {
    if (!currentUser || currentUser.role !== "ADMIN") {
      router.push("/");
    }
  }, [currentUser, router]);

  // Sidebar Tab
  const [activeTab, setActiveTab] = useState<"overview" | "motifs" | "users" | "content">("overview");

  // Search States
  const [motifSearch, setMotifSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  // Motif Modal State
  const [isMotifModalOpen, setIsMotifModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingMotifId, setEditingMotifId] = useState<string | null>(null);

  // Motif Form Fields
  const [namaMotif, setNamaMotif] = useState("");
  const [kategori, setKategori] = useState<'FLORA' | 'FAUNA' | 'GEOMETRIS' | 'ALAM' | 'LAINNYA'>("FLORA");
  const [deskripsi, setDeskripsi] = useState("");
  const [maknaFilosofi, setMaknaFilosofi] = useState("");
  const [sejarahText, setSejarahText] = useState("");
  const [warnaTradisionalCsv, setWarnaTradisionalCsv] = useState("#8B1A1A, #C5960C, #FAF3E0, #3D1C0B");
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT'>("PUBLISHED");
  const [svgTemplate, setSvgTemplate] = useState<"diamond" | "wave" | "leaf" | "star">("diamond");

  // Content Editor States
  const [selectedChapterId, setSelectedChapterId] = useState("chapter-1");
  const [chapterKonten, setChapterKonten] = useState("");
  const [chapterSpeech, setChapterSpeech] = useState("");
  const [contentSavedMsg, setContentSavedMsg] = useState("");

  const [prevSelectedChapterId, setPrevSelectedChapterId] = useState(selectedChapterId);
  const [prevHistoryChapters, setPrevHistoryChapters] = useState(historyChapters);

  if (selectedChapterId !== prevSelectedChapterId || historyChapters !== prevHistoryChapters) {
    setPrevSelectedChapterId(selectedChapterId);
    setPrevHistoryChapters(historyChapters);
    const ch = historyChapters.find(c => c.id === selectedChapterId);
    if (ch) {
      setChapterKonten(ch.konten);
      setChapterSpeech(ch.speech);
      setContentSavedMsg("");
    }
  }

  if (!currentUser || currentUser.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex flex-col bg-bg-cream text-text-dark items-center justify-center">
        <Navbar />
        <p className="text-sm font-semibold animate-pulse">Menghubungkan ke Admin Panel...</p>
        <Footer />
      </div>
    );
  }

  // Pre-configured SVG coordinates templates
  const svgTemplates = {
    diamond: [
      { d: "M 0 0 H 100 V 100 H 0 Z", role: "background" as const },
      { d: "M 50 15 L 85 50 L 50 85 L 15 50 Z", role: "main" as const },
      { d: "M 50 30 L 70 50 L 50 70 L 30 50 Z", role: "accent" as const },
      { d: "M 50 10 L 90 50 L 50 90 L 10 50 Z", role: "jelujur" as const, strokeWidth: 1.5, strokeDasharray: "2,2" }
    ],
    wave: [
      { d: "M 0 0 H 100 V 100 H 0 Z", role: "background" as const },
      { d: "M 10 30 Q 30 10, 50 30 T 90 30 C 95 35, 90 45, 50 45 Z", role: "main" as const },
      { d: "M 10 60 Q 30 40, 50 60 T 90 60 C 95 65, 90 75, 50 75 Z", role: "accent" as const },
      { d: "M 10 25 Q 30 5, 50 25 T 90 25", role: "jelujur" as const, strokeWidth: 2, strokeDasharray: "3,3" }
    ],
    leaf: [
      { d: "M 0 0 H 100 V 100 H 0 Z", role: "background" as const },
      { d: "M 50 85 C 30 75, 20 50, 35 25 C 45 40, 48 65, 50 85 Z", role: "main" as const },
      { d: "M 50 85 C 70 75, 80 50, 65 25 C 55 40, 52 65, 50 85 Z", role: "accent" as const },
      { d: "M 50 20 L 50 85", role: "jelujur" as const, strokeWidth: 1.5, strokeDasharray: "2,2" }
    ],
    star: [
      { d: "M 0 0 H 100 V 100 H 0 Z", role: "background" as const },
      { d: "M 50 20 L 60 40 L 80 50 L 60 60 L 50 80 L 40 60 L 20 50 L 40 40 Z", role: "main" as const },
      { d: "M 50 35 L 55 45 L 65 50 L 55 55 L 50 65 L 45 55 L 35 50 L 45 45 Z", role: "accent" as const },
      { d: "M 50 15 A 35 35 0 1 1 49.9 15 Z", role: "jelujur" as const, strokeWidth: 1.5, strokeDasharray: "3,3", fillRule: "evenodd" as const }
    ]
  };

  // MOTIF MODAL HANDLERS
  const openAddMotifModal = () => {
    setModalMode("add");
    setNamaMotif("");
    setKategori("FLORA");
    setDeskripsi("");
    setMaknaFilosofi("");
    setSejarahText("");
    setWarnaTradisionalCsv("#8B1A1A, #C5960C, #FAF3E0, #3D1C0B");
    setStatus("PUBLISHED");
    setSvgTemplate("diamond");
    setEditingMotifId(null);
    setIsMotifModalOpen(true);
  };

  const openEditMotifModal = (motif: Motif) => {
    setModalMode("edit");
    setNamaMotif(motif.nama_motif);
    setKategori(motif.kategori);
    setDeskripsi(motif.deskripsi);
    setMaknaFilosofi(motif.makna_filosofi);
    setSejarahText(motif.sejarah || "");
    setWarnaTradisionalCsv(motif.warna_tradisional.join(", "));
    setStatus(motif.status);
    setEditingMotifId(motif.id);
    setIsMotifModalOpen(true);
  };

  const handleSaveMotif = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaMotif.trim() || !deskripsi.trim() || !maknaFilosofi.trim()) {
      alert("Semua kolom wajib wajib diisi!");
      return;
    }

    const warnaArray = warnaTradisionalCsv.split(",").map(c => c.trim()).filter(c => c.startsWith("#"));

    if (modalMode === "add") {
      const paths = svgTemplates[svgTemplate];
      addMotif({
        nama_motif: namaMotif,
        kategori,
        deskripsi,
        makna_filosofi: maknaFilosofi,
        sejarah: sejarahText || undefined,
        warna_tradisional: warnaArray.length > 0 ? warnaArray : ["#8B1A1A", "#C5960C", "#FAF3E0", "#3D1C0B"],
        status,
        paths,
        viewBox: "0 0 100 100"
      });
    } else if (modalMode === "edit" && editingMotifId) {
      updateMotif(editingMotifId, {
        nama_motif: namaMotif,
        kategori,
        deskripsi,
        makna_filosofi: maknaFilosofi,
        sejarah: sejarahText || undefined,
        warna_tradisional: warnaArray.length > 0 ? warnaArray : ["#8B1A1A", "#C5960C", "#FAF3E0", "#3D1C0B"],
        status
      });
    }

    setIsMotifModalOpen(false);
  };

  const handleDeleteMotif = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus motif ini secara permanen?")) {
      deleteMotif(id);
    }
  };

  // CONTENT SAVE HANDLER
  const handleSaveContent = () => {
    updateHistoryChapter(selectedChapterId, chapterKonten, chapterSpeech);
    setContentSavedMsg("Konten sejarah berhasil diperbarui!");
    setTimeout(() => setContentSavedMsg(""), 3000);
  };

  // Filtered Lists
  const filteredMotifs = motifs.filter(m => 
    m.nama_motif.toLowerCase().includes(motifSearch.toLowerCase()) || 
    m.kategori.toLowerCase().includes(motifSearch.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-bg-cream text-text-dark">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-6 pt-32 pb-24 flex flex-col gap-8">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-secondary/15 pb-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary text-text-light flex items-center justify-center shadow-lg">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <h1 className="font-serif text-3xl font-extrabold text-primary">Admin Control Panel</h1>
              <p className="text-xs text-text-dark/60 font-semibold uppercase tracking-wider">
                Kelola Motif, Pengguna, Konten Budaya & Analitik SASITRA
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={resetDatabase} className="border-red-500 text-red-600 hover:bg-red-50">
            Reset Database ke Default
          </Button>
        </div>

        {/* Dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR: Nav controls */}
          <nav className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-3 lg:pb-0 scrollbar-none border-b lg:border-b-0 lg:border-r border-secondary/15 pr-0 lg:pr-4">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-bold w-full transition-all duration-300 ${
                activeTab === "overview" ? "bg-primary text-text-light shadow-md" : "text-text-dark/70 hover:bg-primary/10 hover:text-primary"
              }`}
            >
              <BarChart3 className="h-4.5 w-4.5" /> Ringkasan Analitik
            </button>
            <button
              onClick={() => setActiveTab("motifs")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-bold w-full transition-all duration-300 ${
                activeTab === "motifs" ? "bg-primary text-text-light shadow-md" : "text-text-dark/70 hover:bg-primary/10 hover:text-primary"
              }`}
            >
              <Palette className="h-4.5 w-4.5" /> Manajemen Motif
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-bold w-full transition-all duration-300 ${
                activeTab === "users" ? "bg-primary text-text-light shadow-md" : "text-text-dark/70 hover:bg-primary/10 hover:text-primary"
              }`}
            >
              <Users className="h-4.5 w-4.5" /> Manajemen Pengguna
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-bold w-full transition-all duration-300 ${
                activeTab === "content" ? "bg-primary text-text-light shadow-md" : "text-text-dark/70 hover:bg-primary/10 hover:text-primary"
              }`}
            >
              <FileText className="h-4.5 w-4.5" /> Manajemen Konten
            </button>
          </nav>

          {/* RIGHT WORKSPACE: Panel details */}
          <div className="lg:col-span-9">
            
            {/* SUB-VIEW 1: OVERVIEW ANALYTICS */}
            {activeTab === "overview" && (
              <div className="flex flex-col gap-8">
                
                {/* Stats grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                  <Card variant="glass-light" className="border border-secondary/15 flex items-center gap-4 py-5 px-5">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/25"><Users className="h-5 w-5" /></div>
                    <div className="flex flex-col"><span className="text-[10px] font-bold text-text-dark/50 uppercase">Total User</span><span className="text-xl font-bold font-mono">{users.length}</span></div>
                  </Card>
                  <Card variant="glass-light" className="border border-secondary/15 flex items-center gap-4 py-5 px-5">
                    <div className="h-11 w-11 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary-dark border border-secondary/25"><Palette className="h-5 w-5" /></div>
                    <div className="flex flex-col"><span className="text-[10px] font-bold text-text-dark/50 uppercase">Total Motif</span><span className="text-xl font-bold font-mono">{motifs.length}</span></div>
                  </Card>
                  <Card variant="glass-light" className="border border-secondary/15 flex items-center gap-4 py-5 px-5">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/25"><Wand2 className="h-5 w-5" /></div>
                    <div className="flex flex-col"><span className="text-[10px] font-bold text-text-dark/50 uppercase">Generate AI</span><span className="text-xl font-bold font-mono">{tryOnResults.length}</span></div>
                  </Card>
                  <Card variant="glass-light" className="border border-secondary/15 flex items-center gap-4 py-5 px-5">
                    <div className="h-11 w-11 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-200"><CheckCircle2 className="h-5 w-5" /></div>
                    <div className="flex flex-col"><span className="text-[10px] font-bold text-text-dark/50 uppercase">Status API</span><span className="text-sm font-bold text-green-600">Terhubung</span></div>
                  </Card>
                </div>

                {/* Simulated Chart */}
                <Card className="bg-white border border-secondary/10 p-6 flex flex-col gap-4">
                  <h3 className="font-serif font-bold text-base text-primary">Tren Aktivitas Mingguan (Try-On)</h3>
                  {/* Simulated SVG line chart */}
                  <div className="w-full aspect-4/1 bg-bg-cream/30 rounded-2xl border border-secondary/10 relative overflow-hidden flex items-end p-4">
                    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                      {/* Grid lines */}
                      <line x1="0" y1="10" x2="100" y2="10" stroke="#C5960C" strokeWidth="0.1" opacity="0.2" />
                      <line x1="0" y1="20" x2="100" y2="20" stroke="#C5960C" strokeWidth="0.1" opacity="0.2" />
                      
                      {/* Trend Curve */}
                      <path d="M 5 25 Q 20 18, 35 15 T 65 12 T 95 6" fill="none" stroke="#8B1A1A" strokeWidth="1" strokeLinecap="round" />
                      <path d="M 5 25 Q 20 18, 35 15 T 65 12 T 95 6 L 95 30 L 5 30 Z" fill="url(#chart-gradient)" opacity="0.1" />
                      
                      <defs>
                        <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8B1A1A" />
                          <stop offset="100%" stopColor="#FAF3E0" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    <div className="flex justify-between w-full text-[9px] font-bold text-text-dark/50 font-mono relative z-15 mt-auto">
                      <span>Senin</span><span>Selasa</span><span>Rabu</span><span>Kamis</span><span>Jumat</span><span>Sabtu</span><span>Minggu</span>
                    </div>
                  </div>
                </Card>

                {/* Recent Activities Log */}
                <Card className="bg-white border border-secondary/10 p-6 flex flex-col gap-4">
                  <h3 className="font-serif font-bold text-base text-primary">Aktivitas Terkini Platform</h3>
                  <div className="flex flex-col gap-3">
                    {tryOnResults.slice(0, 3).map((r, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b border-secondary/10 pb-3 last:border-b-0 last:pb-0">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-secondary/15 flex items-center justify-center text-[10px] text-primary">AI</div>
                          <span>User <strong>{users.find(u => u.id === r.userId)?.name || "Publik"}</strong> men-generate fitting kemeja motif {motifs.find(m => m.id === r.motifId)?.nama_motif || "Kustom"}.</span>
                        </div>
                        <span className="font-mono text-[10px] text-text-dark/50">{new Date(r.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ))}
                    {tryOnResults.length === 0 && (
                      <p className="text-xs text-text-dark/50 italic text-center py-4">Belum ada aktivitas rendering fitting room AI saat ini.</p>
                    )}
                  </div>
                </Card>
              </div>
            )}

            {/* SUB-VIEW 2: MANAGE MOTIFS (CRUD) */}
            {activeTab === "motifs" && (
              <Card className="bg-white border border-secondary/10 p-6 flex flex-col gap-6">
                
                {/* Search & Actions Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="relative w-full sm:max-w-xs">
                    <Input
                      type="text"
                      placeholder="Cari motif..."
                      value={motifSearch}
                      onChange={(e) => setMotifSearch(e.target.value)}
                      className="pl-10 py-2.5 rounded-xl border-2 border-secondary/20"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-text-dark/45" />
                  </div>
                  <Button onClick={openAddMotifModal} size="sm" className="w-full sm:w-auto">
                    <Plus className="mr-1.5 h-4.5 w-4.5" /> Tambah Motif Baru
                  </Button>
                </div>

                {/* Motifs List Table */}
                <div className="overflow-x-auto rounded-xl border border-secondary/15">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-bg-cream border-b border-secondary/15 font-bold uppercase tracking-wider text-text-dark/70">
                        <th className="p-3.5 pl-5">Visual</th>
                        <th className="p-3.5">Nama Motif</th>
                        <th className="p-3.5">Kategori</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 pr-5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary/10">
                      {filteredMotifs.map((m) => (
                        <tr key={m.id} className="hover:bg-bg-cream/15 transition-colors">
                          <td className="p-3.5 pl-5">
                            <div className="h-10 w-10 border border-secondary/20 rounded bg-bg-cream/40 p-1 flex items-center justify-center">
                              <svg viewBox={m.viewBox || "0 0 100 100"} className="w-full h-full">
                                {m.paths.map((p, idx) => {
                                  let fill = "transparent";
                                  let stroke = "none";
                                  if (p.role === "background") fill = m.warna_tradisional[2] || "#FAF3E0";
                                  else if (p.role === "main") fill = m.warna_tradisional[0] || "#8B1A1A";
                                  else if (p.role === "accent") fill = m.warna_tradisional[1] || "#C5960C";
                                  else if (p.role === "jelujur") stroke = m.warna_tradisional[3] || "#3D1C0B";

                                  return (
                                    <path
                                      key={idx}
                                      d={p.d}
                                      fill={fill}
                                      stroke={stroke}
                                      strokeWidth={p.strokeWidth}
                                    />
                                  );
                                })}
                              </svg>
                            </div>
                          </td>
                          <td className="p-3.5 font-bold text-text-dark">{m.nama_motif}</td>
                          <td className="p-3.5">
                            <span className="bg-secondary/10 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider text-secondary-dark">
                              {m.kategori}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                              m.status === 'PUBLISHED' ? "bg-green-50 text-green-600 border border-green-200" : "bg-zinc-50 text-zinc-500 border border-zinc-200"
                            }`}>
                              {m.status}
                            </span>
                          </td>
                          <td className="p-3.5 pr-5 text-right">
                            <div className="flex justify-end gap-2.5">
                              <button onClick={() => openEditMotifModal(m)} className="p-1 hover:text-primary transition-colors" title="Edit">
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleDeleteMotif(m.id)} className="p-1 hover:text-red-600 transition-colors" title="Hapus">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredMotifs.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-text-dark/50 italic">
                            Tidak ada motif Sasirangan yang ditemukan.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* SUB-VIEW 3: MANAGE USERS */}
            {activeTab === "users" && (
              <Card className="bg-white border border-secondary/10 p-6 flex flex-col gap-6">
                
                {/* Search Header */}
                <div className="relative w-full sm:max-w-xs">
                  <Input
                    type="text"
                    placeholder="Cari user email atau nama..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-10 py-2.5 rounded-xl border-2 border-secondary/20"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-text-dark/45" />
                </div>

                {/* Users List Table */}
                <div className="overflow-x-auto rounded-xl border border-secondary/15">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-bg-cream border-b border-secondary/15 font-bold uppercase tracking-wider text-text-dark/70">
                        <th className="p-3.5 pl-5">Profil</th>
                        <th className="p-3.5">Nama</th>
                        <th className="p-3.5">Email</th>
                        <th className="p-3.5">Hak Akses</th>
                        <th className="p-3.5 text-center">Status</th>
                        <th className="p-3.5 pr-5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary/10">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-bg-cream/15 transition-colors">
                          <td className="p-3.5 pl-5">
                            <Image
                              src={u.avatar_url || "https://api.dicebear.com/7.x/adventurer/svg"}
                              alt={u.name}
                              width={32}
                              height={32}
                              className="rounded-full border border-secondary/35 object-cover bg-white"
                            />
                          </td>
                          <td className="p-3.5 font-bold text-text-dark">{u.name}</td>
                          <td className="p-3.5 font-mono">{u.email}</td>
                          <td className="p-3.5">
                            <span className={`inline-flex items-center gap-1 font-semibold ${
                              u.role === 'ADMIN' ? "text-secondary-dark" : "text-text-dark/75"
                            }`}>
                              {u.role === 'ADMIN' ? <Shield className="h-3.5 w-3.5" /> : <UserIcon className="h-3.5 w-3.5" />}
                              {u.role}
                            </span>
                          </td>
                          <td className="p-3.5 text-center">
                            <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                              u.is_active ? "bg-green-50 text-green-600 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"
                            }`}>
                              {u.is_active ? "Aktif" : "Nonaktif"}
                            </span>
                          </td>
                          <td className="p-3.5 pr-5 text-right">
                            <Button
                              variant={u.is_active ? "danger" : "primary"}
                              size="sm"
                              className="h-7 px-3 text-[10px]"
                              disabled={u.role === 'ADMIN'} // Cannot deactivate self or other admins
                              onClick={() => toggleUserStatus(u.id)}
                            >
                              {u.is_active ? <PowerOff className="h-3 w-3 mr-1" /> : <Power className="h-3 w-3 mr-1" />}
                              {u.is_active ? "Nonaktifkan" : "Aktifkan"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-text-dark/50 italic">
                            Tidak ada pengguna yang cocok dengan pencarian Anda.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* SUB-VIEW 4: MANAGE CONTENT */}
            {activeTab === "content" && (
              <Card className="bg-white border border-secondary/10 p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-secondary/10 pb-4">
                  <h3 className="font-serif font-bold text-base text-primary">
                    Ubah Konten Sejarah (Scrollytelling)
                  </h3>
                  <span className="text-xs font-bold text-secondary-dark uppercase tracking-wider">
                    Pembaruan Real-Time
                  </span>
                </div>

                {contentSavedMsg && (
                  <div className="bg-green-50 text-green-600 text-xs font-semibold px-4 py-3 rounded-xl border border-green-200 flex items-center gap-2">
                    <CheckCircle2 className="h-4.5 w-4.5" /> {contentSavedMsg}
                  </div>
                )}

                <div className="flex flex-col gap-5">
                  <Select
                    label="Pilih Chapter Sejarah"
                    value={selectedChapterId}
                    onChange={(e) => setSelectedChapterId(e.target.value)}
                    options={historyChapters.map(c => ({ value: c.id, label: `Chapter 0${c.chapter_order}: ${c.judul}` }))}
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-text-dark/80 tracking-wide uppercase">
                      Konten Penjelasan Sejarah
                    </label>
                    <textarea
                      rows={5}
                      value={chapterKonten}
                      onChange={(e) => setChapterKonten(e.target.value)}
                      className="w-full rounded-xl border-2 border-secondary/20 bg-white/50 px-4 py-3 text-sm text-text-dark focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-text-dark/80 tracking-wide uppercase">
                      Dialog Speech Bubble Sira Galuh
                    </label>
                    <textarea
                      rows={3}
                      value={chapterSpeech}
                      onChange={(e) => setChapterSpeech(e.target.value)}
                      className="w-full rounded-xl border-2 border-secondary/20 bg-white/50 px-4 py-3 text-sm text-text-dark focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
                    />
                  </div>

                  <Button onClick={handleSaveContent} className="mt-2 w-max">
                    Simpan Perubahan Konten
                  </Button>
                </div>
              </Card>
            )}

          </div>

        </div>
      </main>

      {/* MODAL: ADD / EDIT MOTIF */}
      <Modal
        isOpen={isMotifModalOpen}
        onClose={() => setIsMotifModalOpen(false)}
        title={modalMode === "add" ? "Tambah Motif Sasirangan Baru" : "Edit Motif Sasirangan"}
      >
        <form onSubmit={handleSaveMotif} className="flex flex-col gap-4">
          <Input
            label="Nama Motif"
            type="text"
            value={namaMotif}
            onChange={(e) => setNamaMotif(e.target.value)}
            placeholder="Hiris Gagatas, Bayam Raja, dll."
          />

          <Select
            label="Kategori"
            value={kategori}
            onChange={(e) => setKategori(e.target.value as 'FLORA' | 'FAUNA' | 'GEOMETRIS' | 'ALAM' | 'LAINNYA')}
            options={[
              { value: "FLORA", label: "Flora" },
              { value: "FAUNA", label: "Fauna" },
              { value: "GEOMETRIS", label: "Geometris" },
              { value: "ALAM", label: "Bentang Alam" },
              { value: "LAINNYA", label: "Lainnya" }
            ]}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-dark/80 tracking-wide uppercase">Deskripsi Lengkap</label>
            <textarea
              rows={3}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Deskripsi sejarah dan asal usul motif..."
              className="w-full rounded-xl border-2 border-secondary/20 bg-white/50 px-4 py-3 text-sm text-text-dark focus:border-primary focus:bg-white focus:outline-none focus:ring-4"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-dark/80 tracking-wide uppercase">Makna & Filosofi Budaya</label>
            <textarea
              rows={2}
              value={maknaFilosofi}
              onChange={(e) => setMaknaFilosofi(e.target.value)}
              placeholder="Makna rohani dan doa di balik lekukan motif..."
              className="w-full rounded-xl border-2 border-secondary/20 bg-white/50 px-4 py-3 text-sm text-text-dark focus:border-primary focus:bg-white focus:outline-none focus:ring-4"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-dark/80 tracking-wide uppercase">Sejarah Asal Usul (Opsional)</label>
            <textarea
              rows={2}
              value={sejarahText}
              onChange={(e) => setSejarahText(e.target.value)}
              placeholder="Sejarah awal penciptaan motif ini..."
              className="w-full rounded-xl border-2 border-secondary/20 bg-white/50 px-4 py-3 text-sm text-text-dark focus:border-primary focus:bg-white focus:outline-none"
            />
          </div>

          <Input
            label="Daftar Preset Warna Tradisional (Pemisah Koma)"
            type="text"
            value={warnaTradisionalCsv}
            onChange={(e) => setWarnaTradisionalCsv(e.target.value)}
            placeholder="#8B1A1A, #C5960C, #FAF3E0"
          />

          <Select
            label="Status Publikasi"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'PUBLISHED' | 'DRAFT')}
            options={[
              { value: "PUBLISHED", label: "Published" },
              { value: "DRAFT", label: "Draft" }
            ]}
          />

          {modalMode === "add" && (
            <Select
              label="Template Visual SVG Motif"
              value={svgTemplate}
              onChange={(e) => setSvgTemplate(e.target.value as "diamond" | "wave" | "leaf" | "star")}
              options={[
                { value: "diamond", label: "Hiris Ketupat (Geometris)" },
                { value: "wave", label: "Ombak Wavy (Air/Fauna)" },
                { value: "leaf", label: "Daun Melengkung (Flora)" },
                { value: "star", label: "Tampuk Bintang (Flora/Flora)" }
              ]}
            />
          )}

          <div className="flex gap-3 mt-4">
            <Button type="submit" className="flex-1">
              Simpan Motif
            </Button>
            <Button type="button" variant="ghost" onClick={() => setIsMotifModalOpen(false)} className="text-text-dark border border-secondary/25">
              Batal
            </Button>
          </div>
        </form>
      </Modal>

      <Footer />
    </div>
  );
}
