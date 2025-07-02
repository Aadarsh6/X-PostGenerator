import { BrainCircuit, PenSquare, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useState, useEffect, useMemo } from "react";
import React from "react";
import { cn } from "@/lib/utils";

const samplePost = "Big news! 🚀 We just dropped a brand new analytics feature. It's a game-changer for understanding your audience. Go check it out and let us know what you think!";

export const TextTutorial = React.memo(() => {
  const shouldReduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);
  const [typedText, setTypedText] = useState('');

  const steps = useMemo(() => [
    {
      icon: <BrainCircuit size={32} />,
      title: "Analyze Trends",
      description: "Our AI scans for viral patterns, topics, and formats relevant to your niche."
    },
    {
      icon: <PenSquare size={32} />,
      title: "Generate Drafts",
      description: "Receive AI-crafted post suggestions that are optimized for engagement and reach."
    },
    {
      icon: <TrendingUp size={32} />,
      title: "Post & Grow",
      description: "Publish your content with confidence and watch your profile's visibility soar."
    }
  ], []);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const cycleInterval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(cycleInterval);
  }, [steps.length, shouldReduceMotion]);

  useEffect(() => {
    setTypedText('');
    if (activeStep === 1) {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < samplePost.length) {
          setTypedText(prev => prev + samplePost.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, 50);
      return () => clearInterval(typingInterval);
    }
  }, [activeStep]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };



  return (
    <section className="bg-[#0a0a0a] py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          A Simple, Automated Workflow
        </h2>
        <p className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">
          Go from idea to trending post in minutes. Our streamlined process makes content creation effortless.
        </p>

        {/* Step Dots */}
        <div className="mt-8 flex justify-center gap-2">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={cn(
                "h-3 w-3 rounded-full transition-colors",
                activeStep === i ? "bg-orange-500" : "bg-neutral-600 hover:bg-neutral-400"
              )}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {steps.map((step, index) => (
            <motion.div
              layout
              key={index}
              className={cn(
                "relative flex flex-col rounded-xl p-8 text-center min-h-[420px] transition-all duration-300",
                activeStep === index
                  ? "bg-neutral-950/60 border border-neutral-700/80"
                  : "bg-neutral-950/40 border border-neutral-800/60"
              )}
              variants={itemVariants}
              animate={activeStep === index ? "active" : "inactive"}
              style={{
                boxShadow: activeStep === index
                  ? '0 10px 40px -10px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(249, 115, 22, 0.1)'
                  : 'none'
              }}
            >
              <AnimatePresence>
                {activeStep === index && !shouldReduceMotion && (
                  <motion.div
                    layoutId="highlight-border"
                    className="absolute -inset-px rounded-xl border-2 border-orange-500"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      boxShadow: [
                        "0 0 0 0 rgba(249, 115, 22, 0.4)",
                        "0 0 0 8px rgba(249, 115, 22, 0.1)",
                        "0 0 0 0 rgba(249, 115, 22, 0.4)"
                      ]
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.3,
                      boxShadow: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  />
                )}
              </AnimatePresence>

              <div className="flex-grow">
                <motion.div
                  className={cn("relative z-10 mx-auto w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-neutral-900 border border-neutral-700 transition-all duration-300",
                    activeStep === index ? "border-orange-500/30 bg-neutral-800" : ""
                  )}
                  animate={{
                    scale: activeStep === index && !shouldReduceMotion ? [1, 1.1, 1] : 1
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut"
                  }}
                >
                  <motion.div
                    className={cn("transition-colors duration-300",
                      activeStep === index ? "text-orange-400" : "text-neutral-600"
                    )}
                    animate={{
                      rotate: activeStep === index && !shouldReduceMotion ? [0, 5, -5, 0] : 0
                    }}
                    transition={{
                      duration: 0.8,
                      ease: "easeInOut"
                    }}
                  >
                    {step.icon}
                  </motion.div>
                </motion.div>

                <motion.h3
                  className={cn("text-xl font-bold transition-colors duration-300",
                    activeStep === index ? "text-white" : "text-neutral-100"
                  )}
                  animate={{
                    scale: activeStep === index && !shouldReduceMotion ? [1, 1.02, 1] : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {step.title}
                </motion.h3>

                <p className={cn("mt-2 text-sm leading-relaxed transition-colors duration-300",
                  activeStep === index ? "text-neutral-300" : "text-neutral-400"
                )}>
                  {step.description}
                </p>
              </div>

              {/* Bottom Content */}
              <motion.div
                className="mt-6"
                animate={{
                  y: activeStep === index && !shouldReduceMotion ? [0, -2, 0] : 0
                }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {index === 0 && (
                  <div className={cn("text-left p-4 rounded-lg border transition-all duration-300",
                    activeStep === index
                      ? "bg-neutral-900/80 border-neutral-700/80"
                      : "bg-neutral-900 border-neutral-800/80"
                  )}>
                    <p className="text-xs font-semibold text-neutral-500 mb-3">Trending Topics:</p>
                    <div className="flex flex-wrap gap-2">
                      {['#AI', '#SaaS', '#GrowthHacking', '#Tech'].map(tag => (
                        <span key={tag} className={cn("text-xs rounded px-2 py-1 transition-colors duration-300",
                          activeStep === index
                            ? "text-neutral-300 bg-neutral-700"
                            : "text-neutral-400 bg-neutral-800"
                        )}>{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {index === 1 && (
                  <AnimatePresence>
                    {activeStep === 1 && (
                      <motion.div
                        key="typing-area"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="text-left p-4 rounded-lg bg-neutral-900/80 border border-neutral-700 text-sm text-neutral-300 min-h-[120px]">
                          {typedText}
                          <span className="inline-block w-2 h-4 bg-orange-500 animate-pulse ml-1" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {index === 2 && (
                  <div className={cn("text-left p-4 rounded-lg border space-y-3 transition-all duration-300",
                    activeStep === index
                      ? "bg-neutral-900/80 border-neutral-700/80"
                      : "bg-neutral-900 border-neutral-800/80"
                  )}>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-medium text-green-400">Engagement</span>
                      <div className="w-1/2 h-2 bg-neutral-800 rounded-full">
                        <motion.div
                          className="h-full bg-green-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "75%" }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-medium text-green-400">Reach</span>
                      <div className="w-1/2 h-2 bg-neutral-800 rounded-full">
                        <motion.div
                          className="h-full bg-green-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "50%" }}
                          transition={{ duration: 1, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

TextTutorial.displayName = "TextTutorial";
