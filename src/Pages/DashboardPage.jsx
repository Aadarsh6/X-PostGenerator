import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Zap } from 'lucide-react'
import { Sidebar, useIsMobile } from '../components/BlockComponent/Sidebar'
import { Xpost } from '../components/BlockComponent/Xpost'

const COLLAPSED_KEY = 'xcrafter:sidebar-collapsed'

export const DashboardPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  // Persist the desktop collapse preference across reloads
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSED_KEY) === 'true'
    } catch {
      return false
    }
  })

  const isMobile = useIsMobile()

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSED_KEY, String(collapsed))
    } catch {
      /* storage unavailable — ignore */
    }
  }, [collapsed])

  // Auto-close the drawer once we're in desktop territory
  useEffect(() => {
    if (!isMobile) setMobileOpen(false)
  }, [isMobile])

  return (
    <div className="min-h-screen bg-[#0a0a0a] antialiased">
      {/* Subtle ambient glow — purely decorative, uses your brand orange */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(234,88,12,0.07),transparent)]"
      />

      <Sidebar
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Content column — left padding mirrors the sidebar width on desktop */}
      <div
        className={`relative z-10 flex min-h-screen flex-col transition-all duration-300 motion-reduce:transition-none ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-[#222323] bg-[#0a0a0a]/80 px-4 backdrop-blur-xl lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="-ml-2 rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c]/60"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <Menu size={22} />
          </button>

          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c]/60"
          >
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#ea580c] shadow-md shadow-[#ea580c]/25">
              <Zap size={14} strokeWidth={2.5} className="text-white" />
            </span>
            <span className="text-[17px] font-semibold tracking-tight text-white">
              XCrafter
            </span>
          </Link>

          {/* Right-side slot: notifications, quick compose action, avatar… */}
          <div className="ml-auto flex items-center gap-1">{/* … */}</div>
        </header>

        {/* Main content */}
        <main className="flex-1">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Xpost />
          </div>
        </main>
      </div>
    </div>
  )
}