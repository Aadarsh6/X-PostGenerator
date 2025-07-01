import React, { useState, useEffect } from "react";
import { ShimmerButton } from "../magicui/shimmer-button"; // Adjusted path
import { cn } from "@/lib/utils";
import { LogIn, ArrowRight } from "lucide-react";

export const NavBar = React.memo(() => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        scrolled
          ? "bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#" className="flex items-center">
          <span className="text-xl font-semibold text-white flex items-baseline gap-2"> {/* Use items-baseline for better text alignment */}
            <span className="text-3xl font-bold text-[#f87115]">Xc</span>
            <span>Craft</span>
          </span>
        </a>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-2 md:flex">
          <button className="group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white">
            <LogIn className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Login
          </button>
          
          {/* The new, elegant white button */}
          <ShimmerButton
            shimmerColor="#ff6500"
            // shimmerSize="0.15rem"
            background="#000000"
            className="text-sm text-white font-semibold shadow-lg shadow-gray-200/10 hover:shadow-xl hover:shadow-gray-400/30 transition-all duration-100"
          >
            <span className="flex items-center gap-2 whitespace-nowrap">
              Sign Up Free
              <ArrowRight size={16} />
            </span>
          </ShimmerButton>
        </div>
        
        {/* Mobile Menu Button: This appears on screens smaller than 'md' */}
        <div className="md:hidden">
            <button className="rounded-md p-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
        </div>
      </div>
    </nav>
  );
});

NavBar.displayName = "NavBar";
