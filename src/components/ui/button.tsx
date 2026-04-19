import { type ButtonHTMLAttributes, forwardRef } from "react";
import { LucideIcon } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      icon: Icon,
      iconPosition = "left",
      isLoading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-[0.01em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      primary: "border border-primary-700 bg-primary-600 text-white shadow-primary hover:bg-primary-700 hover:border-primary-800",
      secondary: "border border-neutral-800 bg-neutral-800 text-white shadow-md hover:bg-neutral-900",
      outline: "border border-primary-100 bg-white/90 text-neutral-700 hover:border-primary-400 hover:bg-primary-50/60",
      ghost: "text-neutral-700 hover:bg-primary-50/70",
      danger: "border border-danger-700 bg-danger-700 text-white shadow-lg hover:bg-danger-800",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
    };


    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {!isLoading && Icon && iconPosition === "left" && <Icon size={size === "sm" ? 14 : 18} />}
        {children}
        {!isLoading && Icon && iconPosition === "right" && <Icon size={size === "sm" ? 14 : 18} />}
      </button>
    );
  }
);

Button.displayName = "Button";
