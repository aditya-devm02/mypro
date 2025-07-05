import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "destructive";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          variant === "outline" && "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100",
          variant === "destructive" && "bg-red-600 text-white hover:bg-red-700",
          variant === "default" && "bg-indigo-600 text-white hover:bg-indigo-700",
          size === "sm" && "text-sm px-2 py-1",
          size === "lg" && "text-lg px-6 py-3",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button"; 