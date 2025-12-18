import CTASection from "@/components/LandingPage/CTASection";
import DemoSection from "@/components/LandingPage/DemoSection";
import FAQSections from "@/components/LandingPage/FAQSections";
import FeaturesSection from "@/components/LandingPage/FeaturesSection/FeaturesSection";
import HeroSection from "@/components/LandingPage/HeroSection";
import HowItWorksSection from "@/components/LandingPage/HowItWorksSection";
import PricingSection from "@/components/LandingPage/PricingSection";
import TestimonialsSection from "@/components/LandingPage/TestimonialsSection";
import TrustedSection from "@/components/LandingPage/TrustedSection";
import WallOfLove from "@/components/LandingPage/WallOfLove";
import MainLayout from "@/components/MainLayout";
import WatchDemo from "@/components/Modals/WatchDemo";
import { seoData } from "@/constants/seoData";
import useUpdateQueryParams from "@/hooks/updateQueryParams";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { Fragment } from "react";

export default function Home() {
  const router = useRouter();
  const updateQueryParams = useUpdateQueryParams();

  return (
    <Fragment>
      <NextSeo {...seoData.landingPage} />
      <MainLayout>
        <section className="overflow-hidden md:pt-32 pb-12 pt-24">
          <HeroSection />
        </section>
        <section className="md:py-12 py-8 overflow-hidden">
          <TrustedSection />
        </section>
        {/* <FeaturesSection /> */}
        <section id="how-it-works" className="md:py-12 py-8 overflow-hidden scroll-mt-8">
          <HowItWorksSection />
        </section>
        {/* <DemoSection /> */}
        <section id="pricing" className="md:py-12 py-8 overflow-hidden scroll-mt-8">
          <PricingSection />
        </section>
        <section className="md:py-12 py-8 overflow-hidden">
          <WallOfLove />
        </section>
        {/* <TestimonialsSection /> */}
        <section id="faqs" className="md:py-12 py-8 overflow-hidden scroll-mt-8">
          <FAQSections />
        </section>
        <section className="md:py-12 py-8 overflow-hidden">
          <CTASection />
        </section>
        <WatchDemo
          onClose={() => updateQueryParams({ demo: null })}
          open={router.query.demo === "true" ? true : false}
        />

      </MainLayout>
    </Fragment>
  );
}
