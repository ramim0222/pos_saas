import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VALUES = [
    {
        no: "01",
        title: "Built for the counter, not the boardroom",
        copy: "Every decision gets tested against what actually happens at a busy till, not how it looks in a slide deck.",
    },
    {
        no: "02",
        title: "Simple enough to explain in one sentence",
        copy: "If a feature needs a training video before a cashier can use it, it isn't ready yet.",
    },
    {
        no: "03",
        title: "Offline is not an edge case",
        copy: "For a shop with patchy internet, staying open isn't optional. We design for that from day one, not as a fallback.",
    },
    {
        no: "04",
        title: "Priced like a local business",
        copy: "Transparent taka pricing, billing through bKash, and no contract that locks you in past a month you didn't need.",
    },
];

export default function ValuesSection() {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from("[data-value]", {
                opacity: 0,
                y: 20,
                duration: 0.65,
                stagger: 0.12,
                ease: "power2.out",
                scrollTrigger: { trigger: rootRef.current, start: "top 78%" },
            });
        },
        { scope: rootRef },
    );

    return (
        <section className="border-t border-front-line bg-front-bg py-24 lg:py-32">
            <div ref={rootRef} className="mx-auto max-w-[1400px] px-6 lg:px-10">
                <p className="mb-14 text-xs font-medium tracking-[0.2em] text-front-accent uppercase">
                    What we hold to
                </p>

                <div className="border-t border-front-line">
                    {VALUES.map((value) => (
                        <div
                            key={value.no}
                            data-value
                            className="grid gap-3 border-b border-front-line py-10 lg:grid-cols-[8rem_1fr] lg:items-baseline lg:gap-10 lg:py-12"
                        >
                            <span className="font-mono text-sm text-front-accent tabular-figures">
                                {value.no}
                            </span>
                            <div className="max-w-2xl">
                                <h3 className="font-display text-2xl font-medium text-front-ink lg:text-3xl">
                                    {value.title}
                                </h3>
                                <p className="mt-3 text-base leading-relaxed text-front-muted">
                                    {value.copy}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
