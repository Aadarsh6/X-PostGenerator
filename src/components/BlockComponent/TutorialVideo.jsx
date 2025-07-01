import  { useReducedMotion }  from "framer-motion";
import  { useState, useCallback }  from "react";
import React from "react";
export const TutorialVideo = React.memo(() => {
  const [videoError, setVideoError] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleVideoError = useCallback(() => {
    setVideoError(true);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          See It In Action
        </h2>
        <p className="mt-2 text-xl text-gray-400 max-w-2xl mx-auto">
          A quick walkthrough of how our platform helps you create viral content.
        </p>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
        
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-900 border border-white/10">
          {videoError ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Play size={40} className="text-orange-400 ml-1" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">Demo Video</h3>
                <p className="text-gray-400">Video content coming soon</p>
              </div>
            </div>
          ) : (
            <video 
              className="w-full h-full object-cover"
              controls
              preload="none"
              onError={handleVideoError}
              loading="lazy"
            >
              <source src="./Xc.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>
    </div>
  );
});
