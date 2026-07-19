import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
    {
        no: "01",
        title: "Sign up",
        copy: "Create your account and pick a plan. No card required to start the trial.",
    },
    {
        no: "02",
        title: "Set up your store",
        copy: "Add branches, load your item list, and invite your cashiers and managers.",
    },
    {
        no: "03",
        title: "Start selling",
        copy: "Ring up sales at the till — offline or on. Every branch stays in one ledger.",
    },
    {
        no: "04",
        title: "Grow with reports",
        copy: "See what's selling, what's not, and where to restock before you run out.",
    },
];

export default function HowItWorks() {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.fromTo(
                "[data-track-fill]",
                { scaleY: 0 },
                {
                    scaleY: 1,
                    ease: "none",
                    transformOrigin: "top center",
                    scrollTrigger: {
                        trigger: rootRef.current,
                        start: "top 70%",
                        end: "bottom 60%",
                        scrub: 0.6,
                    },
                },
            );

            gsap.from("[data-step]", {
                opacity: 0,
                y: 24,
                duration: 0.6,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: { trigger: rootRef.current, start: "top 75%" },
            });
        },
        { scope: rootRef },
    );

    return (
        <section id="how-it-works" ref={rootRef} className="bg-front-bg py-24 lg:py-32">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                <div className="mb-16 max-w-2xl">
                    <p className="mb-4 text-xs font-medium tracking-[0.2em] text-front-accent uppercase">
                        Getting started
                    </p>
                    <h2 className="font-display text-4xl font-semibold tracking-tight text-front-ink lg:text-5xl">
                        Open for business in an afternoon.
                    </h2>
                </div>

                <div className="relative grid gap-x-10 lg:grid-cols-[auto_1fr]">
                    <div className="relative hidden w-px justify-self-center bg-front-line lg:block">
                        <div
                            data-track-fill
                            className="absolute inset-x-0 top-0 h-full w-px bg-front-accent"
                        />
                    </div>

                    <div className="space-y-14 lg:space-y-20">
                        {STEPS.map((step) => (
                            <div
                                key={step.no}
                                data-step
                                className="grid gap-3 lg:grid-cols-[7rem_1fr] lg:items-baseline lg:gap-10"
                            >
                                <span className="font-mono text-sm text-front-accent tabular-figures">
                                    No. {step.no}
                                </span>
                                <div>
                                    <h3 className="font-display text-2xl font-medium text-front-ink">
                                        {step.title}
                                    </h3>
                                    <p className="mt-2 max-w-md text-base leading-relaxed text-front-muted">
                                        {step.copy}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
