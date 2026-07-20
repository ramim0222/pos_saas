import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Eye } from "lucide-react";

import StatusBadge from "@/Components/Admin/StatusBadge";

const METHOD_LABELS = {
    cash: "Cash",
    card: "Card",
    bkash: "bKash",
    nagad: "Nagad",
};

export default function SalesTable({ sales, onView }) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.fromTo(
                "[data-sale-row]",
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.35, stagger: 0.03, ease: "power2.out" },
            );
        },
        { scope: rootRef, dependencies: [sales], revertOnUpdate: true },
    );

    if (sales.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-front-line p-12 text-center">
                <p className="text-sm text-front-muted">No transactions match these filters.</p>
            </div>
        );
    }

    return (
        <div ref={rootRef} className="overflow-x-auto rounded-2xl border border-front-line bg-front-surface">
            <table className="w-full min-w-[960px] border-collapse">
                <thead>
                    <tr className="border-b border-front-line text-left text-xs font-medium text-front-muted uppercase">
                        <th scope="col" className="px-4 py-3">Sale #</th>
                        <th scope="col" className="px-4 py-3">Date/time</th>
                        <th scope="col" className="px-4 py-3">Branch</th>
                        <th scope="col" className="px-4 py-3">Cashier</th>
                        <th scope="col" className="px-4 py-3">Customer</th>
                        <th scope="col" className="px-4 py-3">Items</th>
                        <th scope="col" className="px-4 py-3">Total</th>
                        <th scope="col" className="px-4 py-3">Payment</th>
                        <th scope="col" className="px-4 py-3">Status</th>
                        <th scope="col" className="px-4 py-3" />
                    </tr>
                </thead>
                <tbody>
                    {sales.map((sale) => (
                        <tr key={sale.id} data-sale-row className="border-b border-front-line last:border-b-0 hover:bg-front-bg/60">
                            <td className="px-4 py-3">
                                <button
                                    type="button"
                                    onClick={() => onView(sale)}
                                    className="text-sm font-medium text-front-ink hover:text-front-accent"
                                >
                                    {sale.sale_number}
                                </button>
                            </td>
                            <td className="px-4 py-3 text-sm text-front-muted">{sale.sold_at}</td>
                            <td className="px-4 py-3 text-sm text-front-muted">{sale.branch}</td>
                            <td className="px-4 py-3 text-sm text-front-muted">{sale.cashier}</td>
                            <td className="px-4 py-3 text-sm text-front-muted">{sale.customer?.name ?? "Walk-in"}</td>
                            <td className="px-4 py-3 text-sm text-front-ink/85 tabular-figures">{sale.items_count}</td>
                            <td className="px-4 py-3 text-sm font-medium text-front-ink/90 tabular-figures">
                                ৳ {sale.total.toLocaleString("en-US")}
                            </td>
                            <td className="px-4 py-3 text-sm text-front-muted">
                                {sale.payment_methods.map((m) => METHOD_LABELS[m] ?? m).join(" + ") || "—"}
                            </td>
                            <td className="px-4 py-3">
                                <StatusBadge status={sale.status} />
                            </td>
                            <td className="px-4 py-3">
                                <button
                                    type="button"
                                    onClick={() => onView(sale)}
                                    aria-label={`View ${sale.sale_number}`}
                                    className="rounded-lg p-1.5 text-front-muted hover:bg-front-bg hover:text-front-ink"
                                >
                                    <Eye size={14} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
