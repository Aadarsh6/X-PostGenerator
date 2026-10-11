import { motion } from 'framer-motion'
import { Check, Copy, Pencil, Twitter } from 'lucide-react'

const RESULT_POST =
  'Shipping beats perfection. Launch it rough, let real users sand the edges.'

const isMac =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
const MOD = isMac ? '⌘' : 'Ctrl'

/* --------------------- step visuals — fragments of the UI --------------------- */

const IdeaVisual = () => (
  <div className="card p-4 sm:p-5">
    <div className="flex items-start gap-3">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0f766e] text-[10px] font-semibold text-white">
        A
      </span>
      <p className="flex-1 text-[13px] leading-relaxed text-gray-200">
        launching my first product next week — nervous but excited
        <span className="animate-blink ml-0.5 inline-block h-[14px] w-[2px] translate-y-[2px] bg-[#f97316]" />
      </p>
    </div>
    <div className="mt-4 flex items-center gap-2.5 border-t border-[#1f2020] pt-3">
      <span className="kbd">{MOD} ↵</span>
      <span className="text-[11px] text-gray-600">and it writes itself</span>
    </div>
  </div>
)

const ControlsVisual = () => (
  <div className="card space-y-3 p-4 sm:p-5">
    <div className="flex rounded-xl border border-[#242424] bg-[#111111] p-1">
      {['Single', 'Thread', 'Long'].map((label) => (
        <span
          key={label}
          className={`flex-1 rounded-lg py-1.5 text-center text-[11px] font-medium ${
            label === 'Thread' ? 'bg-white/[0.07] text-white' : 'text-gray-600'
          }`}
        >
          {label}
        </span>
      ))}
    </div>
    <div className="flex flex-wrap gap-2">
      {['Professional', 'Humorous', 'Educational', 'Casual'].map((tone) => (
        <span
          key={tone}
          className={`rounded-full px-3 py-1 text-[11px] font-medium ${
            tone === 'Educational'
              ? 'border border-[#ea580c]/40 bg-[#ea580c]/10 text-[#f97316]'
              : 'border border-[#242424] bg-[#141414] text-gray-500'
          }`}
        >
          {tone}
        </span>
      ))}
    </div>
  </div>
)

const ResultVisual = () => (
  <div className="card p-4 sm:p-5">
    <div className="flex items-start gap-3">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0f766e] text-[10px] font-semibold text-white">
        A
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-white">Aadarsh</span>
          <span className="ml-auto flex items-center gap-1 text-[10px] font-medium text-emerald-400">
            <Check size={10} strokeWidth={3} />
            <span className="tabular-nums">{RESULT_POST.length}/280</span>
          </span>
        </div>
        <p className="mt-1 text-[13px] leading-relaxed text-gray-300">{RESULT_POST}</p>
        <div className="mt-3 flex items-center gap-1 border-t border-[#1f2020] pt-2.5">
          {[Copy, Pencil, Twitter].map((Icon, i) => (
            <span key={i} className="grid h-7 w-7 place-items-center rounded-lg text-gray-600">
              <Icon size={13} />
            </span>
          ))}
          <span className="ml-auto flex h-7 items-center rounded-lg bg-[#ea580c] px-3 text-[11px] font-semibold text-white">
            Post to X
          </span>
        </div>
      </div>
    </div>
  </div>
)

/* ---------------------------------- steps ---------------------------------- */

const STEPS = [
  {
    number: '1',
    title: 'Describe your idea',
    description:
      'Type a topic, a thought, or a rough idea. No need to structure it. The AI figures out the rest.',
    Visual: IdeaVisual,
  },
  {
    number: '2',
    title: 'Pick your tone and format',
    description:
      'Choose from 6 tones and 3 formats. Single post, thread, or long thread. Your voice, your style.',
    Visual: ControlsVisual,
  },
  {
    number: '3',
    title: 'Post or save it',
    description:
      'Copy it, post directly to X, or save it for later. Every post is under 280 characters and ready to go.',
    Visual: ResultVisual,
  },
]

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="w-full px-4 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#f97316]">
            How it works
          </p>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl md:text-4xl lg:text-5xl">
            From idea to post in{' '}
            <span className="font-serif-accent text-[1.06em] text-[#f97316]">30 seconds</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-gray-500">
            The whole flow fits in three steps — no learning curve.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative mt-14 space-y-10 md:mt-16 md:space-y-16">
          {/* Rail */}
          <div
            aria-hidden="true"
            className="absolute bottom-6 left-5 top-6 w-px bg-gradient-to-b from-[#ea580c]/50 via-[#2a2a2a] to-transparent"
          />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex gap-5 sm:gap-8"
            >
              {/* Node */}
              <div className="relative z-10 shrink-0">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-[#ea580c]/30 bg-[#0a0a0a] text-sm font-semibold tabular-nums text-[#f97316] shadow-[0_0_20px_rgba(234,88,12,0.2)]">
                  {step.number}
                </span>
              </div>

              {/* Content + visual — alternating sides on desktop */}
              <div className="grid min-w-0 flex-1 gap-5 md:grid-cols-2 md:items-center md:gap-12">
                <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                  <h3 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{step.description}</p>
                </div>
                <div className={i % 2 === 1 ? 'md:order-1' : ''}>
                  <step.Visual />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}