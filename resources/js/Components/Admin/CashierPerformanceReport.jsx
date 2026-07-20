import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Clock, UserCog } from "lucide-react";

function CashierTooltip({ active, payload, label }) {
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

export default function CashierPerformanceReport({ cashierPerformance }) {
    const rootRef = useRef(null);
    const rows = cashierPerformance.rows;

    useGSAP(
        () => {
            gsap.from("[data-cashier-card]", { opacity: 0, y: 16, duration: 0.5, ease: "power2.out" });
            gsap.fromTo(
                "[data-cashier-row]",
                { opacity: 0, x: 10 },
                { opacity: 1, x: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" },
            );
        },
        { scope: rootRef },
    );

    if (rows.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-front-line p-12 text-center">
                <p className="text-sm text-front-muted">No sales recorded by any cashier in this range.</p>
            </div>
        );
    }

    return (
        <div ref={rootRef} className="space-y-6">
            <div data-cashier-card className="rounded-2xl border border-front-line bg-front-surface p-6">
                <p className="font-display text-lg font-medium text-front-ink">Sales by cashier</p>
                <p className="mb-5 text-xs text-front-muted">Total completed sales value per cashier</p>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={rows} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                            <CartesianGrid vertical={false} stroke="var(--color-front-line)" strokeDasharray="3 6" />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: "var(--color-front-muted)", fontSize: 11 }}
                                axisLine={{ stroke: "var(--color-front-line)" }}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fill: "var(--color-front-muted)", fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => `৳${Math.round(v / 1000)}k`}
                                width={48}
                            />
                            <Tooltip content={<CashierTooltip />} cursor={{ fill: "var(--color-front-line)", opacity: 0.3 }} />
                            <Bar dataKey="total_sales" fill="var(--color-front-accent)" radius={[6, 6, 0, 0]} animationDuration={800} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-front-line bg-front-surface">
                <table className="w-full min-w-[720px] border-collapse">
                    <thead>
                        <tr className="border-b border-front-line text-left text-xs font-medium text-front-muted uppercase">
                            <th scope="col" className="px-4 py-3">Cashier</th>
                            <th scope="col" className="px-4 py-3">Transactions</th>
                            <th scope="col" className="px-4 py-3">Total sales</th>
                            <th scope="col" className="px-4 py-3">Avg. order value</th>
                            <th scope="col" className="px-4 py-3">Refunds</th>
                            <th scope="col" className="px-4 py-3">Avg. service time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.cashier_id ?? row.name} data-cashier-row className="border-b border-front-line last:border-b-0">
                                <td className="px-4 py-3">
                                    <span className="flex items-center gap-2 text-sm text-front-ink/90">
                                        <UserCog size={14} className="text-front-muted" />
                                        {row.name}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm tabular-figures text-front-ink/85">{row.transactions}</td>
                                <td className="px-4 py-3 text-sm font-medium tabular-figures text-front-ink/90">
                                    ৳ {row.total_sales.toLocaleString("en-US")}
                                </td>
                                <td className="px-4 py-3 text-sm tabular-figures text-front-ink/85">
                                    ৳ {row.average_order_value.toLocaleString("en-US")}
                                </td>
                                <td className="px-4 py-3 text-sm tabular-figures text-front-muted">{row.refunds}</td>
                                <td className="px-4 py-3 text-sm tabular-figures text-front-muted">
                                    <span className="flex items-center gap-1.5">
                                        <Clock size={13} />
                                        {row.avg_service_minutes} min
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
