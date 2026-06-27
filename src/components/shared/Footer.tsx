import React from "react";
import Image from "next/image";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-accent-brown text-text-light mt-auto relative overflow-hidden">
      {/* Dashed stitch pattern border at the top of the footer */}
      <div className="w-full h-1 bg-bg-cream opacity-95">
        <div className="w-full h-full border-t-2 border-dashed border-secondary" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Logo & Description */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center overflow-hidden border border-secondary/40 shadow-inner">
                <Image src="/assets/logo/logo_sasitra.png" alt="Logo SASITRA" width={34} height={34} className="object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl text-secondary-light tracking-wide">
                  SASITRA
                </span>
                <span className="text-[9px] text-bg-cream/70 uppercase tracking-widest font-semibold">
                  Menenun Kisah Sasirangan
                </span>
              </div>
            </div>
            <p className="text-sm text-text-light/75 leading-relaxed max-w-sm">
              SASITRA adalah platform digital interaktif pelestari budaya kain tradisional Sasirangan khas Suku Banjar, Kalimantan Selatan. Menggabungkan media scrollytelling sejarah, ensiklopedia motif digital, dan simulasi AI Try-On.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif font-bold text-base text-secondary-light tracking-wide">
              Eksplorasi
            </h4>
            <div className="flex flex-col gap-2.5 text-sm text-text-light/80">
              <Link href="/home" className="hover:text-secondary-light transition-colors">
                Beranda
              </Link>
              <Link href="/sejarah" className="hover:text-secondary-light transition-colors">
                Perjalanan Sejarah
              </Link>
              <Link href="/ensiklopedia" className="hover:text-secondary-light transition-colors">
                Ensiklopedia Motif
              </Link>
              <Link href="/try-on" className="hover:text-secondary-light transition-colors">
                Virtual Try-On AI
              </Link>
            </div>
          </div>

          {/* Cultural Info */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif font-bold text-base text-secondary-light tracking-wide">
              Warisan Banua
            </h4>
            <p className="text-xs text-text-light/70 leading-relaxed">
              Dibuat dengan rasa hormat mendalam kepada para pengrajin kain Sasirangan di Kalimantan Selatan. 
            </p>
            <div className="mt-2 text-[11px] text-secondary/90 bg-primary-dark/30 border border-secondary/20 rounded-xl px-4 py-2.5 inline-block">
              📍 Banjarmasin, Kalimantan Selatan
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-bg-cream/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-light/50">
          <p>© {new Date().getFullYear()} SASITRA. Semua Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex gap-6">
            <span className="hover:text-secondary-light cursor-pointer">Syarat & Ketentuan</span>
            <span className="hover:text-secondary-light cursor-pointer">Kebijakan Privasi</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
