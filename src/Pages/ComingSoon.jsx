import React from 'react'
import { Link } from 'react-router-dom'

export const ComingSoon = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-[#1f1f1f] via-[#171717] to-[#0f0f0f] px-4">
      {/* Wrapper */}
      <div className="flex flex-col items-center text-center">
        <h1 className="animate-pulse text-slate-200 text-4xl sm:text-5xl md:text-7xl font-bold">
          Coming Soon!
        </h1>

        <div className="mt-10">
          <Link to="/dashboard">
            <button className="bg-[#ff6900] text-white font-bold py-3 px-8 rounded-lg 
              transition-transform duration-300 hover:scale-110 shadow-lg hover:shadow-[#ff6900]/30 text-sm sm:text-base">
              Go to dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
