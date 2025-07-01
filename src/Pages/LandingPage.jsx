import { HomePage } from "@/components/BlockComponent/Home";
import { NavBar } from "@/components/BlockComponent/NavBar";
import { TextTutorial } from "@/components/BlockComponent/TextTutorial";
import { TutorialVideo } from "@/components/BlockComponent/TutorialVideo";

export const LandingPage = () => {
  return (
    <div className="w-full bg-[#0a0a0a] overflow-x-hidden">
      <NavBar />
      <main>
        <HomePage />
        <TutorialVideo />
        <TextTutorial />
      </main>
      
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};