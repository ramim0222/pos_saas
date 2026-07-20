import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Printer, RotateCcw, X, XCircle } from "lucide-react";

import StatusBadge from "@/Components/Admin/StatusBadge";

const METHOD_LABELS = {
    cash: "Cash",
    card: "Card",
    bkash: "bKash",
    nagad: "Nagad",
};

export default function SaleDetailPanel({ open, onClose, sale, onRefund, onVoid }) {
    const rootRef = useRef(null);
    const panelRef = useRef(null);

    useGSAP(
        () => {
            if (open) {
                gsap.set(rootRef.current, { display: "flex" });
                gsap.fromTo("[data-backdrop]", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out" });
                gsap.fromTo(panelRef.current, { xPercent: 100 }, { xPercent: 0, duration: 0.4, ease: "power3.out" });
            } else if (rootRef.current) {
                gsap.to(panelRef.current, { xPercent: 100, duration: 0.32, ease: "power2.in" });
                gsap.to("[data-backdrop]", {
                    opacity: 0,
                    duration: 0.25,
                    onComplete: () => gsap.set(rootRef.current, { display: "none" }),
                });
            }
        },
        { scope: rootRef, dependencies: [open] },
    );

    if (!sale) return null;

    return (
        <div ref={rootRef} className="fixed inset-0 z-50 hidden">
            <div data-backdrop className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
            <div ref={panelRef} className="relative ml-auto flex h-full w-full max-w-2xl flex-col bg-front-bg shadow-2xl">
                <div className="flex shrink-0 items-start justify-between border-b border-front-line px-6 py-5">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="font-display text-xl font-medium text-front-ink">{sale.sale_number}</h2>
                            <StatusBadge status={sale.status} />
                        </div>
                        <p className="mt-1 text-sm text-front-muted">
                            {sale.sold_at} · {sale.branch} · {sale.cashier}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close panel"
                        className="rounded-full p-2 text-front-muted hover:bg-front-surface hover:text-front-ink"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
                    {(sale.status === "refunded" || sale.status === "voided") && (
                        <div className="rounded-xl border border-red-400/30 bg-red-400/[0.06] px-4 py-3">
                            <p className="text-sm font-medium text-red-400">
                                {sale.status === "refunded" ? "Refunded" : "Voided"} — {sale.refunded_at ?? sale.voided_at}
                            </p>
                            <p className="mt-1 text-sm text-front-ink/80">{sale.refund_reason ?? sale.void_reason}</p>
                        </div>
                    )}

                    <div>
                        <p className="text-xs text-front-muted uppercase">Customer</p>
                        {sale.customer ? (
                            <p className="mt-1 text-sm font-medium text-front-ink">
                                {sale.customer.name}
                                {sale.customer.phone && <span className="text-front-muted"> · {sale.customer.phone}</span>}
                            </p>
                        ) : (
                            <p className="mt-1 text-sm text-front-muted">Walk-in customer</p>
                        )}
                    </div>

                    <div>
                        <p className="mb-3 text-xs font-medium tracking-wide text-front-muted uppercase">Line items</p>
                        <div className="overflow-hidden rounded-xl border border-front-line">
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className="border-b border-front-line bg-front-surface text-left text-xs font-medium text-front-muted uppercase">
                                        <th scope="col" className="px-3 py-2.5">Product</th>
                                        <th scope="col" className="px-3 py-2.5">Qty</th>
                                        <th scope="col" className="px-3 py-2.5">Unit price</th>
                                        <th scope="col" className="px-3 py-2.5">Discount</th>
                                        <th scope="col" className="px-3 py-2.5">Line total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sale.items.map((item) => (
                                        <tr key={item.id} className="border-b border-front-line last:border-b-0">
                                            <td className="px-3 py-2.5 text-front-ink/90">
                                                {item.product}
                                                {item.variant && <span className="text-front-muted"> — {item.variant}</span>}
                                            </td>
                                            <td className="px-3 py-2.5 tabular-figures text-front-muted">{item.quantity}</td>
                                            <td className="px-3 py-2.5 tabular-figures text-front-muted">
                                                ৳ {item.unit_price.toLocaleString("en-US")}
                                            </td>
                                            <td className="px-3 py-2.5 tabular-figures text-front-muted">
                                                {item.discount > 0 ? `− ৳ ${item.discount.toLocaleString("en-US")}` : "—"}
                                            </td>
                                            <td className="px-3 py-2.5 font-medium tabular-figures text-front-ink/90">
                                                ৳ {item.line_total.toLocaleString("en-US")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="space-y-2 rounded-xl border border-front-line bg-front-surface px-4 py-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-front-muted">Subtotal</span>
                            <span className="tabular-figures text-front-ink/85">৳ {sale.subtotal.toLocaleString("en-US")}</span>
                        </div>
                        {sale.discount_total > 0 && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-front-muted">Discount</span>
                                <span className="tabular-figures text-front-ink/85">− ৳ {sale.discount_total.toLocaleString("en-US")}</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-front-muted">Tax</span>
                            <span className="tabular-figures text-front-ink/85">৳ {sale.tax_total.toLocaleString("en-US")}</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-front-line pt-2 text-sm font-medium">
                            <span className="text-front-ink">Total</span>
                            <span className="font-display text-lg tabular-figures text-front-ink">
                                ৳ {sale.total.toLocaleString("en-US")}
                            </span>
                        </div>
                    </div>

                    <div>
                        <p className="mb-2 text-xs font-medium tracking-wide text-front-muted uppercase">Payment</p>
                        <div className="space-y-1.5">
                            {sale.payments.map((payment, idx) => (
                                <div key={idx} className="flex items-center justify-between rounded-lg border border-front-line px-3 py-2 text-sm">
                                    <span className="text-front-ink/85">{METHOD_LABELS[payment.method] ?? payment.method}</span>
                                    <span className="tabular-figures text-front-ink/85">৳ {payment.amount.toLocaleString("en-US")}</span>
                                </div>
                            ))}
                            {sale.payments.length === 0 && <p className="text-sm text-front-muted">No payment recorded.</p>}
                        </div>
                    </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-front-line px-6 py-4">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="flex items-center gap-1.5 rounded-full border border-front-line px-4 py-2 text-sm font-medium text-front-ink hover:border-front-accent"
                    >
                        <Printer size={14} />
                        Print receipt
                    </button>
                    {sale.status === "completed" && (
                        <>
                            <button
                                type="button"
                                onClick={() => onVoid(sale)}
                                className="flex items-center gap-1.5 rounded-full border border-red-400/30 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-400/10"
                            >
                                <XCircle size={14} />
                                Void
                            </button>
                            <button
                                type="button"
                                onClick={() => onRefund(sale)}
                                className="flex items-center gap-1.5 rounded-full border border-red-400/30 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-400/10"
                            >
                                <RotateCcw size={14} />
                                Refund
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
