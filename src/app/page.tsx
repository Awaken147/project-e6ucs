'use client';

import Navbar from '@/components/sections/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import PricingSection from '@/components/sections/PricingSection';
import PlaygroundSection from '@/components/sections/PlaygroundSection';
import AboutFAQ from '@/components/sections/AboutFAQ';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#030014] noise-overlay">
      <Navbar />
      <main>
        <HeroSection />
        <PricingSection />
        <PlaygroundSection />
        <AboutFAQ />
      </main>
      <Footer />
    </div>
  );
}
