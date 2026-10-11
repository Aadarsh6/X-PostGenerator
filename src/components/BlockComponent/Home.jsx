import { useReducedMotion, motion } from 'framer-motion'
import { useMemo } from 'react'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { ArrowRight } from 'lucide-react'
import { ShimmerButton } from '../magicui/shimmer-button'
import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export const HomePage = React.memo(() => {
  const { token } = useAuthStore()
  const shouldReduceMotion = useReducedMotion()

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
    <section className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-24 antialiased">
      <motion.div
        className="relative z-10 mx-auto w-full max-w-3xl text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="bg-gradient-to-b from-neutral-200 to-neutral-600 bg-clip-text text-balance text-[32px] font-bold leading-[1.12] tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Stop Guessing. <br /> Start Trending on X.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-6 max-w-lg text-sm text-neutral-400 sm:text-base md:text-lg"
        >
          Our AI-powered tool helps you create high quality X posts tailored to your tone and style.
        </motion.p>

        <motion.div variants={itemVariants} className="mt-8 flex justify-center sm:mt-10">
          <Link to={token ? '/dashboard' : 'signup'}>
            <ShimmerButton
              background="linear-gradient(to right, #f97316, #ea580c)"
              className="shadow-lg shadow-orange-600/30 transition-all duration-200 hover:shadow-xl hover:shadow-orange-700/40"
            >
              Get Started Free
              <ArrowRight size={15} />
            </ShimmerButton>
          </Link>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="mt-5 text-xs text-neutral-500"
        >
          Free to start · No credit card required
        </motion.p>
      </motion.div>

      <BackgroundBeams />
    </section>
  )
})