import {  useRef, useState } from 'react'
import { BarChart3, Bell, Brush, Check, Link2 } from 'lucide-react'
import { AppLayout } from '@/components/BlockComponent/AppLayout'
import { useAuthStore } from '@/store/authStore'

const TONE_KEY = 'xcrafter:default-tone'
const FORMAT_KEY = 'xcrafter:default-type'

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'humorous', label: 'Humorous' },
  { value: 'educational', label: 'Educational' },
  { value: 'controversal', label: 'Controversial' },
  { value: 'casual', label: 'Casual' },
  { value: 'inspirational', label: 'Inspirational' },
]

const FORMATS = [
  { value: 'single', short: 'Single', hint: 'One standalone post' },
  { value: 'thread', short: 'Thread', hint: 'A thread of 2–5 posts' },
  { value: 'long-thread', short: 'Long', hint: 'A deep-dive thread of 6–10 posts' },
]

const PLANNED = [
  { icon: Bell, title: 'Notifications', desc: 'Email and in-app alerts when generations finish.' },
  { icon: Link2, title: 'Connect your X account', desc: 'Publish threads without leaving XCrafter.' },
  { icon: Brush, title: 'Themes & accents', desc: 'Custom palettes and a light mode.' },
  { icon: BarChart3, title: 'Usage & analytics', desc: 'Track generations, published posts, and engagement.' },
]

export default function SettingsPage() {
  const { user } = useAuthStore()

  const [tone, setTone] = useState(() => {
    try {
      return localStorage.getItem(TONE_KEY) || 'educational'
    } catch {
      return 'educational'
    }
  })
  const [format, setFormat] = useState(() => {
    try {
      return localStorage.getItem(FORMAT_KEY) || 'single'
    } catch {
      return 'single'
    }
  })
  const [savedFlash, setSavedFlash] = useState(false)
  const flashTimer = useRef(null)

  const persist = (setter, key, value) => {
    setter(value)
    try {
      localStorage.setItem(key, value)
    } catch {
      /* ignore */
    }
    setSavedFlash(true)
    clearTimeout(flashTimer.current)
    flashTimer.current = window.setTimeout(() => setSavedFlash(false), 1600)
  }

  const activeFormatIndex = FORMATS.findIndex((f) => f.value === format)

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <AppLayout crumb="Settings">
      {/* Header */}
      <div className="animate-fade-up">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-600">
          Preferences
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-[28px]">
          Settings
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Configure how XCrafter behaves. Everything saves automatically.
        </p>
      </div>

      {/* Composer defaults — these actually work */}
      <div className="card animate-fade-up mt-6 p-5 sm:p-6" style={{ animationDelay: '80ms' }}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight text-white">
              Composer defaults
            </h2>
            <p className="mt-0.5 text-xs text-gray-500">
              Loaded automatically next time you craft a post.
            </p>
          </div>
          <span
            className={`flex items-center gap-1 text-[11px] font-medium text-emerald-400 transition-opacity duration-300 ${
              savedFlash ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Check size={12} />
            Saved
          </span>
        </div>

        {/* Default tone */}
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-600">
          Default tone
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {TONES.map((t) => (
            <button
              key={t.value}
              onClick={() => persist(setTone, TONE_KEY, t.value)}
              className={`h-9 rounded-full px-4 text-[13px] font-medium outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#ea580c]/60 ${
                tone === t.value
                  ? 'border border-[#ea580c]/40 bg-[#ea580c]/10 text-[#f97316]'
                  : 'border border-[#242424] bg-[#141414] text-gray-400 hover:border-[#333333] hover:text-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Default format */}
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-600">
          Default format
        </p>
        <div
          className="relative mt-2.5 flex max-w-sm rounded-xl border border-[#242424] bg-[#111111] p-1"
          role="group"
          aria-label="Default format"
        >
          <span
            aria-hidden="true"
            className="absolute bottom-1 top-1 rounded-lg bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-200 ease-out"
            style={{
              left: `calc(4px + (100% - 8px) * ${activeFormatIndex / FORMATS.length})`,
              width: `calc((100% - 8px) / ${FORMATS.length})`,
            }}
          />
          {FORMATS.map((f) => (
            <button
              key={f.value}
              title={f.hint}
              onClick={() => persist(setFormat, FORMAT_KEY, f.value)}
              className={`relative z-10 flex-1 rounded-lg py-2 text-xs font-medium outline-none transition-colors duration-200 focus-visible:ring-1 focus-visible:ring-[#ea580c]/60 sm:text-[13px] ${
                format === f.value ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {f.short}
            </button>
          ))}
        </div>
      </div>

      {/* Account — read-only for now */}
      <div
        className="card animate-fade-up mt-4 divide-y divide-[#1c1d1d] overflow-hidden"
        style={{ animationDelay: '160ms' }}
      >
        <div className="p-5">
          <h2 className="text-[15px] font-semibold tracking-tight text-white">Account</h2>
          <p className="mt-0.5 text-xs text-gray-500">Profile editing is on the roadmap.</p>
        </div>
        {[
          { label: 'Name', value: user?.name || '—' },
          { label: 'Email', value: user?.email || '—' },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 px-5 py-3.5">
            <span className="text-[13px] text-gray-500">{row.label}</span>
            <span className="truncate text-[13px] font-medium text-gray-200">{row.value}</span>
          </div>
        ))}
        <div className="flex items-center justify-between gap-4 px-5 py-3.5">
          <span className="text-[13px] text-gray-500">Plan</span>
          <span className="rounded-full border border-[#2dd4bf]/25 bg-[#14b8a6]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#2dd4bf]">
            Free
          </span>
        </div>
        {memberSince && (
          <div className="flex items-center justify-between gap-4 px-5 py-3.5">
            <span className="text-[13px] text-gray-500">Member since</span>
            <span className="text-[13px] font-medium text-gray-200">{memberSince}</span>
          </div>
        )}
      </div>

      {/* Roadmap — honest, no fake toggles */}
      <div
        className="card animate-fade-up mt-4 divide-y divide-[#1c1d1d] overflow-hidden"
        style={{ animationDelay: '240ms' }}
      >
        <div className="p-5">
          <h2 className="text-[15px] font-semibold tracking-tight text-white">Coming to settings</h2>
          <p className="mt-0.5 text-xs text-gray-500">In active development.</p>
        </div>
        {PLANNED.map((item) => (
          <div key={item.title} className="flex items-center gap-4 px-5 py-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#242424] bg-[#141414] text-gray-500">
              <item.icon size={16} strokeWidth={1.75} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-white">{item.title}</span>
              <span className="block text-xs text-gray-500">{item.desc}</span>
            </span>
            <span className="shrink-0 rounded-full border border-[#242424] bg-[#141414] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              Planned
            </span>
          </div>
        ))}
      </div>
    </AppLayout>
  )
}