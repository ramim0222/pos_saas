import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Eye, Pencil, Sparkles } from "lucide-react";

const GROUP_STYLES = {
    VIP: "bg-front-accent/15 text-front-accent",
    Wholesale: "bg-blue-400/15 text-blue-300",
    Retail: "bg-front-line text-front-muted",
};

function GroupPill({ group }) {
    if (!group) {
        return <span className="text-sm text-front-muted">—</span>;
    }
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${GROUP_STYLES[group.name] ?? "bg-front-line text-front-muted"}`}>
            {group.name}
        </span>
    );
}

export default function CustomerTable({ customers, onView, onEdit }) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.fromTo(
                "[data-customer-row]",
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.35, stagger: 0.03, ease: "power2.out" },
            );
        },
        { scope: rootRef, dependencies: [customers], revertOnUpdate: true },
    );

    if (customers.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-front-line p-12 text-center">
                <p className="text-sm text-front-muted">No customers match this search.</p>
            </div>
        );
    }

    return (
        <div ref={rootRef} className="overflow-x-auto rounded-2xl border border-front-line bg-front-surface">
            <table className="w-full min-w-[900px] border-collapse">
                <thead>
                    <tr className="border-b border-front-line text-left text-xs font-medium text-front-muted uppercase">
                        <th scope="col" className="px-4 py-3">Customer</th>
                        <th scope="col" className="px-4 py-3">Contact</th>
                        <th scope="col" className="px-4 py-3">Group</th>
                        <th scope="col" className="px-4 py-3">Orders</th>
                        <th scope="col" className="px-4 py-3">Total spend</th>
                        <th scope="col" className="px-4 py-3">Points</th>
                        <th scope="col" className="px-4 py-3">Last purchase</th>
                        <th scope="col" className="px-4 py-3" />
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id} data-customer-row className="border-b border-front-line last:border-b-0 hover:bg-front-bg/60">
                            <td className="px-4 py-3">
                                <button
                                    type="button"
                                    onClick={() => onView(customer)}
                                    className="text-left text-sm font-medium text-front-ink hover:text-front-accent"
                                >
                                    {customer.name}
                                </button>
                            </td>
                            <td className="px-4 py-3 text-sm text-front-muted">
                                <p>{customer.phone ?? "—"}</p>
                                {customer.email && <p className="text-xs">{customer.email}</p>}
                            </td>
                            <td className="px-4 py-3">
                                <GroupPill group={customer.group} />
                            </td>
                            <td className="px-4 py-3 text-sm text-front-ink/90 tabular-figures">{customer.total_orders}</td>
                            <td className="px-4 py-3 text-sm font-medium text-front-ink/90 tabular-figures">
                                ৳ {customer.total_spend.toLocaleString("en-US")}
                            </td>
                            <td className="px-4 py-3 text-sm tabular-figures">
                                <span className="flex items-center gap-1 font-medium text-front-accent">
                                    <Sparkles size={12} />
                                    {customer.loyalty_points}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-front-muted">{customer.last_purchase_at ?? "Never"}</td>
                            <td className="px-4 py-3">
                                <div className="flex items-center justify-end gap-1">
                                    <button
                                        type="button"
                                        onClick={() => onView(customer)}
                                        aria-label={`View ${customer.name}`}
                                        className="rounded-lg p-1.5 text-front-muted hover:bg-front-bg hover:text-front-ink"
                                    >
                                        <Eye size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onEdit(customer)}
                                        aria-label={`Edit ${customer.name}`}
                                        className="rounded-lg p-1.5 text-front-muted hover:bg-front-bg hover:text-front-ink"
                                    >
                                        <Pencil size={14} />
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
