import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const TIERS = [
    { name: "Bronze", min: 0, max: 100, className: "text-amber-600" },
    { name: "Silver", min: 100, max: 300, className: "text-slate-300" },
    { name: "Gold", min: 300, max: 600, className: "text-front-accent" },
    { name: "Platinum", min: 600, max: 1200, className: "text-blue-300" },
];

function tierFor(points) {
    return TIERS.find((t) => points < t.max) ?? TIERS[TIERS.length - 1];
}

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function LoyaltyRing({ points }) {
    const circleRef = useRef(null);
    const numberRef = useRef(null);
    const tier = tierFor(points);
    const progress = Math.min(1, (points - tier.min) / (tier.max - tier.min));

    useGSAP(
        () => {
            if (!circleRef.current || !numberRef.current) return;

            const targetOffset = CIRCUMFERENCE * (1 - progress);
            gsap.set(circleRef.current, { strokeDasharray: CIRCUMFERENCE, strokeDashoffset: CIRCUMFERENCE });

            const tween = gsap.to(circleRef.current, {
                strokeDashoffset: targetOffset,
                duration: 1,
                ease: "power2.out",
                delay: 0.15,
            });

            const counter = { value: 0 };
            const numTween = gsap.to(counter, {
                value: points,
                duration: 1,
                ease: "power2.out",
                delay: 0.15,
                onUpdate: () => {
                    numberRef.current.textContent = Math.round(counter.value);
                },
            });

            const fallback = window.setTimeout(() => {
                gsap.set(circleRef.current, { strokeDashoffset: targetOffset });
                numberRef.current.textContent = points;
            }, 1500);

            return () => {
                tween.kill();
                numTween.kill();
                window.clearTimeout(fallback);
            };
        },
        { dependencies: [points] },
    );

    return (
        <div className="flex items-center gap-4">
            <svg width="96" height="96" viewBox="0 0 96 96" className="shrink-0 -rotate-90">
                <circle cx="48" cy="48" r={RADIUS} fill="none" stroke="currentColor" strokeWidth="7" className="text-front-line" />
                <circle
                    ref={circleRef}
                    cx="48"
                    cy="48"
                    r={RADIUS}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="7"
                    strokeLinecap="round"
                    className={tier.className}
                />
            </svg>
            <div>
                <p className="text-xs font-medium tracking-wide text-front-muted uppercase">{tier.name} tier</p>
                <p className="font-display text-2xl font-semibold tabular-figures text-front-ink">
                    <span ref={numberRef}>0</span> <span className="text-sm font-normal text-front-muted">pts</span>
                </p>
                <p className="mt-0.5 text-xs text-front-muted">
                    {tier.max - points > 0 ? `${tier.max - points} pts to next tier` : "Highest tier reached"}
                </p>
            </div>
        </div>
    );
}
