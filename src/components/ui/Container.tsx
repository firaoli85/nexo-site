import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

// Horizontal rhythm wrapper — one consistent max-width + gutter for the whole
// site. Every full-width band uses this so content edges always line up.

export function Container({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
