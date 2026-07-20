import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Building2 } from "lucide-react";

import StatCard from "@/Components/Admin/StatCard";

const PALETTE = [
    "var(--color-front-accent)",
    "var(--color-front-green)",
    "#93c5fd",
    "#fca5a5",
    "#c4b5fd",
    "#fcd34d",
];

function ValueTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border border-front-line bg-front-surface px-3.5 py-2.5 shadow-lg">
            <p className="text-xs text-front-muted">{label}</p>
            <p className="mt-0.5 font-display text-sm font-medium tabular-figures text-front-ink">
                ৳ {payload[0].value.toLocaleString("en-US")}
            </p>
        </div>
    );
}

export default function StockValuationReport({ stockValuation }) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from("[data-stock-card]", { opacity: 0, y: 16, duration: 0.5, stagger: 0.08, ease: "power2.out" });
        },
        { scope: rootRef },
    );

    return (
        <div ref={rootRef} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StatCard label="Total inventory value" value={stockValuation.total_value} format="currency" />
                <StatCard label="Total units in stock" value={stockValuation.total_units} format="number" />
            </div>

            <div data-stock-card className="rounded-2xl border border-front-line bg-front-surface p-6">
                <p className="font-display text-lg font-medium text-front-ink">Value by category</p>
                <p className="mb-5 text-xs text-front-muted">Current stock quantity × unit price</p>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stockValuation.by_category} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 0 }}>
                            <CartesianGrid horizontal={false} stroke="var(--color-front-line)" strokeDasharray="3 6" />
                            <XAxis
                                type="number"
                                tick={{ fill: "var(--color-front-muted)", fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => `৳${Math.round(v / 1000)}k`}
                            />
                            <YAxis
                                type="category"
                                dataKey="category"
                                tick={{ fill: "var(--color-front-muted)", fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                width={100}
                            />
                            <Tooltip content={<ValueTooltip />} cursor={{ fill: "var(--color-front-line)", opacity: 0.3 }} />
                            <Bar dataKey="value" radius={[0, 6, 6, 0]} animationDuration={800}>
                                {stockValuation.by_category.map((entry, index) => (
                                    <Cell key={entry.category} fill={PALETTE[index % PALETTE.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div data-stock-card className="rounded-2xl border border-front-line bg-front-surface p-6">
                <p className="font-display text-lg font-medium text-front-ink">Value by branch</p>
                <p className="mb-5 text-xs text-front-muted">Inventory value held at each location</p>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[480px] border-collapse">
                        <thead>
                            <tr className="border-b border-front-line text-left text-xs font-medium text-front-muted uppercase">
                                <th scope="col" className="px-4 py-3">Branch</th>
                                <th scope="col" className="px-4 py-3">Units</th>
                                <th scope="col" className="px-4 py-3">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockValuation.by_branch.map((row) => (
                                <tr key={row.branch} className="border-b border-front-line last:border-b-0">
                                    <td className="px-4 py-3">
                                        <span className="flex items-center gap-2 text-sm text-front-ink/90">
                                            <Building2 size={14} className="text-front-muted" />
                                            {row.branch}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm tabular-figures text-front-ink/85">{row.quantity}</td>
                                    <td className="px-4 py-3 text-sm font-medium tabular-figures text-front-ink/90">
                                        ৳ {row.value.toLocaleString("en-US")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
