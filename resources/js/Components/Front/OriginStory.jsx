import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PROBLEM_LINES = [
    "Retail software built abroad assumes steady broadband, card-first payments,",
    "and one store with one till.",
    "Most shop owners we talked to in Dhaka run on patchy internet, bKash, and a",
    "notebook that doubles as an inventory system.",
    "They weren't choosing bad tools. They just weren't the ones any tool was built for.",
];

const SOLUTION_LINES = [
    "So we built a till that keeps selling when the connection drops, and syncs",
    "the moment it's back.",
    "Billing that renews through bKash, not a card most owners don't carry.",
    "A dashboard that makes just as much sense at one counter as it does at five.",
];

function Lines({ lines }) {
    return (
        <p className="max-w-xl text-base leading-relaxed text-front-muted">
            {lines.map((line) => (
                <span key={line} className="block overflow-hidden">
                    <span data-line className="inline-block">
                        {line}
                    </span>
                </span>
            ))}
        </p>
    );
}

export default function OriginStory() {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from("[data-quote-line]", {
                opacity: 0,
                y: 16,
                duration: 0.9,
                ease: "power2.out",
                stagger: 0.1,
                scrollTrigger: { trigger: rootRef.current, start: "top 75%" },
            });

            gsap.from("[data-line]", {
                opacity: 0,
                y: 12,
                duration: 0.6,
                ease: "power2.out",
                stagger: 0.045,
                scrollTrigger: { trigger: "[data-story-columns]", start: "top 80%" },
            });
        },
        { scope: rootRef },
    );

    return (
        <section ref={rootRef} className="bg-front-bg py-24 lg:py-32">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                <p className="mb-8 text-xs font-medium tracking-[0.2em] text-front-accent uppercase">
                    Why Dokan
                </p>

                <blockquote className="mb-20 max-w-4xl">
                    <p className="font-display text-3xl leading-[1.2] font-medium text-front-ink sm:text-4xl lg:text-5xl">
                        <span data-quote-line className="block">
                            &ldquo;Every POS we tried assumed a shop
                        </span>
                        <span data-quote-line className="block">
                            that didn&apos;t look like ours.&rdquo;
                        </span>
                    </p>
                </blockquote>

                <div
                    data-story-columns
                    className="grid gap-12 border-t border-front-line pt-14 lg:grid-cols-2 lg:gap-20"
                >
                    <div>
                        <p className="mb-4 text-xs font-medium tracking-wide text-front-ink/70 uppercase">
                            The problem
                        </p>
                        <Lines lines={PROBLEM_LINES} />
                    </div>
                    <div>
                        <p className="mb-4 text-xs font-medium tracking-wide text-front-ink/70 uppercase">
                            What we built instead
                        </p>
                        <Lines lines={SOLUTION_LINES} />
                    </div>
                </div>
            </div>
        </section>
    );
}
