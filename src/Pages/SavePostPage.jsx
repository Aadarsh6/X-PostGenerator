import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle, Bookmark, CalendarDays, Check, Copy, Loader2, Trash2, X,
} from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { AppLayout } from '@/components/BlockComponent/AppLayout'
import { useAvatar } from '@/components/BlockComponent/Context/avatarContext'
import { useAuthStore } from '@/store/authStore'
import { api } from '@/services/api'

/* --------------------------------- modal ---------------------------------- */

const ThreadModal = ({ thread, onClose }) => {
  const { initial } = useAvatar()
  const { user } = useAuthStore()
  const closeRef = useRef(null)
  const [copied, setCopied] = useState(false)

  const name = user?.name || user?.username || user?.email?.split('@')[0] || 'You'
  const isThread = thread.posts.length > 1

  useEffect(() => {
    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(thread.posts.map((p) => p.content).join('\n\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  const savedDate = new Date(thread.posts[0].createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="animate-fade-in absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={isThread ? 'Saved thread' : 'Saved post'}
        className="animate-pop-in relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#2c2c2c] bg-[#141414] shadow-[0_32px_90px_-12px_rgba(0,0,0,0.9)]"
      >
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[#222323] px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-[15px] font-semibold tracking-tight text-white">
              {isThread ? 'Saved thread' : 'Saved post'}
            </h2>
            <p className="mt-0.5 text-xs text-gray-500">
              {thread.posts.length} {thread.posts.length > 1 ? 'posts' : 'post'} · saved {savedDate}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={handleCopy}
              className={`flex h-9 items-center gap-2 rounded-lg px-3 text-[13px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#ea580c]/60 ${
                copied ? 'text-emerald-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              ref={closeRef}
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 outline-none transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Posts — styled like the generated thread for consistency */}
        <div className="overflow-y-auto p-5">
          <div className="space-y-4">
            {thread.posts.map((post, index) => (
              <div
                key={post.id ?? index}
                className="animate-fade-up flex gap-3.5"
                style={{ animationDelay: `${Math.min(index * 60, 300)}ms` }}
              >
                <div className="relative shrink-0">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0f766e] text-xs font-semibold text-white">
                    {initial || 'U'}
                  </div>
                  {isThread && index < thread.posts.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 top-9 bottom-[-16px] w-px -translate-x-1/2 bg-[#262626]"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold text-white">{name}</span>
                    {isThread && (
                      <span className="ml-auto rounded-full border border-[#242424] bg-[#141414] px-2 py-0.5 text-[10px] font-semibold tabular-nums text-gray-500">
                        {index + 1}/{thread.posts.length}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-gray-200">
                    {post.content}
                  </p>

                  <p className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-600">
                    <CalendarDays size={12} />
                    {new Date(post.createdAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* --------------------------------- cards ---------------------------------- */

const ThreadCard = ({ thread, index, onClick, onDelete, isDeleting }) => {
  const firstPost = thread.posts[0]
  const postCount = thread.posts.length
  const isThread = postCount > 1
  const snippet = firstPost.content.slice(0, 140) + (firstPost.content.length > 140 ? '…' : '')
  const savedDate = new Date(firstPost.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Open saved ${isThread ? 'thread' : 'post'}`}
      onClick={isDeleting ? undefined : onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !isDeleting) onClick()
      }}
      style={{ animationDelay: `${Math.min(index * 60, 360)}ms` }}
      className="card animate-fade-up group cursor-pointer p-4 outline-none transition-all duration-200 hover:border-[#2c2c2c] focus-visible:ring-2 focus-visible:ring-[#ea580c]/60"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full border border-[#242424] bg-[#141414] px-2.5 py-1 text-[11px] font-medium text-gray-400">
          {isThread ? `Thread · ${postCount} posts` : 'Single post'}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation()
            if (!isDeleting) onDelete(thread.threadID)
          }}
          disabled={isDeleting}
          title="Delete"
          aria-label="Delete"
          className="rounded-lg p-1.5 text-gray-600 outline-none transition-colors hover:bg-red-500/10 hover:text-red-400 focus-visible:ring-2 focus-visible:ring-red-500/40 disabled:opacity-40"
        >
          {isDeleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
        </button>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-gray-300">{snippet}</p>

      <div className="mt-4 flex items-center justify-between border-t border-[#1c1d1d] pt-3 text-[11px] text-gray-600">
        <span>Saved {savedDate}</span>
        <span className="font-semibold text-[#f97316] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Open →
        </span>
      </div>
    </article>
  )
}

/* --------------------------------- states --------------------------------- */

const SavedSkeleton = () => (
  <>
    <div className="animate-fade-up">
      <div className="h-3 w-24 animate-pulse rounded bg-[#1c1c1c]" />
      <div className="mt-3 h-8 w-56 animate-pulse rounded bg-[#1c1c1c]" />
    </div>

    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card animate-fade-up p-4" style={{ animationDelay: `${i * 70}ms` }}>
          <div className="h-6 w-28 animate-pulse rounded-full bg-[#1c1c1c]" />
          <div className="mt-4 h-3.5 w-full animate-pulse rounded bg-[#1c1c1c]" />
          <div className="mt-2.5 h-3.5 w-5/6 animate-pulse rounded bg-[#1c1c1c]" />
          <div className="mt-2.5 h-3.5 w-2/3 animate-pulse rounded bg-[#1c1c1c]" />
          <div className="mt-5 h-3 w-24 animate-pulse rounded bg-[#1c1c1c]" />
        </div>
      ))}
    </div>
  </>
)

const EmptyState = () => (
  <div className="card animate-fade-up mx-auto mt-16 max-w-md p-8 text-center sm:p-10">
    <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-[#ea580c]/20 bg-[#ea580c]/10 text-[#f97316]">
      <Bookmark size={20} />
    </span>
    <h2 className="mt-4 text-lg font-semibold tracking-tight text-white">Nothing saved yet</h2>
    <p className="mt-2 text-sm leading-relaxed text-gray-500">
      Generate a post and hit Save — everything you keep lives here.
    </p>
    <Link
      to="/dashboard"
      className="btn-primary mt-6 inline-flex h-10 items-center rounded-xl px-5 text-sm font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c]/60"
    >
      Create your first post
    </Link>
  </div>
)

const ErrorState = ({ message, onRetry }) => (
  <div className="card animate-fade-up mx-auto mt-16 max-w-md p-8 text-center sm:p-10">
    <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
      <AlertTriangle size={20} />
    </span>
    <h2 className="mt-4 text-lg font-semibold tracking-tight text-white">Couldn't load your library</h2>
    <p className="mt-2 text-sm text-gray-500">{message}</p>
    <button
      onClick={onRetry}
      className="mt-6 inline-flex h-10 items-center rounded-xl border border-[#ea580c]/40 bg-[#ea580c]/10 px-5 text-sm font-semibold text-[#f97316] outline-none transition-colors hover:bg-[#ea580c]/20 focus-visible:ring-2 focus-visible:ring-[#ea580c]/60"
    >
      Try again
    </button>
  </div>
)

/* ---------------------------------- page ---------------------------------- */

const SavePostPage = () => {
  const [savedPost, setSavedPost] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [deletingThreads, setDeletingThreads] = useState(new Set())
  const [selectedThread, setSelectedThread] = useState(null)

  const getSavedPost = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const result = await api.getPosts()
      const threads = Array.isArray(result?.threads) ? result.threads : []
      const normalized = threads
        .map((posts) => ({
          threadID: posts[0]?.threadId ?? posts[0]?.id,
          posts,
        }))
        .filter((t) => t.threadID && t.posts?.length)
        .sort((a, b) => new Date(b.posts[0].createdAt) - new Date(a.posts[0].createdAt))
      setSavedPost(normalized)
    } catch (e) {
      console.error('Cannot get saved posts:', e)
      setLoadError('Failed to load saved posts. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    getSavedPost()
  }, [getSavedPost])

  /* Optimistic delete — restored + toast on failure */
  const handleDelete = async (threadID) => {
    const threadToDelete = savedPost.find((t) => t.threadID === threadID)
    if (!threadToDelete) return

    setDeletingThreads((prev) => new Set([...prev, threadID]))
    setSavedPost((prev) => prev.filter((t) => t.threadID !== threadID))
    if (selectedThread?.threadID === threadID) setSelectedThread(null)

    try {
      const isSingle = threadToDelete.posts.length === 1 && !threadToDelete.posts[0].threadId
      if (isSingle) {
        await api.deletePost(threadToDelete.posts[0].id)
      } else {
        await api.deleteThread(threadID)
      }
      toast.success('Deleted', { description: 'Removed from your saved posts.' })
    } catch (error) {
      console.error('Error deleting post:', error)
      setSavedPost((prev) =>
        [...prev, threadToDelete].sort(
          (a, b) => new Date(b.posts[0].createdAt) - new Date(a.posts[0].createdAt),
        ),
      )
      toast.error('Failed to delete', { description: 'Please try again.' })
    } finally {
      setDeletingThreads((prev) => {
        const next = new Set(prev)
        next.delete(threadID)
        return next
      })
    }
  }

  return (
    <AppLayout crumb="Saved" wide>
      {/* ⚠️ Keep exactly ONE <Toaster> in the whole app (ideally in App.jsx).
          Delete this one once you've moved it there, or toasts will double up. */}
      <Toaster
        position="bottom-right"
        richColors
        theme="dark"
        toastOptions={{
          classNames: {
            toast:
              'bg-[#111111]/95 backdrop-blur-md text-zinc-100 border border-[#262626] shadow-[0_10px_30px_rgba(0,0,0,0.45)] rounded-2xl',
            title: 'text-zinc-100 text-[15px] font-medium',
            description: 'text-zinc-400 text-sm',
            success: '!border-orange-500/35 !text-orange-100',
            error: '!border-red-500/30 !text-red-100',
          },
          duration: 3500,
        }}
      />

      {loading ? (
        <SavedSkeleton />
      ) : loadError ? (
        <ErrorState message={loadError} onRetry={getSavedPost} />
      ) : savedPost.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="animate-fade-up flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-600">
                Library
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-[28px]">
                Saved posts
              </h1>
              <p className="mt-2 text-sm text-gray-500">Threads and posts you've kept for later.</p>
            </div>
            <p className="pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-600">
              {savedPost.length} {savedPost.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedPost.map((thread, index) => (
              <ThreadCard
                key={thread.threadID}
                thread={thread}
                index={index}
                onClick={() => setSelectedThread(thread)}
                onDelete={handleDelete}
                isDeleting={deletingThreads.has(thread.threadID)}
              />
            ))}
          </div>
        </>
      )}

      {selectedThread && (
        <ThreadModal thread={selectedThread} onClose={() => setSelectedThread(null)} />
      )}
    </AppLayout>
  )
}

export default SavePostPage