import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import StatCard from "@/Components/Admin/StatCard";

function PLTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border border-front-line bg-front-surface px-3.5 py-2.5 shadow-lg">
            <p className="text-xs text-front-muted">{label}</p>
            {payload.map((p) => (
                <p key={p.dataKey} className="mt-0.5 flex items-center gap-1.5 text-sm font-medium tabular-figures text-front-ink">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                    ৳ {p.value.toLocaleString("en-US")}
                    <span className="text-xs font-normal text-front-muted capitalize">{p.dataKey}</span>
                </p>
            ))}
        </div>
    );
}

export default function ProfitLossReport({ profitLoss }) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from("[data-pl-card]", { opacity: 0, y: 16, duration: 0.5, stagger: 0.08, ease: "power2.out" });
        },
        { scope: rootRef },
    );

    return (
        <div ref={rootRef} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Revenue" value={profitLoss.total_revenue} format="currency" />
                <StatCard label="Cost of goods sold" value={profitLoss.total_cogs} format="currency" />
                <StatCard label="Gross profit" value={profitLoss.gross_profit} format="currency" />
                <StatCard label="Gross margin" value={profitLoss.margin} format="number" />
            </div>

            <div data-pl-card className="rounded-2xl border border-front-line bg-front-surface p-6">
                <p className="font-display text-lg font-medium text-front-ink">Revenue vs. cost of goods</p>
                <p className="mb-5 text-xs text-front-muted">Estimated COGS from average purchase cost per product</p>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={profitLoss.trend} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                            <CartesianGrid vertical={false} stroke="var(--color-front-line)" strokeDasharray="3 6" />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: "var(--color-front-muted)", fontSize: 11 }}
                                axisLine={{ stroke: "var(--color-front-line)" }}
                                tickLine={false}
                                interval={Math.max(0, Math.floor(profitLoss.trend.length / 8))}
                            />
                            <YAxis
                                tick={{ fill: "var(--color-front-muted)", fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => `৳${Math.round(v / 1000)}k`}
                                width={52}
                            />
                            <Tooltip content={<PLTooltip />} cursor={{ fill: "var(--color-front-line)", opacity: 0.3 }} />
                            <Bar dataKey="revenue" fill="var(--color-front-accent)" radius={[4, 4, 0, 0]} animationDuration={800} />
                            <Bar dataKey="cogs" fill="var(--color-front-line)" radius={[4, 4, 0, 0]} animationDuration={800} />
                            <Line type="monotone" dataKey="profit" stroke="var(--color-front-green)" strokeWidth={2} dot={false} animationDuration={900} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div data-pl-card className="rounded-2xl border border-front-line bg-front-surface p-6">
                <p className="font-display text-lg font-medium text-front-ink">Breakdown by category</p>
                <p className="mb-5 text-xs text-front-muted">Revenue, COGS, and margin per product category</p>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] border-collapse">
                        <thead>
                            <tr className="border-b border-front-line text-left text-xs font-medium text-front-muted uppercase">
                                <th scope="col" className="px-4 py-3">Category</th>
                                <th scope="col" className="px-4 py-3">Revenue</th>
                                <th scope="col" className="px-4 py-3">COGS</th>
                                <th scope="col" className="px-4 py-3">Profit</th>
                                <th scope="col" className="px-4 py-3">Margin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profitLoss.breakdown.map((row) => (
                                <tr key={row.category} className="border-b border-front-line last:border-b-0">
                                    <td className="px-4 py-3 text-sm text-front-ink/90">{row.category}</td>
                                    <td className="px-4 py-3 text-sm tabular-figures text-front-ink/85">৳ {row.revenue.toLocaleString("en-US")}</td>
                                    <td className="px-4 py-3 text-sm tabular-figures text-front-muted">৳ {row.cogs.toLocaleString("en-US")}</td>
                                    <td className="px-4 py-3 text-sm font-medium tabular-figures text-front-green">৳ {row.profit.toLocaleString("en-US")}</td>
                                    <td className="px-4 py-3 text-sm tabular-figures text-front-ink/85">{row.margin}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
