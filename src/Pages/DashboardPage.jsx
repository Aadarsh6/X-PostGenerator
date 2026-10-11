import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell, Bookmark, Home, LogOut, Menu, PanelLeft, PenLine, Search, Settings, User, Zap,
} from 'lucide-react'
import { Sidebar, useIsMobile } from '../components/BlockComponent/Sidebar'
import { Xpost } from '../components/BlockComponent/Xpost'
import { CommandPalette } from '../components/BlockComponent/CommandPalette'
import { useAuthStore } from '@/store/authStore'

const COLLAPSED_KEY = 'xcrafter:sidebar-collapsed'

const isMac =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
const MOD = isMac ? '⌘' : 'Ctrl'

export const DashboardPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)
  const isMobile = useIsMobile()

  /* Persist the desktop collapse preference */
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSED_KEY) === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSED_KEY, String(collapsed))
    } catch {
      /* storage unavailable — ignore */
    }
  }, [collapsed])

  /* Auto-close the drawer on desktop */
  useEffect(() => {
    if (!isMobile) setMobileOpen(false)
  }, [isMobile])

  /* Global shortcuts: ⌘K → palette, ⌘B → toggle sidebar */
  useEffect(() => {
    const onKey = (e) => {
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      } else if (mod && e.key.toLowerCase() === 'b') {
        // Don't hijack bold inside text inputs
        const t = e.target
        if (
          t instanceof HTMLElement &&
          (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
        )
          return
        e.preventDefault()
        setCollapsed((c) => !c)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const handleLogout = useCallback(() => {
    logout()
    navigate('/login', { replace: true })
  }, [logout, navigate])

  /* Command palette commands */
  const commands = useMemo(
    () => [
      {
        id: 'new-post',
        icon: PenLine,
        label: 'New post',
        group: 'Actions',
        keywords: 'compose create write draft tweet',
        run: () => navigate('/dashboard'), // ⚠️ wire to your composer
      },
      {
        id: 'toggle-sidebar',
        icon: PanelLeft,
        label: collapsed ? 'Expand sidebar' : 'Collapse sidebar',
        group: 'Actions',
        shortcut: `${MOD}B`,
        run: () => setCollapsed((c) => !c),
      },
      {
        id: 'logout',
        icon: LogOut,
        label: 'Log out',
        group: 'Actions',
        run: handleLogout,
      },
      { id: 'nav-dashboard', icon: Home, label: 'Go to Dashboard', group: 'Navigation', run: () => navigate('/dashboard') },
      { id: 'nav-saved', icon: Bookmark, label: 'Go to Saved', group: 'Navigation', run: () => navigate('/save') },
      { id: 'nav-profile', icon: User, label: 'Go to Profile', group: 'Navigation', run: () => navigate('/profile') },
      { id: 'nav-settings', icon: Settings, label: 'Go to Settings', group: 'Navigation', run: () => navigate('/soon') },
    ],
    [collapsed, navigate, handleLogout],
  )

  /* Greeting + date */
  const now = new Date()
  const hour = now.getHours()
  const greeting =
    hour < 5 ? 'Good night' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateLabel = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const displayName = user?.name ?? user?.username ?? user?.email ?? 'there'
  const firstName = displayName.split(' ')[0]
  const initials =
    displayName
      .split(' ')
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'U'

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] antialiased">
      {/* ---------- Ambient background layers ---------- */}
      <div
        aria-hidden="true"
        className="dot-grid pointer-events-none fixed inset-0 z-0"
        style={{
          WebkitMaskImage: 'radial-gradient(ellipse 80% 45% at 50% 0%, black 20%, transparent 75%)',
          maskImage: 'radial-gradient(ellipse 80% 45% at 50% 0%, black 20%, transparent 75%)',
        }}
      />
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-0 flex justify-center">
        <div className="glow-blob h-[420px] w-[840px] rounded-full opacity-60 blur-3xl" />
      </div>
      <div aria-hidden="true" className="noise" />

      <Sidebar
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onOpenCommandPalette={() => setPaletteOpen(true)}
      />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        commands={commands}
      />

      {/* ---------- Content column ---------- */}
      <div
        className={`relative z-10 flex min-h-screen flex-col transition-all duration-300 motion-reduce:transition-none ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-[#1c1c1c] bg-[#0a0a0a]/80 px-4 backdrop-blur-xl lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="-ml-2 rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c]/60"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <Menu size={22} />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c]/60">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#ea580c] shadow-md shadow-[#ea580c]/25">
              <Zap size={14} strokeWidth={2.5} className="text-white" />
            </span>
            <span className="text-[17px] font-semibold tracking-[-0.02em] text-white">XCrafter</span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setPaletteOpen(true)}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Search"
            >
              <Search size={19} />
            </button>
            {/* ⚠️ wire to your composer */}
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary grid h-9 w-9 place-items-center rounded-lg text-white"
              aria-label="New post"
            >
              <PenLine size={16} strokeWidth={2.25} />
            </button>
          </div>
        </header>

        {/* Desktop app bar */}
        <header className="sticky top-0 z-30 hidden h-14 shrink-0 items-center gap-4 border-b border-[#1c1c1c] bg-[#0a0a0a]/75 px-6 backdrop-blur-xl lg:flex">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">XCrafter</span>
            <span className="text-gray-800">/</span>
            <span className="font-medium text-gray-200">Dashboard</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setPaletteOpen(true)}
              className="flex h-9 w-48 items-center gap-2.5 rounded-lg border border-[#222323] bg-[#111111] px-3 text-sm text-gray-500 outline-none transition-all duration-200 hover:border-[#333333] hover:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#ea580c]/60 xl:w-64"
            >
              <Search size={15} className="shrink-0" />
              <span className="flex-1 text-left">Search…</span>
              <span className="kbd shrink-0">{MOD}K</span>
            </button>

            {/* ⚠️ wire notifications */}
            <button
              className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#ea580c]" />
            </button>

            <div className="mx-1 h-5 w-px bg-[#222323]" />

            <Link
              to="/profile"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#ea580c]/25 bg-[#ea580c]/15 text-[11px] font-semibold text-[#ea580c] transition-transform duration-200 hover:scale-105"
              aria-label="Profile"
            >
              {initials}
            </Link>
          </div>
        </header>

        {/* ---------- Main content ---------- */}
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-8 sm:px-6 lg:px-10 lg:pt-10">
          {/* Hero */}
          <div className="animate-fade-up">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-600">
              {dateLabel}
            </p>
            <h1 className="mt-2.5 text-[28px] font-semibold leading-[1.12] tracking-[-0.03em] text-white sm:text-[36px]">
              {greeting},{' '}
              <span className="font-serif-accent text-[1.08em] text-[#f97316]">{firstName}</span>
            </h1>
            <p className="mt-2.5 max-w-md text-sm leading-relaxed text-gray-500">
              Craft, schedule, and track high-performing posts — all in one place.
            </p>
          </div>

          {/* Stat cards — ✦ DEMO DATA: wire to your API or delete this block */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: 'Posts crafted', value: '24', delta: '+8 this week' },
              { label: 'Impressions', value: '18.4K', delta: '+12.2%' },
              { label: 'Bookmarks', value: '342', delta: '+5.4%' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="card animate-fade-up p-4 sm:p-5"
                style={{ animationDelay: `${90 + i * 70}ms` }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-600">
                  {stat.label}
                </p>
                <div className="mt-2.5 flex items-baseline gap-2">
                  <span className="tnum text-2xl font-semibold tracking-[-0.02em] text-white">
                    {stat.value}
                  </span>
                  <span className="tnum rounded-full bg-emerald-400/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                    {stat.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Your main content */}
          <div className="animate-fade-up mt-8 lg:mt-10" style={{ animationDelay: '300ms' }}>
            <Xpost />
          </div>

          {/* Footer */}
          <footer className="mt-14 flex items-center justify-between border-t border-[#1a1a1a] pt-6 text-xs text-gray-700">
            <span>© {new Date().getFullYear()} XCrafter</span>
            <span className="flex items-center gap-4">
              <a href="#" className="transition-colors hover:text-gray-400">Docs</a>
              <a href="#" className="transition-colors hover:text-gray-400">Support</a>
            </span>
          </footer>
        </main>
      </div>
    </div>
  )
}