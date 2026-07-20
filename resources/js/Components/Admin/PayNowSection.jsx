import { useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Loader2, ShieldCheck } from "lucide-react";

import { FrontButton } from "@/Components/Front/Button";

export default function PayNowSection({ subscription, onPaid }) {
    const rootRef = useRef(null);
    const [processing, setProcessing] = useState(false);

    useGSAP(
        () => {
            gsap.from(rootRef.current, { opacity: 0, y: 14, duration: 0.5, ease: "power2.out", delay: 0.08 });
        },
        { scope: rootRef },
    );

    const nextPeriodDays = subscription.billing_cycle === "yearly" ? 365 : 30;

    const payNow = () => {
        setProcessing(true);
        router.post(
            route("admin.billing.pay-now"),
            {},
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
                onSuccess: () => onPaid(),
            },
        );
    };

    return (
        <div ref={rootRef} className="rounded-2xl border border-front-line bg-front-surface p-6 sm:p-8">
            <p className="font-display text-lg font-medium text-front-ink">Renew your subscription</p>
            <p className="mt-1 text-sm text-front-muted">
                Manual renewal via bKash — nothing is charged automatically.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-front-line bg-front-bg px-5 py-4">
                <div>
                    <p className="text-xs text-front-muted uppercase">Amount due</p>
                    <p className="mt-1 font-display text-2xl font-semibold tabular-figures text-front-ink">
                        ৳ {subscription.amount.toLocaleString("en-US")}
                    </p>
                    <p className="mt-0.5 text-xs text-front-muted">
                        Covers the next {nextPeriodDays === 365 ? "12 months" : "30 days"} of your {subscription.plan} plan
                    </p>
                </div>
                <FrontButton onClick={payNow} disabled={processing}>
                    {processing ? (
                        <>
                            <Loader2 size={15} className="animate-spin" />
                            Connecting to bKash…
                        </>
                    ) : (
                        "Pay via bKash"
                    )}
                </FrontButton>
            </div>

            <p className="mt-4 flex items-center gap-1.5 text-xs text-front-muted">
                <ShieldCheck size={13} />
                You'll be guided through bKash's Create → Confirm → Verify checkout — your card or wallet details never touch our servers.
            </p>
        </div>
    );
}
