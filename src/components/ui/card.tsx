import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded border border-gray-200 bg-white shadow-sm p-4",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card"; 