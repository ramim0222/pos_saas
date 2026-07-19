import { useEffect, useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Loader2, X } from "lucide-react";

import { FrontButton } from "@/Components/Front/Button";

export default function ReceiveStockModal({ open, onClose, order }) {
    const rootRef = useRef(null);
    const panelRef = useRef(null);
    const [quantities, setQuantities] = useState({});
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!open || !order) return;
        const initial = {};
        order.items.forEach((item) => {
            const remaining = item.quantity - item.received_quantity;
            initial[item.id] = remaining > 0 ? String(remaining) : "0";
        });
        setQuantities(initial);
        setErrors({});
    }, [open, order]);

    useGSAP(
        () => {
            if (open) {
                gsap.set(rootRef.current, { display: "flex" });
                gsap.fromTo("[data-backdrop]", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out" });
                gsap.fromTo(panelRef.current, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
            } else if (rootRef.current) {
                gsap.to(panelRef.current, { scale: 0.95, opacity: 0, duration: 0.2, ease: "power2.in" });
                gsap.to("[data-backdrop]", {
                    opacity: 0,
                    duration: 0.2,
                    onComplete: () => gsap.set(rootRef.current, { display: "none" }),
                });
            }
        },
        { scope: rootRef, dependencies: [open] },
    );

    if (!order) return null;

    const submit = (e) => {
        e.preventDefault();
        setErrors({});
        setProcessing(true);

        router.post(
            route("admin.purchases.orders.receive", order.id),
            {
                items: order.items.map((item) => ({
                    item_id: item.id,
                    quantity: Number(quantities[item.id]) || 0,
                })),
            },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
                onSuccess: () => onClose(),
                onError: (err) => setErrors(err),
            },
        );
    };

    return (
        <div ref={rootRef} className="fixed inset-0 z-[60] hidden items-center justify-center p-4">
            <div data-backdrop className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
            <div ref={panelRef} className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-front-line bg-front-bg shadow-2xl">
                <div className="flex shrink-0 items-center justify-between border-b border-front-line px-6 py-5">
                    <h2 className="font-display text-lg font-medium text-front-ink">Receive stock — {order.po_number}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded-full p-2 text-front-muted hover:bg-front-surface hover:text-front-ink"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form id="receive-form" onSubmit={submit} noValidate className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
                    <p className="text-xs text-front-muted">
                        Enter quantities to record as received into <strong className="text-front-ink/80">{order.branch}</strong>. Partial
                        quantities are supported — leftover units stay pending for a later receipt.
                    </p>
                    {order.items.map((item) => {
                        const remaining = item.quantity - item.received_quantity;
                        return (
                            <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border border-front-line px-3 py-2.5">
                                <div className="min-w-0">
                                    <p className="truncate text-sm text-front-ink/90">
                                        {item.product}
                                        {item.variant && <span className="text-front-muted"> — {item.variant}</span>}
                                    </p>
                                    <p className="text-xs text-front-muted">
                                        {item.received_quantity}/{item.quantity} received
                                    </p>
                                </div>
                                <input
                                    type="number"
                                    min="0"
                                    max={remaining}
                                    disabled={remaining <= 0}
                                    value={quantities[item.id] ?? ""}
                                    onChange={(e) => setQuantities((prev) => ({ ...prev, [item.id]: e.target.value }))}
                                    className="w-20 shrink-0 rounded-lg border border-front-line bg-front-bg px-2.5 py-2 text-right text-sm text-front-ink outline-none focus:border-front-accent disabled:opacity-40"
                                />
                            </div>
                        );
                    })}
                    {errors.items && <p className="text-sm text-red-400">{errors.items}</p>}
                </form>

                <div className="flex shrink-0 items-center justify-end gap-3 border-t border-front-line px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-front-line px-4 py-2 text-sm font-medium text-front-ink hover:border-front-accent"
                    >
                        Cancel
                    </button>
                    <FrontButton type="submit" form="receive-form" disabled={processing}>
                        {processing ? (
                            <>
                                <Loader2 size={15} className="animate-spin" />
                                Confirming
                            </>
                        ) : (
                            "Confirm receipt"
                        )}
                    </FrontButton>
                </div>
            </div>
        </div>
    );
}
