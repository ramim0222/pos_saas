import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function FeatureCategory({
    id,
    eyebrow,
    title,
    description,
    bullets,
    layout = "split-right",
    visual,
}) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.timeline({
                defaults: { ease: "power2.out" },
                scrollTrigger: { trigger: rootRef.current, start: "top 75%" },
            })
                .from("[data-cat-eyebrow]", { opacity: 0, y: 14, duration: 0.5 })
                .from("[data-cat-title]", { opacity: 0, y: 18, duration: 0.6 }, "-=0.3")
                .from("[data-cat-desc]", { opacity: 0, y: 14, duration: 0.5 }, "-=0.35")
                .from(
                    "[data-cat-bullet]",
                    { opacity: 0, x: -10, duration: 0.4, stagger: 0.08 },
                    "-=0.25",
                )
                .from(
                    "[data-cat-visual]",
                    { opacity: 0, y: 24, duration: 0.7 },
                    "-=0.5",
                );
        },
        { scope: rootRef },
    );

    const content = (
        <div className="max-w-lg">
            <p
                data-cat-eyebrow
                className="mb-4 text-xs font-medium tracking-[0.2em] text-front-accent uppercase"
            >
                {eyebrow}
            </p>
            <h2
                data-cat-title
                className="font-display text-3xl font-semibold tracking-tight text-front-ink lg:text-4xl"
            >
                {title}
            </h2>
            <p data-cat-desc className="mt-4 text-base leading-relaxed text-front-muted">
                {description}
            </p>
            <ul className="mt-7 space-y-3">
                {bullets.map((bullet) => (
                    <li
                        key={bullet}
                        data-cat-bullet
                        className="flex items-start gap-3 text-sm text-front-ink/85"
                    >
                        <Check size={16} className="mt-0.5 shrink-0 text-front-accent" />
                        <span>{bullet}</span>
                    </li>
                ))}
            </ul>
        </div>
    );

    const visualBlock = (
        <div data-cat-visual className="flex items-center justify-center">
            {visual}
        </div>
    );

    return (
        <section
            id={id}
            ref={rootRef}
            className="scroll-mt-28 border-t border-front-line py-20 lg:py-28"
        >
            {layout === "stacked" ? (
                <div className="space-y-12">
                    {content}
                    <div data-cat-visual className="w-full">
                        {visual}
                    </div>
                </div>
            ) : (
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    {layout === "split-left" ? (
                        <>
                            {visualBlock}
                            {content}
                        </>
                    ) : (
                        <>
                            {content}
                            {visualBlock}
                        </>
                    )}
                </div>
            )}
        </section>
    );
}
