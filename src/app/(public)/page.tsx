import { FeaturedGalleryTeaser } from "@/components/gallery/FeaturedGalleryTeaser";
import { FeaturesRow } from "@/components/landing/FeaturesRow";
import { HeroSection } from "@/components/landing/HeroSection";
import { PromoBanner } from "@/components/landing/PromoBanner";
import { QuickBookCard } from "@/components/landing/QuickBookCard";
import { Testimonials } from "@/components/landing/Testimonials";

export default function HomePage() {
  return (
    <main id="main-content">
      <HeroSection />
      <QuickBookCard />
      <FeaturesRow />
      <FeaturedGalleryTeaser />
      <PromoBanner />
      <Testimonials />
    </main>
  );
}
