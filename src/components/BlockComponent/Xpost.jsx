import { useEffect, useRef, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import {
  AlertCircle, Check, Copy, Loader2, PenLine, Plus, RefreshCw, Save, Sparkles, Twitter,
} from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { BorderBeam } from '../magicui/border-beam'
import { useNavigate } from 'react-router-dom'
import { api } from '@/services/api'
import { postToTwitter, createThreadContent } from '@/utils/twitterUtils'
import { PostCard } from './PostCard'

const isMac =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
const MOD = isMac ? '⌘' : 'Ctrl'

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'humorous', label: 'Humorous' },
  { value: 'educational', label: 'Educational' },
  { value: 'controversial', label: 'Controversial' },
  { value: 'casual', label: 'Casual' },
  { value: 'inspirational', label: 'Inspirational' },
]

const POST_TYPES = [
  { value: 'single', label: 'Single Post', short: 'Single', hint: 'One standalone post' },
  { value: 'thread', label: 'Thread (2–5 posts)', short: 'Thread', hint: 'A thread of 2–5 posts' },
  { value: 'long-thread', label: 'Long Thread (6–10 posts)', short: 'Long', hint: 'A deep-dive thread of 6–10 posts' },
]

export const Xpost = () => {
  const [prompt, setPrompt] = useState('')
  const [postType, setPostType] = useState('single')
  const [tone, setTone] = useState('educational')
  const [generating, setGenerating] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [generatedPost, setGeneratedPost] = useState([])
  const [error, setError] = useState('')
  const [copiedId, setCopiedId] = useState(null)
  const [allCopied, setAllCopied] = useState(false)
  const [backendStatus, setBackendStatus] = useState(null)
  const [editingPostId, setEditingPostId] = useState(null)
  const [editingContent, setEditingContent] = useState('')
  const [postingToTwitter, setPostingToTwitter] = useState(false)
  const [savedThreadId, setSavedThreadId] = useState(null)
  const [saving, setSaving] = useState(false)

  const textareaRef = useRef(null)
  const resultsRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.checkHealth().then(setBackendStatus)
  }, [])

  const recheckBackend = () => {
    setBackendStatus(null)
    api.checkHealth().then(setBackendStatus)
  }

  const backendOk = backendStatus?.status === 'OK'
  const activeTypeIndex = POST_TYPES.findIndex((t) => t.value === postType)
  const isThread = postType !== 'single'

  /* Auto-grow the prompt textarea */
  const autoGrow = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.max(el.scrollHeight, 110)}px`
  }

  /* ⌘/Ctrl + Enter generates */
  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      if (prompt.trim() && !generating && backendOk) generateXpost()
    }
  }

  const generateXpost = async (isRegenerate = false) => {
    setGenerating(true)
    if (isRegenerate) setRegenerating(true)
    setSavedThreadId(null)
    setAllCopied(false)
    setError('')
    try {
      const response = await api.generatePost(prompt.trim(), tone, postType)
      if (response.success && response.posts) {
        setGeneratedPost(
          response.posts.map((post, index) => ({
            id: post.id || `temp-${index}-${Date.now()}`,
            content: post.content,
            characterCount: post.characterCount,
            withinLimit: post.withinLimit,
            threadId: post.threadId,
            postNumber: post.postNumber,
          })),
        )
        setTimeout(
          () => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
          100,
        )
      } else {
        throw new Error(response.error || 'Failed to generate post')
      }
    } catch (err) {
      setError(err.message || 'Failed to generate post. Please check your connection.')
    } finally {
      setGenerating(false)
      setRegenerating(false)
    }
  }

  const copyToClipboard = async (text, postId) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(postId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      setError('Failed to copy text to clipboard')
    }
  }

  const handleCopyAll = async () => {
    const text = isThread
      ? generatedPost.map((p) => p.content).join('\n\n')
      : generatedPost[0].content
    try {
      await navigator.clipboard.writeText(text)
      setAllCopied(true)
      setTimeout(() => setAllCopied(false), 2000)
    } catch {
      setError('Failed to copy text to clipboard')
    }
  }

  const handleNewPost = () => {
    setPrompt('')
    setGeneratedPost([])
    setError('')
    setSavedThreadId(null)
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => textareaRef.current?.focus(), 150)
  }

  const handleEdit = (postId, currentContent) => {
    setEditingPostId(postId)
    setEditingContent(currentContent)
  }

  const saveEditPost = (postId) => {
    const trimmed = editingContent.trim()
    if (!trimmed) {
      setError('Post content cannot be empty')
      return
    }
    setGeneratedPost((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              content: trimmed,
              characterCount: trimmed.length,
              withinLimit: trimmed.length <= 280,
            }
          : post,
      ),
    )
    setEditingPostId(null)
    setEditingContent('')
    setError('')
  }

  const cancelEdit = () => {
    setEditingPostId(null)
    setEditingContent('')
  }

  const handleKeyEdit = (e, postId) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      saveEditPost(postId)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      cancelEdit()
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await api.saveThread(generatedPost, postType, tone)
      setSavedThreadId(true)
      toast.success('Saved to your library', { description: 'Find it under Saved anytime.' })
    } catch (err) {
      console.log(err)
      toast.error('Failed to save', { description: 'Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const handlePostToTwitter = async () => {
    setPostingToTwitter(true)
    try {
      const content = isThread ? createThreadContent(generatedPost) : generatedPost[0].content
      postToTwitter(content)
      toast.success('Opening X!', { description: 'Compose window opened.' })
    } catch {
      toast.error('Failed to open X. Please try again.')
    } finally {
      setPostingToTwitter(false)
    }
  }

  return (
    <div className="w-full">
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
            actionButton: 'bg-[#f97316] text-white hover:bg-[#ea580c] rounded-lg',
            cancelButton: 'bg-[#1a1a1a] text-zinc-300 hover:bg-[#252525] rounded-lg',
          },
          duration: 3500,
        }}
      />

      {/* ------------------------------ Composer ------------------------------ */}
      <div className="card animate-fade-up relative overflow-hidden transition-colors duration-300 focus-within:border-[#ea580c]/40">
        {/* The beam only animates while working — it's a status signal, not decoration */}
        {generating && (
          <BorderBeam duration={5} size={280} className="from-transparent via-[#ea580c] to-transparent" />
        )}

        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#ea580c]/20 bg-[#ea580c]/10 text-[#f97316]">
              <PenLine size={16} strokeWidth={2} />
            </span>
            <div>
              <h2 className="text-[15px] font-semibold tracking-tight text-white">Craft a new post</h2>
              <p className="text-xs text-gray-500">Describe your idea — the AI does the writing.</p>
            </div>
          </div>

          {backendStatus && (
            <button
              onClick={recheckBackend}
              title="Click to recheck connection"
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#242424] bg-[#111111] px-2.5 py-1 text-[11px] font-medium text-gray-500 transition-colors hover:text-gray-300"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${backendOk ? 'bg-emerald-500' : 'bg-red-500'}`}
              />
              {backendOk ? 'Connected' : 'Offline'}
            </button>
          )}
        </div>

        {/* Prompt */}
        <div className="px-4 pb-4 pt-3 sm:px-5">
          {error && (
            <div className="mb-3 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span className="text-sm text-red-400">{error}</span>
            </div>
          )}

          <Textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value)
              autoGrow()
            }}
            onKeyDown={handleKeyDown}
            placeholder={`What's the idea? e.g. "5 lessons from shipping my first SaaS"`}
            className="min-h-[110px] w-full resize-none border-none bg-transparent p-0 text-[15px] leading-relaxed text-gray-200 placeholder:text-gray-600 focus-visible:!ring-0"
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-t border-[#1f2020] px-4 py-3 sm:gap-3 sm:px-5">
          {/* Post type — segmented control with sliding indicator */}
          <div
            className="relative flex min-w-[190px] flex-1 rounded-xl border border-[#242424] bg-[#111111] p-1"
            role="group"
            aria-label="Post type"
          >
            <span
              aria-hidden="true"
              className="absolute bottom-1 top-1 rounded-lg bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-200 ease-out"
              style={{
                left: `calc(4px + (100% - 8px) * ${activeTypeIndex / POST_TYPES.length})`,
                width: `calc((100% - 8px) / ${POST_TYPES.length})`,
              }}
            />
            {POST_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                title={type.hint}
                onClick={() => setPostType(type.value)}
                className={`relative z-10 flex-1 rounded-lg py-2 text-xs font-medium outline-none transition-colors duration-200 focus-visible:ring-1 focus-visible:ring-[#ea580c]/60 sm:text-[13px] ${
                  postType === type.value ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {type.short}
              </button>
            ))}
          </div>

          {/* Tone */}
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger
              aria-label="Tone"
              className="h-10 w-[148px] rounded-xl bg-[#111111] text-[13px] font-medium text-gray-300 shadow-[0_0_0_1px_#242424] transition-shadow hover:shadow-[0_0_0_1px_#3a3a3a] focus:ring-2 focus:ring-[#ea580c]/50"
            >
              <SelectValue placeholder="Tone" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-[#2a2a2a] bg-[#181818] text-gray-300">
              {TONES.map((t) => (
                <SelectItem
                  key={t.value}
                  value={t.value}
                  className="cursor-pointer rounded-lg text-[13px] focus:bg-[#ea580c]/10 focus:text-white data-[highlighted]:bg-[#ea580c]/10 data-[highlighted]:text-white"
                >
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Generate */}
          <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
            <span className="kbd hidden sm:inline-flex">
              {MOD} ↵
            </span>
            <button
              onClick={() => generateXpost()}
              disabled={!prompt.trim() || generating || !backendOk}
              className="btn-primary flex h-10 flex-1 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white outline-none transition-all focus-visible:ring-2 focus-visible:ring-[#ea580c]/60 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none sm:flex-none"
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {generating
                ? 'Generating…'
                : backendStatus === null
                  ? 'Connecting…'
                  : !backendOk
                    ? 'Offline'
                    : 'Generate'}
            </button>
          </div>
        </div>
      </div>

      {/* Shimmer while working */}
      {generating && (
        <div className="mt-4" aria-live="polite" aria-busy="true">
          <div className="card animate-fade-up p-5">
            <div className="flex items-center gap-3">
              <Loader2 className="h-4 w-4 animate-spin text-[#f97316]" />
              <p className="text-sm font-medium text-gray-400">
                Crafting your {isThread ? 'thread' : 'post'}…
              </p>
            </div>
            <div className="mt-4 space-y-2.5">
              <div className="h-3 w-3/4 animate-pulse rounded-full bg-[#1c1c1c]" />
              <div className="h-3 w-full animate-pulse rounded-full bg-[#1c1c1c]" />
              <div className="h-3 w-5/6 animate-pulse rounded-full bg-[#1c1c1c]" />
              <div className="h-3 w-2/3 animate-pulse rounded-full bg-[#1c1c1c]" />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------ Results ------------------------------ */}
      {generatedPost.length > 0 && (
        <section ref={resultsRef} className="mt-8 scroll-mt-[88px]">
          {/* Sticky action toolbar — follows you through long threads */}
          <div className="sticky top-[72px] z-20">
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#1f2020] bg-[#0e0e0e]/90 px-3 py-2.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:px-4">
              <div className="mr-auto flex items-center gap-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#ea580c]/20 bg-[#ea580c]/10 text-[#f97316]">
                  <Sparkles size={14} />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold tracking-tight text-white">
                    {isThread ? 'Generated thread' : 'Generated post'}
                  </p>
                  <p className="truncate text-[11px] capitalize text-gray-500">
                    {tone} · {isThread ? `${generatedPost.length} posts` : '1 post'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {/* Copy all */}
                <button
                  onClick={handleCopyAll}
                  className={`flex h-9 items-center gap-2 rounded-lg px-3 text-[13px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#ea580c]/60 ${
                    allCopied
                      ? 'text-emerald-400'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {allCopied ? <Check size={15} /> : <Copy size={15} />}
                  <span className="hidden sm:inline">{allCopied ? 'Copied' : 'Copy all'}</span>
                </button>

                {/* Regenerate */}
                <button
                  onClick={() => generateXpost(true)}
                  disabled={regenerating || !backendOk}
                  className="flex h-9 items-center gap-2 rounded-lg px-3 text-[13px] font-medium text-gray-400 outline-none transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-[#ea580c]/60 disabled:opacity-40"
                >
                  <RefreshCw size={15} className={regenerating ? 'animate-spin' : ''} />
                  <span className="hidden sm:inline">
                    {regenerating ? 'Regenerating…' : 'Regenerate'}
                  </span>
                </button>

                {/* Save */}
                <button
                  onClick={handleSave}
                  disabled={!!savedThreadId || saving}
                  className={`flex h-9 items-center gap-2 rounded-lg px-3 text-[13px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#ea580c]/60 disabled:cursor-default ${
                    savedThreadId
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-[#ea580c]/10 text-[#f97316] hover:bg-[#ea580c]/20'
                  }`}
                >
                  {saving ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : savedThreadId ? (
                    <Check size={15} />
                  ) : (
                    <Save size={15} />
                  )}
                  <span className="hidden sm:inline">
                    {saving ? 'Saving…' : savedThreadId ? 'Saved' : isThread ? 'Save thread' : 'Save post'}
                  </span>
                </button>

                {savedThreadId && (
                  <button
                    onClick={() => navigate('/save')}
                    className="text-[12px] font-medium text-[#f97316] underline underline-offset-4 outline-none transition-colors hover:text-[#fb923c] focus-visible:ring-2 focus-visible:ring-[#ea580c]/60"
                  >
                    View saved →
                  </button>
                )}

                {/* Post to X */}
                <button
                  onClick={handlePostToTwitter}
                  disabled={postingToTwitter}
                  className="btn-primary flex h-9 items-center gap-2 rounded-lg px-4 text-[13px] font-semibold text-white outline-none transition-all focus-visible:ring-2 focus-visible:ring-[#ea580c]/60 disabled:opacity-40 disabled:shadow-none"
                >
                  {postingToTwitter ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Twitter size={15} />
                  )}
                  <span className="hidden sm:inline">{postingToTwitter ? 'Opening…' : 'Post to X'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Thread posts */}
          <div className="mt-4 space-y-4">
            {generatedPost.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                index={index}
                total={generatedPost.length}
                isLast={index === generatedPost.length - 1}
                postType={postType}
                editingPostId={editingPostId}
                editingContent={editingContent}
                setEditingContent={setEditingContent}
                copiedId={copiedId}
                onCopy={copyToClipboard}
                onEdit={handleEdit}
                onSaveEdit={saveEditPost}
                onCancelEdit={cancelEdit}
                onKeyEdit={handleKeyEdit}
                onPostToTwitter={(content) => {
                  postToTwitter(content)
                  toast.success('Opening X!', { description: 'Compose window opened.' })
                }}
              />
            ))}
          </div>

          {/* Start over */}
          <div className="pt-4 text-center">
            <button
              onClick={handleNewPost}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-medium text-gray-500 outline-none transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-[#ea580c]/60"
            >
              <Plus size={15} />
              Start a new post
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

export default Xpost