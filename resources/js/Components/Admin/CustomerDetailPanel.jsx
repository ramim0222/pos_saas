import { useRef } from "react";
import { router } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowDownCircle, ArrowUpCircle, Pencil, Sliders, X } from "lucide-react";

import StatusBadge from "@/Components/Admin/StatusBadge";
import LoyaltyRing from "@/Components/Admin/LoyaltyRing";

const LEDGER_META = {
    earned: { icon: ArrowUpCircle, className: "text-front-green" },
    redeemed: { icon: ArrowDownCircle, className: "text-red-400" },
    adjusted: { icon: Sliders, className: "text-front-accent" },
};

export default function CustomerDetailPanel({ open, onClose, customer, groups, onEdit, onAdjustPoints }) {
    const rootRef = useRef(null);
    const panelRef = useRef(null);
    const ledgerRef = useRef(null);

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

    useGSAP(
        () => {
            if (!open || !ledgerRef.current) return;
            gsap.fromTo(
                "[data-ledger-row]",
                { opacity: 0, x: 12 },
                { opacity: 1, x: 0, duration: 0.35, stagger: 0.05, ease: "power2.out", delay: 0.2 },
            );
        },
        { scope: rootRef, dependencies: [open, customer?.id] },
    );

    if (!customer) return null;

    const changeGroup = (groupId) => {
        router.put(
            route("admin.customers.update", customer.id),
            {
                name: customer.name,
                phone: customer.phone,
                email: customer.email,
                address: customer.address,
                notes: customer.notes,
                customer_group_id: groupId || null,
            },
            { preserveScroll: true },
        );
    };

    return (
        <div ref={rootRef} className="fixed inset-0 z-50 hidden">
            <div data-backdrop className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
            <div ref={panelRef} className="relative ml-auto flex h-full w-full max-w-2xl flex-col bg-front-bg shadow-2xl">
                <div className="flex shrink-0 items-start justify-between border-b border-front-line px-6 py-5">
                    <div>
                        <h2 className="font-display text-xl font-medium text-front-ink">{customer.name}</h2>
                        <p className="mt-1 text-sm text-front-muted">
                            {customer.phone ?? "No phone"} {customer.email && `· ${customer.email}`}
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
                    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-front-line bg-front-surface px-5 py-5">
                        <LoyaltyRing points={customer.loyalty_points} />
                        <div className="flex flex-col items-start gap-2 sm:items-end">
                            <select
                                value={customer.group?.id ?? ""}
                                onChange={(e) => changeGroup(e.target.value)}
                                aria-label="Change customer group"
                                className="rounded-full border border-front-line bg-front-bg px-3 py-1.5 text-xs text-front-ink outline-none focus:border-front-accent"
                            >
                                <option value="">No group</option>
                                {groups.map((g) => (
                                    <option key={g.id} value={g.id}>
                                        {g.name} ({g.discount_percent}% off)
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={() => onAdjustPoints(customer)}
                                className="flex items-center gap-1.5 rounded-full border border-front-line px-3 py-1.5 text-xs font-medium text-front-ink hover:border-front-accent"
                            >
                                <Sliders size={12} />
                                Adjust points
                            </button>
                        </div>
                    </div>

                    <div>
                        <p className="mb-3 text-xs font-medium tracking-wide text-front-muted uppercase">Purchase history</p>
                        {customer.purchase_history.length === 0 ? (
                            <p className="rounded-lg border border-dashed border-front-line px-3 py-4 text-center text-xs text-front-muted">
                                No purchases yet.
                            </p>
                        ) : (
                            <div className="overflow-hidden rounded-xl border border-front-line">
                                <table className="w-full border-collapse text-sm">
                                    <thead>
                                        <tr className="border-b border-front-line bg-front-surface text-left text-xs font-medium text-front-muted uppercase">
                                            <th scope="col" className="px-3 py-2.5">Sale #</th>
                                            <th scope="col" className="px-3 py-2.5">Date</th>
                                            <th scope="col" className="px-3 py-2.5">Total</th>
                                            <th scope="col" className="px-3 py-2.5">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customer.purchase_history.map((sale) => (
                                            <tr key={sale.id} className="border-b border-front-line last:border-b-0">
                                                <td className="px-3 py-2.5 text-front-ink/90">{sale.sale_number}</td>
                                                <td className="px-3 py-2.5 text-front-muted">{sale.sold_at}</td>
                                                <td className="px-3 py-2.5 font-medium tabular-figures text-front-ink/90">
                                                    ৳ {sale.total.toLocaleString("en-US")}
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <StatusBadge status={sale.status} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div ref={ledgerRef}>
                        <p className="mb-3 text-xs font-medium tracking-wide text-front-muted uppercase">Loyalty points ledger</p>
                        {customer.ledger.length === 0 ? (
                            <p className="rounded-lg border border-dashed border-front-line px-3 py-4 text-center text-xs text-front-muted">
                                No points activity yet.
                            </p>
                        ) : (
                            <div className="space-y-1">
                                {customer.ledger.map((entry) => {
                                    const meta = LEDGER_META[entry.type] ?? LEDGER_META.adjusted;
                                    const Icon = meta.icon;
                                    const positive = entry.points >= 0;
                                    return (
                                        <div key={entry.id} data-ledger-row className="flex items-center justify-between rounded-lg px-2 py-2.5 hover:bg-front-surface">
                                            <div className="flex items-center gap-2.5">
                                                <Icon size={16} className={meta.className} />
                                                <div>
                                                    <p className="text-sm text-front-ink/90 capitalize">{entry.type}</p>
                                                    <p className="text-xs text-front-muted">{entry.reason} · {entry.created_at}</p>
                                                </div>
                                            </div>
                                            <span className={`text-sm font-medium tabular-figures ${positive ? "text-front-green" : "text-red-400"}`}>
                                                {positive ? "+" : ""}
                                                {entry.points}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex shrink-0 items-center justify-end gap-3 border-t border-front-line px-6 py-4">
                    <button
                        type="button"
                        onClick={() => onEdit(customer)}
                        className="flex items-center gap-1.5 rounded-full border border-front-line px-4 py-2 text-sm font-medium text-front-ink hover:border-front-accent"
                    >
                        <Pencil size={14} />
                        Edit customer
                    </button>
                </div>
            </div>
        </div>
    );
}
