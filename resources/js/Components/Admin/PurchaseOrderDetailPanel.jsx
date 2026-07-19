import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { PackageCheck, Pencil, Send, X, XCircle } from "lucide-react";

import StatusBadge from "@/Components/Admin/StatusBadge";

export default function PurchaseOrderDetailPanel({ open, onClose, order, onEdit, onSend, onReceive, onCancel }) {
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

    if (!order) return null;

    return (
        <div ref={rootRef} className="fixed inset-0 z-50 hidden">
            <div data-backdrop className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
            <div ref={panelRef} className="relative ml-auto flex h-full w-full max-w-2xl flex-col bg-front-bg shadow-2xl">
                <div className="flex shrink-0 items-start justify-between border-b border-front-line px-6 py-5">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="font-display text-xl font-medium text-front-ink">{order.po_number}</h2>
                            <StatusBadge status={order.status} />
                        </div>
                        <p className="mt-1 text-sm text-front-muted">
                            {order.supplier} · {order.branch}
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
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div>
                            <p className="text-xs text-front-muted uppercase">Order date</p>
                            <p className="mt-1 text-sm font-medium text-front-ink">{order.order_date}</p>
                        </div>
                        <div>
                            <p className="text-xs text-front-muted uppercase">Expected delivery</p>
                            <p className="mt-1 text-sm font-medium text-front-ink">{order.expected_delivery ?? "—"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-front-muted uppercase">Total</p>
                            <p className="mt-1 text-sm font-medium text-front-ink tabular-figures">
                                ৳ {order.total_amount.toLocaleString("en-US")}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-front-muted uppercase">Received</p>
                            <p className="mt-1 text-sm font-medium text-front-ink tabular-figures">{order.receiving_progress}</p>
                        </div>
                    </div>

                    {order.notes && (
                        <div className="rounded-xl border border-front-line bg-front-surface px-4 py-3">
                            <p className="text-xs text-front-muted uppercase">Notes</p>
                            <p className="mt-1 text-sm text-front-ink/85">{order.notes}</p>
                        </div>
                    )}

                    <div>
                        <p className="mb-3 text-xs font-medium tracking-wide text-front-muted uppercase">
                            Line items & receiving history
                        </p>
                        <div className="overflow-hidden rounded-xl border border-front-line">
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className="border-b border-front-line bg-front-surface text-left text-xs font-medium text-front-muted uppercase">
                                        <th scope="col" className="px-3 py-2.5">Product</th>
                                        <th scope="col" className="px-3 py-2.5">Ordered</th>
                                        <th scope="col" className="px-3 py-2.5">Received</th>
                                        <th scope="col" className="px-3 py-2.5">Unit cost</th>
                                        <th scope="col" className="px-3 py-2.5">Line total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item) => (
                                        <tr key={item.id} className="border-b border-front-line last:border-b-0">
                                            <td className="px-3 py-2.5 text-front-ink/90">
                                                {item.product}
                                                {item.variant && <span className="text-front-muted"> — {item.variant}</span>}
                                            </td>
                                            <td className="px-3 py-2.5 tabular-figures text-front-muted">{item.quantity}</td>
                                            <td className="px-3 py-2.5 tabular-figures">
                                                <span
                                                    className={
                                                        item.received_quantity >= item.quantity
                                                            ? "font-medium text-front-green"
                                                            : item.received_quantity > 0
                                                              ? "font-medium text-front-accent"
                                                              : "text-front-muted"
                                                    }
                                                >
                                                    {item.received_quantity}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2.5 tabular-figures text-front-muted">
                                                ৳ {item.unit_cost.toLocaleString("en-US")}
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
                </div>

                <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-front-line px-6 py-4">
                    {order.status === "draft" && (
                        <>
                            <button
                                type="button"
                                onClick={() => onEdit(order)}
                                className="flex items-center gap-1.5 rounded-full border border-front-line px-4 py-2 text-sm font-medium text-front-ink hover:border-front-accent"
                            >
                                <Pencil size={14} />
                                Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => onSend(order)}
                                className="flex items-center gap-1.5 rounded-full bg-front-accent px-4 py-2 text-sm font-medium text-front-accent-ink"
                            >
                                <Send size={14} />
                                Send to supplier
                            </button>
                        </>
                    )}
                    {(order.status === "sent" || order.status === "partially_received") && (
                        <>
                            <button
                                type="button"
                                onClick={() => onCancel(order)}
                                className="flex items-center gap-1.5 rounded-full border border-red-400/30 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-400/10"
                            >
                                <XCircle size={14} />
                                Cancel order
                            </button>
                            <button
                                type="button"
                                onClick={() => onReceive(order)}
                                className="flex items-center gap-1.5 rounded-full bg-front-accent px-4 py-2 text-sm font-medium text-front-accent-ink"
                            >
                                <PackageCheck size={14} />
                                Receive stock
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
