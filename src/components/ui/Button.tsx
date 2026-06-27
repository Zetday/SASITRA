import * as React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass-light' | 'glass-dark' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    
    // Style mappings
    const baseStyle = "inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95";
    
    const variants = {
      primary: "bg-primary text-text-light hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20 focus-visible:ring-primary",
      secondary: "bg-secondary text-text-dark hover:bg-secondary-light hover:shadow-lg hover:shadow-secondary/20 focus-visible:ring-secondary",
      outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-text-light focus-visible:ring-primary",
      ghost: "text-text-dark hover:bg-primary/10 focus-visible:ring-primary",
      "glass-light": "glass-panel-light text-text-dark hover:bg-accent-cream/50 hover:shadow-md border border-secondary/20 focus-visible:ring-secondary",
      "glass-dark": "glass-panel-dark text-text-light hover:bg-bg-dark/40 hover:shadow-md border border-secondary/10 focus-visible:ring-secondary",
      danger: "bg-red-600 text-white hover:bg-red-500 hover:shadow-lg hover:shadow-red-600/20 focus-visible:ring-red-600",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-11 px-6 text-sm",
      lg: "h-13 px-8 text-base",
      icon: "h-11 w-11 rounded-full",
    };

    return (
      <button
        className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {size !== 'icon' && "Memproses..."}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
