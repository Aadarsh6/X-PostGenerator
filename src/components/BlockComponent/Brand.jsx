import { Link } from 'react-router-dom'

const SIZES = {
  sm: { box: 'h-7 w-7 rounded-lg', glyph: 'text-[15px]' },
  md: { box: 'h-8 w-8 rounded-[10px]', glyph: 'text-[18px]' },
}

/** Typographic monogram — serif X on the brand tile. No icons. */
export const LogoMark = ({ size = 'md', className = '' }) => {
  const s = SIZES[size] ?? SIZES.md
  return (
    <span className={`grid ${s.box} shrink-0 place-items-center bg-[#ea580c] ${className}`}>
      <span className={`font-serif-display ${s.glyph} leading-none text-white`}>X</span>
    </span>
  )
}

/** Full lockup: monogram + wordmark. */
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
      <span className={`font-semibold tracking-[-0.02em] text-white ${textClassName}`}>
        XCrafter
      </span>
    )}
  </Link>
)