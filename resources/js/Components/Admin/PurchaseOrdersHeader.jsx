import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Plus, Search } from "lucide-react";

const STATUS_FILTERS = [
    { value: "", label: "All statuses" },
    { value: "draft", label: "Draft" },
    { value: "sent", label: "Sent" },
    { value: "partially_received", label: "Partially received" },
    { value: "received", label: "Received" },
    { value: "cancelled", label: "Cancelled" },
];

export default function PurchaseOrdersHeader({ total, search, onSearchChange, status, onStatusChange, onNewOrder }) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from(rootRef.current, { opacity: 0, y: 10, duration: 0.4, ease: "power2.out" });
        },
        { scope: rootRef },
    );

    return (
        <div ref={rootRef} className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-display text-2xl font-semibold text-front-ink">Purchase orders</h1>
                    <p className="mt-1 text-sm text-front-muted">
                        {total} order{total === 1 ? "" : "s"} across your branches
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onNewOrder}
                    className="flex items-center gap-2 rounded-full bg-front-accent px-4 py-2 text-sm font-medium text-front-accent-ink transition-transform hover:scale-[1.03]"
                >
                    <Plus size={15} />
                    New purchase order
                </button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1 sm:max-w-xs">
                    <Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-front-muted" />
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search PO number or supplier…"
                        aria-label="Search purchase orders"
                        className="w-full rounded-full border border-front-line bg-front-bg py-2 pr-4 pl-9 text-sm text-front-ink outline-none focus:border-front-accent"
                    />
                </div>
                <select
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value)}
                    aria-label="Filter by status"
                    className="rounded-full border border-front-line bg-front-bg px-3 py-2 text-sm text-front-ink outline-none focus:border-front-accent"
                >
                    {STATUS_FILTERS.map((f) => (
                        <option key={f.value} value={f.value}>
                            {f.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
