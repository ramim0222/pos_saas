import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowLeftRight, History, PackageOpen, SlidersHorizontal } from "lucide-react";

function StatusBadge({ status }) {
    const meta = {
        in_stock: { label: "In stock", className: "bg-front-green/10 text-front-green" },
        low: { label: "Low", className: "bg-front-accent/10 text-front-accent" },
        out: { label: "Out of stock", className: "bg-red-400/10 text-red-400" },
    }[status];

    return (
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${meta.className}`}>
            {meta.label}
        </span>
    );
}

export default function StockTable({ rows, onAdjust, onTransfer, onViewHistory }) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.fromTo(
                "[data-stock-row]",
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.35, stagger: 0.03, ease: "power2.out" },
            );
        },
        { scope: rootRef, dependencies: [rows], revertOnUpdate: true },
    );

    if (rows.length === 0) {
        return (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-front-line bg-front-surface px-6 py-20 text-center">
                <PackageOpen size={28} className="text-front-muted" />
                <h3 className="mt-4 font-display text-lg font-medium text-front-ink">
                    No stock records for this branch yet
                </h3>
                <p className="mt-1.5 max-w-sm text-sm text-front-muted">
                    Add products from the Products page, then adjust or transfer
                    stock to start tracking levels here.
                </p>
            </div>
        );
    }

    return (
        <div ref={rootRef} className="rounded-2xl border border-front-line bg-front-surface">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] border-collapse">
                    <thead>
                        <tr className="border-b border-front-line text-left text-xs font-medium text-front-muted uppercase">
                            <th scope="col" className="px-4 py-3">Product</th>
                            <th scope="col" className="px-4 py-3">SKU</th>
                            <th scope="col" className="px-4 py-3">Category</th>
                            <th scope="col" className="px-4 py-3">Stock</th>
                            <th scope="col" className="px-4 py-3">Reorder at</th>
                            <th scope="col" className="px-4 py-3">Last updated</th>
                            <th scope="col" className="px-4 py-3">Status</th>
                            <th scope="col" className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr
                                key={row.id}
                                data-stock-row
                                className="border-b border-front-line last:border-b-0 hover:bg-front-bg/60"
                            >
                                <td className="px-4 py-3">
                                    <p className="text-sm font-medium text-front-ink">{row.name}</p>
                                    {row.has_variants && (
                                        <p className="text-xs text-front-muted">Has variants</p>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-sm text-front-muted tabular-figures">
                                    {row.sku}
                                </td>
                                <td className="px-4 py-3 text-sm text-front-muted">
                                    {row.category ?? "—"}
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-front-ink/90 tabular-figures">
                                    {row.stock}
                                </td>
                                <td className="px-4 py-3 text-sm text-front-muted tabular-figures">
                                    {row.reorder_point}
                                </td>
                                <td className="px-4 py-3 text-sm text-front-muted">
                                    {row.updated_at}
                                </td>
                                <td className="px-4 py-3">
                                    <StatusBadge status={row.status} />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            type="button"
                                            onClick={() => onAdjust(row)}
                                            aria-label={`Adjust stock for ${row.name}`}
                                            className="rounded-lg p-1.5 text-front-muted hover:bg-front-bg hover:text-front-ink"
                                        >
                                            <SlidersHorizontal size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onTransfer(row)}
                                            aria-label={`Transfer stock for ${row.name}`}
                                            className="rounded-lg p-1.5 text-front-muted hover:bg-front-bg hover:text-front-ink"
                                        >
                                            <ArrowLeftRight size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onViewHistory(row)}
                                            aria-label={`View history for ${row.name}`}
                                            className="rounded-lg p-1.5 text-front-muted hover:bg-front-bg hover:text-front-ink"
                                        >
                                            <History size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
