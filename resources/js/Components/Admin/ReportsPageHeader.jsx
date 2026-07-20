import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Download } from "lucide-react";

function toDateStr(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function computePreset(preset) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (preset === "today") {
        return { from: toDateStr(today), to: toDateStr(today) };
    }
    if (preset === "week") {
        const day = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - ((day + 6) % 7));
        return { from: toDateStr(monday), to: toDateStr(today) };
    }
    if (preset === "month") {
        const first = new Date(today.getFullYear(), today.getMonth(), 1);
        return { from: toDateStr(first), to: toDateStr(today) };
    }
    if (preset === "quarter") {
        const q = Math.floor(today.getMonth() / 3);
        const first = new Date(today.getFullYear(), q * 3, 1);
        return { from: toDateStr(first), to: toDateStr(today) };
    }
    return null;
}

const PRESETS = [
    { value: "today", label: "Today" },
    { value: "week", label: "This week" },
    { value: "month", label: "This month" },
    { value: "quarter", label: "This quarter" },
    { value: "custom", label: "Custom" },
];

export default function ReportsPageHeader({ filters, activePreset, onPresetChange, onDateChange, branches, onBranchChange, onExport }) {
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
                    <h1 className="font-display text-2xl font-semibold text-front-ink">Reports</h1>
                    <p className="mt-1 text-sm text-front-muted">Analytics hub for profit, performance, and inventory</p>
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
                <div className="inline-flex rounded-full border border-front-line p-1">
                    {PRESETS.map((p) => (
                        <button
                            key={p.value}
                            type="button"
                            onClick={() => onPresetChange(p.value)}
                            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                                activePreset === p.value ? "bg-front-accent text-front-accent-ink" : "text-front-muted hover:text-front-ink"
                            }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>

                {activePreset === "custom" && (
                    <div className="flex items-center gap-1.5">
                        <input
                            type="date"
                            value={filters.from}
                            onChange={(e) => onDateChange({ from: e.target.value })}
                            aria-label="From date"
                            className="rounded-full border border-front-line bg-front-bg px-3 py-2 text-xs text-front-ink outline-none focus:border-front-accent"
                        />
                        <span className="text-xs text-front-muted">to</span>
                        <input
                            type="date"
                            value={filters.to}
                            onChange={(e) => onDateChange({ to: e.target.value })}
                            aria-label="To date"
                            className="rounded-full border border-front-line bg-front-bg px-3 py-2 text-xs text-front-ink outline-none focus:border-front-accent"
                        />
                    </div>
                )}

                <select
                    value={filters.branch}
                    onChange={(e) => onBranchChange(e.target.value)}
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
            </div>
        </div>
    );
}
