import React from 'react'
import { Github, Twitter } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from './Brand'

const scrollToId = (e, id) => {
  e.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

const NAV_LINKS = [
  { label: 'How it works', id: 'how-it-works' },
  { label: 'Results', id: 'results' },
  { label: 'Demo', id: 'demo' },
]

const SOCIALS = [
  { icon: Twitter, href: 'https://x.com/Aadarsh_MM', label: 'X (Twitter)' },
  { icon: Github, href: 'https://github.com/Aadarsh6', label: 'GitHub' },
]

export const Footer = React.memo(() => {
  return (
    <footer className="border-t border-[#1c1c1c] bg-[#0a0a0a]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between">
          <Logo size="sm" to="/" ariaLabel="XCrafter home" />

          <nav className="flex flex-wrap justify-center gap-x-7 gap-y-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => scrollToId(e, link.id)}
                className="text-sm font-medium text-gray-500 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#ea580c]/60"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/contact"
              className="text-sm font-medium text-gray-500 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#ea580c]/60"
            >
              Contact
            </Link>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center gap-5 border-t border-[#141414] pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-gray-700">
            © {new Date().getFullYear()} XCrafter. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-gray-600 transition-colors hover:text-white"
              >
                <social.icon size={16} />
              </a>
            ))}
            <span className="hidden h-4 w-px bg-[#1f1f1f] sm:block" />
            <a
              href="https://x.com/Aadarsh_MM"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-600 transition-colors hover:text-[#f97316]"
            >
              Crafted by <span className="font-serif-accent text-[1.15em]">Aadarsh</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
})

Footer.displayName = 'Footer'