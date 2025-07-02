import React, { useState, useEffect } from "react";
import { ShimmerButton } from "../magicui/shimmer-button"; // Adjusted path
import { cn } from "@/lib/utils";
import { LogIn, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const NavBar = React.memo(() => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) { // Tailwind's 'md' breakpoint
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
  <>
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        scrolled || mobileMenuOpen
          ? "bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 shadow-lg"
          : "bg-transparent"
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out",
          scrolled ? "h-16" : "h-20"
        )}
      >
        {/* Logo */}
        <a href="#" className="flex items-center">
          <span className="flex items-baseline gap-2 font-semibold text-white">
            <span
              className={cn(
                "font-bold text-[#f87115] transition-all duration-300",
                scrolled ? "text-2xl" : "text-3xl"
              )}
            >
              Xc
            </span>
            <span
              className={cn(
                "transition-all duration-300",
                scrolled ? "text-lg" : "text-xl"
              )}
            >
              Craft
            </span>
          </span>
        </a>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-2 md:flex">
          <Link to="/login">
            <button className="group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white">
              <LogIn className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Login
            </button>
          </Link>
          <Link to="/signup">
            <ShimmerButton
              shimmerColor="#ff6500"
              background="#000000"
              className="text-sm font-semibold text-white shadow-lg shadow-gray-200/10 hover:shadow-xl hover:shadow-gray-400/30 transition-all duration-100"
            >
              <span className="flex items-center gap-2 whitespace-nowrap">
                Sign Up Free
                <ArrowRight size={16} />
              </span>
            </ShimmerButton>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="rounded-md p-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>

    {/* Mobile Menu OUTSIDE nav so it doesn't affect nav height */}
    <div
      className={cn(
        "fixed top-[4.5rem] w-full z-40 md:hidden origin-top transform transition-all duration-300 ease-in-out",
        mobileMenuOpen
          ? "opacity-100 scale-y-100"
          : "opacity-0 scale-y-95 pointer-events-none"
      )}
    >
      <div className="flex flex-col gap-2 px-4 pt-2 pb-4 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10">
        <Link
          to="/login"
          className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          onClick={toggleMobileMenu}
        >
          <LogIn className="h-5 w-5" />
          <span>Login</span>
        </Link>
        <Link
          to="/signup"
          className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-3 text-base font-semibold text-white transition-colors hover:bg-white/15"
          onClick={toggleMobileMenu}
        >
          <ArrowRight className="h-5 w-5" />
          <span>Sign Up Free</span>
        </Link>
      </div>
    </div>
  </>
);
})
NavBar.displayName = "NavBar";
