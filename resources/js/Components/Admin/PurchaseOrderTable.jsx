import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Eye, PackageCheck, Send, Trash2, XCircle } from "lucide-react";

import StatusBadge from "@/Components/Admin/StatusBadge";

export default function PurchaseOrderTable({ orders, onView, onSend, onReceive, onCancel, onDelete }) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.fromTo(
                "[data-po-row]",
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.35, stagger: 0.03, ease: "power2.out" },
            );
        },
        { scope: rootRef, dependencies: [orders], revertOnUpdate: true },
    );

    if (orders.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-front-line p-12 text-center">
                <p className="text-sm text-front-muted">No purchase orders match these filters.</p>
            </div>
        );
    }

    return (
        <div ref={rootRef} className="overflow-x-auto rounded-2xl border border-front-line bg-front-surface">
            <table className="w-full min-w-[840px] border-collapse">
                <thead>
                    <tr className="border-b border-front-line text-left text-xs font-medium text-front-muted uppercase">
                        <th scope="col" className="px-4 py-3">PO number</th>
                        <th scope="col" className="px-4 py-3">Supplier</th>
                        <th scope="col" className="px-4 py-3">Order date</th>
                        <th scope="col" className="px-4 py-3">Expected delivery</th>
                        <th scope="col" className="px-4 py-3">Total</th>
                        <th scope="col" className="px-4 py-3">Status</th>
                        <th scope="col" className="px-4 py-3" />
                    </tr>
                </thead>
                <tbody>
                    {orders.map((po) => (
                        <tr key={po.id} data-po-row className="border-b border-front-line last:border-b-0 hover:bg-front-bg/60">
                            <td className="px-4 py-3">
                                <button
                                    type="button"
                                    onClick={() => onView(po)}
                                    className="text-sm font-medium text-front-ink hover:text-front-accent"
                                >
                                    {po.po_number}
                                </button>
                                <p className="text-xs text-front-muted">{po.branch}</p>
                            </td>
                            <td className="px-4 py-3 text-sm text-front-ink/90">{po.supplier}</td>
                            <td className="px-4 py-3 text-sm text-front-muted">{po.order_date}</td>
                            <td className="px-4 py-3 text-sm text-front-muted">{po.expected_delivery ?? "—"}</td>
                            <td className="px-4 py-3 text-sm font-medium text-front-ink/90 tabular-figures">
                                ৳ {po.total_amount.toLocaleString("en-US")}
                            </td>
                            <td className="px-4 py-3">
                                <StatusBadge status={po.status} />
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center justify-end gap-1">
                                    <button
                                        type="button"
                                        onClick={() => onView(po)}
                                        aria-label={`View ${po.po_number}`}
                                        className="rounded-lg p-1.5 text-front-muted hover:bg-front-bg hover:text-front-ink"
                                    >
                                        <Eye size={14} />
                                    </button>
                                    {po.status === "draft" && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => onSend(po)}
                                                aria-label={`Send ${po.po_number}`}
                                                className="rounded-lg p-1.5 text-front-muted hover:bg-front-bg hover:text-front-ink"
                                            >
                                                <Send size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onDelete(po)}
                                                aria-label={`Delete ${po.po_number}`}
                                                className="rounded-lg p-1.5 text-front-muted hover:bg-red-400/10 hover:text-red-400"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </>
                                    )}
                                    {(po.status === "sent" || po.status === "partially_received") && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => onReceive(po)}
                                                aria-label={`Receive stock for ${po.po_number}`}
                                                className="rounded-lg p-1.5 text-front-muted hover:bg-front-bg hover:text-front-ink"
                                            >
                                                <PackageCheck size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onCancel(po)}
                                                aria-label={`Cancel ${po.po_number}`}
                                                className="rounded-lg p-1.5 text-front-muted hover:bg-red-400/10 hover:text-red-400"
                                            >
                                                <XCircle size={14} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
