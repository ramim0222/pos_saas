import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Download, Search } from "lucide-react";

const PAYMENT_METHODS = [
    { value: "all", label: "All payment methods" },
    { value: "cash", label: "Cash" },
    { value: "card", label: "Card" },
    { value: "bkash", label: "bKash" },
    { value: "nagad", label: "Nagad" },
];

export default function SalesPageHeader({
    total,
    filters,
    onFilterChange,
    branches,
    cashiers,
    search,
    onSearchChange,
    onExport,
}) {
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
                    <h1 className="font-display text-2xl font-semibold text-front-ink">Sales</h1>
                    <p className="mt-1 text-sm text-front-muted">
                        {total} transaction{total === 1 ? "" : "s"} in this range
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onExport}
                    className="flex items-center gap-2 rounded-full border border-front-line px-4 py-2 text-sm font-medium text-front-ink transition-colors hover:border-front-accent hover:text-front-accent"
                >
                    <Download size={15} />
                    Export CSV
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 sm:max-w-xs">
                    <Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-front-muted" />
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search sale # or customer…"
                        aria-label="Search sales"
                        className="w-full rounded-full border border-front-line bg-front-bg py-2 pr-4 pl-9 text-sm text-front-ink outline-none focus:border-front-accent"
                    />
                </div>

                <div className="flex items-center gap-1.5">
                    <input
                        type="date"
                        value={filters.from}
                        onChange={(e) => onFilterChange({ from: e.target.value })}
                        aria-label="From date"
                        className="rounded-full border border-front-line bg-front-bg px-3 py-2 text-xs text-front-ink outline-none focus:border-front-accent"
                    />
                    <span className="text-xs text-front-muted">to</span>
                    <input
                        type="date"
                        value={filters.to}
                        onChange={(e) => onFilterChange({ to: e.target.value })}
                        aria-label="To date"
                        className="rounded-full border border-front-line bg-front-bg px-3 py-2 text-xs text-front-ink outline-none focus:border-front-accent"
                    />
                </div>

                <select
                    value={filters.branch}
                    onChange={(e) => onFilterChange({ branch: e.target.value })}
                    aria-label="Filter by branch"
                    className="rounded-full border border-front-line bg-front-bg px-3 py-2 text-sm text-front-ink outline-none focus:border-front-accent"
                >
                    <option value="all">All branches</option>
                    {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                            {b.name}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.cashier}
                    onChange={(e) => onFilterChange({ cashier: e.target.value })}
                    aria-label="Filter by cashier"
                    className="rounded-full border border-front-line bg-front-bg px-3 py-2 text-sm text-front-ink outline-none focus:border-front-accent"
                >
                    <option value="all">All cashiers</option>
                    {cashiers.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.method}
                    onChange={(e) => onFilterChange({ method: e.target.value })}
                    aria-label="Filter by payment method"
                    className="rounded-full border border-front-line bg-front-bg px-3 py-2 text-sm text-front-ink outline-none focus:border-front-accent"
                >
                    {PAYMENT_METHODS.map((m) => (
                        <option key={m.value} value={m.value}>
                            {m.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
