import { Hero } from '@/components/home/Hero';
import { Features } from '@/components/home/Features';
import { Statistics } from '@/components/home/Statistics';
import { HowItWorks } from '@/components/home/HowItWorks';
import { CTASection } from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Statistics />
      <Features />
      <HowItWorks />
      <CTASection />
    </>
  );
}
