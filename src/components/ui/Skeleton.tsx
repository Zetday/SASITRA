import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "rect" | "circle" | "text";
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = "", 
  variant = "rect" 
}) => {
  const baseClasses = "animate-pulse bg-accent-brown/15 dark:bg-accent-brown/20";
  
  let variantClasses = "";
  if (variant === "circle") {
    variantClasses = "rounded-full";
  } else if (variant === "text") {
    variantClasses = "h-4 rounded-sm w-5/6";
  } else {
    variantClasses = "rounded-xl";
  }

  return (
    <div 
      className={`${baseClasses} ${variantClasses} ${className}`} 
      aria-hidden="true"
    />
  );
};
