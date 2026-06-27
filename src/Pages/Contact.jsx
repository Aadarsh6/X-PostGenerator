import { NavBar } from "@/components/BlockComponent/NavBar";
import { Mail, Twitter } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <NavBar />
      <div className="max-w-lg mx-auto px-4 pt-32 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Get in touch
          </h1>
          <p className="mt-4 text-neutral-400 text-lg">
            Have feedback, a bug to report, or just want to say hi? Reach out directly.
          </p>

          <div className="mt-12 flex flex-col gap-4">
            <a
              href="https://twitter.com/adarshx_23"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-[#111111] border border-neutral-800 hover:border-orange-500/40 rounded-2xl p-5 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                <Twitter className="w-5 h-5 text-orange-400" />
              </div>
              <div className="text-left">
                <div className="text-white font-medium group-hover:text-orange-400 transition-colors">
                  Twitter / X
                </div>
                <div className="text-neutral-500 text-sm">@aadarshmX</div>
              </div>
            </a>

            <a
              href="mailto:aadarshakmishra16@gmail.com"
              className="flex items-center gap-4 bg-[#111111] border border-neutral-800 hover:border-orange-500/40 rounded-2xl p-5 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-orange-400" />
              </div>
              <div className="text-left">
                <div className="text-white font-medium group-hover:text-orange-400 transition-colors">
                  Email
                </div>
                <div className="text-neutral-500 text-sm">aadarshakmishra16@gmail.com</div>
              </div>
            </a>
          </div>

          <p className="mt-8 text-neutral-600 text-sm">
            I usually respond within 24 hours.
          </p>
        </motion.div>
      </div>
    </div>
  );
}