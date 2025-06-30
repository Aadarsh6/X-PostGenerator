import { BrainCircuit, PenSquare, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react'

export const TextTutorial = () => {

    
const steps = [
  {
    icon: <BrainCircuit size={40} className="text-teal-400" />,
    title: "Analyze Trends",
    description: "Our AI scans X for viral patterns, topics, and formats relevant to your niche."
  },
  {
    icon: <PenSquare size={40} className="text-teal-400" />,
    title: "Generate Drafts",
    description: "Receive AI-crafted post suggestions that are optimized for engagement and reach."
  },
  {
    icon: <TrendingUp size={40} className="text-teal-400" />,
    title: "Post & Grow",
    description: "Publish your content with confidence and watch your profile's visibility soar."
  }
];

// Animation variants for the container and items
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  },
};



  return (
           <section className="py-20 sm:py-32">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-400">
          A Simple 3-Step Process
        </h2>
        <p className="mt-4 text-neutral-400 max-w-xl mx-auto">
          Go from idea to trending post in minutes. Our streamlined workflow makes content creation effortless.
        </p>
        
        {/* Steps Grid */}
        <motion.div 
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="group relative bg-gradient-to-br from-neutral-900/80 to-neutral-950/60 
            border border-neutral-800/50 
            hover:border-purple-500/40 
            transition-colors duration-300 rounded-xl p-8 flex flex-col items-center text-center"
              variants={itemVariants}
            >
              <div className="bg-neutral-950 p-4 rounded-full border border-neutral-700">
                {step.icon}
              </div>
              <h3 className="mt-6 text-xl font-bold text-neutral-100">{step.title}</h3>
              <p className="mt-2 text-neutral-400">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}


