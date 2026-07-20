import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { ArrowUpRight, Boxes, ReceiptText, Users, X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

function TrendTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border border-front-line bg-front-surface px-3 py-2 shadow-lg">
            <p className="text-xs text-front-muted">{label}</p>
            <p className="text-sm font-medium tabular-figures text-front-ink">৳ {payload[0].value.toLocaleString("en-US")}</p>
        </div>
    );
}

export default function BranchDetailPanel({ open, onClose, branch }) {
    const rootRef = useRef(null);
    const panelRef = useRef(null);

    useGSAP(
        () => {
            if (!open) return;
            gsap.fromTo("[data-backdrop]", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out" });
            gsap.fromTo(panelRef.current, { xPercent: 100 }, { xPercent: 0, duration: 0.4, ease: "power3.out" });
        },
        { scope: rootRef, dependencies: [open] },
    );

    useGSAP(
        () => {
            if (!open) return;
            gsap.fromTo(
                "[data-staff-item], [data-stock-item]",
                { opacity: 0, x: 10 },
                { opacity: 1, x: 0, duration: 0.35, stagger: 0.04, ease: "power2.out", delay: 0.2 },
            );
        },
        { scope: rootRef, dependencies: [open, branch?.id] },
    );

    if (!open || !branch) return null;

    return (
        <div ref={rootRef} className="fixed inset-0 z-50 flex">
            <div data-backdrop className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
            <div ref={panelRef} className="relative ml-auto flex h-full w-full max-w-2xl flex-col bg-front-bg shadow-2xl">
                <div className="flex shrink-0 items-start justify-between border-b border-front-line px-6 py-5">
                    <div>
                        <h2 className="font-display text-xl font-medium text-front-ink">{branch.name}</h2>
                        <p className="mt-1 text-sm text-front-muted">{branch.address ?? "No address on file"}</p>
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
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="rounded-xl border border-front-line bg-front-surface px-4 py-3">
                            <p className="text-xs text-front-muted uppercase">Today's sales</p>
                            <p className="mt-1 font-display text-lg font-semibold tabular-figures text-front-ink">
                                ৳ {branch.today_sales.toLocaleString("en-US")}
                            </p>
                        </div>
                        <div className="rounded-xl border border-front-line bg-front-surface px-4 py-3">
                            <p className="text-xs text-front-muted uppercase">Stock value</p>
                            <p className="mt-1 font-display text-lg font-semibold tabular-figures text-front-ink">
                                ৳ {branch.stock_value.toLocaleString("en-US")}
                            </p>
                        </div>
                        <div className="rounded-xl border border-front-line bg-front-surface px-4 py-3">
                            <p className="text-xs text-front-muted uppercase">Staff</p>
                            <p className="mt-1 font-display text-lg font-semibold tabular-figures text-front-ink">{branch.staff_count}</p>
                        </div>
                        <div className="rounded-xl border border-front-line bg-front-surface px-4 py-3">
                            <p className="text-xs text-front-muted uppercase">Manager</p>
                            <p className="mt-1 truncate text-sm font-medium text-front-ink">{branch.manager?.name ?? "—"}</p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-front-line bg-front-surface p-5">
                        <p className="mb-3 text-xs font-medium tracking-wide text-front-muted uppercase">7-day sales trend</p>
                        <div className="h-36 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={branch.sales_trend} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id={`branchTrend-${branch.id}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--color-front-accent)" stopOpacity={0.35} />
                                            <stop offset="100%" stopColor="var(--color-front-accent)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" tick={{ fill: "var(--color-front-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<TrendTooltip />} cursor={{ stroke: "var(--color-front-line)" }} />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="var(--color-front-accent)"
                                        strokeWidth={2}
                                        fill={`url(#branchTrend-${branch.id})`}
                                        animationDuration={800}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-3 flex gap-3 text-xs">
                            <a
                                href={`${route("admin.sales.index")}?branch=${branch.id}`}
                                className="flex items-center gap-1 font-medium text-front-accent hover:underline"
                            >
                                <ReceiptText size={12} />
                                View sales for this branch
                                <ArrowUpRight size={11} />
                            </a>
                            <a
                                href={`${route("admin.inventory.index")}?branch=${branch.id}`}
                                className="flex items-center gap-1 font-medium text-front-accent hover:underline"
                            >
                                <Boxes size={12} />
                                View inventory for this branch
                                <ArrowUpRight size={11} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <p className="mb-3 flex items-center gap-1.5 text-xs font-medium tracking-wide text-front-muted uppercase">
                            <Users size={13} />
                            Staff at this branch
                        </p>
                        {branch.staff_list.length === 0 ? (
                            <p className="rounded-lg border border-dashed border-front-line px-3 py-4 text-center text-xs text-front-muted">
                                No staff assigned yet.
                            </p>
                        ) : (
                            <div className="space-y-1.5">
                                {branch.staff_list.map((s) => (
                                    <div key={s.id} data-staff-item className="flex items-center justify-between rounded-lg border border-front-line px-3.5 py-2.5">
                                        <span className="text-sm text-front-ink/90">{s.name}</span>
                                        <span className="text-xs text-front-muted capitalize">{s.role.replace("_", " ")}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <p className="mb-3 flex items-center gap-1.5 text-xs font-medium tracking-wide text-front-muted uppercase">
                            <Boxes size={13} />
                            Top stock on hand
                        </p>
                        {branch.top_stock.length === 0 ? (
                            <p className="rounded-lg border border-dashed border-front-line px-3 py-4 text-center text-xs text-front-muted">
                                No stock recorded at this branch.
                            </p>
                        ) : (
                            <div className="space-y-1.5">
                                {branch.top_stock.map((item, idx) => (
                                    <div key={`${item.sku}-${idx}`} data-stock-item className="flex items-center justify-between rounded-lg border border-front-line px-3.5 py-2.5">
                                        <div>
                                            <p className="text-sm text-front-ink/90">{item.product}</p>
                                            <p className="text-xs text-front-muted">{item.sku}</p>
                                        </div>
                                        <span className="text-sm font-medium tabular-figures text-front-ink/85">{item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
