import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type = "text", label, error, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label ? (
          <label htmlFor={inputId} className="text-xs font-semibold text-text-dark/80 tracking-wide uppercase cursor-pointer">
            {label}
          </label>
        ) : null}
        <input
          id={inputId}
          type={type}
          className={`w-full rounded-xl border-2 border-secondary/20 bg-white/50 px-4 py-3 text-sm text-text-dark transition-all duration-300 placeholder:text-text-dark/40 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""
          } ${className}`}
          ref={ref}
          {...props}
        />
        {error ? <span className="text-xs font-medium text-red-500">{error}</span> : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", label, error, id, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label ? (
          <label htmlFor={textareaId} className="text-xs font-semibold text-text-dark/80 tracking-wide uppercase cursor-pointer">
            {label}
          </label>
        ) : null}
        <textarea
          id={textareaId}
          className={`w-full min-h-25 rounded-xl border-2 border-secondary/20 bg-white/50 px-4 py-3 text-sm text-text-dark transition-all duration-300 placeholder:text-text-dark/40 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""
          } ${className}`}
          ref={ref}
          {...props}
        />
        {error ? <span className="text-xs font-medium text-red-500">{error}</span> : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

