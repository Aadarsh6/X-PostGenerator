import React from 'react';
import { Twitter, Linkedin, Github } from 'lucide-react';
import { cn } from "@/lib/utils"; // Your classname utility
import { Link } from 'react-router-dom';

export const Footer = React.memo(() => {
  // A simplified list of essential links for a compact footer
  const essentialLinks = [
    { label: 'Features', href: '/' },
    { label: 'Pricing', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Privacy', href: '#' },
  ];

  const socialLinks = [
    { icon: <Twitter size={18} />, href: 'https://github.com/Aadarsh6', label: 'Twitter' },
    { icon: <Linkedin size={18} />, href: '#https://github.com/Aadarsh6', label: 'LinkedIn' },
    { icon: <Github size={18} />, href: 'https://github.com/Aadarsh6#', label: 'GitHub' },
  ];

  return (
    <footer className="bg-[#0a0a0a] border-t border-neutral-800/60 py-2">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {/* Logo */}
        <a href="#" className="inline-block">
          <span className="text-xl font-semibold text-white flex items-baseline gap-2">
            <span className="text-3xl font-bold text-orange-500">Xc</span>
            <span>Craft</span>
          </span>
        </a>

        {/* Description & Contact */}
        <p className="mt-4 text-sm text-neutral-400 max-w-sm mx-auto">
          The AI-powered platform to supercharge your content. Have questions? 
          <Link to="/contact" className="text-orange-400 hover:text-orange-300 transition-colors"> Get in touch</Link>.
        </p>

        {/* Essential Links */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {essentialLinks.map((link) => (
            <a 
              key={link.label} 
              href={link.href} 
              className="text-sm text-neutral-300 hover:text-orange-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Social Icons & Copyright */}
        <div className="mt-10 flex flex-col items-center gap-6">
          <div className="flex items-center gap-6">
            {socialLinks.map((social) => (
              <a 
                key={social.label} 
                href={social.href} 
                aria-label={social.label}
                target='_blank'
                className="text-neutral-500 hover:text-orange-400 transition-colors"
              >
                {social.icon}
              </a>
            ))}
          </div>
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} Xc Craft. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
