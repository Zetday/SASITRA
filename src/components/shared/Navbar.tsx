"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, User as UserIcon, ShieldAlert } from "lucide-react";
import { useDatabase } from "../../store/useDatabase";
import { Button } from "../ui/Button";

export interface NavbarProps {
  activeOverride?: string;
}

// Hoist static navigation links - server-hoist-static-io
const NAV_LINKS = [
  { name: "Beranda", href: "/home" },
  { name: "Sejarah", href: "/home#sejarah" },
  { name: "Galeri", href: "/galeri" },
  { name: "Jelajah 3D", href: "/3d" },
  { name: "Try-On", href: "/try-on" },
];

export const Navbar: React.FC<NavbarProps> = ({ activeOverride }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  const { currentUser, logout } = useDatabase();
  
  const isDarkTheme = pathname === "/galeri" && !scrolled;
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;

      if (currentScrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Hide or show navbar based on scroll direction
      if (isOpen) {
        setVisible(true);
      } else if (currentScrollY < 50) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setVisible(false);
      } else {
        // Scrolling up
        setVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  // Close menus on navigation inside useEffect - rerender-move-effect-to-event / rerender-derived-state-no-effect
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setIsOpen(false);
      setProfileDropdownOpen(false);
    });
    return () => cancelAnimationFrame(handle);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isLinkActive = (href: string) => {
    if (activeOverride) {
      return href === activeOverride;
    }
    if (href === "/home") {
      return pathname === "/home";
    }
    if (href === "/home#sejarah" && pathname.startsWith("/sejarah")) {
      return true;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 transform ${
        visible ? "translate-y-0" : "-translate-y-full"
      } ${
        scrolled
          ? "bg-bg-cream/95 backdrop-blur-md shadow-md border-b border-secondary/15 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo and Tagline */}
        <Link href="/home" className="flex items-center gap-3 group">
          <Image src="/assets/logo/logo_sasitra.png" alt="Logo SASITRA" width={50} height={50} className="object-contain" />
          <div className="flex flex-col">
            <span className={`font-serif font-bold text-xl tracking-wide leading-tight transition-colors duration-300 ${isDarkTheme ? "text-secondary" : "text-primary"}`}>
              SASITRA
            </span>
            <span className={`text-[10px] font-semibold uppercase tracking-wider hidden sm:inline transition-colors duration-300 ${isDarkTheme ? "text-text-light/75" : "text-accent-brown/70"}`}>
              Menenun Kisah Sasirangan
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold tracking-wide transition-all duration-300 relative py-1 ${
                isLinkActive(link.href)
                  ? isDarkTheme ? "text-secondary font-bold" : "text-primary font-bold"
                  : isDarkTheme ? "text-text-light/80 hover:text-secondary" : "text-text-dark/70 hover:text-primary"
              }`}
            >
              {link.name}
              {isLinkActive(link.href) ? (
                <span className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${isDarkTheme ? "bg-secondary" : "bg-primary"}`} />
              ) : null}
            </Link>
          ))}
        </div>

        {/* Auth / Avatar Section */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                aria-label="Menu profil"
                aria-expanded={profileDropdownOpen}
                className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full transition-transform hover:scale-105"
              >
                <Image
                  src={currentUser.avatar_url || "https://api.dicebear.com/7.x/adventurer/svg"}
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="rounded-full bg-white object-cover border-2 border-secondary/50 shadow-sm"
                />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen ? (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-bg-cream p-2 shadow-2xl border border-secondary/20 z-50">
                  <div className="px-4 py-3 border-b border-secondary/10 flex flex-col mb-1.5">
                    <span className="text-xs font-semibold text-text-dark/50 uppercase tracking-wider">
                      Masuk Sebagai
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {currentUser.name}
                    </span>
                    <span className="text-xs text-text-dark/70 truncate">
                      {currentUser.email}
                    </span>
                  </div>

                  <Link
                    href="/profil"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-text-dark hover:bg-primary/10 hover:text-primary transition-colors"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <UserIcon className="h-4 w-4" />
                    Profil & Koleksi
                  </Link>

                  {currentUser.role === "ADMIN" ? (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-text-dark hover:bg-secondary/20 hover:text-secondary-dark transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <ShieldAlert className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  ) : null}

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 mt-1 border-t border-secondary/10 rounded-xl text-sm font-medium text-red-600 hover:bg-red-600/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link href="/auth">
              <Button size="sm">Masuk / Daftar</Button>
            </Link>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isOpen}
            className={`p-1.5 rounded-lg border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors ${
              isDarkTheme
                ? "border-white/20 text-text-light hover:text-secondary hover:bg-white/5"
                : "border-secondary/25 text-text-dark/80 hover:text-primary hover:bg-primary/5"
            }`}
          >
            {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen ? (
        <div className="md:hidden absolute top-full left-0 right-0 bg-bg-cream border-b border-secondary/20 shadow-2xl py-6 px-6 z-50 flex flex-col gap-5">
          <div className="flex flex-col gap-3.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base font-semibold py-2 px-3 rounded-xl transition-all duration-300 ${
                  isLinkActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-text-dark/70 hover:bg-primary/5 hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {currentUser ? (
            <div className="border-t border-secondary/15 pt-5 flex flex-col gap-3">
              <div className="flex items-center gap-3 px-3">
                <Image
                  src={currentUser.avatar_url || "https://api.dicebear.com/7.x/adventurer/svg"}
                  alt="Avatar"
                  width={36}
                  height={36}
                  className="rounded-full bg-white object-cover border border-secondary/35"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-text-dark">
                    {currentUser.name}
                  </span>
                  <span className="text-xs text-text-dark/50">
                    {currentUser.email}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <Link href="/profil" className="w-full">
                  <Button variant="outline" size="sm" className="w-full justify-start pl-6">
                    <UserIcon className="mr-2 h-4 w-4" /> Profil & Koleksi
                  </Button>
                </Link>

                {currentUser.role === "ADMIN" ? (
                  <Link href="/admin" className="w-full">
                    <Button variant="glass-light" size="sm" className="w-full justify-start pl-6 text-secondary-dark">
                      <ShieldAlert className="mr-2 h-4 w-4" /> Admin Dashboard
                    </Button>
                  </Link>
                ) : null}

                <Button variant="danger" size="sm" className="w-full justify-start pl-6" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Keluar
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-t border-secondary/15 pt-5">
              <Link href="/auth" className="w-full">
                <Button className="w-full">Masuk / Daftar</Button>
              </Link>
            </div>
          )}
        </div>
      ) : null}
    </nav>
  );
};

