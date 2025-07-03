import { Menu, Home, Settings, User, Bookmark, X } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { UserAvatar } from './UserAvatar'

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleResize = useCallback(() => {
    const mobile = window.innerWidth < 1024
    setIsMobile(mobile)
    setCollapsed(mobile) // always collapsed on mobile
    
    // Close mobile menu when switching to desktop
    if (!mobile) {
      setMobileMenuOpen(false)
    }
  }, [])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        closeMobileMenu()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [mobileMenuOpen, closeMobileMenu])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen && isMobile) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen, isMobile])

  const menuItems = [
    { icon: Home, label: 'Dashboard', id: 'dashboard', to: "/dashboard"},
    { icon: Bookmark, label: 'Saved', id: 'saved', to: "/save"},
    { icon: User, label: 'Profile', id: 'profile', to: "/"},
    { icon: Settings, label: 'Settings', id: 'settings', to: "/"},
  ]

  return (
    <>
      {/* Mobile Menu Button - Fixed in top right */}
      {isMobile && (
        <button
          onClick={toggleMobileMenu}
          className="fixed top-4 right-4 z-[60] p-2 rounded-lg bg-[#171717] border border-[#222323] text-white hover:bg-[#ea580c] focus:outline-none focus:ring-2 focus:ring-[#ea580c]/50 transition-colors duration-200 lg:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}
        </button>
      )}

      {/* Mobile menu backdrop */}
      {mobileMenuOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-[#171717] border-r border-[#222323] transition-all duration-300 ease-in-out z-50 flex flex-col
          ${isMobile 
            ? `w-64 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`
            : `${collapsed ? 'w-16' : 'w-64'}`
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 mt-2 border-b border-[#222323]">
          {/* Logo - show full on mobile or when not collapsed on desktop */}
          {(!collapsed || isMobile) && (
            <div className="text-white font-semibold text-lg select-none tracking-wide">
              <Link to="/dashboard" onClick={isMobile ? closeMobileMenu : undefined}>
                XCrafter
              </Link>
            </div>
          )}

          {/* Collapsed logo - only on desktop when collapsed */}
          {!isMobile && (
            <div className='flex justify-center items-center'>
              {collapsed && (
                <div className="text-[#e6e8df] font-semibold">
                  <Link to="/dashboard">Xc</Link>
                </div>
              )}
            </div>
          )}

          {/* Close button for mobile */}
          {isMobile && (
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-lg hover:bg-[#ea580c] focus:outline-none text-white transition-colors duration-200"
              aria-label="Close mobile menu"
            >
              <X size={20} />
            </button>
          )}

          {/* Desktop toggle button */}
          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-[#ea580c] focus:outline-none text-white transition-colors duration-200"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {/* <Menu size={20} /> */}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const content = (
              <button
                key={item.id}
                className={`relative group w-full flex items-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ea580c]/50 text-gray-300 hover:text-white hover:bg-[#ea580c] rounded-lg
                  ${(collapsed && !isMobile) ? 'justify-center px-2 py-3' : 'justify-start gap-3 px-3 py-3'}`}
                data-tooltip={(collapsed && !isMobile) ? item.label : ''}
                aria-label={item.label}
                onClick={isMobile ? closeMobileMenu : undefined}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span
                  className={`font-medium select-none overflow-hidden transition-all duration-300 ease-in-out
                    ${(collapsed && !isMobile) ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}
                >
                  {item.label}
                </span>

                {/* Tooltip for collapsed desktop view */}
                {(collapsed && !isMobile) && (
                  <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity duration-200 z-50 select-none shadow-lg">
                    {item.label}
                  </span>
                )}
              </button>
            )

            return item.to ? (
              <NavLink 
                key={item.id}
                to={item.to}
                className={({ isActive }) => `
                  relative group w-full flex items-center transition-all duration-200 focus:outline-none
                  text-gray-300 hover:text-white hover:bg-[#ea580c] rounded-lg
                  ${(collapsed && !isMobile) ? 'justify-center' : 'justify-start'}
                  ${isActive ? 'ring-2 ring-[#ea580c]/50 shadow-2xl' : ''}
                `}
                onClick={isMobile ? closeMobileMenu : undefined}
              >
                {content}
              </NavLink>
            ) : (
              <div key={item.id}>
                {content}
              </div>
            )
          })}
        </nav>

        <div className="border-t border-[#222323]" />
        <UserAvatar collapsed={collapsed && !isMobile} />
      </div>
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







