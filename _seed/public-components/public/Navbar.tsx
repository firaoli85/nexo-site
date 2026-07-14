'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/utils/cn'

const NAV_LINKS = [
  { href: '/',         label: 'Home'     },
  { href: '/about',    label: 'About'    },
  { href: '/services', label: 'Services' },
  { href: '/contact',  label: 'Contact'  },
]

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0" onClick={onClick}>
      <div className="size-8 bg-accent-subtle border border-accent rounded-lg flex items-center justify-center">
        <span className="text-accent font-display font-bold text-sm">N</span>
      </div>
      <span className="font-display text-default font-semibold tracking-tight text-lg">Nexo Access</span>
    </Link>
  )
}

// Desktop nav item — larger, with an animated underline that grows from center on
// hover (and stays full for the active page) + a color shift. Tokens only.
function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative px-3 py-2 text-[15px] font-medium transition-colors duration-150',
        active ? 'text-default' : 'text-muted hover:text-default',
      )}
    >
      {label}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute left-3 right-3 -bottom-px h-0.5 rounded-full bg-accent origin-center transition-transform duration-200 ease-out',
          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
        )}
      />
    </Link>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 bg-surface-glass backdrop-blur-md border-b border-default">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Brand onClick={() => setOpen(false)} />

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map(link => (
            <NavLink key={link.href} href={link.href} label={link.label} active={pathname === link.href} />
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/apply"
            className="bg-accent hover:bg-accent-hover text-accent-text text-[15px] font-medium rounded-xl px-5 py-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Apply as Provider
          </Link>
          <Link
            href="/login"
            className="text-[15px] text-muted hover:text-default transition-colors px-3 py-2"
          >
            Sign In
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-muted hover:text-default transition-colors p-1"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-default bg-surface px-6 py-4 space-y-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                'block px-4 py-3 rounded-xl text-base font-medium transition-colors',
                pathname === link.href
                  ? 'text-default bg-surface-hover'
                  : 'text-muted hover:text-default hover:bg-surface-hover',
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2 border-t border-default mt-3">
            <Link
              href="/apply"
              onClick={() => setOpen(false)}
              className="bg-accent hover:bg-accent-hover text-accent-text text-base font-medium rounded-xl px-5 py-3 text-center transition-colors"
            >
              Apply as Provider
            </Link>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="text-base text-muted hover:text-default transition-colors px-4 py-3 text-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
