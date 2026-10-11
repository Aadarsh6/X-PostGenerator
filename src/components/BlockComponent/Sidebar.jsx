import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Bookmark, ChevronLeft, ChevronRight, ChevronsUpDown, Home, LogOut,
  PenLine, Search, Settings, User, X, Zap,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

/* ---------------------------------- hooks --------------------------------- */

function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (e) => setMatches(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export const useIsMobile = () => useMediaQuery('(max-width: 1023px)')

const isMac =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
const MOD = isMac ? '⌘' : 'Ctrl'

/* ---------------------------------- config -------------------------------- */

const NAV_ITEMS = [
  { icon: Home, label: 'Dashboard', to: '/dashboard' },
  { icon: Bookmark, label: 'Saved', to: '/save' },
  { icon: User, label: 'Profile', to: '/profile' },
  { icon: Settings, label: 'Settings', to: '/soon' },
]

/* --------------------------------- tooltip -------------------------------- */

const Tooltip = ({ children }) => (
  <span className="pointer-events-none absolute left-full top-1/2 ml-4 -translate-y-1/2 translate-x-2 whitespace-nowrap rounded-lg border border-[#222323] bg-[#0a0a0a] px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
    {children}
  </span>
)

/* -------------------------------- nav item -------------------------------- */

const NavItem = ({ item, isCollapsed, isActive, onNavigate, itemRef, index }) => {
  const Icon = item.icon

  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      ref={itemRef}
      style={{ animationDelay: `${120 + index * 45}ms` }}
      className={`
        animate-fade-up group relative flex h-11 items-center gap-3 rounded-xl px-3 outline-none
        transition-all duration-200 motion-reduce:transition-none
        ${isCollapsed ? 'mx-auto w-11' : 'w-full'}
        ${isActive ? 'bg-[#ea580c]/10' : 'hover:bg-white/[0.06]'}
        focus-visible:ring-2 focus-visible:ring-[#ea580c]/60
      `}
    >
      <Icon
        size={20}
        strokeWidth={isActive ? 2.25 : 1.75}
        className={`shrink-0 transition-colors duration-200 ${
          isActive ? 'text-[#ea580c]' : 'text-gray-400 group-hover:text-white'
        }`}
      />

      <span
        className={`overflow-hidden whitespace-nowrap text-sm font-medium tracking-tight transition-all duration-200 ${
          isCollapsed ? 'w-0 opacity-0' : 'opacity-100'
        } ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}
      >
        {item.label}
      </span>

      {isCollapsed && <Tooltip>{item.label}</Tooltip>}
    </NavLink>
  )
}

/* --------------------------------- sidebar -------------------------------- */

export const Sidebar = ({
  collapsed,
  onCollapsedChange,
  mobileOpen,
  onMobileClose,
  onOpenCommandPalette,
}) => {
  const isMobile = useIsMobile()
  const location = useLocation()
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)

  // "Collapsed" is a desktop-only concept — the mobile drawer is always expanded
  const isCollapsed = collapsed && !isMobile

  /* Which nav item is active? */
  const activeTo = useMemo(() => {
    const match = NAV_ITEMS.find(
      (n) => location.pathname === n.to || location.pathname.startsWith(n.to + '/'),
    )
    return match ? match.to : null
  }, [location.pathname])

  /* Sliding active indicator */
  const itemRefs = useRef({})
  const [indicator, setIndicator] = useState({ top: 0, height: 0, visible: false })

  useEffect(() => {
    const el = itemRefs.current[activeTo]
    if (!el || isCollapsed) {
      setIndicator((i) => ({ ...i, visible: false }))
      return
    }
    setIndicator({ top: el.offsetTop, height: el.offsetHeight, visible: true })
  }, [activeTo, isCollapsed])

  const closeBtnRef = useRef(null)

  /* Lock body scroll + move focus into the drawer while open */
  useEffect(() => {
    if (mobileOpen && isMobile) {
      document.body.style.overflow = 'hidden'
      closeBtnRef.current?.focus()
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen, isMobile])

  /* Escape closes the drawer */
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') onMobileClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileOpen, onMobileClose])

  /* Swipe left to close (mobile) */
  const touchStartX = useRef(null)
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    if (e.changedTouches[0].clientX - touchStartX.current < -60) onMobileClose()
    touchStartX.current = null
  }

  const handleLogout = () => {
    onMobileClose()
    logout()
    navigate('/login', { replace: true })
  }

  const displayName = user?.name ?? user?.username ?? user?.email ?? 'Guest'
  const initials =
    displayName
      .split(' ')
      .map((word) => word[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'U'

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 motion-reduce:transition-none lg:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      {/* Sidebar: slide-in drawer on mobile, fixed rail on desktop */}
      <aside
        aria-label="Sidebar"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#222323] bg-[#171717] shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none
          ${mobileOpen ? 'visible translate-x-0' : 'invisible -translate-x-full'}
          lg:visible lg:translate-x-0 lg:shadow-none
          ${collapsed ? 'lg:w-20' : 'lg:w-64'}
        `}
      >
        {/* ------------------------------- Header ------------------------------- */}
        <div
          className={`flex h-16 shrink-0 items-center border-b border-[#222323] ${
            isCollapsed ? 'justify-center' : 'justify-between px-4'
          }`}
        >
          <Link
            to="/dashboard"
            onClick={isMobile ? onMobileClose : undefined}
            className="group flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c]/60"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#ea580c] shadow-lg shadow-[#ea580c]/25 transition-transform duration-200 group-hover:scale-105">
              <Zap size={15} strokeWidth={2.5} className="text-white" />
            </span>
            {!isCollapsed && (
              <span className="text-[17px] font-semibold tracking-[-0.02em] text-white">
                XCrafter
              </span>
            )}
          </Link>

          {isMobile && (
            <button
              ref={closeBtnRef}
              onClick={onMobileClose}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Collapse toggle — floats on the sidebar edge (desktop) */}
        <button
          onClick={() => onCollapsedChange(!collapsed)}
          className="absolute -right-3 top-[76px] hidden h-6 w-6 place-items-center rounded-full border border-[#2a2a2a] bg-[#171717] text-gray-500 shadow-lg transition-all duration-200 hover:border-[#ea580c]/60 hover:text-[#ea580c] lg:grid"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* ------------------------- CTA + search trigger ------------------------ */}
        <div className={`shrink-0 pt-4 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          {/* Primary CTA — ⚠️ point this at your composer route */}
          <Link
            to="/dashboard"
            onClick={isMobile ? onMobileClose : undefined}
            className={`btn-primary group relative flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#ea580c]/60 ${
              isCollapsed ? 'w-11' : 'w-full'
            }`}
          >
            <PenLine size={17} strokeWidth={2.25} className="shrink-0" />
            {!isCollapsed && <span className="tracking-tight">New Post</span>}
            {isCollapsed && <Tooltip>New Post</Tooltip>}
          </Link>

          {/* Search trigger → command palette */}
          <button
            onClick={onOpenCommandPalette}
            className={`group relative mt-3 flex h-10 items-center rounded-xl border border-[#242424] bg-[#111111] outline-none transition-all duration-200 hover:border-[#333333] hover:bg-[#151515] focus-visible:ring-2 focus-visible:ring-[#ea580c]/60 ${
              isCollapsed ? 'w-11 justify-center' : 'w-full gap-3 px-3'
            }`}
            aria-label="Open command palette"
          >
            <Search size={16} strokeWidth={2} className="shrink-0 text-gray-500" />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left text-sm text-gray-500 transition-colors group-hover:text-gray-400">
                  Search…
                </span>
                <span className="kbd shrink-0">{MOD}K</span>
              </>
            )}
            {isCollapsed && <Tooltip>Search {MOD}K</Tooltip>}
          </button>
        </div>

        {/* ------------------------------ Navigation ----------------------------- */}
        <nav className="relative flex-1 px-3 py-5">
          {/* Sliding active indicator */}
          <span
            aria-hidden="true"
            style={{ top: `${indicator.top}px`, height: `${indicator.height}px` }}
            className={`pointer-events-none absolute left-0 w-[3px] rounded-full bg-[#ea580c] shadow-[0_0_14px_rgba(234,88,12,0.9)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              indicator.visible ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {!isCollapsed && (
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-600">
              Menu
            </p>
          )}

          <div className="space-y-1">
            {NAV_ITEMS.map((item, index) => (
              <NavItem
                key={item.label}
                item={item}
                index={index}
                isCollapsed={isCollapsed}
                isActive={item.to === activeTo}
                onNavigate={isMobile ? onMobileClose : undefined}
                itemRef={(el) => {
                  itemRefs.current[item.to] = el
                }}
              />
            ))}
          </div>
        </nav>

        {/* ------------------------ User + logout (bottom) ------------------------ */}
        <div className="shrink-0 border-t border-[#222323] p-3">
          <Link
            to="/profile"
            onClick={isMobile ? onMobileClose : undefined}
            className={`group relative flex items-center rounded-xl outline-none transition-all duration-200 hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-[#ea580c]/60 ${
              isCollapsed ? 'mx-auto h-12 w-12 justify-center' : 'w-full gap-3 p-2'
            }`}
          >
            <span className="relative shrink-0">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-[#2dd4bf]/25 bg-[#14b8a6]/15 text-xs font-semibold text-[#2dd4bf]">
  {initials}
</span>
              {/* Online status */}
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-[#171717] bg-emerald-500" />
              </span>
            </span>

            {!isCollapsed && (
              <>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-white">
                    {displayName}
                  </span>
                  <span className="block truncate text-xs text-gray-500">
                    {user?.email || 'View profile'}
                  </span>
                </span>
                <ChevronsUpDown size={15} className="shrink-0 text-gray-600" />
              </>
            )}

            {isCollapsed && <Tooltip>{displayName}</Tooltip>}
          </Link>

          <button
            onClick={handleLogout}
            className={`group relative flex h-11 items-center gap-3 rounded-xl px-3 text-gray-500 outline-none transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 focus-visible:ring-2 focus-visible:ring-red-500/40 ${
              isCollapsed ? 'mx-auto w-11' : 'mt-2 w-full'
            }`}
            aria-label="Log out"
          >
            <LogOut size={20} strokeWidth={1.75} className="shrink-0" />
            <span
              className={`overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-200 ${
                isCollapsed ? 'w-0 opacity-0' : 'opacity-100'
              }`}
            >
              Logout
            </span>
            {isCollapsed && <Tooltip>Logout</Tooltip>}
          </button>

          {/* Version + status footer */}
          {!isCollapsed && (
            <div className="mt-3 flex items-center justify-between border-t border-[#1c1d1d] pt-3 text-[10px] font-medium uppercase tracking-[0.14em] text-gray-700">
              <span>v1.0.0</span>
              <span className="flex items-center gap-1.5 normal-case tracking-normal">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                All systems go
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

/*                              DOCS


?Consistency & Spacing:

Uniform padding: Used consistent //!px-3 py-3 for navigation items
Consistent gaps: Standardized gap-3 and margins throughout
Balanced header: Adjusted header padding to px-4 py-3

?Visual Hierarchy:

Icon sizing: Reduced to size={20} for better proportion and consistency
Typography: Improved font weights and sizes for better readability
Color harmony: Used consistent hover color #252525 throughout

?Enhanced UX:

Smoother transitions: Reduced duration to 200ms for snappier feel
Better focus states: Improved focus ring with blue accent
Status indicator: Added "Online" status under username
Gradient avatar fallback: More visually appealing fallback
Proper truncation: Username truncates properly in narrow spaces

?Tooltip Improvements:

Better positioning: Increased ml-3 for proper spacing
Enhanced styling: Added border and shadow for better visibility
Consistent background: Used bg-gray-900 with border

?Footer Enhancements:

Conditional hover: Only applies hover when expanded
Better user info: Added status indicator and proper layout
Improved avatar: Better sizing and object-cover for images

?Accessibility:

Better focus indicators: Enhanced focus rings
Proper ARIA labels: Maintained all accessibility features
Keyboard navigation: All interactive elements remain keyboard accessible

The design now feels more polished and consistent while maintaining your dark theme aesthetic and all existing functionality.
*/










/*                              DOCS


?Consistency & Spacing:

Uniform padding: Used consistent //!px-3 py-3 for navigation items
Consistent gaps: Standardized gap-3 and margins throughout
Balanced header: Adjusted header padding to px-4 py-3

?Visual Hierarchy:

Icon sizing: Reduced to size={20} for better proportion and consistency
Typography: Improved font weights and sizes for better readability
Color harmony: Used consistent hover color #252525 throughout

?Enhanced UX:

Smoother transitions: Reduced duration to 200ms for snappier feel
Better focus states: Improved focus ring with blue accent
Status indicator: Added "Online" status under username
Gradient avatar fallback: More visually appealing fallback
Proper truncation: Username truncates properly in narrow spaces

?Tooltip Improvements:

Better positioning: Increased ml-3 for proper spacing
Enhanced styling: Added border and shadow for better visibility
Consistent background: Used bg-gray-900 with border

?Footer Enhancements:

Conditional hover: Only applies hover when expanded
Better user info: Added status indicator and proper layout
Improved avatar: Better sizing and object-cover for images

?Accessibility:

Better focus indicators: Enhanced focus rings
Proper ARIA labels: Maintained all accessibility features
Keyboard navigation: All interactive elements remain keyboard accessible

The design now feels more polished and consistent while maintaining your dark theme aesthetic and all existing functionality.
*/







