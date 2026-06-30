import React from "react";
import { Navbar } from "../../components/shared/Navbar";
import { Skeleton } from "../../components/ui/Skeleton";

export default function HomeLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-cream text-text-dark overflow-hidden">
      <Navbar />
      
      {/* Welcome Screen Skeleton */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 lg:pl-12 xl:pl-16 w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-24 pb-16">
          
          {/* Left side text elements */}
          <div className="lg:col-span-7 flex flex-col gap-5 justify-center text-center lg:text-left">
            {/* Small subtitle placeholder */}
            <Skeleton className="h-6 w-44 mx-auto lg:mx-0" />
            
            {/* Title heading placeholder */}
            <div className="flex flex-col gap-2.5">
              <Skeleton className="h-12 w-80 sm:w-96 mx-auto lg:mx-0" />
              <Skeleton className="h-12 w-64 sm:w-80 mx-auto lg:mx-0" />
            </div>
            
            {/* Paragraph placeholder */}
            <div className="flex flex-col gap-2 mt-2">
              <Skeleton className="h-4 w-full md:w-5/6 mx-auto lg:mx-0" />
              <Skeleton className="h-4 w-11/12 md:w-4/5 mx-auto lg:mx-0" />
              <Skeleton className="h-4 w-4/5 md:w-3/4 mx-auto lg:mx-0" />
            </div>
            
            {/* Action Button placeholder */}
            <Skeleton className="h-12 w-48 rounded-xl mt-4 mx-auto lg:mx-0" />
          </div>

          {/* Right side mascot Sira outline (Only visible on desktop lg+) */}
          <div className="lg:col-span-5 hidden lg:flex items-end justify-end gap-3 h-[32rem] relative">
            {/* Speech Bubble placeholder */}
            <Skeleton className="w-52 h-24 rounded-[2rem] mb-48 -mr-6 z-10" />
            {/* Mascot placeholder */}
            <Skeleton className="w-72 h-[32rem] rounded-[2.5rem]" />
          </div>
          
        </div>
      </div>
    </div>
  );
}
