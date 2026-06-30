import React from "react";
import { Navbar } from "../../components/shared/Navbar";
import { Skeleton } from "../../components/ui/Skeleton";

export default function CustomizerLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-cream text-text-dark overflow-hidden">
      <Navbar />
      
      {/* 3D Customizer Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row pt-20 h-[calc(100vh-5rem)]">
        
        {/* Left Side: 3D WebGL Viewport Box */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative h-full">
          <div className="w-full max-w-md md:max-w-lg aspect-square flex flex-col items-center justify-center relative">
            <Skeleton className="w-full h-full rounded-[2rem] shadow-md" />
            
            {/* Spinning load status at the center of the viewport skeleton */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              <span className="text-[10px] md:text-xs font-bold text-primary animate-pulse tracking-widest uppercase">
                Menyiapkan Kanvas 3D...
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Sidebar Panel Layout */}
        <div className="w-full lg:w-96 bg-[#FFFDF9]/85 border-l border-secondary/15 flex flex-col justify-between p-6 gap-6 h-full overflow-y-auto">
          <div className="flex flex-col gap-6">
            
            {/* Pilih Produk Dropdown */}
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>

            {/* Tema Preset Motif */}
            <div className="flex flex-col gap-3">
              <Skeleton className="h-4 w-36" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-16 rounded-xl" />
                <Skeleton className="h-16 rounded-xl" />
                <Skeleton className="h-16 rounded-xl" />
                <Skeleton className="h-16 rounded-xl" />
              </div>
            </div>

            {/* Warna Kain Dasar */}
            <div className="flex flex-col gap-3">
              <Skeleton className="h-4 w-40" />
              <div className="flex gap-2">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="w-10 h-10 rounded-full" />
              </div>
            </div>
          </div>

          {/* Action Panel Buttons */}
          <div className="flex flex-col gap-3 mt-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          
        </div>
      </div>
    </div>
  );
}
