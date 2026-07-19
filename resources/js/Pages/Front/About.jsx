import { Head } from "@inertiajs/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "@/Components/Front/Navbar";
import PageHeader from "@/Components/Front/PageHeader";
import OriginStory from "@/Components/Front/OriginStory";
import ValuesSection from "@/Components/Front/ValuesSection";
import StatsSection from "@/Components/Front/StatsSection";
import TeamSection from "@/Components/Front/TeamSection";
import FinalCTA from "@/Components/Front/FinalCTA";
import Footer from "@/Components/Front/Footer";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function About({ canLogin, canRegister }) {
    return (
        <>
            <Head title="About — Dokan" />

            <div className="bg-front-bg font-sans">
                <Navbar canLogin={canLogin} canRegister={canRegister} />
                <main>
                    <PageHeader
                        eyebrow="About Dokan"
                        title="Built for store owners who deserve better tools."
                        intro="Not another POS built for a market that doesn't look like Bangladesh's. Here's why we built this one, and what we still believe."
                    />
                    <OriginStory />
                    <ValuesSection />
                    <StatsSection />
                    <TeamSection />
                    <FinalCTA
                        canRegister={canRegister}
                        title="Come run your counter with us."
                        subtitle="Start free and see if Dokan fits the way your shop actually works."
                    />
                </main>
                <Footer />
            </div>
        </>
    );
}
