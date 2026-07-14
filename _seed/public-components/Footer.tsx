import Link from 'next/link'

const COLS = [
  {
    heading: 'Platform',
    links: [
      { label: 'Home',     href: '/'         },
      { label: 'About',    href: '/about'    },
      { label: 'Services', href: '/services' },
      { label: 'Contact',  href: '/contact'  },
    ],
  },
  {
    heading: 'Providers',
    links: [
      { label: 'Apply Now',       href: '/apply'            },
      { label: 'Provider Portal', href: '/login'            },
      { label: 'Documentation',   href: '/contact'          },
      { label: 'Support',         href: '/contact'          },
    ],
  },
  {
    heading: 'Compliance',
    links: [
      { label: 'Privacy Policy',    href: '/privacy'  },
      { label: 'Terms of Service',  href: '/terms'    },
      { label: 'HIPAA Notice',      href: '/hipaa'    },
      { label: 'Accessibility',     href: '/accessibility' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-surface-alt border-t border-default">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="size-8 bg-accent-subtle border border-accent rounded-lg flex items-center justify-center">
                <span className="text-accent font-display font-bold text-sm">N</span>
              </div>
              <span className="font-display text-default font-semibold tracking-tight">Nexo Access</span>
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-[200px]">
              NEMT operations platform for Medicaid transportation providers in the DMV region.
            </p>
          </div>

          {/* Link columns */}
          {COLS.map(col => (
            <div key={col.heading}>
              <h4 className="text-xs font-semibold text-subtle uppercase tracking-widest mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-default transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-default flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-subtle">
            &copy; {new Date().getFullYear()} Nexo Access. All rights reserved.
          </p>
          <p className="text-xs text-subtle">
            HIPAA compliant &middot; Maryland &amp; DC licensed
          </p>
        </div>
      </div>
    </footer>
  )
}
