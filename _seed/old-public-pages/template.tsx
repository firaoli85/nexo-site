'use client'

import PageTransition from '@/components/motion/PageTransition'

/**
 * Public-section route transitions. A `template.tsx` re-mounts on every navigation
 * (unlike `layout.tsx`, which persists), so wrapping children in PageTransition
 * replays the fade + subtle rise on each route change — while the persistent
 * Navbar/Footer in (public)/layout.tsx stay put. Result: client-side, in-place
 * transitions with no full-page reload or flash.
 */
export default function PublicTemplate({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>
}
