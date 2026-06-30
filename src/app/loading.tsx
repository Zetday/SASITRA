import React from "react";
import Image from "next/image";

export default function RootLoading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-bg-cream text-text-dark select-none relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-jelujur-pattern opacity-[0.02] pointer-events-none" />
      
      <div className="flex flex-col items-center gap-6 z-10">
        {/* Pulsing logo */}
        <div className="relative w-64 h-24 animate-pulse">
          <Image
            src="/assets/logo/tulisan_sasitra.png"
            alt="SASITRA"
            fill
            className="object-contain"
            priority
          />
        </div>
        
        {/* Bouncing loading dots in primary theme color */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
        </div>
      </div>
    </div>
  );
}
