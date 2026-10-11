import { useAuthStore } from '@/store/authStore'
import { ShimmerButton } from '../magicui/shimmer-button'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import React from 'react'
import { Link } from 'react-router-dom'
import { LogoMark } from './Brand'

export const CTASection = React.memo(() => {
  const { token } = useAuthStore()

  return (
    <section className="relative overflow-hidden border-t border-[#1c1c1c] py-24 sm:py-32">
      {/* Giant watermark mark — the closing bookend */}
      <LogoMark
        size="lg"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[12] opacity-[0.04]"
      />

      {/* Center glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(234,88,12,0.12),transparent_65%)] blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl md:text-5xl"
        >
          Your next viral post is{' '}
          <span className="font-serif-accent text-[1.06em] text-[#f97316]">one idea away</span>.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-500 sm:text-base"
        >
          Describe the idea — XCrafter handles the words.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex justify-center"
        >
          <Link to={token ? '/dashboard' : '/signup'}>
            <ShimmerButton
              background="linear-gradient(to right, #f97316, #ea580c)"
              className="shadow-lg shadow-orange-600/25 transition-shadow duration-200 hover:shadow-xl hover:shadow-orange-700/40"
            >
              Start Creating
              <ArrowRight size={15} />
            </ShimmerButton>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-5 text-xs text-gray-600"
        >
          Free to start · No credit card required
        </motion.p>
      </div>
    </section>
  )
})