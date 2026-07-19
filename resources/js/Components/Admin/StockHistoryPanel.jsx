import { useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDownLeft, ArrowRightLeft, ArrowUpRight, History } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const TYPE_META = {
    adjustment: { icon: ArrowUpRight, label: "Adjustment" },
    transfer_in: { icon: ArrowDownLeft, label: "Transfer in" },
    transfer_out: { icon: ArrowRightLeft, label: "Transfer out" },
};

const TYPE_FILTERS = [
    { value: "", label: "All activity" },
    { value: "adjustment", label: "Adjustments" },
    { value: "transfer_in", label: "Transfers in" },
    { value: "transfer_out", label: "Transfers out" },
];

export default function StockHistoryPanel({ history, filterProduct, onClearFilter }) {
    const rootRef = useRef(null);
    const [typeFilter, setTypeFilter] = useState("");

    useGSAP(
        () => {
            gsap.from(rootRef.current, {
                opacity: 0,
                y: 16,
                duration: 0.5,
                ease: "power2.out",
                scrollTrigger: { trigger: rootRef.current, start: "top 85%" },
            });
        },
        { scope: rootRef },
    );

    const filtered = useMemo(() => {
        return history.filter((event) => {
            if (typeFilter && event.type !== typeFilter) return false;
            if (filterProduct && event.product !== filterProduct) return false;
            return true;
        });
    }, [history, typeFilter, filterProduct]);

    return (
        <div ref={rootRef} className="rounded-2xl border border-front-line bg-front-surface p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <History size={16} className="text-front-accent" />
                    <div>
                        <p className="font-display text-lg font-medium text-front-ink">
                            Stock movement history
                        </p>
                        {filterProduct && (
                            <p className="text-xs text-front-muted">
                                Filtered to {filterProduct} —{" "}
                                <button type="button" onClick={onClearFilter} className="text-front-accent hover:underline">
                                    clear
                                </button>
                            </p>
                        )}
                    </div>
                </div>
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="rounded-full border border-front-line bg-front-bg px-3 py-1.5 text-xs text-front-ink outline-none focus:border-front-accent"
                >
                    {TYPE_FILTERS.map((f) => (
                        <option key={f.value} value={f.value}>
                            {f.label}
                        </option>
                    ))}
                </select>
            </div>

            {filtered.length === 0 ? (
                <p className="py-8 text-center text-sm text-front-muted">
                    No stock movements match this filter yet.
                </p>
            ) : (
                <div className="max-h-96 space-y-1 overflow-y-auto">
                    {filtered.map((event) => {
                        const meta = TYPE_META[event.type] ?? TYPE_META.adjustment;
                        const Icon = meta.icon;
                        const positive = event.quantity_delta >= 0;
                        return (
                            <div
                                key={event.id}
                                className="flex items-start gap-3 rounded-lg px-2 py-3 hover:bg-front-bg/60"
                            >
                                <span
                                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                        positive ? "bg-front-green/10 text-front-green" : "bg-red-400/10 text-red-400"
                                    }`}
                                >
                                    <Icon size={14} />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-front-ink/90">
                                        <span className="font-medium">{event.product}</span>
                                        {event.variant && <span className="text-front-muted"> — {event.variant}</span>}
                                    </p>
                                    <p className="text-xs text-front-muted">
                                        {meta.label} at {event.branch}
                                        {event.related_branch &&
                                            (event.type === "transfer_out"
                                                ? ` → ${event.related_branch}`
                                                : ` ← ${event.related_branch}`)}
                                        {" · "}
                                        {event.reason} · {event.user} · {event.created_at}
                                    </p>
                                    {event.notes && (
                                        <p className="mt-0.5 text-xs text-front-muted italic">{event.notes}</p>
                                    )}
                                </div>
                                <span
                                    className={`shrink-0 text-sm font-medium tabular-figures ${
                                        positive ? "text-front-green" : "text-red-400"
                                    }`}
                                >
                                    {positive ? "+" : ""}
                                    {event.quantity_delta}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
