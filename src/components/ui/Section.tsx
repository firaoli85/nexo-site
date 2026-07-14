import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

// Vertical-rhythm wrapper. Owns ALL vertical spacing for a band so children never
// fight it with their own top/bottom margins — one consistent py scale site-wide.

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-20 lg:py-24", className)}>
      {children}
    </section>
  );
}
