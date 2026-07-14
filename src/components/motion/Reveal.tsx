'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

// Refined ease — fast, premium, no overshoot (easeOutExpo-ish).
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

type RevealProps = {
  children: ReactNode
  /** stagger offset in seconds */
  delay?: number
  /** initial vertical offset in px */
  y?: number
  className?: string
  /** reveal on scroll-into-view (default) vs immediately on mount */
  inView?: boolean
}

/**
 * Reusable, tasteful reveal: a subtle fade + rise. Use increasing `delay`
 * across siblings to orchestrate a staggered sequence. Honors prefers-reduced-motion:
 * when the user requests reduced motion, content renders statically (no animation).
 */
export default function Reveal({ children, delay = 0, y = 14, className, inView = true }: RevealProps) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>

  const hidden = { opacity: 0, y }
  const shown = { opacity: 1, y: 0 }
  const transition = { duration: 0.55, ease: EASE, delay }

  if (inView) {
    return (
      <motion.div
        className={className}
        initial={hidden}
        whileInView={shown}
        viewport={{ once: true, margin: '-80px' }}
        transition={transition}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div className={className} initial={hidden} animate={shown} transition={transition}>
      {children}
    </motion.div>
  )
}
