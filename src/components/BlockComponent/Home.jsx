// Fixed NavBar component
export const NavBar = () => {
  return (
    <nav className='fixed top-0 left-0 right-0 bg-[#0a0a0a]/80 shadow-md backdrop-blur-md z-50'>
      <div className='mx-auto flex h-16 max-w-7xl py-4 items-center justify-between px-4 sm:px-6 lg:px-8'>
        <div className='text-2xl font-bold text-orange-600'>
          Xc Craft
        </div>
        <div className='space-x-2 md:space-x-4'>
          <button className='rounded px-4 py-2 font-medium text-blue-600 transition hover:bg-blue-50'>
            Login
          </button>
          <button className='rounded bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700'>
            Sign Up Free
          </button>
        </div>
      </div>
    </nav>
  );
};

// Fixed HomePage component
import { BackgroundBeams } from "@/components/ui/background-beams";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.4,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.98 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <section className="min-h-screen w-full relative flex flex-col items-center justify-center antialiased px-4">
      {/* Content Wrapper */}
      <motion.div 
        className="max-w-2xl mx-auto p-4 relative z-10 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="text-3xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 font-bold tracking-tighter leading-tight"
        >
          Stop Guessing. <br /> Start Trending on X.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-neutral-400 max-w-lg mx-auto my-6 text-base md:text-md"
        >
          Our AI-powered platform analyzes viral trends and helps you craft engaging posts that capture attention. Ditch the writer's block and unlock explosive growth for your profile.
        </motion.p>
        
        <motion.button
          variants={itemVariants}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-100 transform hover:scale-105"
        >
          Get Started Free
          <ArrowRight size={16} />
        </motion.button>
      </motion.div>
      
      <BackgroundBeams />
    </section>
  );
}
