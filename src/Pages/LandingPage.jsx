import { CTASection } from "@/components/BlockComponent/CTA";
import { Footer } from "@/components/BlockComponent/Footer";
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
        <CTASection/>
        <Footer/>
      </main>
      
      
    </div>
  );
};