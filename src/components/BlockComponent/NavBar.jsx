import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { LogIn, ArrowRight, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

// Mock ShimmerButton component since we don't have the actual one
const ShimmerButton = ({ children, className, shimmerColor, background, ...props }) => (
  <button
    className={cn(
      "relative overflow-hidden rounded-full px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25 hover:scale-105",
      className
    )}
    {...props}
  >
    <span className="relative z-10">{children}</span>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
  </button>
);

export const NavBar = React.memo(() => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10);
  }, []);

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 768) {
      setMobileMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll, handleResize]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen, closeMobileMenu]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Mobile menu backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
          scrolled || mobileMenuOpen
            ? "bg-[#0a0a0a]/90 backdrop-blur-xl shadow-lg"
            : "bg-transparent"
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out",
            scrolled ? "h-16" : "h-20"
          )}
        >
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center"
            aria-label="XcCraft Home"
          >
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
          </Link>

          {/* Desktop Auth Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
            to={"/login"}
            >
            <button className="group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-100 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-transparent">
              <LogIn className="h-4 w-4 transition-transform group-hover:scale-110" />
              Login
            </button>
            </Link>

            <ShimmerButton
              shimmerColor="#ff6500"
              background="#000000"
              className="text-sm font-semibold text-white shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              <Link
              to={"/signup"}
              >
              <span className="flex items-center gap-2 whitespace-nowrap">
                Sign Up Free
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
              </Link>
            </ShimmerButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden rounded-md p-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-transparent"
            aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed top-0 right-0 h-full w-80 max-w-[90vw] z-50 md:hidden transform transition-all duration-300 ease-in-out",
          mobileMenuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <div className="h-full bg-[#0a0a0a]/95 backdrop-blur-xl border-l border-white/10 flex flex-col">
          {/* Mobile menu header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 id="mobile-menu-title" className="text-lg font-semibold text-white">
              Menu
            </h2>
            <button
              onClick={closeMobileMenu}
              className="rounded-md p-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Close mobile menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile menu content */}
          <div className="flex-1 flex flex-col gap-2 p-4">
            <Link
            to="/login"
            >
            <button
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] w-full text-left"
              onClick={closeMobileMenu}
            >
              <LogIn className="h-5 w-5" />
              <div>Login</div>
            </button>
              </Link>
            
            <Link
            to="/signup"
            >
            <button
              className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 text-base font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/25 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] w-full text-left"
              onClick={closeMobileMenu}
            >
              <ArrowRight className="h-5 w-5" />
              <span>Sign Up Free</span>
            </button>
              </Link>
          </div>
        </div>
      </div>

      <style>
  {`
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    .animate-shimmer {
      animation: shimmer 2s infinite;
    }
  `}
</style>

    </>
  );
});

NavBar.displayName = "NavBar";