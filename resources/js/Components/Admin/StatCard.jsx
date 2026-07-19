import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TrendingDown, TrendingUp } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

function formatValue(value, format) {
    if (format === "currency") {
        return `৳ ${Math.round(value).toLocaleString("en-US")}`;
    }
    return Math.round(value).toLocaleString("en-US");
}

export default function StatCard({ label, value, change, changeLabel, format = "number", tone }) {
    const cardRef = useRef(null);
    const numRef = useRef(null);

    useGSAP(() => {
        const el = numRef.current;
        if (!el) return;
        const counter = { value: 0 };
        let fallback;

        const trigger = ScrollTrigger.create({
            trigger: cardRef.current,
            start: "top 90%",
            once: true,
            onEnter: () => {
                gsap.to(counter, {
                    value,
                    duration: 1.1,
                    ease: "power2.out",
                    onUpdate: () => {
                        el.textContent = formatValue(counter.value, format);
                    },
                    onComplete: () => {
                        el.textContent = formatValue(value, format);
                    },
                });

                fallback = window.setTimeout(() => {
                    el.textContent = formatValue(value, format);
                }, 2000);
            },
        });

        return () => {
            trigger.kill();
            window.clearTimeout(fallback);
        };
    }, []);

    const isPositive = change >= 0;
    const badNews = tone === "warning" ? isPositive : !isPositive;
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;

    return (
        <div
            ref={cardRef}
            data-stat-card
            className="rounded-2xl border border-front-line bg-front-surface p-6"
        >
            <p className="text-xs tracking-wide text-front-muted uppercase">{label}</p>
            <p className="mt-3 font-display text-3xl font-semibold tabular-figures text-front-ink">
                <span ref={numRef}>{formatValue(0, format)}</span>
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs">
                <span
                    className={`flex items-center gap-1 font-medium ${
                        badNews ? "text-red-400" : "text-front-green"
                    }`}
                >
                    <TrendIcon size={13} />
                    {Math.abs(change)}
                    {format === "currency" ? "%" : ""}
                </span>
                <span className="text-front-muted">{changeLabel}</span>
            </div>
        </div>
    );
}
