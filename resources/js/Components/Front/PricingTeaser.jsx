import { Fragment, useRef } from "react";
import { Link } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Check } from "lucide-react";

import { FrontButton } from "@/Components/Front/Button";

gsap.registerPlugin(ScrollTrigger);

const TIERS = [
    { name: "Starter", price: "৳ 999", note: "per month", featured: false },
    { name: "Pro", price: "৳ 2,499", note: "per month", featured: true },
    { name: "Enterprise", price: "Custom", note: "talk to us", featured: false },
];

const ROWS = [
    { label: "Branches", values: ["1", "Up to 5", "Unlimited"] },
    { label: "Staff accounts", values: ["2", "15", "Unlimited"] },
    { label: "Offline POS", values: [true, true, true] },
    { label: "bKash auto-reminders", values: [true, true, true] },
    { label: "Priority support", values: [false, true, true] },
];

export default function PricingTeaser() {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from(rootRef.current.querySelector("[data-sheet]"), {
                opacity: 0,
                y: 24,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: { trigger: rootRef.current, start: "top 78%" },
            });
        },
        { scope: rootRef },
    );

    return (
        <section id="pricing" ref={rootRef} className="bg-front-bg py-24 lg:py-32">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
                    <div className="max-w-2xl">
                        <p className="mb-4 text-xs font-medium tracking-[0.2em] text-front-accent uppercase">
                            Pricing
                        </p>
                        <h2 className="font-display text-4xl font-semibold tracking-tight text-front-ink lg:text-5xl">
                            Priced for one branch. Ready for twenty.
                        </h2>
                    </div>
                    <Link
                        href="/pricing"
                        className="group inline-flex items-center gap-1.5 text-sm font-medium text-front-ink/85 hover:text-front-accent"
                    >
                        Full pricing details
                        <ArrowUpRight
                            size={15}
                            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                    </Link>
                </div>

                <div
                    data-sheet
                    className="overflow-x-auto rounded-2xl border border-front-line bg-front-surface"
                >
                    <div className="grid min-w-[640px] grid-cols-4">
                        <div />
                        {TIERS.map((tier) => (
                            <div
                                key={tier.name}
                                className={`border-l border-front-line px-6 py-8 ${
                                    tier.featured ? "bg-front-accent/[0.07]" : ""
                                }`}
                            >
                                {tier.featured && (
                                    <span className="mb-3 inline-block rounded-full bg-front-accent px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-wide text-front-accent-ink uppercase">
                                        Most chosen
                                    </span>
                                )}
                                <p className="font-display text-lg font-medium text-front-ink">
                                    {tier.name}
                                </p>
                                <p className="mt-3 font-display text-3xl font-semibold tabular-figures text-front-ink">
                                    {tier.price}
                                </p>
                                <p className="text-xs text-front-muted">{tier.note}</p>
                            </div>
                        ))}

                        {ROWS.map((row) => (
                            <Fragment key={row.label}>
                                <div className="border-t border-front-line px-6 py-4 text-sm text-front-muted">
                                    {row.label}
                                </div>
                                {row.values.map((val, i) => (
                                    <div
                                        key={`${row.label}-${TIERS[i].name}`}
                                        className={`border-t border-l border-front-line px-6 py-4 text-sm ${
                                            TIERS[i].featured ? "bg-front-accent/[0.07]" : ""
                                        }`}
                                    >
                                        {typeof val === "boolean" ? (
                                            val ? (
                                                <Check size={16} className="text-front-accent" />
                                            ) : (
                                                <span className="text-front-muted">—</span>
                                            )
                                        ) : (
                                            <span className="tabular-figures text-front-ink/85">{val}</span>
                                        )}
                                    </div>
                                ))}
                            </Fragment>
                        ))}

                        <div className="border-t border-front-line px-6 py-6" />
                        {TIERS.map((tier) => (
                            <div
                                key={`${tier.name}-cta`}
                                className={`border-t border-l border-front-line px-6 py-6 ${
                                    tier.featured ? "bg-front-accent/[0.07]" : ""
                                }`}
                            >
                                <FrontButton
                                    size="sm"
                                    variant={tier.featured ? "primary" : "ghost"}
                                    render={<Link href={route("register")} />}
                                >
                                    Choose {tier.name}
                                </FrontButton>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
