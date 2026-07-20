import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    Area,
    AreaChart,
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

gsap.registerPlugin(ScrollTrigger);

function RevenueTooltip({ active, payload, label }) {
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

function ComboTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border border-front-line bg-front-surface px-3.5 py-2.5 shadow-lg">
            <p className="text-xs text-front-muted">{label}</p>
            {payload.map((p) => (
                <p key={p.dataKey} className="mt-0.5 text-sm font-medium tabular-figures text-front-ink">
                    {p.dataKey === "transactions" ? p.value : `৳ ${p.value.toLocaleString("en-US")}`}
                    <span className="ml-1 text-xs font-normal text-front-muted">
                        {p.dataKey === "transactions" ? "transactions" : "AOV"}
                    </span>
                </p>
            ))}
        </div>
    );
}

export default function SalesOverviewReport({ overview }) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from("[data-chart-card]", {
                opacity: 0,
                y: 16,
                duration: 0.5,
                stagger: 0.08,
                ease: "power2.out",
            });
        },
        { scope: rootRef },
    );

    return (
        <div ref={rootRef} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total revenue" value={overview.total_revenue} format="currency" />
                <StatCard label="Transactions" value={overview.total_transactions} format="number" />
                <StatCard label="Average order value" value={overview.average_order_value} format="currency" />
                <StatCard label="Total refunds" value={overview.total_refunds} format="currency" tone="warning" />
            </div>

            <div data-chart-card className="rounded-2xl border border-front-line bg-front-surface p-6">
                <p className="font-display text-lg font-medium text-front-ink">Revenue over time</p>
                <p className="mb-5 text-xs text-front-muted">Completed sales within the selected range</p>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={overview.trend} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                            <defs>
                                <linearGradient id="reportRevenueFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--color-front-accent)" stopOpacity={0.35} />
                                    <stop offset="100%" stopColor="var(--color-front-accent)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} stroke="var(--color-front-line)" strokeDasharray="3 6" />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: "var(--color-front-muted)", fontSize: 11 }}
                                axisLine={{ stroke: "var(--color-front-line)" }}
                                tickLine={false}
                                interval={Math.max(0, Math.floor(overview.trend.length / 8))}
                            />
                            <YAxis
                                tick={{ fill: "var(--color-front-muted)", fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => `৳${Math.round(v / 1000)}k`}
                                width={52}
                            />
                            <Tooltip content={<RevenueTooltip />} cursor={{ stroke: "var(--color-front-line)" }} />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="var(--color-front-accent)"
                                strokeWidth={2}
                                fill="url(#reportRevenueFill)"
                                animationDuration={900}
                                animationEasing="ease-out"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div data-chart-card className="rounded-2xl border border-front-line bg-front-surface p-6">
                <p className="font-display text-lg font-medium text-front-ink">Transactions &amp; average order value</p>
                <p className="mb-5 text-xs text-front-muted">Daily transaction volume with AOV trend line</p>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={overview.trend} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                            <CartesianGrid vertical={false} stroke="var(--color-front-line)" strokeDasharray="3 6" />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: "var(--color-front-muted)", fontSize: 11 }}
                                axisLine={{ stroke: "var(--color-front-line)" }}
                                tickLine={false}
                                interval={Math.max(0, Math.floor(overview.trend.length / 8))}
                            />
                            <YAxis
                                yAxisId="left"
                                tick={{ fill: "var(--color-front-muted)", fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                width={30}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tick={{ fill: "var(--color-front-muted)", fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => `৳${Math.round(v / 1000)}k`}
                                width={48}
                            />
                            <Tooltip content={<ComboTooltip />} cursor={{ fill: "var(--color-front-line)", opacity: 0.3 }} />
                            <Bar yAxisId="left" dataKey="transactions" fill="var(--color-front-line)" radius={[4, 4, 0, 0]} animationDuration={800} />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="aov"
                                stroke="var(--color-front-green)"
                                strokeWidth={2}
                                dot={false}
                                animationDuration={900}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
