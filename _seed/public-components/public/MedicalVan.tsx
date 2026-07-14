interface MedicalVanProps {
  variant?: 'light' | 'dark'
  className?: string
}

export default function MedicalVan({ variant = 'dark', className = '' }: MedicalVanProps) {
  const body   = variant === 'dark' ? '#0d2e1f' : '#e8f5ee'
  const accent = variant === 'dark' ? '#0a5c3a' : '#0d9488'
  const glass  = variant === 'dark' ? '#1a4a30' : '#b2dfdb'
  const stripe = variant === 'dark' ? '#063827' : '#4db6ac'
  const wheel  = variant === 'dark' ? '#111'    : '#37474f'
  const rim    = variant === 'dark' ? '#1a4a30' : '#90a4ae'
  const cross  = variant === 'dark' ? '#22c55e' : '#00695c'

  return (
    <svg
      viewBox="0 0 520 265"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Body */}
      <rect x="30" y="80" width="400" height="130" rx="18" fill={body} />

      {/* Cab section */}
      <path d="M330 80 L390 80 Q430 80 430 110 L430 210 L30 210 L30 80 Z" fill={body} />

      {/* Roof line / cab top */}
      <path d="M100 80 L320 80 L340 40 L150 40 Z" fill={accent} />

      {/* Green stripe along side */}
      <rect x="30" y="160" width="400" height="8" rx="2" fill={stripe} />

      {/* Windshield */}
      <path d="M345 44 L315 78 L425 78 L425 55 Q425 44 415 44 Z" fill={glass} />

      {/* Side windows row */}
      <rect x="100" y="92" width="55" height="42" rx="6" fill={glass} />
      <rect x="168" y="92" width="55" height="42" rx="6" fill={glass} />
      <rect x="236" y="92" width="55" height="42" rx="6" fill={glass} />
      <rect x="304" y="92" width="40" height="42" rx="6" fill={glass} />

      {/* Medical cross on side */}
      <g transform="translate(58, 96)">
        <rect x="-4" y="-14" width="8" height="36" rx="2" fill={cross} />
        <rect x="-14" y="-4" width="36" height="8" rx="2" fill={cross} />
      </g>

      {/* Front bumper */}
      <rect x="415" y="185" width="28" height="14" rx="4" fill={accent} />

      {/* Rear bumper */}
      <rect x="20" y="185" width="28" height="14" rx="4" fill={accent} />

      {/* Headlight */}
      <rect x="418" y="148" width="16" height="22" rx="4" fill="#fef9c3" opacity="0.9" />

      {/* Tail light */}
      <rect x="26" y="148" width="12" height="22" rx="3" fill="#fca5a5" opacity="0.7" />

      {/* Door handle front */}
      <rect x="310" y="148" width="22" height="5" rx="2.5" fill={accent} />

      {/* Door handle mid */}
      <rect x="220" y="148" width="22" height="5" rx="2.5" fill={accent} />

      {/* Roof light bar */}
      <rect x="160" y="34" width="110" height="10" rx="4" fill={cross} opacity="0.6" />

      {/* ── Rear wheel ──────────────────────────────────────────────────── */}

      {/* Rear wheel arch — drawn before wheel so wheel sits on top */}
      <path d="M80 210 Q118 175 156 210" stroke={accent} strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Tire */}
      <circle cx="118" cy="218" r="36" fill={wheel} />
      {/* Rim ring */}
      <circle cx="118" cy="218" r="25" fill={rim} />
      {/* Hub cap */}
      <circle cx="118" cy="218" r="9" fill={wheel} />
      {/* Spokes */}
      <g transform="translate(118, 218)" stroke={wheel} strokeWidth="1.5" strokeLinecap="round">
        <line x1="9"    y1="0"    x2="25"   y2="0"    />
        <line x1="4.5"  y1="7.8"  x2="12.5" y2="21.7" />
        <line x1="-4.5" y1="7.8"  x2="-12.5" y2="21.7" />
        <line x1="-9"   y1="0"    x2="-25"  y2="0"    />
        <line x1="-4.5" y1="-7.8" x2="-12.5" y2="-21.7" />
        <line x1="4.5"  y1="-7.8" x2="12.5" y2="-21.7" />
      </g>
      {/* Ground shadow under rear wheel */}
      <ellipse cx="118" cy="254" rx="42" ry="7" fill="black" opacity="0.12" />

      {/* ── Front wheel ─────────────────────────────────────────────────── */}

      {/* Front wheel arch */}
      <path d="M332 210 Q370 175 408 210" stroke={accent} strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Tire */}
      <circle cx="370" cy="218" r="36" fill={wheel} />
      {/* Rim ring */}
      <circle cx="370" cy="218" r="25" fill={rim} />
      {/* Hub cap */}
      <circle cx="370" cy="218" r="9" fill={wheel} />
      {/* Spokes */}
      <g transform="translate(370, 218)" stroke={wheel} strokeWidth="1.5" strokeLinecap="round">
        <line x1="9"    y1="0"    x2="25"   y2="0"    />
        <line x1="4.5"  y1="7.8"  x2="12.5" y2="21.7" />
        <line x1="-4.5" y1="7.8"  x2="-12.5" y2="21.7" />
        <line x1="-9"   y1="0"    x2="-25"  y2="0"    />
        <line x1="-4.5" y1="-7.8" x2="-12.5" y2="-21.7" />
        <line x1="4.5"  y1="-7.8" x2="12.5" y2="-21.7" />
      </g>
      {/* Ground shadow under front wheel */}
      <ellipse cx="370" cy="254" rx="42" ry="7" fill="black" opacity="0.12" />

      {/* Wide ground shadow spanning full vehicle */}
      <ellipse cx="245" cy="256" rx="220" ry="9" fill="black" opacity="0.10" />
    </svg>
  )
}
