import { useEffect, useRef } from "react";
import { Link } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Check, Sparkles } from "lucide-react";

import { FrontButton } from "@/Components/Front/Button";

function formatPrice(n) {
    return Math.round(n).toLocaleString("en-US");
}

export default function PricingCard({
    name,
    description,
    monthlyPrice,
    yearlyMonthlyPrice,
    yearlyBilledTotal,
    billing,
    features,
    featured = false,
    custom = false,
    ctaLabel,
    ctaHref,
    canRegister,
}) {
    const cardRef = useRef(null);
    const priceRef = useRef(null);
    const displayed = useRef({ value: monthlyPrice });
    const glowTweenRef = useRef(null);

    useGSAP(
        () => {
            if (custom || !priceRef.current) return;
            const target = billing === "monthly" ? monthlyPrice : yearlyMonthlyPrice;
            gsap.to(displayed.current, {
                value: target,
                duration: 0.5,
                ease: "power2.out",
                onUpdate: () => {
                    priceRef.current.textContent = formatPrice(displayed.current.value);
                },
                onComplete: () => {
                    priceRef.current.textContent = formatPrice(target);
                },
            });
        },
        { scope: cardRef, dependencies: [billing] },
    );

    useEffect(() => {
        if (!featured || !cardRef.current) return;
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;
        if (prefersReducedMotion) return;

        glowTweenRef.current = gsap.to(cardRef.current, {
            boxShadow: "0 0 0 1px var(--color-front-accent), 0 0 40px 4px oklch(0.77 0.14 75 / 0.25)",
            duration: 2.2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
        });

        return () => glowTweenRef.current?.kill();
    }, [featured]);

    return (
        <div
            ref={cardRef}
            className={`front-grain relative flex flex-col rounded-2xl border p-8 transition-transform duration-300 hover:-translate-y-1.5 ${
                featured
                    ? "border-front-accent bg-front-surface lg:scale-[1.04]"
                    : "border-front-line bg-front-surface"
            }`}
        >
            {featured && (
                <span className="absolute -top-3.5 left-8 inline-flex items-center gap-1.5 rounded-full bg-front-accent px-3 py-1 text-[0.65rem] font-semibold tracking-wide text-front-accent-ink uppercase">
                    <Sparkles size={12} />
                    Most popular
                </span>
            )}

            <p className="font-display text-xl font-medium text-front-ink">{name}</p>
            <p className="mt-2 text-sm leading-relaxed text-front-muted">{description}</p>

            <div className="mt-6 flex items-baseline gap-1.5">
                {custom ? (
                    <span className="font-display text-4xl font-semibold text-front-ink">
                        Custom
                    </span>
                ) : (
                    <>
                        <span className="font-display text-lg font-medium text-front-ink">
                            ৳
                        </span>
                        <span
                            ref={priceRef}
                            className="font-display text-4xl font-semibold tabular-figures text-front-ink"
                        >
                            {formatPrice(billing === "monthly" ? monthlyPrice : yearlyMonthlyPrice)}
                        </span>
                        <span className="text-sm text-front-muted">/mo</span>
                    </>
                )}
            </div>
            <p className="mt-1 text-xs text-front-muted">
                {custom
                    ? "Priced around your setup"
                    : billing === "yearly"
                      ? `Billed ৳${formatPrice(yearlyBilledTotal)} yearly`
                      : "Billed monthly, cancel anytime"}
            </p>

            <ul className="mt-7 flex-1 space-y-3">
                {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-front-ink/85">
                        <Check size={16} className="mt-0.5 shrink-0 text-front-accent" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            <div className="mt-8">
                {custom ? (
                    <FrontButton
                        variant="ghost"
                        className="w-full"
                        render={<a href={ctaHref} />}
                    >
                        {ctaLabel}
                    </FrontButton>
                ) : canRegister ? (
                    <FrontButton
                        variant={featured ? "primary" : "ghost"}
                        className="w-full"
                        render={<Link href={route("register")} />}
                    >
                        {ctaLabel}
                    </FrontButton>
                ) : (
                    <FrontButton
                        variant={featured ? "primary" : "ghost"}
                        className="w-full"
                        render={<a href={ctaHref} />}
                    >
                        {ctaLabel}
                    </FrontButton>
                )}
            </div>
        </div>
    );
}
