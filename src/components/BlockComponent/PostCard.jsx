import { AlertTriangle, Check, Copy, Pencil, Twitter } from 'lucide-react'
import { Textarea } from '../ui/textarea'
import { useAvatar } from './Context/avatarContext'
import { useAuthStore } from '@/store/authStore'

export const PostCard = ({
  post,
  index,
  total,
  isLast,
  postType,
  editingPostId,
  editingContent,
  setEditingContent,
  copiedId,
  onCopy,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onKeyEdit,
  onPostToTwitter,
}) => {
  const { initial } = useAvatar()
  const user = useAuthStore((state) => state.user)

  const isEditing = editingPostId === post.id
  const isThread = postType !== 'single'
  const number = post.postNumber || index + 1
  const isCopied = copiedId === post.id
  const overLimit = post.characterCount > 280 || post.withinLimit === false

  const name = user?.name || user?.username || user?.email?.split('@')[0] || 'You'
  const handle = user?.username ? `@${user.username}` : '@you'

  return (
    <article
      className="card animate-fade-up p-4 transition-colors duration-200 hover:border-[#2c2c2c]"
      style={{ animationDelay: `${Math.min(index * 60, 360)}ms` }}
    >
      <div className="flex gap-3.5">
        {/* Avatar + thread connector */}
        <div className="relative shrink-0">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#f06414] to-[#c2410c] text-xs font-semibold text-white shadow-md shadow-[#ea580c]/20">
            {initial || 'U'}
          </div>
          {isThread && !isLast && (
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-[52px] bottom-[-32px] w-px -translate-x-1/2 bg-[#262626]"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-semibold text-white">{name}</span>
            <span className="text-[13px] text-gray-600">{handle}</span>
            {isThread && (
              <span className="ml-auto rounded-full border border-[#242424] bg-[#141414] px-2 py-0.5 text-[10px] font-semibold tabular-nums text-gray-500">
                {number}/{total}
              </span>
            )}
          </div>

          {/* Content / editing */}
          {isEditing ? (
            <div className="mt-2">
              <Textarea
                autoFocus
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                onKeyDown={(e) => onKeyEdit(e, post.id)}
                className="min-h-[96px] w-full resize-none rounded-xl border border-[#2c2c2c] bg-[#0f0f0f] p-3 text-[15px] leading-relaxed text-gray-200 focus-visible:ring-2 focus-visible:ring-[#ea580c]/50"
              />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={`text-xs tabular-nums ${
                    editingContent.length > 280 ? 'text-red-400' : 'text-gray-600'
                  }`}
                >
                  {editingContent.length}/280
                </span>
                <span className="hidden text-[11px] text-gray-600 sm:inline">
                  Ctrl+Enter to save · Esc to cancel
                </span>
                <div className="ml-auto flex gap-2">
                  <button
                    onClick={onCancelEdit}
                    className="h-8 rounded-lg px-3 text-[13px] font-medium text-gray-400 outline-none transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-[#ea580c]/60"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => onSaveEdit(post.id)}
                    className="flex h-8 items-center gap-1.5 rounded-lg bg-[#ea580c]/15 px-3 text-[13px] font-semibold text-[#f97316] outline-none transition-colors hover:bg-[#ea580c]/25 focus-visible:ring-2 focus-visible:ring-[#ea580c]/60"
                  >
                    <Check size={14} />
                    Save
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-1 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-gray-200">
                {post.content}
              </p>
              {overLimit && (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-400">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  {post.characterCount}/280 — over the limit
                </p>
              )}
            </>
          )}

          {/* Actions */}
          {!isEditing && (
            <div className="mt-3 flex items-center gap-1">
              <button
                onClick={() => onCopy(post.content, post.id)}
                title={isCopied ? 'Copied' : 'Copy'}
                className={`flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#ea580c]/60 ${
                  isCopied ? 'text-emerald-400' : 'text-gray-600 hover:bg-white/5 hover:text-white'
                }`}
              >
                {isCopied ? <Check size={14} /> : <Copy size={14} />}
                {isCopied && <span>Copied</span>}
              </button>

              <button
                onClick={() => onEdit(post.id, post.content)}
                title="Edit"
                className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-gray-600 outline-none transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-[#ea580c]/60"
              >
                <Pencil size={14} />
              </button>

              <button
                onClick={() => onPostToTwitter(post.content)}
                title="Open in X"
                className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-gray-600 outline-none transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-[#ea580c]/60"
              >
                <Twitter size={14} />
              </button>

              <span className="ml-auto text-[11px] tabular-nums text-gray-700">
                {post.characterCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default PostCard