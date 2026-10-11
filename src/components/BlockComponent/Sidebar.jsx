import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Bookmark, ChevronLeft, ChevronRight, Home, LogOut, Settings, User, X, Zap,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

/* ---------------------------------- hooks --------------------------------- */

function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (e) => setMatches(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/**
 * Shared breakpoint hook — used by Sidebar AND DashboardPage so the header,
 * drawer, and content always agree on what "mobile" means.
 * (Move to src/hooks/ if you reuse it elsewhere.)
 */
export const useIsMobile = () => useMediaQuery('(max-width: 1023px)')

/* ---------------------------------- config -------------------------------- */

const NAV_ITEMS = [
  { icon: Home, label: 'Dashboard', to: '/dashboard' },
  { icon: Bookmark, label: 'Saved', to: '/save' },
  { icon: User, label: 'Profile', to: '/profile' },
  { icon: Settings, label: 'Settings', to: '/soon' },
]

/* -------------------------------- nav item -------------------------------- */

const NavItem = ({ item, isCollapsed, onNavigate }) => {
  const Icon = item.icon

  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) => `
        group relative flex h-11 items-center gap-3 rounded-xl px-3 outline-none
        transition-all duration-200 motion-reduce:transition-none
        ${isCollapsed ? 'mx-auto w-11' : 'w-full'}
        ${isActive ? 'bg-[#ea580c]/10' : 'hover:bg-white/[0.06]'}
        focus-visible:ring-2 focus-visible:ring-[#ea580c]/60
      `}
    >
      {({ isActive }) => (
        <>
          {/* Active indicator — expanded only */}
          {isActive && !isCollapsed && (
            <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#ea580c]" />
          )}

          <Icon
            size={20}
            strokeWidth={isActive ? 2.25 : 1.75}
            className={`shrink-0 transition-colors duration-200 ${
              isActive ? 'text-[#ea580c]' : 'text-gray-400 group-hover:text-white'
            }`}
          />

          {/* Label keeps its node so the collapse animation feels smooth */}
          <span
            className={`overflow-hidden whitespace-nowrap text-sm font-medium tracking-tight transition-all duration-200 ${
              isCollapsed ? 'w-0 opacity-0' : 'opacity-100'
            } ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}
          >
            {item.label}
          </span>

          {/* Tooltip — collapsed (desktop) only */}
          {isCollapsed && (
            <span className="pointer-events-none absolute left-full top-1/2 ml-4 -translate-y-1/2 translate-x-2 whitespace-nowrap rounded-lg border border-[#222323] bg-[#0a0a0a] px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
              {item.label}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}

/* --------------------------------- sidebar -------------------------------- */

export const Sidebar = ({ collapsed, onCollapsedChange, mobileOpen, onMobileClose }) => {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)

  // "Collapsed" is a desktop-only concept — the mobile drawer is always expanded
  const isCollapsed = collapsed && !isMobile

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
        {/* Header */}
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
              <span className="text-[17px] font-semibold tracking-tight text-white">
                XCrafter
              </span>
            )}
          </Link>

          {/* Close — mobile drawer only */}
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

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5">
          {!isCollapsed && (
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-600">
              Menu
            </p>
          )}

          <div className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <NavItem
                key={item.label}
                item={item}
                isCollapsed={isCollapsed}
                onNavigate={isMobile ? onMobileClose : undefined}
              />
            ))}
          </div>
        </nav>

        {/* User + logout — pinned to the bottom */}
        <div className="shrink-0 border-t border-[#222323] p-3">
          <Link
            to="/profile"
            onClick={isMobile ? onMobileClose : undefined}
            className={`group relative flex items-center rounded-xl outline-none transition-all duration-200 hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-[#ea580c]/60 ${
              isCollapsed ? 'mx-auto h-12 w-12 justify-center' : 'w-full gap-3 p-2'
            }`}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#ea580c]/30 bg-[#ea580c]/15 text-xs font-semibold text-[#ea580c]">
              {initials}
            </span>

            {!isCollapsed && (
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-white">
                  {displayName}
                </span>
                <span className="block truncate text-xs text-gray-500">View profile</span>
              </span>
            )}

            {isCollapsed && (
              <span className="pointer-events-none absolute left-full top-1/2 ml-4 -translate-y-1/2 translate-x-2 whitespace-nowrap rounded-lg border border-[#222323] bg-[#0a0a0a] px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                {displayName}
              </span>
            )}
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

            {isCollapsed && (
              <span className="pointer-events-none absolute left-full top-1/2 ml-4 -translate-y-1/2 translate-x-2 whitespace-nowrap rounded-lg border border-[#222323] bg-[#0a0a0a] px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                Logout
              </span>
            )}
          </button>
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







