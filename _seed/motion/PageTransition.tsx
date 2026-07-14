'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * Reusable page/section transition wrapper — a tasteful fade + subtle rise on
 * mount. Wrap a page's content to give it an elegant entrance. Honors
 * prefers-reduced-motion (renders statically when the user requests it).
 *
 * Used by (public)/template.tsx so every public route change replays the
 * transition in place (no full-page reload). A `template.tsx` re-mounts on each
 * navigation, which is what makes this fire per route change.
 */
export default function PageTransition({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
