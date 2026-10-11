import { useState, useCallback } from 'react'
import { Play } from 'lucide-react'
import { motion } from 'framer-motion'
import React from 'react'

export const TutorialVideo = React.memo(() => {
  const [videoError, setVideoError] = useState(false)

  const handleVideoError = useCallback(() => {
    setVideoError(true)
  }, [])

  return (
    <section id="demo" className="w-full px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center md:mb-14"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#f97316]">
            See it in action
          </p>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl md:text-4xl">
            Watch the{' '}
            <span className="font-serif-accent text-[1.06em] text-[#f97316]">full walkthrough</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-gray-500">
            Two minutes — from blank composer to posted thread.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Ambient glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-6 rounded-[36px] bg-[radial-gradient(ellipse_at_center,rgba(234,88,12,0.14),transparent_70%)] blur-3xl"
          />

          {/* Window frame — matches the hero demo */}
          <div className="card relative overflow-hidden">
            <div className="flex items-center gap-3 border-b border-[#1f2020] px-4 py-3">
              <span className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#262626]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#262626]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#262626]" />
              </span>
              <div className="mx-auto rounded-md border border-[#242424] bg-[#111111] px-2.5 py-1 text-[10px] font-medium text-gray-500">
                XCrafter — walkthrough
              </div>
              <span className="hidden items-center rounded-full border border-[#242424] bg-[#111111] px-2 py-0.5 text-[10px] font-medium text-gray-500 sm:flex">
                Product tour
              </span>
            </div>

            <div className="relative aspect-video bg-[#0d0d0d]">
              {videoError ? (
                <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_center,#141414,#0a0a0a)]">
                  <div className="p-8 text-center">
                    <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-[#ea580c]/20 bg-[#ea580c]/10 text-[#f97316]">
                      <Play size={24} className="ml-1" />
                    </span>
                    <h3 className="text-lg font-semibold tracking-tight text-white">Demo video</h3>
                    <p className="mt-1.5 text-sm text-gray-500">
                      The full walkthrough is coming soon.
                    </p>
                  </div>
                </div>
              ) : (
                <video
                  className="h-full w-full object-cover"
                  controls
                  preload="metadata"
                  onError={handleVideoError}
                  poster="/img.png"
                >
                  <source src="./Xc.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
})

TutorialVideo.displayName = 'TutorialVideo'