import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Hero } from './sections/Hero';
import { TrustStrip } from './sections/TrustStrip';
import { Feature } from './sections/Feature';
import { Performance } from './sections/Performance';
import { BenefitsStrip } from './sections/BenefitsStrip';
import { Shop } from './sections/Shop';
import { Comparison } from './sections/Comparison';
import { Faq } from './sections/Faq';
import { Cta } from './sections/Cta';

export default function App() {
  return (
    <div className="relative bg-white">
      <AnnouncementBar />
      <Navbar />

      <main>
        <Hero />
        <TrustStrip />
        <Feature />
        <Performance />
        <BenefitsStrip />
        <Shop />
        <Comparison />
        <Faq />
        <Cta />
      </main>
    </div>
  );
}
