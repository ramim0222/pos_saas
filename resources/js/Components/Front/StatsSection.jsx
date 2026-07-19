import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
    { value: 500, decimals: 0, prefix: "", suffix: "+", label: "Stores running on Dokan" },
    { value: 12, decimals: 0, prefix: "৳ ", suffix: " Cr", label: "Processed monthly" },
    { value: 850, decimals: 0, prefix: "", suffix: "+", label: "Branches connected" },
    { value: 99.9, decimals: 1, prefix: "", suffix: "%", label: "Platform uptime" },
];

function StatItem({ stat }) {
    const numRef = useRef(null);

    useGSAP(() => {
        const el = numRef.current;
        if (!el) return;
        const counter = { value: 0 };
        let fallback;

        const trigger = ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            once: true,
            onEnter: () => {
                gsap.to(counter, {
                    value: stat.value,
                    duration: 1.4,
                    ease: "power2.out",
                    onUpdate: () => {
                        el.textContent = counter.value.toFixed(stat.decimals);
                    },
                    onComplete: () => {
                        el.textContent = stat.value.toFixed(stat.decimals);
                    },
                });

                // Safety net: a backgrounded/throttled tab can pause GSAP's
                // rAF ticker mid-tween, leaving the count stuck. Force the
                // final value once the animation should long since be done.
                fallback = window.setTimeout(() => {
                    el.textContent = stat.value.toFixed(stat.decimals);
                }, 2500);
            },
        });

        return () => {
            trigger.kill();
            window.clearTimeout(fallback);
        };
    }, []);

    return (
        <div>
            <p className="font-display text-4xl font-semibold tabular-figures text-front-ink lg:text-5xl">
                {stat.prefix}
                <span ref={numRef}>0</span>
                {stat.suffix}
            </p>
            <p className="mt-2 text-sm text-front-muted">{stat.label}</p>
        </div>
    );
}

export default function StatsSection() {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from("[data-stat]", {
                opacity: 0,
                y: 16,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: { trigger: rootRef.current, start: "top 80%" },
            });
        },
        { scope: rootRef },
    );

    return (
        <section
            ref={rootRef}
            className="border-t border-front-line bg-front-surface/40 py-20 lg:py-28"
        >
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
                    {STATS.map((stat) => (
                        <div key={stat.label} data-stat>
                            <StatItem stat={stat} />
                        </div>
                    ))}
                </div>
                <p className="mt-10 max-w-md text-xs text-front-muted">
                    Figures are illustrative while Dokan is in early access — updated as
                    real usage comes in.
                </p>
            </div>
        </section>
    );
}
