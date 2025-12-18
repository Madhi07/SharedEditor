import PricingSection from "@/components/LandingPage/PricingSection";
import MainLayout from "@/components/MainLayout";

export default function PricingPage() {
    return (
        <MainLayout>
            <section id="pricing" className="py-20 overflow-hidden">
                <PricingSection />
            </section>
        </MainLayout>
    )
}
