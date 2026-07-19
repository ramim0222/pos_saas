import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const QUOTES = [
    {
        quote: "I check yesterday's numbers before I even unlock the shutter.",
        name: "Nasima Akter",
        role: "Mirpur",
    },
    {
        quote: "Renewing takes less time than making tea.",
        name: "Kamrul Hasan",
        role: "Chattogram",
    },
    {
        quote: "My manager finally stopped calling me for stock counts.",
        name: "Shirin Sultana",
        role: "Sylhet",
    },
];

export default function BrandPanel({
    eyebrow = "Dokan",
    title = "Everything your shop needs, still open.",
    intro = "Sign back in to pick up where you left off — sales, stock, and staff, all in one place.",
}) {
    const rootRef = useRef(null);
    const quoteRef = useRef(null);
    const [active, setActive] = useState(0);

    useGSAP(
        () => {
            gsap.from("[data-panel-item]", {
                opacity: 0,
                y: 16,
                duration: 0.7,
                stagger: 0.1,
                ease: "power2.out",
                delay: 0.3,
            });
        },
        { scope: rootRef },
    );

    useGSAP(
        () => {
            if (!quoteRef.current) return;
            gsap.fromTo(
                quoteRef.current,
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
            );
        },
        { scope: rootRef, dependencies: [active], revertOnUpdate: true },
    );

    useEffect(() => {
        const id = setInterval(() => setActive((i) => (i + 1) % QUOTES.length), 6000);
        return () => clearInterval(id);
    }, []);

    const current = QUOTES[active];

    return (
        <div
            ref={rootRef}
            className="front-grain relative flex h-full flex-col justify-between overflow-hidden bg-front-surface px-14 py-16 xl:px-20"
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(0deg, var(--color-front-line) 0 1px, transparent 1px 32px), repeating-linear-gradient(90deg, var(--color-front-line) 0 1px, transparent 1px 32px)",
                }}
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-front-accent/10 blur-3xl"
                aria-hidden="true"
            />

            <div data-panel-item className="relative flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-front-accent text-sm font-bold text-front-accent-ink">
                    D
                </span>
                <span className="font-display text-xl font-semibold text-front-ink">
                    {eyebrow}
                </span>
            </div>

            <div className="relative max-w-md">
                <h2
                    data-panel-item
                    className="font-display text-4xl leading-[1.15] font-semibold tracking-tight text-front-ink xl:text-5xl"
                >
                    {title}
                </h2>
                <p data-panel-item className="mt-5 text-base leading-relaxed text-front-muted">
                    {intro}
                </p>
            </div>

            <div data-panel-item className="relative max-w-sm border-t border-front-line pt-8">
                <blockquote ref={quoteRef}>
                    <p className="font-display text-lg leading-snug text-front-ink/90">
                        &ldquo;{current.quote}&rdquo;
                    </p>
                    <footer className="mt-3 text-xs text-front-muted">
                        <span className="font-medium text-front-ink/80">{current.name}</span>
                        {" — "}
                        {current.role}
                    </footer>
                </blockquote>
                <div className="mt-5 flex gap-1.5">
                    {QUOTES.map((q, i) => (
                        <span
                            key={q.name}
                            className={`h-1 rounded-full transition-all ${
                                i === active ? "w-5 bg-front-accent" : "w-1 bg-front-line"
                            }`}
                            aria-hidden="true"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
