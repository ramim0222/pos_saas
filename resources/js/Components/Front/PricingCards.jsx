import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import PricingToggle from "@/Components/Front/PricingToggle";
import PricingCard from "@/Components/Front/PricingCard";

gsap.registerPlugin(ScrollTrigger);

const TIERS = [
    {
        name: "Starter",
        description: "For a single counter finding its feet.",
        monthlyPrice: 999,
        yearlyMonthlyPrice: 833,
        yearlyBilledTotal: 9990,
        features: [
            "1 branch",
            "2 staff accounts",
            "Up to 500 products",
            "1 POS terminal",
            "Email support",
        ],
        ctaLabel: "Start free trial",
        ctaHref: "/register",
    },
    {
        name: "Pro",
        description: "For shops running more than one branch.",
        monthlyPrice: 2499,
        yearlyMonthlyPrice: 2083,
        yearlyBilledTotal: 24990,
        features: [
            "Up to 5 branches",
            "15 staff accounts",
            "Unlimited products",
            "Up to 5 POS terminals",
            "Priority support — phone and email",
        ],
        featured: true,
        ctaLabel: "Start free trial",
        ctaHref: "/register",
    },
    {
        name: "Enterprise",
        description: "For chains that need it built around them.",
        custom: true,
        features: [
            "Unlimited branches",
            "Unlimited staff accounts",
            "Unlimited products",
            "Unlimited POS terminals",
            "Dedicated account manager",
        ],
        ctaLabel: "Contact sales",
        ctaHref: "mailto:hello@dokan.app",
    },
];

export default function PricingCards({ canRegister }) {
    const rootRef = useRef(null);
    const [billing, setBilling] = useState("monthly");

    useGSAP(
        () => {
            gsap.from("[data-pricing-card]", {
                opacity: 0,
                y: 30,
                duration: 0.7,
                stagger: 0.12,
                ease: "power3.out",
                scrollTrigger: { trigger: rootRef.current, start: "top 78%" },
            });
        },
        { scope: rootRef },
    );

    return (
        <section id="pricing" ref={rootRef} className="bg-front-bg py-24 lg:py-32">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                <div className="mb-12 flex justify-center">
                    <PricingToggle billing={billing} onChange={setBilling} />
                </div>

                <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
                    {TIERS.map((tier) => (
                        <div key={tier.name} data-pricing-card>
                            <PricingCard {...tier} billing={billing} canRegister={canRegister} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
