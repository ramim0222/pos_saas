import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const STATUS_META = {
    paid: { icon: CheckCircle2, className: "text-front-green", label: "Paid" },
    pending: { icon: Clock, className: "text-front-accent", label: "Pending" },
    failed: { icon: XCircle, className: "text-red-400", label: "Failed" },
};

export default function RecentPaymentsFeed({ payments }) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from("[data-payment-row]", {
                opacity: 0,
                y: 10,
                duration: 0.4,
                stagger: 0.05,
                ease: "power2.out",
                scrollTrigger: { trigger: rootRef.current, start: "top 85%" },
            });
        },
        { scope: rootRef },
    );

    return (
        <div ref={rootRef} className="rounded-2xl border border-front-line bg-front-surface p-6">
            <p className="font-display text-lg font-medium text-front-ink">
                Recent payments
            </p>
            <p className="mb-5 text-xs text-front-muted">Latest bKash subscription renewals</p>

            <div className="divide-y divide-front-line">
                {payments.map((payment) => {
                    const meta = STATUS_META[payment.status];
                    const Icon = meta.icon;
                    return (
                        <div
                            key={payment.id}
                            data-payment-row
                            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                        >
                            <Icon size={16} className={`shrink-0 ${meta.className}`} />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-front-ink/90">
                                    {payment.store}
                                </p>
                                <p className="text-xs text-front-muted">
                                    {payment.plan} · {payment.method} · {payment.time}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium tabular-figures text-front-ink/90">
                                    ৳ {payment.amount.toLocaleString("en-US")}
                                </p>
                                <p className={`text-xs ${meta.className}`}>{meta.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
