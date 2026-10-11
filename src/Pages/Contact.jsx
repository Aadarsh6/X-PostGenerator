import { NavBar } from '@/components/BlockComponent/NavBar'
import { Footer } from '@/components/BlockComponent/Footer'
import { ChevronRight, Mail, Twitter } from 'lucide-react'
import { motion } from 'framer-motion'

const CHANNELS = [
  {
    icon: Twitter,
    href: 'https://twitter.com/Aadarsh_MM',
    title: 'X (Twitter)',
    value: '@Aadarsh_MM',
    hint: 'Fastest — DMs are open',
    external: true,
  },
  {
    icon: Mail,
    href: 'mailto:aadarshakmishra16@gmail.com',
    title: 'Email',
    value: 'aadarshakmishra16@gmail.com',
    hint: 'Best for detailed feedback',
    external: false,
  },
]

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] antialiased">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="dot-grid pointer-events-none fixed inset-0"
        style={{
          WebkitMaskImage: 'radial-gradient(ellipse 70% 45% at 50% 25%, black, transparent 75%)',
          maskImage: 'radial-gradient(ellipse 70% 45% at 50% 25%, black, transparent 75%)',
        }}
      />
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 flex justify-center">
        <div className="glow-blob h-[340px] w-[560px] rounded-full opacity-30 blur-3xl" />
      </div>
      <div aria-hidden="true" className="noise" />

      <NavBar />

      <main className="relative z-10 mx-auto max-w-md px-4 pb-20 pt-32 sm:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-600">
            Get in touch
          </p>
          <h1 className="mt-2.5 text-[28px] font-semibold tracking-[-0.03em] text-white sm:text-[32px]">
            Let's <span className="font-serif-accent text-[1.08em] text-[#f97316]">talk</span>.
          </h1>
          <p className="mx-auto mt-2.5 max-w-sm text-sm leading-relaxed text-gray-500">
            Feedback, bugs, or just a hello — it goes straight to the person who builds XCrafter.
          </p>
        </motion.div>

        <div className="mt-10 flex flex-col gap-3">
          {CHANNELS.map((channel, i) => (
            <motion.a
              key={channel.title}
              href={channel.href}
              target={channel.external ? '_blank' : undefined}
              rel={channel.external ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 + i * 0.08 }}
              className="card group flex items-center gap-4 p-4 outline-none transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2c2c2c] focus-visible:ring-2 focus-visible:ring-[#ea580c]/60 sm:p-5"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#ea580c]/20 bg-[#ea580c]/10 text-[#f97316]">
                <channel.icon size={17} strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1 text-left">
                <span className="block text-sm font-semibold text-white">{channel.title}</span>
                <span className="block truncate text-[13px] text-gray-400">{channel.value}</span>
                <span className="mt-0.5 block text-[11px] text-gray-600">{channel.hint}</span>
              </span>
              <ChevronRight
                size={16}
                className="shrink-0 text-gray-600 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-gray-300"
              />
            </motion.a>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.4 }}
          className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-600"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Usually replies within 24 hours
        </motion.p>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}