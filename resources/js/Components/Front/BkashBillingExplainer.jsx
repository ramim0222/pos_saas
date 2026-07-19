import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { BillingVisual } from "@/Components/Front/FeatureVisuals";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
    {
        no: "01",
        title: "A reminder, a few days early",
        copy: "Before your renewal date, we send a reminder by SMS and email — no surprises at the till.",
    },
    {
        no: "02",
        title: "Pay through bKash",
        copy: "Tap the reminder or open your account and pay your plan through bKash. Takes under a minute, no bank visit.",
    },
    {
        no: "03",
        title: "Renews the moment it's confirmed",
        copy: "Your plan renews as soon as the payment clears — nothing to wait on, nothing to approve manually.",
    },
    {
        no: "04",
        title: "A grace period, just in case",
        copy: "Miss the date? You keep a short grace period before anything is paused, and we'll remind you again.",
    },
];

export default function BkashBillingExplainer() {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from("[data-step]", {
                opacity: 0,
                y: 18,
                duration: 0.55,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: { trigger: rootRef.current, start: "top 78%" },
            });
            gsap.from("[data-billing-visual]", {
                opacity: 0,
                y: 24,
                duration: 0.7,
                ease: "power3.out",
                scrollTrigger: { trigger: rootRef.current, start: "top 78%" },
            });
        },
        { scope: rootRef },
    );

    return (
        <section
            ref={rootRef}
            className="border-t border-front-line bg-front-surface/40 py-24 lg:py-32"
        >
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
                    <div>
                        <p className="mb-4 text-xs font-medium tracking-[0.2em] text-front-accent uppercase">
                            Billing, in plain terms
                        </p>
                        <h2 className="font-display text-4xl font-semibold tracking-tight text-front-ink lg:text-5xl">
                            Billed through bKash. Nothing hidden, nothing automatic.
                        </h2>
                        <p className="mt-5 max-w-md text-base leading-relaxed text-front-muted">
                            There's no card on file quietly charging you. Every renewal is a
                            payment you make yourself, through bKash, when you're ready.
                        </p>

                        <div className="mt-10 space-y-7">
                            {STEPS.map((step) => (
                                <div key={step.no} data-step className="flex gap-5">
                                    <span className="w-8 shrink-0 font-mono text-sm text-front-accent tabular-figures">
                                        {step.no}
                                    </span>
                                    <div>
                                        <h3 className="font-display text-lg font-medium text-front-ink">
                                            {step.title}
                                        </h3>
                                        <p className="mt-1.5 text-sm leading-relaxed text-front-muted">
                                            {step.copy}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div data-billing-visual className="flex justify-center">
                        <BillingVisual />
                    </div>
                </div>
            </div>
        </section>
    );
}
