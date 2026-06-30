import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Props = {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variants = {
  primary: "bg-gold text-green font-bold hover:bg-gold-light active:bg-gold-dark shadow-sm",
  outline: "border-2 border-gold text-gold font-bold hover:bg-gold hover:text-green",
  ghost: "text-green font-medium hover:underline",
};

const sizes = {
  sm: "px-4 py-2 text-sm rounded-md",
  md: "px-6 py-3 text-base rounded-lg",
  lg: "px-8 py-4 text-lg rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "primary", size = "md", className, ...rest }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}
    />
  )
);

Button.displayName = "Button";
