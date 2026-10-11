import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, ChevronRight, Layers, MessageSquare, Settings } from 'lucide-react'
import { AppLayout } from '@/components/BlockComponent/AppLayout'
import { useAvatar } from '@/components/BlockComponent/Context/avatarContext'
import { useAuthStore } from '@/store/authStore'
import { api } from '@/services/api'

export default function ProfilePage() {
  const { user } = useAuthStore()
  const { initial } = useAvatar()
  const [stats, setStats] = useState({ saved: 0, threads: 0, singles: 0 })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    api
      .getPosts()
      .then((data) => {
        if (!mounted || !data?.success) return
        const threads = Array.isArray(data.threads) ? data.threads : []
        setStats({
          saved: threads.reduce((sum, t) => sum + t.length, 0),
          threads: threads.filter((t) => t.length > 1).length,
          singles: threads.filter((t) => t.length === 1).length,
        })
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setStatsLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <AppLayout crumb="Profile" wide>
      {/* Header */}
      <div className="animate-fade-up">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-600">Account</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-[28px]">
          Profile
        </h1>
        <p className="mt-2 text-sm text-gray-500">Your identity, activity, and account settings.</p>
      </div>

      {/* Identity — teal = "who you are" */}
      <div className="card animate-fade-up mt-6 p-5 sm:p-6" style={{ animationDelay: '80ms' }}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0f766e] text-xl font-semibold text-white shadow-lg shadow-[#14b8a6]/25 sm:h-20 sm:w-20 sm:text-2xl">
            {initial || 'U'}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="truncate text-xl font-semibold tracking-tight text-white">
                {user?.name || 'User'}
              </h2>
              {/* ⚠️ wire to real plan data when you have billing */}
              <span className="rounded-full border border-[#2dd4bf]/25 bg-[#14b8a6]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#2dd4bf]">
                Free plan
              </span>
            </div>
            <p className="mt-1 truncate text-sm text-gray-500">{user?.email || '—'}</p>
            {memberSince && <p className="mt-2 text-xs text-gray-600">Member since {memberSince}</p>}
          </div>
        </div>
      </div>

      {/* Stats — real data from your API */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: 'Saved posts', value: stats.saved, icon: Bookmark },
          { label: 'Threads', value: stats.threads, icon: Layers },
          { label: 'Single posts', value: stats.singles, icon: MessageSquare },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="card animate-fade-up p-4 sm:p-5"
            style={{ animationDelay: `${140 + i * 70}ms` }}
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-600">
                {stat.label}
              </p>
              <stat.icon size={14} className="text-[#2dd4bf]/70" />
            </div>
            <div className="mt-3">
              {statsLoading ? (
                <div className="h-7 w-10 animate-pulse rounded bg-[#1e1e1e]" />
              ) : (
                <span className="tnum text-2xl font-semibold tracking-tight text-white">
                  {stat.value}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Links — orange = "things you can do" */}
      <div
        className="card animate-fade-up mt-4 divide-y divide-[#1c1d1d] overflow-hidden"
        style={{ animationDelay: '360ms' }}
      >
        <Link
          to="/save"
          className="group flex items-center gap-4 p-4 transition-colors hover:bg-white/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ea580c]/60 sm:p-5"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#ea580c]/20 bg-[#ea580c]/10 text-[#f97316]">
            <Bookmark size={16} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-white">Saved posts</span>
            <span className="block text-xs text-gray-500">Everything you've kept for later</span>
          </span>
          <ChevronRight
            size={16}
            className="shrink-0 text-gray-600 transition-all group-hover:translate-x-0.5 group-hover:text-gray-400"
          />
        </Link>

        <Link
          to="/soon"
          className="group flex items-center gap-4 p-4 transition-colors hover:bg-white/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ea580c]/60 sm:p-5"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#ea580c]/20 bg-[#ea580c]/10 text-[#f97316]">
            <Settings size={16} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-white">Account settings</span>
            <span className="block text-xs text-gray-500">Update profile and preferences</span>
          </span>
          <ChevronRight
            size={16}
            className="shrink-0 text-gray-600 transition-all group-hover:translate-x-0.5 group-hover:text-gray-400"
          />
        </Link>
      </div>
    </AppLayout>
  )
} 