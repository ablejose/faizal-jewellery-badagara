import { Navbar } from "@/sections/Navbar";
import { Hero } from "@/sections/Hero";
import { Collections } from "@/sections/Collections";
import { BrandIntro } from "@/sections/BrandIntro";
import { StoryChapters } from "@/sections/StoryChapters";
import { VisitStore } from "@/sections/VisitStore";
import { Faq } from "@/sections/Faq";
import { Contact } from "@/sections/Contact";
import { FinalCta } from "@/sections/FinalCta";
import { Footer } from "@/sections/Footer";
import { FloatingWhatsApp } from "@/sections/FloatingWhatsApp";

/**
 * Page composition: Hero → Our Collections → Brand Story → Story Chapters →
 * Visit Store → FAQ → Contact → Final CTA → Footer. "Our Collections" sits
 * directly below the hero.
 */
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Collections />
        <BrandIntro />
        <StoryChapters />
        <VisitStore />
        <Faq />
        <Contact />
        <FinalCta />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
