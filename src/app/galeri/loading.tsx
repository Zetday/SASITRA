import React from "react";
import { Navbar } from "../../components/shared/Navbar";
import { Skeleton } from "../../components/ui/Skeleton";

export default function GaleriLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-cream text-text-dark overflow-hidden">
      <Navbar />
      
      {/* Title Section */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 w-full pt-28 flex flex-col gap-2 items-center text-center">
        <Skeleton className="h-10 w-72 rounded-xl" />
        <Skeleton className="h-5 w-96 mt-2" />
      </div>

      {/* Grid Folder Card Motif Skeletons */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 w-full pt-10 pb-16 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-3 bg-[#FFFDF9]/40 border border-secondary/10 p-3 rounded-2xl shadow-xs">
              {/* Folder image placeholder */}
              <Skeleton className="aspect-4/3 w-full rounded-xl" />
              {/* Folder title placeholder */}
              <Skeleton className="h-5 w-2/3 mt-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
