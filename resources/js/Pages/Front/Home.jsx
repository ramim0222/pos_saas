import { Head } from "@inertiajs/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "@/Components/Front/Navbar";
import Hero from "@/Components/Front/Hero";
import TrustBar from "@/Components/Front/TrustBar";
import FeaturesShowcase from "@/Components/Front/FeaturesShowcase";
import HowItWorks from "@/Components/Front/HowItWorks";
import ProductShowcase from "@/Components/Front/ProductShowcase";
import PricingTeaser from "@/Components/Front/PricingTeaser";
import Testimonials from "@/Components/Front/Testimonials";
import FAQ from "@/Components/Front/FAQ";
import FinalCTA from "@/Components/Front/FinalCTA";
import Footer from "@/Components/Front/Footer";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Home({ canLogin, canRegister }) {
    return (
        <>
            <Head title="Dokan — Store management &amp; POS for your shop" />

            <div className="bg-front-bg font-sans">
                <Navbar canLogin={canLogin} canRegister={canRegister} />
                <main>
                    <Hero canRegister={canRegister} />
                    <TrustBar />
                    <FeaturesShowcase />
                    <HowItWorks />
                    <ProductShowcase />
                    <PricingTeaser />
                    <Testimonials />
                    <FAQ />
                    <FinalCTA canRegister={canRegister} />
                </main>
                <Footer />
            </div>
        </>
    );
}
