import { Head } from "@inertiajs/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "@/Components/Front/Navbar";
import PageHeader from "@/Components/Front/PageHeader";
import PricingCards from "@/Components/Front/PricingCards";
import PricingComparisonTable from "@/Components/Front/PricingComparisonTable";
import BkashBillingExplainer from "@/Components/Front/BkashBillingExplainer";
import FAQ from "@/Components/Front/FAQ";
import FinalCTA from "@/Components/Front/FinalCTA";
import Footer from "@/Components/Front/Footer";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const BILLING_FAQS = [
    {
        q: "What happens if my payment fails?",
        a: "If a bKash payment doesn't go through, we'll let you know and give you a short grace period to retry. Your data and settings stay exactly as they were — nothing is deleted.",
    },
    {
        q: "Can I switch plans later?",
        a: "Yes, upgrade or downgrade anytime from your account. Changes take effect on your next billing cycle, and upgrades mid-cycle are prorated.",
    },
    {
        q: "Is there a free trial?",
        a: "Every plan starts with a free trial — no card required. You can explore the full feature set before deciding to subscribe.",
    },
    {
        q: "Do you offer refunds?",
        a: "If something isn't right within the first 7 days of a paid plan, contact us and we'll refund that payment in full.",
    },
    {
        q: "How do I switch from monthly to yearly billing?",
        a: "Switch anytime from your billing settings. We'll adjust your next bKash payment to reflect the new plan and any remaining credit.",
    },
    {
        q: "Do the prices include VAT?",
        a: "Displayed prices are before VAT. Applicable tax is added at checkout and shown clearly before you pay.",
    },
];

export default function Pricing({ canLogin, canRegister }) {
    return (
        <>
            <Head title="Pricing — Dokan" />

            <div className="bg-front-bg font-sans">
                <Navbar canLogin={canLogin} canRegister={canRegister} />
                <main>
                    <PageHeader
                        eyebrow="Plans"
                        title="Simple pricing, built for growing stores."
                        intro="Start on one branch, grow to twenty — pay only for what your shop actually needs, billed through bKash."
                    />
                    <PricingCards canRegister={canRegister} />
                    <PricingComparisonTable />
                    <BkashBillingExplainer />
                    <FAQ
                        id="billing-faq"
                        eyebrow="Billing questions"
                        title="Before you subscribe"
                        items={BILLING_FAQS}
                    />
                    <FinalCTA
                        canRegister={canRegister}
                        title="Pick a plan and open for business."
                        subtitle="Start free today. Upgrade, downgrade, or cancel whenever your shop needs change."
                    />
                </main>
                <Footer />
            </div>
        </>
    );
}
