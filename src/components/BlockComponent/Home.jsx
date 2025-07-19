import  { useReducedMotion }  from "framer-motion";
import { useMemo } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { ArrowRight } from "lucide-react";
import { ShimmerButton } from "../magicui/shimmer-button";
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const HomePage = React.memo(() => {
  const shouldReduceMotion = useReducedMotion();
  
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.3,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  }), [shouldReduceMotion]);

  const itemVariants = useMemo(() => ({
    hidden: { y: shouldReduceMotion ? 0 : 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut" },
    },
  }), [shouldReduceMotion]);

  return (
  <section className="min-h-[60vh] md:min-h-screen w-full relative flex flex-col items-center justify-center antialiased px-4">
      <motion.div 
        className="max-w-2xl mx-auto p-4 relative z-10 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="text-3xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 font-bold tracking-tight leading-tight"
        >
          Stop Guessing. <br /> Start Trending on X.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-neutral-400 max-w-lg mx-auto my-6 text-base md:text-lg"
        >
          Our AI-powered tool helps you create high quality X posts tailored to your tone and style.
        </motion.p>

        <motion.div variants={itemVariants} className="flex justify-center">
            <Link
            to="/signup"
            >
          <ShimmerButton  background="linear-gradient(to right, #f97316, #ea580c)"
    className="shadow-lg shadow-orange-600/30 hover:shadow-xl hover:shadow-orange-700/40 transition-all duration-200">
            Get Started Free
            <ArrowRight size={15} />
          </ShimmerButton>
          </Link>
        </motion.div>
      </motion.div>
      
      <BackgroundBeams />
    </section>
  );
});