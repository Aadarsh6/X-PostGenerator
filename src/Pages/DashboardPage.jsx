import { AppLayout } from '@/components/BlockComponent/AppLayout'
import { Xpost } from '../components/BlockComponent/Xpost'
import { useAuthStore } from '@/store/authStore'

export const DashboardPage = () => {
  const user = useAuthStore((state) => state.user)

  const now = new Date()
  const hour = now.getHours()
  const greeting =
    hour < 5 ? 'Good night' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateLabel = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const displayName = user?.name ?? user?.username ?? user?.email ?? 'there'
  const firstName = displayName.split(' ')[0]

  return (
    <AppLayout crumb="Dashboard">
      <div className="animate-fade-up flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-[28px]">
          {greeting},{' '}
          <span className="font-serif-accent text-[1.08em] text-[#f97316]">{firstName}</span>
        </h1>
        <p className="pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-600">
          {dateLabel}
        </p>
      </div>

      <div className="mt-6 lg:mt-8">
        <Xpost />
      </div>
    </AppLayout>
  )
}