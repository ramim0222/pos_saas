import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PlanDistribution({ plans }) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from("[data-plan-bar]", {
                scaleX: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                transformOrigin: "left center",
                scrollTrigger: { trigger: rootRef.current, start: "top 85%" },
            });
            gsap.from("[data-plan-row]", {
                opacity: 0,
                y: 10,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: { trigger: rootRef.current, start: "top 85%" },
            });
        },
        { scope: rootRef },
    );

    const totalStores = plans.reduce((sum, p) => sum + p.stores, 0);

    return (
        <div ref={rootRef} className="rounded-2xl border border-front-line bg-front-surface p-6">
            <p className="font-display text-lg font-medium text-front-ink">
                Plan distribution
            </p>
            <p className="mb-6 text-xs text-front-muted">
                {totalStores} active stores, by plan and revenue share
            </p>

            <div className="space-y-5">
                {plans.map((plan) => (
                    <div key={plan.plan} data-plan-row>
                        <div className="mb-1.5 flex items-baseline justify-between text-sm">
                            <span className="font-medium text-front-ink/90">{plan.plan}</span>
                            <span className="text-xs text-front-muted">
                                {plan.stores} stores · {Math.round(plan.revenueShare * 100)}% of revenue
                            </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-front-bg">
                            <div
                                data-plan-bar
                                className="h-2 rounded-full bg-front-accent"
                                style={{ width: `${plan.revenueShare * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
