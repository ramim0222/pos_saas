import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function PageHeader({ eyebrow, title, intro }) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.timeline({ defaults: { ease: "power3.out" } })
                .from("[data-eyebrow]", { opacity: 0, y: 14, duration: 0.6 })
                .from(
                    "[data-title]",
                    { opacity: 0, y: 24, duration: 0.7 },
                    "-=0.35",
                )
                .from("[data-intro]", { opacity: 0, y: 14, duration: 0.6 }, "-=0.4");
        },
        { scope: rootRef },
    );

    return (
        <header
            ref={rootRef}
            className="relative overflow-hidden bg-front-bg pt-32 pb-16 lg:pt-44 lg:pb-24"
        >
            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24 opacity-[0.35]"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(to top, var(--color-front-line) 0 1px, transparent 1px 28px)",
                }}
                aria-hidden="true"
            />
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                <p
                    data-eyebrow
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-front-line px-3.5 py-1.5 text-xs font-medium tracking-wide text-front-muted"
                >
                    {eyebrow}
                </p>
                <h1
                    data-title
                    className="max-w-3xl font-display text-4xl leading-[1.08] font-semibold tracking-tight text-front-ink sm:text-5xl lg:text-6xl"
                >
                    {title}
                </h1>
                <p
                    data-intro
                    className="mt-6 max-w-xl text-lg leading-relaxed text-front-muted"
                >
                    {intro}
                </p>
            </div>
        </header>
    );
}
