import { motion } from "framer-motion";
import { PenLine, Sliders, Rocket } from "lucide-react";

const steps = [
  {
    icon: PenLine,
    step: "01",
    title: "Describe your idea",
    description: "Type a topic, a thought, or a rough idea. No need to structure it. The AI figures out the rest.",
  },
  {
    icon: Sliders,
    step: "02",
    title: "Pick your tone and format",
    description: "Choose from 6 tones and 3 formats. Single post, thread, or long thread. Your voice, your style.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Post or save it",
    description: "Copy it, post directly to X, or save it for later. Every post is under 280 characters and ready to go.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="w-full py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-3">
            How it works
          </p>
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            From idea to post in 30 seconds
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line — desktop only */}
          <div className="hidden md:block absolute top-10 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative bg-[#111111] border border-neutral-800 rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300"
            >
              {/* Step number */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-orange-400" />
                </div>
                <span className="text-neutral-700 font-bold text-2xl">{step.step}</span>
              </div>

              <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};