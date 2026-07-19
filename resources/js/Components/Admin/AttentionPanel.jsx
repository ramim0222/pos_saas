import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AlertTriangle, Send } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function AttentionPanel({ stores }) {
    const rootRef = useRef(null);
    const iconRefs = useRef([]);

    useGSAP(
        () => {
            gsap.from("[data-attention-row]", {
                opacity: 0,
                y: 12,
                duration: 0.45,
                stagger: 0.07,
                ease: "power2.out",
                scrollTrigger: { trigger: rootRef.current, start: "top 85%" },
            });
        },
        { scope: rootRef },
    );

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;
        if (prefersReducedMotion) return;

        const tweens = iconRefs.current
            .filter(Boolean)
            .map((el) =>
                gsap.to(el, {
                    opacity: 0.45,
                    duration: 1.1,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1,
                }),
            );

        return () => tweens.forEach((t) => t.kill());
    }, [stores]);

    return (
        <div ref={rootRef} className="rounded-2xl border border-front-line bg-front-surface p-6">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <p className="font-display text-lg font-medium text-front-ink">
                        Needs attention
                    </p>
                    <p className="text-xs text-front-muted">
                        Stores in grace period or overdue on renewal
                    </p>
                </div>
                <span className="rounded-full bg-front-accent/10 px-2.5 py-1 text-xs font-medium text-front-accent">
                    {stores.length}
                </span>
            </div>

            <div className="space-y-3">
                {stores.map((store, i) => (
                    <div
                        key={store.id}
                        data-attention-row
                        className="flex items-center gap-3 rounded-lg border border-front-line px-4 py-3"
                    >
                        <AlertTriangle
                            ref={(el) => (iconRefs.current[i] = el)}
                            size={16}
                            className={store.status === "overdue" ? "text-red-400" : "text-front-accent"}
                        />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-front-ink/90">
                                {store.name}
                            </p>
                            <p className="text-xs text-front-muted">
                                {store.plan} · ৳ {store.dueAmount.toLocaleString("en-US")} ·{" "}
                                {store.status === "overdue"
                                    ? "Payment overdue"
                                    : `${store.daysLeft} day${store.daysLeft === 1 ? "" : "s"} left`}
                            </p>
                        </div>
                        <button
                            type="button"
                            className="flex shrink-0 items-center gap-1.5 rounded-full border border-front-line px-3 py-1.5 text-xs font-medium text-front-ink transition-colors hover:border-front-accent hover:text-front-accent"
                        >
                            <Send size={12} />
                            Send reminder
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
