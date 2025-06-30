
// Fixed LandingPage component
import { NavBar } from '@/components/BlockComponent/NavBar';
import { HomePage } from '@/components/BlockComponent/Home';
import { TextTutorial } from '@/components/BlockComponent/TextTutorial';

export const LandingPage = () => {
  return (
    <div className="w-full bg-[#0a0a0a]">
      <NavBar />
      <main>
        <HomePage />
        <TextTutorial />
      </main>
    </div>
  );
};