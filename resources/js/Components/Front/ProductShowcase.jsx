import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const KPIS = [
    { label: "Today's sales", value: "৳ 48,200" },
    { label: "Low on stock", value: "6 items" },
    { label: "Branches open", value: "4 of 4" },
];

const BARS = [30, 55, 40, 70, 90, 62, 48];
const CART = [
    { name: "Detergent, 1kg", price: "৳ 260" },
    { name: "Rice, 5kg", price: "৳ 620" },
    { name: "Biscuit pack x2", price: "৳ 180" },
];

export default function ProductShowcase() {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.to("[data-dash]", {
                y: -30,
                ease: "none",
                scrollTrigger: {
                    trigger: rootRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                },
            });
            gsap.to("[data-terminal]", {
                y: 40,
                ease: "none",
                scrollTrigger: {
                    trigger: rootRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                },
            });

            gsap.from("[data-dash], [data-terminal]", {
                opacity: 0,
                y: 60,
                duration: 0.9,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: { trigger: rootRef.current, start: "top 75%" },
            });
        },
        { scope: rootRef },
    );

    return (
        <section className="overflow-hidden bg-front-bg py-24 lg:py-32">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                <div className="mb-16 max-w-2xl">
                    <p className="mb-4 text-xs font-medium tracking-[0.2em] text-front-accent uppercase">
                        The counter, and the office
                    </p>
                    <h2 className="font-display text-4xl font-semibold tracking-tight text-front-ink lg:text-5xl">
                        One screen at the till. Another for the whole picture.
                    </h2>
                </div>
            </div>

            <div ref={rootRef} className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
                <div
                    data-dash
                    className="front-grain relative z-0 overflow-hidden rounded-2xl border border-front-line bg-front-surface shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)]"
                >
                    <div className="flex items-center gap-1.5 border-b border-front-line px-5 py-3.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-front-line" />
                        <span className="h-2.5 w-2.5 rounded-full bg-front-line" />
                        <span className="h-2.5 w-2.5 rounded-full bg-front-line" />
                        <span className="ml-3 text-xs text-front-muted">Owner dashboard — Gulshan</span>
                    </div>
                    <div className="grid gap-6 p-6 lg:grid-cols-[1fr_1.4fr] lg:p-10">
                        <div className="space-y-4">
                            {KPIS.map((kpi) => (
                                <div
                                    key={kpi.label}
                                    className="rounded-xl border border-front-line bg-front-bg px-4 py-3.5"
                                >
                                    <p className="text-xs text-front-muted">{kpi.label}</p>
                                    <p className="mt-1 font-display text-xl font-medium tabular-figures text-front-ink">
                                        {kpi.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="rounded-xl border border-front-line bg-front-bg p-5">
                            <p className="mb-4 text-xs text-front-muted">Sales, last 7 days</p>
                            <div className="flex h-40 items-end gap-3">
                                {BARS.map((h, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 rounded-t-sm bg-front-accent/60"
                                        style={{ height: `${h}%` }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    data-terminal
                    className="front-grain relative z-10 mx-auto -mt-16 w-[85%] max-w-sm overflow-hidden rounded-2xl border-4 border-front-surface-2 bg-front-surface shadow-[0_50px_90px_-30px_rgba(0,0,0,0.75)] lg:absolute lg:right-16 lg:bottom-0 lg:mt-0 lg:translate-y-1/3"
                >
                    <div className="border-b border-front-line px-5 py-3">
                        <p className="text-xs text-front-muted">Till 02 — new sale</p>
                    </div>
                    <div className="space-y-2.5 p-5">
                        {CART.map((item) => (
                            <div
                                key={item.name}
                                className="flex justify-between text-sm text-front-ink/85"
                            >
                                <span>{item.name}</span>
                                <span className="tabular-figures text-front-muted">{item.price}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between border-t border-front-line bg-front-bg px-5 py-4">
                        <span className="text-sm font-medium text-front-ink">Total</span>
                        <span className="font-display text-lg font-semibold tabular-figures text-front-accent">
                            ৳ 1,060
                        </span>
                    </div>
                </div>

                <div className="h-16 lg:h-40" aria-hidden="true" />
            </div>
        </section>
    );
}
