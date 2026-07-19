import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Eye, Pencil, PowerOff, Power } from "lucide-react";

import StatusBadge from "@/Components/Admin/StatusBadge";

export default function SupplierTable({ suppliers, onView, onEdit, onToggleActive }) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.fromTo(
                "[data-supplier-row]",
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.35, stagger: 0.03, ease: "power2.out" },
            );
        },
        { scope: rootRef, dependencies: [suppliers], revertOnUpdate: true },
    );

    if (suppliers.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-front-line p-12 text-center">
                <p className="text-sm text-front-muted">No suppliers match this search.</p>
            </div>
        );
    }

    return (
        <div ref={rootRef} className="overflow-x-auto rounded-2xl border border-front-line bg-front-surface">
            <table className="w-full min-w-[880px] border-collapse">
                <thead>
                    <tr className="border-b border-front-line text-left text-xs font-medium text-front-muted uppercase">
                        <th scope="col" className="px-4 py-3">Supplier</th>
                        <th scope="col" className="px-4 py-3">Contact</th>
                        <th scope="col" className="px-4 py-3">Total POs</th>
                        <th scope="col" className="px-4 py-3">Total spend</th>
                        <th scope="col" className="px-4 py-3">Outstanding</th>
                        <th scope="col" className="px-4 py-3">Status</th>
                        <th scope="col" className="px-4 py-3" />
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map((supplier) => (
                        <tr key={supplier.id} data-supplier-row className="border-b border-front-line last:border-b-0 hover:bg-front-bg/60">
                            <td className="px-4 py-3">
                                <button
                                    type="button"
                                    onClick={() => onView(supplier)}
                                    className="text-left text-sm font-medium text-front-ink hover:text-front-accent"
                                >
                                    {supplier.name}
                                </button>
                                <p className="text-xs text-front-muted">{supplier.payment_terms ?? "No terms set"}</p>
                            </td>
                            <td className="px-4 py-3 text-sm text-front-muted">
                                <p>{supplier.contact_person ?? "—"}</p>
                                <p className="text-xs">{supplier.phone ?? supplier.email ?? ""}</p>
                            </td>
                            <td className="px-4 py-3 text-sm text-front-ink/90 tabular-figures">{supplier.total_pos}</td>
                            <td className="px-4 py-3 text-sm font-medium text-front-ink/90 tabular-figures">
                                ৳ {supplier.total_spend.toLocaleString("en-US")}
                            </td>
                            <td className="px-4 py-3 text-sm tabular-figures">
                                <span className={supplier.outstanding_balance > 0 ? "font-medium text-front-accent" : "text-front-muted"}>
                                    ৳ {supplier.outstanding_balance.toLocaleString("en-US")}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <StatusBadge status={supplier.is_active ? "active" : "inactive"} />
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center justify-end gap-1">
                                    <button
                                        type="button"
                                        onClick={() => onView(supplier)}
                                        aria-label={`View ${supplier.name}`}
                                        className="rounded-lg p-1.5 text-front-muted hover:bg-front-bg hover:text-front-ink"
                                    >
                                        <Eye size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onEdit(supplier)}
                                        aria-label={`Edit ${supplier.name}`}
                                        className="rounded-lg p-1.5 text-front-muted hover:bg-front-bg hover:text-front-ink"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onToggleActive(supplier)}
                                        aria-label={supplier.is_active ? `Deactivate ${supplier.name}` : `Activate ${supplier.name}`}
                                        className="rounded-lg p-1.5 text-front-muted hover:bg-front-bg hover:text-front-ink"
                                    >
                                        {supplier.is_active ? <PowerOff size={14} /> : <Power size={14} />}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
