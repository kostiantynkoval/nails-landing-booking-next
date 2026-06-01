import { FeaturedGalleryTeaser } from "@/components/gallery/FeaturedGalleryTeaser";
import { FeaturesRow } from "@/components/landing/FeaturesRow";
import { HeroSection } from "@/components/landing/HeroSection";
import { PromoBanner } from "@/components/landing/PromoBanner";
import { QuickBookCard } from "@/components/landing/QuickBookCard";
import { Testimonials } from "@/components/landing/Testimonials";
import { bookingService } from "@/services/booking/BookingService";

export default async function HomePage() {
  const services = await bookingService.getServices();

  return (
    <main id="main-content">
      <HeroSection />
      <QuickBookCard services={services} />
      <FeaturesRow />
      <FeaturedGalleryTeaser />
      <PromoBanner />
      <Testimonials />
    </main>
  );
}
