import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Plus, Search } from "lucide-react";

export default function CustomersHeader({ total, search, onSearchChange, onAddCustomer }) {
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
                    <h1 className="font-display text-2xl font-semibold text-front-ink">Customers</h1>
                    <p className="mt-1 text-sm text-front-muted">
                        {total} customer{total === 1 ? "" : "s"} in your database
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onAddCustomer}
                    className="flex items-center gap-2 rounded-full bg-front-accent px-4 py-2 text-sm font-medium text-front-accent-ink transition-transform hover:scale-[1.03]"
                >
                    <Plus size={15} />
                    Add customer
                </button>
            </div>

            <div className="relative max-w-xs">
                <Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-front-muted" />
                <input
                    type="search"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search name, phone, or email…"
                    aria-label="Search customers"
                    className="w-full rounded-full border border-front-line bg-front-bg py-2 pr-4 pl-9 text-sm text-front-ink outline-none focus:border-front-accent"
                />
            </div>
        </div>
    );
}
