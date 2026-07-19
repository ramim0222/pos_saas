import { useRef } from "react";
import { Link } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Wallet } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function BillingPipelineWidget({ pipeline }) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from(rootRef.current, {
                opacity: 0,
                y: 16,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: { trigger: rootRef.current, start: "top 85%" },
            });
        },
        { scope: rootRef },
    );

    const rows = [
        { label: "Renewals due this week", value: pipeline.dueThisWeek },
        { label: "In grace period", value: pipeline.inGracePeriod, tone: "warning" },
        { label: "Overdue", value: pipeline.overdue, tone: "danger" },
        { label: "Failed payments", value: pipeline.failedPayments, tone: "danger" },
    ];

    return (
        <div
            ref={rootRef}
            className="front-grain relative overflow-hidden rounded-2xl border border-front-line bg-front-surface p-6"
        >
            <div className="mb-5 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-front-accent/10 text-front-accent">
                    <Wallet size={16} />
                </span>
                <div>
                    <p className="font-display text-lg font-medium text-front-ink">
                        Billing pipeline
                    </p>
                    <p className="text-xs text-front-muted">bKash renewals across the platform</p>
                </div>
            </div>

            <div className="space-y-3">
                {rows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between text-sm">
                        <span className="text-front-muted">{row.label}</span>
                        <span
                            className={`font-medium tabular-figures ${
                                row.tone === "danger"
                                    ? "text-red-400"
                                    : row.tone === "warning"
                                      ? "text-front-accent"
                                      : "text-front-ink/90"
                            }`}
                        >
                            {row.value}
                        </span>
                    </div>
                ))}
            </div>

            <Link
                href="/admin/billing"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-front-accent hover:underline"
            >
                Go to Billing
                <ArrowUpRight size={14} />
            </Link>
        </div>
    );
}
