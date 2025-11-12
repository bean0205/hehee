import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import SocialSection from '@/components/landing/SocialSection';
import ProSection from '@/components/landing/ProSection';
import FinalCTA from '@/components/landing/FinalCTA';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <SocialSection />
      <ProSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}
