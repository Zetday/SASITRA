import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'maroon' | 'gold' | 'glass-light' | 'glass-dark' | 'outline';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className = "",
  variant = "default",
  hoverable = false,
  children,
  ...props
}) => {
  const baseStyle = "rounded-2xl p-6 transition-all duration-300";
  
  const variants = {
    default: "bg-white shadow-md shadow-secondary/5 border border-secondary/10 text-text-dark",
    maroon: "bg-primary text-text-light shadow-lg shadow-primary/10",
    gold: "bg-secondary text-text-dark shadow-lg shadow-secondary/10",
    "glass-light": "glass-panel-light text-text-dark",
    "glass-dark": "glass-panel-dark text-text-light",
    outline: "border-2 border-dashed border-secondary/30 bg-transparent text-text-dark",
  };

  const hoverStyle = hoverable
    ? "hover:-translate-y-1.5 hover:shadow-xl hover:shadow-secondary/10 cursor-pointer"
    : "";

  return (
    <div
      className={`${baseStyle} ${variants[variant]} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
