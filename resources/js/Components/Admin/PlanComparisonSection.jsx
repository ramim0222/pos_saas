import { useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Check, Loader2 } from "lucide-react";

const FEATURES = {
    Starter: ["1 branch", "2 staff accounts", "Up to 500 products", "1 POS terminal"],
    Pro: ["Up to 5 branches", "15 staff accounts", "Unlimited products", "Up to 5 POS terminals"],
    Enterprise: ["Unlimited branches", "Unlimited staff", "Unlimited products", "Dedicated account manager"],
};

export default function PlanComparisonSection({ subscription, plans }) {
    const rootRef = useRef(null);
    const [cycle, setCycle] = useState(subscription.billing_cycle);
    const [processingPlan, setProcessingPlan] = useState(null);

    useGSAP(
        () => {
            gsap.from("[data-plan-card]", { opacity: 0, y: 16, duration: 0.5, stagger: 0.08, ease: "power2.out" });
        },
        { scope: rootRef },
    );

    const switchPlan = (planName) => {
        if (planName === subscription.plan && cycle === subscription.billing_cycle) return;
        setProcessingPlan(planName);
        router.post(
            route("admin.billing.change-plan"),
            { plan: planName, billing_cycle: cycle },
            {
                preserveScroll: true,
                onFinish: () => setProcessingPlan(null),
            },
        );
    };

    return (
        <div ref={rootRef} className="rounded-2xl border border-front-line bg-front-surface p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="font-display text-lg font-medium text-front-ink">Change plan</p>
                    <p className="mt-1 text-sm text-front-muted">
                        Upgrades apply immediately; the new price reflects on your next bKash payment. Downgrades take effect at your next renewal.
                    </p>
                </div>
                <div className="inline-flex shrink-0 rounded-full border border-front-line p-1">
                    {["monthly", "yearly"].map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setCycle(c)}
                            className={`rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ${
                                cycle === c ? "bg-front-accent text-front-accent-ink" : "text-front-muted hover:text-front-ink"
                            }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                {plans.map((plan) => {
                    const isCurrent = plan.name === subscription.plan && cycle === subscription.billing_cycle;
                    const price = cycle === "yearly" ? plan.yearly : plan.monthly;

                    return (
                        <div
                            key={plan.name}
                            data-plan-card
                            className={`flex flex-col rounded-xl border p-5 ${
                                isCurrent ? "border-front-accent bg-front-accent/[0.05]" : "border-front-line bg-front-bg"
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <p className="font-display text-lg font-medium text-front-ink">{plan.name}</p>
                                {isCurrent && (
                                    <span className="rounded-full bg-front-accent/15 px-2.5 py-0.5 text-[11px] font-medium text-front-accent">
                                        Current
                                    </span>
                                )}
                            </div>
                            <p className="mt-2 font-display text-2xl font-semibold tabular-figures text-front-ink">
                                ৳ {price.toLocaleString("en-US")}
                                <span className="text-sm font-normal text-front-muted"> /{cycle === "yearly" ? "yr" : "mo"}</span>
                            </p>

                            <ul className="mt-4 flex-1 space-y-2">
                                {FEATURES[plan.name].map((feature) => (
                                    <li key={feature} className="flex items-start gap-2 text-sm text-front-ink/80">
                                        <Check size={14} className="mt-0.5 shrink-0 text-front-green" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                type="button"
                                onClick={() => switchPlan(plan.name)}
                                disabled={isCurrent || processingPlan === plan.name}
                                className={`mt-5 flex items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                                    isCurrent
                                        ? "border-front-line text-front-muted"
                                        : "border-front-accent text-front-accent hover:bg-front-accent hover:text-front-accent-ink"
                                }`}
                            >
                                {processingPlan === plan.name ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        Switching
                                    </>
                                ) : isCurrent ? (
                                    "Current plan"
                                ) : (
                                    "Switch to this plan"
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
