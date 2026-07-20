import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CalendarClock, CheckCircle2 } from "lucide-react";

const STATUS_META = {
    trial: { label: (days) => `Trial — ${days} day${days === 1 ? "" : "s"} left`, className: "bg-front-accent/15 text-front-accent" },
    active: { label: () => "Active", className: "bg-front-green/15 text-front-green" },
    grace: { label: (days) => `Grace period — ${days} day${days === 1 ? "" : "s"} left`, className: "bg-amber-400/15 text-amber-500" },
    suspended: { label: () => "Suspended", className: "bg-red-400/15 text-red-400" },
};

export default function CurrentPlanCard({ subscription, justPaid }) {
    const rootRef = useRef(null);
    const badgeRef = useRef(null);
    const checkRef = useRef(null);

    useGSAP(
        () => {
            gsap.from(rootRef.current, { opacity: 0, y: 14, duration: 0.5, ease: "power2.out" });
        },
        { scope: rootRef },
    );

    useGSAP(
        () => {
            if (!badgeRef.current) return;
            gsap.fromTo(
                badgeRef.current,
                { opacity: 0, y: -4 },
                { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
            );
        },
        { scope: rootRef, dependencies: [subscription.status, subscription.days_left] },
    );

    useGSAP(
        () => {
            if (!justPaid || !checkRef.current) return;
            gsap.fromTo(
                checkRef.current,
                { scale: 0, opacity: 0, rotate: -20 },
                { scale: 1, opacity: 1, rotate: 0, duration: 0.55, ease: "back.out(2.2)" },
            );
        },
        { scope: rootRef, dependencies: [justPaid] },
    );

    const meta = STATUS_META[subscription.status] ?? STATUS_META.active;

    return (
        <div ref={rootRef} className="rounded-2xl border border-front-line bg-front-surface p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-medium tracking-wide text-front-muted uppercase">Current plan</p>
                    <p className="mt-2 font-display text-3xl font-semibold text-front-ink">{subscription.plan}</p>
                    <p className="mt-1 text-sm text-front-muted">
                        ৳ {subscription.amount.toLocaleString("en-US")} / {subscription.billing_cycle === "yearly" ? "year" : "month"}
                    </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <span
                        ref={badgeRef}
                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium ${meta.className}`}
                    >
                        {meta.label(subscription.days_left)}
                    </span>
                    {justPaid && (
                        <span ref={checkRef} className="flex items-center gap-1.5 text-xs font-medium text-front-green">
                            <CheckCircle2 size={14} />
                            Payment confirmed
                        </span>
                    )}
                </div>
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-xl border border-front-line bg-front-bg px-4 py-3 text-sm text-front-ink/85">
                <CalendarClock size={16} className="shrink-0 text-front-muted" />
                <span>
                    Current period: <span className="font-medium text-front-ink">{subscription.current_period_start}</span> –{" "}
                    <span className="font-medium text-front-ink">{subscription.current_period_end}</span>
                </span>
            </div>
        </div>
    );
}
