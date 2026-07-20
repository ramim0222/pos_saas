import { useEffect, useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { AlertTriangle, Loader2, X } from "lucide-react";

import { FrontButton } from "@/Components/Front/Button";

export default function RefundVoidModal({ open, onClose, sale, mode }) {
    const rootRef = useRef(null);
    const panelRef = useRef(null);
    const [reason, setReason] = useState("");
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    const isRefund = mode === "refund";

    useEffect(() => {
        if (!open) return;
        setReason("");
        setError(null);
    }, [open, sale]);

    useGSAP(
        () => {
            if (open) {
                gsap.set(rootRef.current, { display: "flex" });
                gsap.fromTo("[data-backdrop]", { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power1.out" });
                gsap.fromTo(
                    panelRef.current,
                    { scale: 0.92, opacity: 0, y: 12 },
                    { scale: 1, opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
                );
            } else if (rootRef.current) {
                gsap.to(panelRef.current, { scale: 0.94, opacity: 0, y: 8, duration: 0.3, ease: "power2.in" });
                gsap.to("[data-backdrop]", {
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => gsap.set(rootRef.current, { display: "none" }),
                });
            }
        },
        { scope: rootRef, dependencies: [open] },
    );

    if (!sale) return null;

    const submit = (e) => {
        e.preventDefault();
        setError(null);
        setProcessing(true);

        const url = isRefund ? route("admin.sales.refund", sale.id) : route("admin.sales.void", sale.id);

        router.post(
            url,
            { reason },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
                onSuccess: () => onClose(),
                onError: (err) => setError(err.reason ?? "Something went wrong."),
            },
        );
    };

    return (
        <div ref={rootRef} className="fixed inset-0 z-[60] hidden items-center justify-center p-4">
            <div data-backdrop className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />
            <div
                ref={panelRef}
                className="relative w-full max-w-md rounded-2xl border border-red-400/30 bg-front-bg shadow-2xl"
            >
                <div className="flex items-start justify-between border-b border-red-400/20 px-6 py-5">
                    <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-400/10 text-red-400">
                            <AlertTriangle size={18} />
                        </span>
                        <div>
                            <h2 className="font-display text-lg font-medium text-front-ink">
                                {isRefund ? "Refund transaction" : "Void transaction"}
                            </h2>
                            <p className="mt-0.5 text-sm text-front-muted">{sale.sale_number}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded-full p-2 text-front-muted hover:bg-front-surface hover:text-front-ink"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={submit} noValidate className="space-y-4 px-6 py-5">
                    <div className="rounded-lg border border-red-400/20 bg-red-400/[0.05] px-4 py-3 text-sm text-front-ink/80">
                        <p className="font-medium text-red-400">This will reverse the transaction:</p>
                        <ul className="mt-1.5 list-inside list-disc space-y-0.5 text-front-ink/70">
                            <li>
                                Stock will be restored for all {sale.items.length} line item{sale.items.length === 1 ? "" : "s"} at{" "}
                                {sale.branch}
                            </li>
                            <li>৳ {sale.total.toLocaleString("en-US")} will be marked as {isRefund ? "refunded" : "voided"}</li>
                            <li>This action cannot be undone</li>
                        </ul>
                    </div>

                    <div>
                        <label htmlFor="reason" className="text-xs font-medium tracking-wide text-front-muted uppercase">
                            Reason {isRefund ? "for refund" : "for void"}
                        </label>
                        <textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                            required
                            placeholder={isRefund ? "e.g. Customer returned item, unopened" : "e.g. Cashier entry error"}
                            className="mt-2 w-full rounded-lg border border-front-line bg-front-surface px-3 py-2.5 text-sm text-front-ink outline-none placeholder:text-front-muted focus:border-red-400/50"
                        />
                        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full border border-front-line px-4 py-2 text-sm font-medium text-front-ink hover:border-front-accent"
                        >
                            Cancel
                        </button>
                        <FrontButton
                            type="submit"
                            disabled={processing || !reason.trim()}
                            className="!bg-red-400 !text-front-bg hover:!brightness-110"
                        >
                            {processing ? (
                                <>
                                    <Loader2 size={15} className="animate-spin" />
                                    Processing
                                </>
                            ) : isRefund ? (
                                "Confirm refund"
                            ) : (
                                "Confirm void"
                            )}
                        </FrontButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
