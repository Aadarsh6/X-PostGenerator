import { motion } from 'framer-motion'
import { PenLine, Sliders, Rocket } from 'lucide-react'

const steps = [
  {
    icon: PenLine,
    step: '01',
    title: 'Describe your idea',
    description: 'Type a topic, a thought, or a rough idea. No need to structure it. The AI figures out the rest.',
  },
  {
    icon: Sliders,
    step: '02',
    title: 'Pick your tone and format',
    description: 'Choose from 6 tones and 3 formats. Single post, thread, or long thread. Your voice, your style.',
  },
  {
    icon: Rocket,
    step: '03',
    title: 'Post or save it',
    description: 'Copy it, post directly to X, or save it for later. Every post is under 280 characters and ready to go.',
  },
]

export const HowItWorks = () => {
  return (
    <section className="w-full px-4 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center md:mb-16"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-orange-500">
            How it works
          </p>
          <h2 className="bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl md:text-4xl lg:text-5xl">
            From idea to post in 30 seconds
          </h2>
        </motion.div>

        <div className="relative grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {/* Connector line — only in the 3-column layout */}
          <div className="absolute left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] top-[44px] hidden h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent lg:block" />

          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`relative rounded-2xl border border-neutral-800 bg-[#111111] p-6 transition-all duration-300 hover:border-orange-500/30 ${
                index === 2 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10">
                  <step.icon className="h-5 w-5 text-orange-400" />
                </div>
                <span className="text-2xl font-bold text-neutral-700">{step.step}</span>
              </div>

              <h3 className="mb-2 text-lg font-semibold text-white">{step.title}</h3>
              <p className="text-sm leading-relaxed text-neutral-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}