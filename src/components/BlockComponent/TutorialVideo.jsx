import { useState, useCallback } from "react";
import { Play } from "lucide-react"; // Added missing import
import React from "react";

export const TutorialVideo = React.memo(() => {
  const [videoError, setVideoError] = useState(false);

  const handleVideoError = useCallback(() => {
    setVideoError(true);
  }, []);

  return (
     <section className="w-full py-8 md:py-16 px-4">  {/* Added section wrapper with proper spacing */}
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-16"> 
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            See It In Action
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A quick walkthrough of how our platform helps you create viral content.
          </p>
        </div>

        {/* Video Container */}
        <div className="relative group">
          {/* Glow Effect - Fixed positioning and blur */}
          <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-all duration-500" />
          
          {/* Video Player Container - Fixed shadow and positioning */}
          <div className="relative">
            <div className="aspect-video rounded-2xl overflow-hidden bg-gray-900 border border-white/10 shadow-2xl shadow-orange-500/25">
              {videoError ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-orange-500/20 flex items-center justify-center backdrop-blur-sm border border-orange-500/30">
                      <Play size={40} className="text-orange-400 ml-1" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-3">Demo Video</h3>
                    <p className="text-gray-400 text-lg">Video content coming soon</p>
                  </div>
                </div>
              ) : (
                <video 
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata" 
                  onError={handleVideoError}
                  poster="/img.png"
                >
                  <source src="./Xc.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

TutorialVideo.displayName = "TutorialVideo";
