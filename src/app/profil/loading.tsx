import React from "react";
import { Navbar } from "../../components/shared/Navbar";
import { Skeleton } from "../../components/ui/Skeleton";

export default function ProfilLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-cream text-text-dark overflow-hidden">
      <Navbar />
      
      {/* Title Section */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 w-full pt-28 pb-4">
        <Skeleton className="h-10 w-48 rounded-xl" />
      </div>

      {/* Main Grid Content Layout */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16 flex-1">
        
        {/* Left Column: User Info Profile Card */}
        <div className="lg:col-span-4">
          <div className="bg-[#FFFDF9]/60 border border-secondary/15 p-6 rounded-2xl shadow-xs flex flex-col items-center text-center gap-4">
            {/* Avatar Circle */}
            <Skeleton variant="circle" className="w-24 h-24" />
            
            {/* Username & Email */}
            <div className="flex flex-col gap-2 w-full items-center">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            <div className="w-full h-px bg-secondary-light/30 my-2" />

            {/* Info details placeholder */}
            <div className="flex flex-col gap-3 w-full">
              <div className="flex justify-between items-center w-full">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex justify-between items-center w-full">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>

            <Skeleton className="h-10 w-full rounded-xl mt-4" />
          </div>
        </div>

        {/* Right Column: AI Try-On History Grid */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex justify-between items-center w-full">
            <Skeleton className="h-6 w-52 rounded-md" />
            <Skeleton className="h-4 w-24 rounded-md" />
          </div>

          {/* Grid of history cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-[#FFFDF9]/40 border border-secondary/10 p-3 rounded-2xl shadow-xs flex flex-col gap-3">
                {/* Result image box */}
                <Skeleton className="aspect-square w-full rounded-xl" />
                {/* Info row */}
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
