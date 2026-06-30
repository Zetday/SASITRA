import React from "react";
import { Navbar } from "../../components/shared/Navbar";
import { Skeleton } from "../../components/ui/Skeleton";

export default function TryOnLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-cream text-text-dark overflow-hidden">
      <Navbar />
      
      {/* Title Section */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 w-full pt-28 flex flex-col gap-2 items-center text-center">
        <Skeleton className="h-10 w-80 rounded-xl" />
        <Skeleton className="h-5 w-96 mt-2" />
      </div>

      {/* Main Grid Content Columns */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 pb-16 flex-1">
        
        {/* Left Column: Upload box, motifs, colors */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Upload frame */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-56 w-full rounded-[1.5rem]" />
          </div>

          {/* Pilihan Motif */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>

          {/* Pilihan Warna */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-32" />
            <div className="grid grid-cols-4 gap-2">
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Right Column: AI Try-On Preview Canvas */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-[28rem] w-full rounded-[1.5rem] shadow-sm" />
          
          {/* Action buttons */}
          <div className="flex gap-4 mt-2">
            <Skeleton className="h-12 flex-1 rounded-xl" />
            <Skeleton className="h-12 flex-1 rounded-xl" />
          </div>
        </div>
        
      </div>
    </div>
  );
}
