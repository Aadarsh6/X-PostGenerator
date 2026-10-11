import { useEffect, useRef } from 'react'
import { Footer } from '@/components/BlockComponent/Footer'
import { HomePage } from '@/components/BlockComponent/Home'
import { NavBar } from '@/components/BlockComponent/NavBar'
import { CTASection } from '@/components/BlockComponent/CTA'
import { HowItWorks } from '@/components/BlockComponent/HowItWorks'
import { TutorialVideo } from '@/components/BlockComponent/TutorialVideo'
import { SocialProof } from '@/components/BlockComponent/SocialProof'
import useLenis from '@/utils/lenis'

/* Thin orange reading-progress bar */
const ScrollProgress = () => {
  const barRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const total = el.scrollHeight - el.clientHeight
      const progress = total > 0 ? el.scrollTop / total : 0
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-[2px]">
      <div
        ref={barRef}
        className="h-full origin-left bg-[#ea580c] shadow-[0_0_12px_rgba(234,88,12,0.7)]"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  )
}

export const LandingPage = () => {
  useLenis()

  return (
    <div className="relative w-full overflow-x-hidden bg-[#0a0a0a]">
      <ScrollProgress />
      <div aria-hidden="true" className="noise" />
      <NavBar />
      <main>
        <HomePage />
        <HowItWorks />
        <SocialProof />
        <TutorialVideo />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}