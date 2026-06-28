"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useDatabase } from "../../store/useDatabase";
import { Navbar } from "../../components/shared/Navbar";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Tabs } from "../../components/ui/Tabs";

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-bg-cream">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/home";

  const { currentUser, login, register } = useDatabase();

  const [activeTab, setActiveTab] = useState("login");

  // Form Fields State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("user@sasitra.com");
  const [password, setPassword] = useState("user123");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Feedback
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      router.push(redirectUrl);
    }
  }, [currentUser, redirectUrl, router]);



  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Semua kolom wajib diisi!");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    
    // Artificial delay for UX polish
    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => router.push(redirectUrl), 1000);
      } else {
        setErrorMsg(res.message);
      }
    }, 800);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg("Semua kolom wajib diisi!");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi tidak cocok!");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Kata sandi harus minimal 6 karakter!");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      const res = register(name, email, password);
      setLoading(false);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => router.push(redirectUrl), 1000);
      } else {
        setErrorMsg(res.message);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-cream text-text-dark">
      <Navbar />

      <main className="flex-1 flex items-center justify-center pt-32 pb-20 px-6 max-w-md mx-auto w-full">
        <div className="flex flex-col gap-6 w-full">
          <Card className="bg-white border border-secondary/15 p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
            
            {/* Header info */}
            <div className="flex flex-col items-center text-center gap-2">
              <div className="h-12 w-12 rounded-full border border-secondary/30 bg-bg-cream flex items-center justify-center shadow-inner overflow-hidden">
                <Image src="/assets/logo/logo_sasitra.png" alt="SASITRA" width={40} height={40} className="object-contain" />
              </div>
              <h2 className="font-serif font-extrabold text-2xl text-primary">
                Pintu Masuk SASITRA
              </h2>
              <p className="text-xs text-text-dark/60 leading-relaxed max-w-xs">
                Silakan masuk atau buat akun baru untuk mengakses studio Virtual Try-On dan favoritkan motif pilihan Anda.
              </p>
            </div>

            {/* Toggle tabs */}
            <Tabs
              options={[
                { id: "login", label: "Masuk (Sign In)" },
                { id: "register", label: "Daftar (Sign Up)" }
              ]}
              activeTab={activeTab}
              onChange={(tab) => {
                setActiveTab(tab);
                setErrorMsg("");
                setSuccessMsg("");
                if (tab === "register") {
                  setName("");
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                } else {
                  setEmail("user@sasitra.com");
                  setPassword("user123");
                }
              }}
              className="w-full"
            />

            {/* Response Alerts */}
            {errorMsg && (
              <div className="bg-red-50 text-red-600 text-xs font-semibold px-4 py-3 rounded-xl border border-red-200">
                ⚠️ {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="bg-green-50 text-green-600 text-xs font-semibold px-4 py-3 rounded-xl border border-green-200">
                ✅ {successMsg}
              </div>
            )}

            {/* Form */}
            {activeTab === "login" ? (
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <Input
                  label="Alamat Email"
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                <Input
                  label="Kata Sandi"
                  type="password"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <Button type="submit" isLoading={loading} className="w-full mt-2">
                  Masuk Sekarang
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <Input
                  label="Nama Lengkap"
                  type="text"
                  placeholder="Budi Sudarsono"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
                <Input
                  label="Alamat Email"
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                <Input
                  label="Buat Kata Sandi"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <Input
                  label="Konfirmasi Kata Sandi"
                  type="password"
                  placeholder="Sama dengan kata sandi di atas"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
                <Button type="submit" isLoading={loading} className="w-full mt-2">
                  Daftar & Masuk
                </Button>
              </form>
            )}

          </Card>
        </div>
      </main>
    </div>
  );
}

