import { Menu, Home, Settings, User, Bookmark } from 'lucide-react'
import { useState, useEffect } from 'react'
// import { LogoutIcon } from './LogoutIcon'
import { Link } from 'react-router-dom'
import { UserAvatar } from './UserAvatar'

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      setCollapsed(mobile) // collapsed = true on mobile, false on desktop
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const menuItems = [
    { icon: Home, label: 'Dashboard', id: 'dashboard' },
    { icon: User, label: 'Profile', id: 'profile' },
    { icon: Bookmark, label: 'Saved', id: 'saved' },
    { icon: Settings, label: 'Settings', id: 'settings' },
  ]

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-[#171717] border-r border-[#222323] transition-all duration-300 ease-in-out z-50
        flex flex-col
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 mt-2 border-b border-[#222323]">
        {!collapsed && (
          <div className="text-white font-semibold text-lg select-none tracking-wide">
            <Link to="/dashboard">XCrafter</Link>
          </div>
        )}

        {/* Toggle only on mobile */}
        {isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-[#ea580c] focus:outline-none text-white transition-colors duration-200 lg:hidden"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Menu size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              className={`relative group w-full flex items-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ea580c]/50 text-gray-300 hover:text-white hover:bg-[#ea580c] rounded-lg
                ${collapsed ? 'justify-center px-2 py-3' : 'justify-start gap-3 px-3 py-3'}`}
              data-tooltip={collapsed ? item.label : ''}
              aria-label={item.label}
            >
              <Icon size={20} className="flex-shrink-0" />
              <span
                className={`font-medium select-none overflow-hidden transition-all duration-300 ease-in-out
                  ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}
              >
                {item.label}
              </span>

              {collapsed && (
                <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity duration-200 z-50 select-none shadow-lg">
                  {item.label}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-[#222323]" />
      <UserAvatar collapsed={collapsed} />
    </div>
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








