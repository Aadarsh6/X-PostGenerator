import { Footer } from "@/components/BlockComponent/Footer";
import { HomePage } from "@/components/BlockComponent/Home";
import { NavBar } from "@/components/BlockComponent/NavBar";
import { CTASection } from "@/components/BlockComponent/CTA";
import { HowItWorks } from "@/components/BlockComponent/HowItWorks";
import { TutorialVideo } from "@/components/BlockComponent/TutorialVideo";
import { SocialProof } from "@/components/BlockComponent/SocialProof";

export const LandingPage = () => {
  return (
    <div className="w-full bg-[#0a0a0a] overflow-x-hidden">
      <NavBar />
      <main>
        <HomePage />
        <TutorialVideo />
        <SocialProof />
        <HowItWorks />
        <CTASection />
        <Footer />
      </main>
    </div>
  );
};