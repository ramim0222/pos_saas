import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Search } from "lucide-react";

const STOCK_OPTIONS = [
    { value: "", label: "All stock" },
    { value: "in_stock", label: "In stock" },
    { value: "low", label: "Low stock" },
    { value: "out", label: "Out of stock" },
];

export default function FilterBar({ filters, categories, brands, onChange }) {
    const rootRef = useRef(null);
    const [search, setSearch] = useState(filters.search ?? "");

    useGSAP(
        () => {
            gsap.from(rootRef.current, {
                opacity: 0,
                y: 10,
                duration: 0.4,
                delay: 0.05,
                ease: "power2.out",
            });
        },
        { scope: rootRef },
    );

    useEffect(() => {
        const id = setTimeout(() => {
            if (search !== (filters.search ?? "")) {
                onChange({ search });
            }
        }, 350);
        return () => clearTimeout(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const selectClass =
        "rounded-lg border border-front-line bg-front-surface px-3 py-2 text-sm text-front-ink outline-none focus:border-front-accent";

    return (
        <div
            ref={rootRef}
            className="flex flex-col gap-3 rounded-2xl border border-front-line bg-front-surface p-4 sm:flex-row sm:flex-wrap sm:items-center"
        >
            <div className="relative flex-1 sm:min-w-[220px]">
                <Search
                    size={15}
                    className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-front-muted"
                />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, SKU, or barcode"
                    className="w-full rounded-lg border border-front-line bg-front-bg py-2 pr-3 pl-9 text-sm text-front-ink outline-none placeholder:text-front-muted focus:border-front-accent"
                />
            </div>

            <select
                value={filters.category ?? ""}
                onChange={(e) => onChange({ category: e.target.value })}
                className={selectClass}
            >
                <option value="">All categories</option>
                {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.name}
                    </option>
                ))}
            </select>

            <select
                value={filters.brand ?? ""}
                onChange={(e) => onChange({ brand: e.target.value })}
                className={selectClass}
            >
                <option value="">All brands</option>
                {brands.map((b) => (
                    <option key={b} value={b}>
                        {b}
                    </option>
                ))}
            </select>

            <select
                value={filters.stock_status ?? ""}
                onChange={(e) => onChange({ stock_status: e.target.value })}
                className={selectClass}
            >
                {STOCK_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
