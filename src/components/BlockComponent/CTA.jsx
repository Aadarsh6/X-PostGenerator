import { ShimmerButton } from '../magicui/shimmer-button';
import { ArrowRight } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

export const CTASection = React.memo(() => {
  return (
    <section className="bg-neutral-950/60 py-20 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          Ready to Elevate Your Content?
        </h2>
        <p className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">
          Stop guessing and start growing. Join hundreds of creators who are building their audience faster with Xc Craft.
        </p>
        <div className="mt-10 flex justify-center">
            <Link
            to="/signup"
            >
          <ShimmerButton
            background="linear-gradient(to right, #f97316, #ea580c)"
            className="animate-breathe bg-[#ff6900] text-white font-bold py-3 px-8 rounded-lg hover:scale-110 transition-transform duration-300 shadow-md hover:shadow-lg"          >
            <span className="flex items-center gap-2 whitespace-nowrap">
              Start Creating
              <ArrowRight size={18} />
            </span>
          </ShimmerButton>
          </Link>
        </div>
      </div>
    </section>
  );
});
