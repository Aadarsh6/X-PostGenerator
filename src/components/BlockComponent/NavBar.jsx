import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, LogIn, Menu, X, Zap } from 'lucide-react'
import { ShimmerButton } from '../magicui/shimmer-button'
import { useAuthStore } from '@/store/authStore'
import { useAvatar } from './Context/avatarContext'
import { cn } from '@/lib/utils'

export const NavBar = React.memo(() => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [avatarError, setAvatarError] = useState(false)

  const { token } = useAuthStore()
  const { avatar, initial } = useAvatar()

  /* Blur the bar once the page scrolls */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Auto-close the drawer at desktop sizes (matchMedia, not resize) */
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)')
    const onChange = (e) => e.matches && setMobileMenuOpen(false)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  /* Escape closes the drawer */
  useEffect(() => {
    if (!mobileMenuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMobileMenuOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileMenuOpen])

  /* Lock body scroll while the drawer is open */
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  /* If the avatar URL changes, retry the image */
  useEffect(() => setAvatarError(false), [avatar])

  const showAvatar = Boolean(avatar) && !avatarError

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 md:hidden',
          mobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <nav
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled || mobileMenuOpen
            ? 'border-b border-[#1c1c1c] bg-[#0a0a0a]/80 backdrop-blur-xl'
            : 'bg-transparent',
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo — unified with the app's branding */}
          <Link to="/" className="group flex items-center gap-2.5" aria-label="XCrafter home">
            <span className="grid font-bold h-7 w-7 place-items-center rounded-lg transition-transform duration-200 group-hover:scale-105">
              {/* <Zap size={14} strokeWidth={2.5} className="text-white" />
               */}
               Xc
            </span>
            <span className="text-[17px] font-semibold tracking-[-0.02em] text-white">XCrafter</span>
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-3 md:flex">
            {token ? (
              <Link
                to="/dashboard"
                className="group flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 outline-none transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-[#ea580c]/60"
              >
                {/* ✦ THE FIX: initials fallback when avatar is missing or broken */}
                {showAvatar ? (
                  <img
                    src={avatar}
                    alt="Profile"
                    onError={() => setAvatarError(true)}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-transparent transition-all duration-200 group-hover:ring-[#2dd4bf]"
                  />
                ) : (
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0f766e] text-[11px] font-semibold text-white ring-2 ring-transparent transition-all duration-200 group-hover:ring-[#2dd4bf]">
                    {initial || 'U'}
                  </span>
                )}
                <span className="text-sm font-semibold text-gray-300 transition-colors group-hover:text-white">
                  Dashboard
                </span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-300 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-[#ea580c]/60"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
                <Link to="/signup">
                  <ShimmerButton
                    background="linear-gradient(to right, #f97316, #ea580c)"
                    className="shadow-lg shadow-orange-600/25 transition-shadow duration-200 hover:shadow-xl hover:shadow-orange-700/40"
                  >
                    Sign Up Free
                    <ArrowRight size={15} />
                  </ShimmerButton>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c]/60 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-80 max-w-[90vw] transform transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] md:hidden',
          mobileMenuOpen ? 'visible translate-x-0' : 'invisible translate-x-full',
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex h-full flex-col border-l border-[#222323] bg-[#171717]">
          <div className="flex h-16 items-center justify-between border-b border-[#222323] px-4">
            <span className="text-[17px] font-semibold tracking-tight text-white">XCrafter</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-3 p-4">
            {token ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white"
              >
                Go to Dashboard
                <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#242424] bg-[#141414] text-sm font-medium text-gray-300 transition-colors hover:border-[#333333] hover:text-white"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white"
                >
                  Sign Up Free
                  <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>

          <p className="px-4 pb-4 text-[11px] text-gray-600">
            © {new Date().getFullYear()} XCrafter
          </p>
        </div>
      </div>
    </>
  )
})

NavBar.displayName = 'NavBar'