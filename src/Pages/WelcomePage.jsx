import React, { useState} from 'react';
import { Check, User, Mail, Settings, BookOpen, ChevronRight, Sparkles } from 'lucide-react';
import { BorderBeam } from '@/components/magicui/border-beam';

const WelcomePage = ({ user, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);

  const steps = [
    
   {
  title: `Hello, ${user?.name || 'New User'}! 👋`,
  subtitle: "Everything looks great!",
  icon: User,
  content: (
    <div className="space-y-4">
      <div className="bg-gray-800/80 rounded-lg p-4 space-y-3 border border-gray-600/50 shadow-lg">
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-gray-400" />
          <div>
            <p className="font-medium text-white">Name</p>
            <p className="text-gray-300">{user?.name || 'Not provided'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Mail className="w-5 h-5 text-gray-400" />
          <div>
            <p className="font-medium text-white">Email</p>
            <p className="text-gray-300">{user?.email || 'Not provided'}</p>
          </div>
        </div>
      </div>
      <div className="bg-[#f87115]/20 border border-[#f87115]/40 rounded-lg p-4 shadow-lg">
        <p className="text-[#f87115] text-sm font-medium">
          <Check className="w-4 h-4 inline mr-2" />
          Your account is verified and ready to use!
        </p>
      </div>
    </div>
  )
}
,
    {
      title: "Writing Great Prompts",
      subtitle: "Quick tip for better results",
      icon: Sparkles,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-[#f87115] mb-2">💡 One Simple Rule</h3>
            <p className="text-gray-300 text-lg">Be specific about what you want</p>
          </div>
          
          <div className="bg-gray-800/80 border border-[#f87115]/40 p-6 rounded-xl shadow-lg">
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-2 flex items-center">
                  <span className="text-red-400 mr-2">❌</span>
                  Vague prompt:
                </h4>
                <p className="text-gray-400 text-sm italic">"Write a LinkedIn post"</p>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-2 flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  Better prompt:
                </h4>
                <p className="text-gray-200 text-sm italic">
                  "Write a LinkedIn post about remote work tips for developers. 
                  Keep it professional and include 3 actionable tips."
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-900/40 p-4 rounded-lg border border-blue-600/30">
            <p className="text-blue-300 text-sm text-center">
              <span className="font-semibold">Remember:</span> More details = better results!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Essential Features",
      subtitle: "Master these key tools for success",
      icon: BookOpen,
      content: (
        <div className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-start space-x-3 p-4 bg-gray-800/80 rounded-lg border border-blue-600/30 shadow-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">💾</div>
              <div>
                <p className="font-semibold text-white">Save Button</p>
                <p className="text-gray-300 text-sm">Keep your favorite responses for future reference</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-gray-800/80 rounded-lg border border-green-600/30 shadow-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">🔄</div>
              <div>
                <p className="font-semibold text-white">Regenerate</p>
                <p className="text-gray-300 text-sm">Get fresh perspectives with one click</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-gray-800/80 rounded-lg border border-purple-600/30 shadow-lg">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">📝</div>
              <div>
                <p className="font-semibold text-white">Post Type & Tone</p>
                <p className="text-gray-300 text-sm">Tailor responses to your exact needs</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
{
  title: "You're All Set!",
  subtitle: "Ready to create amazing content",
  icon: Check,
  content: (
    <div className="text-center space-y-8">
      {/* Gradient now uses only your brand's CTA color */}
      <div className="w-24 h-24 bg-gradient-to-br from-[#f87115] to-[#f87115]/70 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-[#f87115]/30">
        <Check className="w-12 h-12 text-white" />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-white">Welcome Aboard!</h3>
        <p className="text-gray-300 max-w-sm mx-auto">
          Your account is ready. You can now use all features to create amazing content.
        </p>

        {/* Redesigned Pro Tip box for a cleaner look */}
        <div className="bg-gray-800/80 p-5 rounded-xl border border-[#f87115]/50 shadow-lg">
          <p className="text-white text-base font-medium">
            <span className="text-[#f87115] font-bold">🎉 Pro Tip:</span> Start with a detailed prompt for the best results!
          </p>
        </div>
      </div>
    </div>
  )
}


  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCompletedSteps([...completedSteps, currentStep]);
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  const finishWelcome = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onComplete?.();
    }, 300);
  };

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dotted Background */}
      <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:16px_16px] opacity-20 z-0" />
      
      <div className="max-w-lg w-full relative z-10">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-400">Getting Started</span>
            <span className="text-sm font-medium text-gray-400">
              {currentStep + 1}/{steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-800/50 rounded-full h-2 shadow-inner">
            <div 
              className="bg-gradient-to-r from-[#f87115] to-[#f87115]/80 h-2 rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Card */}
        <div className={`bg-[#1a1a1a] rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-600/50 relative overflow-hidden transform transition-all duration-300 ${isAnimating ? 'scale-95 opacity-75' : 'scale-100 opacity-100'}`}>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#f87115] to-[#f87115]/80 rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg border border-[#f87115]/40">
                <CurrentIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
                {steps[currentStep].title}
              </h1>
              <p className="text-gray-400">
                {steps[currentStep].subtitle}
              </p>
            </div>

            {/* Content */}
            <div className="mb-8">
              {steps[currentStep].content}
            </div>

            {/* Actions */}
            <div className="flex justify-center">
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-[#f87115] to-[#f87115]/90 text-white px-8 py-3 rounded-xl font-semibold hover:from-[#f87115]/90 hover:to-[#f87115] transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-[#f87115]/50"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={finishWelcome}
                  className="bg-[#f97316] hover:bg-[#ea580c] text-white px-8 py-3 rounded-xl font-semibold hover:from-[#f87115]/90 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-[#f87115]/50"
                >
                  <span>Get Started</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* BorderBeam Effects */}
          <BorderBeam
            duration={8}
            size={400}
            borderWidth={2.5}
            className="from-transparent via-[#f97316] to-transparent"
          />
          <BorderBeam
            duration={8}
            delay={4}
            size={400}
            borderWidth={2.5}
            className="from-transparent via-[#ea580c] to-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
