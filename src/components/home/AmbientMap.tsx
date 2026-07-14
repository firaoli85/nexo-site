import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

// THE LIVING MAP v5 — REGIONAL COMPOSITIONS + AUTHORED CLEARANCE (Stage 6.6). Two layers:
//   (1) `.ambient-map` GRID — a faint orthogonal street grid, full-bleed. The ONLY decoration
//       permitted under a text block, and only at whisper level.
//   (2) `.ambient-gutter` FEATURES — the region's distinct geography + landmark glyphs, physically
//       PINNED to the left/right page gutters and shown ONLY at `xl` (≥1280), where the centered
//       max-w-6xl container leaves a ~96px gutter on each side that no text column reaches. Because
//       the features are anchored to the gutters (not masked out of the middle), NO landmark,
//       arterial, or trip stroke can ever pass behind a text block (Task A: clearance is AUTHORED by
//       composition, not just faded). Below xl the gutter collapses, so features hide and only the
//       whisper grid remains — clearance-first on small screens.
// Three DISTINCT region compositions in the map grammar — DC (Monument obelisk + Capitol dome +
// L'Enfant diagonals), MD (Chesapeake Bay Bridge + shoreline + suburban arterials), VA (Pentagon +
// radial arterials) — plus the WIDE DMV composite (Potomac + Beltway arcs; hero + footer). Landmark
// density is capped at ~1 primary glyph per gutter; adjacent sections never share a glyph. NO text
// labels, NO real names (copy gate). Pure inline SVG, aria-hidden, absolute, edge-faded, FLAT, SSR.

const GRID_X = [40, 96, 156, 216, 280, 344];
const GRID_Y = [46, 108, 170, 232];

function Grid({ color, opacity }: { color: string; opacity: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      className={cn("ambient-map pointer-events-none absolute inset-0 h-full w-full", color, opacity)}
    >
      <g stroke="currentColor" strokeWidth="0.75" opacity="0.42">
        {GRID_X.map((x) => (
          <line key={`vx${x}`} x1={x} y1="-20" x2={x} y2="320" />
        ))}
        {GRID_Y.map((y) => (
          <line key={`hy${y}`} x1="-20" y1={y} x2="420" y2={y} />
        ))}
      </g>
    </svg>
  );
}

// One gutter column. viewBox is a tall narrow slice (64 wide × 220 tall); `meet` keeps the whole
// glyph visible and vertically centred whatever the section height, so landmarks are never cropped.
function Gutter({ side, color, children }: { side: "left" | "right"; color: string; children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 220"
      preserveAspectRatio={side === "left" ? "xMinYMid meet" : "xMaxYMid meet"}
      fill="none"
      className={cn(
        "ambient-gutter pointer-events-none absolute top-0 h-full w-[88px]",
        side === "left" ? "left-0" : "right-0",
        color
      )}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  );
}

// Region FEATURE layers, split by gutter. `right` carries the region's PRIMARY landmark (always clear
// of the left route-spine); `left` carries a quieter arterial/secondary read.
const REGION_FEATURES: Record<string, { left: ReactNode; right: ReactNode }> = {
  dc: {
    // L'Enfant diagonals fanning off a circle + a cherry-blossom sprig (lower)
    left: (
      <>
        <g strokeWidth="1.1" opacity="0.42">
          <circle cx="30" cy="110" r="4.5" strokeWidth="1.2" />
          <path d="M30 110 L30 40 M30 110 L30 180 M30 110 L58 72 M30 110 L6 150 M30 110 L58 150" />
        </g>
        <g className="map-landmark" strokeWidth="1.0">
          <path d="M8 214 Q20 201 34 190" />
          <g strokeWidth="0.8" opacity="0.85">
            <circle cx="34" cy="189" r="2.8" />
            <circle cx="22" cy="199" r="2.4" />
            <circle cx="13" cy="208" r="2.2" />
            <path d="M34 185 L34 182 M38 189 L41 189 M30 192 L27 194" strokeWidth="0.6" opacity="0.7" />
          </g>
        </g>
      </>
    ),
    // Capitol dome on its base + an arched Potomac bridge span (lower)
    right: (
      <>
        <g className="map-landmark" strokeWidth="1.3">
          <path d="M14 132 L52 132" />
          <path d="M19 132 Q19 96 33 96 Q47 96 47 132" strokeWidth="1.15" />
          <line x1="33" y1="96" x2="33" y2="86" strokeWidth="1.15" />
          <path d="M22 132 L22 118 M33 132 L33 116 M44 132 L44 118" strokeWidth="0.85" opacity="0.7" />
        </g>
        <g className="map-landmark" strokeWidth="1.1">
          <path d="M8 206 Q33 176 58 206" />
          <line x1="8" y1="206" x2="58" y2="206" strokeWidth="0.85" opacity="0.6" />
          <line x1="21" y1="196" x2="21" y2="206" strokeWidth="0.7" opacity="0.7" />
          <line x1="45" y1="196" x2="45" y2="206" strokeWidth="0.7" opacity="0.7" />
        </g>
      </>
    ),
  },
  md: {
    // suburban arterials fanning inland (upper) + a run of Baltimore rowhouse gables (lower)
    left: (
      <>
        <g strokeWidth="1.05" opacity="0.42">
          <path d="M6 40 C 32 60, 32 88, 10 112" />
          <path d="M8 84 C 30 82, 44 70, 58 52" />
        </g>
        <g className="map-landmark" strokeWidth="1.1">
          <path d="M6 186 L6 164 L17 156 L28 164 L28 186" />
          <path d="M28 186 L28 167 L39 159 L50 167 L50 186" />
          <line x1="4" y1="186" x2="52" y2="186" strokeWidth="0.8" opacity="0.7" />
          <rect x="12" y="172" width="5" height="8" strokeWidth="0.7" opacity="0.7" />
          <rect x="35" y="174" width="5" height="8" strokeWidth="0.7" opacity="0.7" />
        </g>
      </>
    ),
    // Chesapeake Bay Bridge (vertical suspension span) + a screwpile lighthouse on the shoal below,
    // with a shoreline curve behind
    right: (
      <>
        <path d="M60 30 C 40 74, 36 132, 56 186" strokeWidth="1.15" opacity="0.4" />
        <g className="map-landmark" strokeWidth="1.2">
          <line x1="24" y1="44" x2="24" y2="150" />
          <line x1="36" y1="44" x2="36" y2="150" />
          <line x1="20" y1="72" x2="40" y2="72" strokeWidth="0.9" />
          <line x1="20" y1="124" x2="40" y2="124" strokeWidth="0.9" />
          <path d="M24 44 Q30 33 36 44" />
          <path d="M24 72 Q30 57 36 72" strokeWidth="0.85" opacity="0.75" />
          <path d="M24 124 Q30 109 36 124" strokeWidth="0.85" opacity="0.75" />
        </g>
        <g className="map-landmark" strokeWidth="1.1">
          <path d="M25 202 L27 184 L39 184 L41 202 Z" />
          <rect x="29" y="176" width="8" height="8" strokeWidth="0.9" />
          <line x1="33" y1="176" x2="33" y2="170" strokeWidth="0.9" />
          <line x1="23" y1="202" x2="43" y2="202" strokeWidth="0.8" opacity="0.7" />
        </g>
        {/* tobacco-barn gable with vertical air-slats (top) */}
        <g className="map-landmark" strokeWidth="1.0">
          <path d="M18 44 L18 22 L32 12 L46 22 L46 44" />
          <g strokeWidth="0.6" opacity="0.65">
            <line x1="25" y1="44" x2="25" y2="26" />
            <line x1="32" y1="44" x2="32" y2="22" />
            <line x1="39" y1="44" x2="39" y2="26" />
          </g>
        </g>
      </>
    ),
  },
  va: {
    // a colonial cupola (drum + dome + weathervane, upper) above radial interchange arterials (lower)
    left: (
      <>
        <g className="map-landmark" strokeWidth="1.1">
          <rect x="23" y="52" width="15" height="14" />
          <path d="M22 52 Q30.5 38 39 52" />
          <line x1="30.5" y1="42" x2="30.5" y2="30" strokeWidth="0.9" />
          <path d="M30.5 32 L36 34 L30.5 36" strokeWidth="0.8" opacity="0.8" />
          <line x1="30.5" y1="66" x2="30.5" y2="106" strokeWidth="0.8" opacity="0.5" />
        </g>
        <g strokeWidth="1.05" opacity="0.42">
          <circle cx="30" cy="120" r="3.5" strokeWidth="1.1" />
          <path d="M30 120 L6 94 M30 120 L58 102 M30 120 L14 178 M30 120 L52 184" />
        </g>
        {/* dogwood sprig (bottom) — a branch to a 4-petal bloom */}
        <g className="map-landmark" strokeWidth="0.9">
          <path d="M6 213 Q19 204 29 193" />
          <g strokeWidth="0.75" opacity="0.85">
            <circle cx="30" cy="189" r="2.3" />
            <circle cx="30" cy="197" r="2.3" />
            <circle cx="26" cy="193" r="2.3" />
            <circle cx="34" cy="193" r="2.3" />
          </g>
          <circle cx="18" cy="204" r="1.8" strokeWidth="0.7" opacity="0.7" />
        </g>
      </>
    ),
    // the Pentagon outline + a Blue Ridge / Appalachian ridgeline along the base
    right: (
      <>
        <g className="map-landmark" strokeWidth="1.3">
          <path d="M33 74 L55 90 L47 118 L19 118 L11 90 Z" />
          <path d="M33 74 L33 118 M11 90 L47 118 M55 90 L19 118" strokeWidth="0.7" opacity="0.55" />
        </g>
        <g className="map-landmark" strokeWidth="1.1">
          <path d="M4 202 L15 186 L24 195 L34 180 L44 193 L53 184 L60 197" />
          <path d="M12 199 L20 190 M38 190 L46 197" strokeWidth="0.7" opacity="0.6" />
        </g>
        {/* Natural Bridge — a rock arch with an inner opening (top) */}
        <g className="map-landmark" strokeWidth="1.15">
          <path d="M12 58 L12 40 Q12 22 30 20 Q48 22 52 40 L52 58" />
          <path d="M20 58 L20 44 Q22 32 30 31 Q40 32 44 44 L44 58" strokeWidth="0.8" opacity="0.55" />
        </g>
      </>
    ),
  },
  wide: {
    // the DMV overview — Potomac river curve (left) + Beltway ring arcs (right); geometric, no shared
    // landmark glyph, so the hero (wide's only visible instance; the footer is grid-only) never
    // repeats its DC-credential neighbour's glyph.
    left: (
      <g strokeWidth="1.15" opacity="0.44">
        <path d="M20 26 C 44 74, 30 118, 24 150 S 44 200, 60 214" />
        <path d="M8 96 C 28 100, 40 92, 52 78" strokeWidth="0.95" opacity="0.8" />
      </g>
    ),
    right: (
      <g strokeWidth="1.15" opacity="0.44">
        <path d="M58 40 C 20 72, 20 148, 58 180" />
        <path d="M50 70 C 28 92, 28 128, 50 150" strokeWidth="0.95" opacity="0.8" />
        <path d="M56 108 L44 108" strokeWidth="0.85" opacity="0.7" />
      </g>
    ),
  },
};

export function AmbientMap({
  tone,
  region = "wide",
  gutter = true,
  className,
}: {
  tone: "light" | "ink";
  region?: "wide" | "dc" | "md" | "va";
  // The gutter FEATURE layer assumes a FULL-BLEED host (its gutters pin to the viewport edge, where
  // the ~96px clearance lives). Set `gutter={false}` when the map is nested in an INSET card (the
  // terminus footer) — the card's own inset shifts the gutter inward and it would graze the footer's
  // text column. Grid-whisper only then; clearance stays guaranteed.
  gutter?: boolean;
  className?: string;
}) {
  const color = tone === "ink" ? "text-on-ink" : "text-accent";
  const gridOpacity = tone === "ink" ? "opacity-[0.12]" : "opacity-[0.15]";
  const gutterOpacity = tone === "ink" ? "opacity-[0.16]" : "opacity-[0.2]";
  const feat = REGION_FEATURES[region];

  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden="true">
      <Grid color={color} opacity={gridOpacity} />
      {gutter ? (
        <div data-ambient-map className={cn("absolute inset-0 hidden xl:block", gutterOpacity)}>
          <Gutter side="left" color={color}>
            {feat.left}
          </Gutter>
          <Gutter side="right" color={color}>
            {feat.right}
          </Gutter>
        </div>
      ) : null}
    </div>
  );
}
