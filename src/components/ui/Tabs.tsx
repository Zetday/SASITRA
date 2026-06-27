import * as React from "react";

export interface TabOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabsProps {
  options: TabOption[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'default' | 'pills';
}

export const Tabs: React.FC<TabsProps> = ({
  options,
  activeTab,
  onChange,
  className = "",
  variant = 'default'
}) => {
  if (variant === 'pills') {
    return (
      <div className={`flex flex-wrap gap-2 p-1.5 bg-secondary/10 rounded-full ${className}`}>
        {options.map((opt) => {
          const isActive = opt.id === activeTab;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`flex items-center justify-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-300 ${
                isActive
                  ? "bg-primary text-text-light shadow-md"
                  : "text-text-dark/60 hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {opt.icon}
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex border-b border-secondary/15 ${className}`}>
      {options.map((opt) => {
        const isActive = opt.id === activeTab;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`flex items-center gap-2 px-6 py-3.5 border-b-2 font-semibold text-sm transition-all duration-300 -mb-0.5 ${
              isActive
                ? "border-primary text-primary font-bold"
                : "border-transparent text-text-dark/50 hover:text-primary hover:border-primary/30"
            }`}
          >
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
