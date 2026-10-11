// Brand.jsx
import { useId } from 'react'
import { Link } from 'react-router-dom'

/*
 * XCrafter monogram — "the crossing".
 * Two strokes cross to form the X. The orange stroke passes OVER the
 * teal one, and a clean gap is cut around it (like a woven or stitched
 * join) — that interlock is the "craft" in Xc. Pure geometry: no font,
 * no icon set, nothing generic.
 *
 * Built on a 48 grid. Both strokes are 45° and butt-capped so the ends
 * are razor-sharp; teal is deliberately shorter than orange to give the
 * mark direction and weight. The tile has a 1px hairline so it holds up
 * on black as well as on light surfaces.
 */
const TILE = '#0a0a0b'
const ORANGE = '#ea580c'
const TEAL = '#14b8a6'

const SIZES = { sm: 'h-7 w-7', md: 'h-9 w-9', lg: 'h-12 w-12' }

export const LogoMark = ({ size = 'md', className = '' }) => {
  // useId() contains ":" which breaks url(#…) references — strip it
  const maskId = useId().replace(/:/g, '')

  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={`shrink-0 ${SIZES[size] ?? SIZES.md} ${className}`}
    >
      <defs>
        {/* cuts a gap in the teal stroke wherever the orange stroke crosses it */}
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
          <rect width="48" height="48" fill="white" />
          <path d="M13 13 35 35" stroke="black" strokeWidth="10.5" fill="none" />
        </mask>
      </defs>

      <rect width="48" height="48" rx="13" fill={TILE} />
      <rect x=".5" y=".5" width="47" height="47" rx="12.5" fill="none" stroke="#fff" strokeOpacity=".1" />

      {/* teal — passes under */}
      <path d="M34 14 14 34" stroke={TEAL} strokeWidth="5.5" fill="none" mask={`url(#${maskId})`} />
      {/* orange — passes over */}
      <path d="M13 13 35 35" stroke={ORANGE} strokeWidth="5.5" fill="none" />
    </svg>
  )
}

export const Logo = ({
  size = 'md',
  to = '/dashboard',
  showText = true,
  textClassName = 'text-[17px]',
  onClick,
  ariaLabel = 'XCrafter',
}) => (
  <Link
    to={to}
    onClick={onClick}
    aria-label={ariaLabel}
    className="group flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c]/60"
  >
    <LogoMark size={size} className="transition-transform duration-200 group-hover:scale-105" />
    {showText && (
      <span className={`tracking-[-0.035em] text-white ${textClassName}`}>
        <span className="font-bold">X</span>
        <span className="font-medium text-white/90">Crafter</span>
      </span>
    )}
  </Link>
)