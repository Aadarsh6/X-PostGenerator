import { useReducedMotion, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { ArrowRight, Check, ChevronDown, Loader2, Lock, PenLine } from 'lucide-react'
import { ShimmerButton } from '../magicui/shimmer-button'
import { BorderBeam } from '../magicui/border-beam'
import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const TYPE_OPTIONS = ['Single', 'Thread', 'Long']

const DEMOS = [
  {
    prompt: '5 lessons from shipping my first SaaS',
    typeLabel: 'Thread',
    tone: 'Educational',
    posts: [
      '1. Nobody wants your features. They want their problem gone. Build the painkiller, not the vitamin.',
      '2. Your first 10 users are consultants, not customers. Watch them use it. Fix what hurts.',
    ],
  },
  {
    prompt: 'why most indie products die',
    typeLabel: 'Single',
    tone: 'Controversial',
    posts: [
      "Most indie products don't die from competition. They die from silence — builders too afraid to ship publicly and tell people what they made.",
    ],
  },
  {
    prompt: 'morning routine of a solo founder',
    typeLabel: 'Thread',
    tone: 'Casual',
    posts: [
      "6:30 — coffee before phone. The inbox can wait; the ideas can't.",
      "7:15 — one deep-work block before the world wakes up. That's where the product gets built.",
    ],
  },
]

const scrollToId = (e, id) => {
  e.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

/* ------------------------ self-playing demo window ------------------------ */

const DemoCard = ({ demo, phase, typed }) => (
  <div className="card relative overflow-hidden text-left">
    {/* The beam = "working" signal, exactly like the real app */}
    {phase === 'generating' && (
      <BorderBeam duration={4} size={200} className="from-transparent via-[#ea580c] to-transparent" />
    )}

    {/* Window chrome */}
    <div className="flex items-center gap-3 border-b border-[#1f2020] px-4 py-3">
      <span className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#262626]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#262626]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#262626]" />
      </span>
      <div className="mx-auto flex items-center gap-1.5 rounded-md border border-[#242424] bg-[#111111] px-2.5 py-1 text-[10px] font-medium text-gray-500">
        <Lock size={9} className="text-emerald-500/70" />
        xcrafter.app
      </div>
      <span className="hidden items-center gap-1.5 rounded-full border border-[#242424] bg-[#111111] px-2 py-0.5 text-[10px] font-medium text-gray-500 sm:flex">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
        Live preview
      </span>
    </div>

    {/* Composer body */}
    <div className="p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0f766e] text-[10px] font-semibold text-white">
          A
        </span>
        <p className="min-h-[42px] flex-1 text-[14px] leading-relaxed text-gray-200">
          {phase === 'results' ? demo.prompt : typed}
          {phase === 'typing' && (
            <span className="animate-blink ml-0.5 inline-block h-[15px] w-[2px] translate-y-[2px] bg-[#f97316]" />
          )}
        </p>
      </div>

      {/* Mini toolbar */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg border border-[#242424] bg-[#111111] p-0.5">
          {TYPE_OPTIONS.map((label) => (
            <span
              key={label}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium ${
                label === demo.typeLabel ? 'bg-white/[0.07] text-white' : 'text-gray-600'
              }`}
            >
              {label}
            </span>
          ))}
        </div>
        <span className="rounded-full border border-[#ea580c]/25 bg-[#ea580c]/10 px-2.5 py-1 text-[11px] font-medium text-[#f97316]">
          {demo.tone}
        </span>
        <span className="ml-auto flex h-8 items-center gap-1.5 rounded-lg bg-[#ea580c] px-3 text-[12px] font-semibold text-white">
          {phase === 'generating' ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <PenLine size={12} strokeWidth={2.5} />
          )}
          {phase === 'generating' ? 'Generating…' : 'Generate'}
        </span>
      </div>

      {/* Generated posts */}
      {phase === 'results' && (
        <div className="mt-4 space-y-3.5 border-t border-[#1f2020] pt-4">
          {demo.posts.map((post, i) => (
            <motion.div
              key={`${demo.prompt}-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.18 }}
              className="flex items-start gap-3"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0f766e] text-[10px] font-semibold text-white">
                A
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-white">Aadarsh</span>
                  {demo.posts.length > 1 && (
                    <span className="rounded-full border border-[#242424] bg-[#141414] px-1.5 py-0.5 text-[9px] font-semibold tabular-nums text-gray-500">
                      {i + 1}/{demo.posts.length}
                    </span>
                  )}
                  <span className="ml-auto flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                    <Check size={10} strokeWidth={3} />
                    <span className="tabular-nums">{post.length}/280</span>
                  </span>
                </div>
                <p className="mt-0.5 text-[13px] leading-relaxed text-gray-300">{post}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  </div>
)

/* ---------------------------------- hero ---------------------------------- */

export const HomePage = React.memo(() => {
  const { token } = useAuthStore()
  const shouldReduceMotion = useReducedMotion()

  /* Demo state machine: typing → generating → results → next demo */
  const [demoIndex, setDemoIndex] = useState(0)
  const [phase, setPhase] = useState(shouldReduceMotion ? 'results' : 'typing')
  const [typed, setTyped] = useState('')

  useEffect(() => {
    if (shouldReduceMotion) return

    if (phase === 'typing') {
      const full = DEMOS[demoIndex].prompt
      if (typed.length < full.length) {
        const t = setTimeout(() => setTyped(full.slice(0, typed.length + 1)), 42)
        return () => clearTimeout(t)
      }
      const t = setTimeout(() => setPhase('generating'), 600)
      return () => clearTimeout(t)
    }

    if (phase === 'generating') {
      const t = setTimeout(() => setPhase('results'), 1600)
      return () => clearTimeout(t)
    }

    const t = setTimeout(() => {
      setDemoIndex((i) => (i + 1) % DEMOS.length)
      setTyped('')
      setPhase('typing')
    }, 5200)
    return () => clearTimeout(t)
  }, [phase, typed, demoIndex, shouldReduceMotion])

  const demo = DEMOS[demoIndex]

  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: shouldReduceMotion ? 0 : 0.3,
          delayChildren: shouldReduceMotion ? 0 : 0.1,
        },
      },
    }),
    [shouldReduceMotion],
  )

  const itemVariants = useMemo(
    () => ({
      hidden: { y: shouldReduceMotion ? 0 : 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { duration: shouldReduceMotion ? 0 : 0.6, ease: 'easeOut' },
      },
    }),
    [shouldReduceMotion],
  )

  return (
    <section className="relative flex w-full flex-col items-center overflow-hidden px-4 pb-24 pt-32 antialiased">
      <motion.div
        className="relative z-10 mx-auto w-full max-w-3xl text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Status badge */}
        <motion.div variants={itemVariants}>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#222323] bg-[#111111] px-3.5 py-1.5 text-xs font-medium text-gray-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            XCrafter v1.0 is live
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="mt-6 text-[34px] font-bold leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl lg:text-[76px]"
        >
          Stop guessing.
          <br />
          Start <span className="font-serif-accent text-[1.05em] text-[#f97316]">trending</span>.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-gray-500 sm:text-base md:text-lg"
        >
          Turn rough ideas into X posts and threads that sound like you — six tones, three
          formats, every character counted.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4"
        >
          <Link to={token ? '/dashboard' : '/signup'}>
            <ShimmerButton
              background="linear-gradient(to right, #f97316, #ea580c)"
              className="shadow-lg shadow-orange-600/30 transition-all duration-200 hover:shadow-xl hover:shadow-orange-700/40"
            >
              Get Started Free
              <ArrowRight size={15} />
            </ShimmerButton>
          </Link>

          <a
            href="#how-it-works"
            onClick={(e) => scrollToId(e, 'how-it-works')}
            className="group flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-medium text-gray-400 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#ea580c]/60"
          >
            See how it works
            <ChevronDown
              size={16}
              className="transition-transform duration-200 group-hover:translate-y-0.5"
            />
          </a>
        </motion.div>

        <motion.p variants={itemVariants} className="mt-4 text-xs text-gray-600">
          Free to start · No credit card required
        </motion.p>
      </motion.div>

      {/* Self-playing product demo */}
      <motion.div
        variants={itemVariants}
        className="relative z-10 mx-auto mt-14 w-full max-w-xl sm:mt-16"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-6 rounded-[36px] bg-[radial-gradient(ellipse_at_center,rgba(234,88,12,0.2),transparent_70%)] blur-3xl"
        />
        <DemoCard demo={demo} phase={phase} typed={typed} />
      </motion.div>

      <BackgroundBeams />
    </section>
  )
})