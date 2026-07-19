import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function PricingToggle({ billing, onChange }) {
    const rootRef = useRef(null);
    const pillRef = useRef(null);

    useGSAP(
        () => {
            const buttons = rootRef.current.querySelectorAll("[data-toggle-btn]");
            const target = billing === "monthly" ? buttons[0] : buttons[1];
            if (!target) return;

            gsap.to(pillRef.current, {
                x: target.offsetLeft,
                width: target.offsetWidth,
                duration: 0.4,
                ease: "power3.out",
            });
        },
        { scope: rootRef, dependencies: [billing] },
    );

    return (
        <div className="flex flex-col items-center gap-3">
            <div
                ref={rootRef}
                className="relative inline-flex items-center rounded-full border border-front-line bg-front-surface p-1"
            >
                <div
                    ref={pillRef}
                    className="absolute top-1 bottom-1 left-1 rounded-full bg-front-accent"
                    aria-hidden="true"
                />
                <button
                    type="button"
                    data-toggle-btn
                    onClick={() => onChange("monthly")}
                    className={`relative z-10 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                        billing === "monthly" ? "text-front-accent-ink" : "text-front-muted"
                    }`}
                    aria-pressed={billing === "monthly"}
                >
                    Monthly
                </button>
                <button
                    type="button"
                    data-toggle-btn
                    onClick={() => onChange("yearly")}
                    className={`relative z-10 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                        billing === "yearly" ? "text-front-accent-ink" : "text-front-muted"
                    }`}
                    aria-pressed={billing === "yearly"}
                >
                    Yearly
                </button>
            </div>
            <span
                className={`text-xs font-medium tracking-wide uppercase transition-opacity ${
                    billing === "yearly" ? "text-front-accent opacity-100" : "opacity-0"
                }`}
            >
                Save about 17% billed yearly
            </span>
        </div>
    );
}
