import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TrendingDown, TrendingUp } from "lucide-react";

function RankedTable({ title, subtitle, rows, icon: Icon, accent }) {
    return (
        <div className="rounded-2xl border border-front-line bg-front-surface p-6">
            <div className="mb-5 flex items-center gap-2">
                <Icon size={16} className={accent} />
                <div>
                    <p className="font-display text-lg font-medium text-front-ink">{title}</p>
                    <p className="text-xs text-front-muted">{subtitle}</p>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] border-collapse">
                    <thead>
                        <tr className="border-b border-front-line text-left text-xs font-medium text-front-muted uppercase">
                            <th scope="col" className="px-3 py-2.5">Product</th>
                            <th scope="col" className="px-3 py-2.5">Units sold</th>
                            <th scope="col" className="px-3 py-2.5">Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.id} data-perf-row className="border-b border-front-line last:border-b-0">
                                <td className="px-3 py-2.5">
                                    <p className="text-sm text-front-ink/90">{row.name}</p>
                                    <p className="text-xs text-front-muted">{row.category ?? "Uncategorized"}</p>
                                </td>
                                <td className="px-3 py-2.5 text-sm tabular-figures text-front-ink/85">{row.quantity_sold}</td>
                                <td className="px-3 py-2.5 text-sm font-medium tabular-figures text-front-ink/90">
                                    ৳ {row.revenue.toLocaleString("en-US")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function ProductPerformanceReport({ productPerformance }) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.fromTo(
                "[data-perf-row]",
                { opacity: 0, x: 10 },
                { opacity: 1, x: 0, duration: 0.35, stagger: 0.04, ease: "power2.out" },
            );
        },
        { scope: rootRef },
    );

    return (
        <div ref={rootRef} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <RankedTable
                    title="Best sellers"
                    subtitle="Ranked by units sold"
                    rows={productPerformance.best_sellers}
                    icon={TrendingUp}
                    accent="text-front-green"
                />
                <RankedTable
                    title="Worst sellers"
                    subtitle="Ranked by units sold, lowest first"
                    rows={productPerformance.worst_sellers}
                    icon={TrendingDown}
                    accent="text-red-400"
                />
            </div>

            <div className="rounded-2xl border border-front-line bg-front-surface p-6">
                <p className="font-display text-lg font-medium text-front-ink">Stock turnover</p>
                <p className="mb-5 text-xs text-front-muted">
                    Units sold ÷ current stock — higher means faster-moving inventory
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] border-collapse">
                        <thead>
                            <tr className="border-b border-front-line text-left text-xs font-medium text-front-muted uppercase">
                                <th scope="col" className="px-4 py-3">Product</th>
                                <th scope="col" className="px-4 py-3">Category</th>
                                <th scope="col" className="px-4 py-3">Units sold</th>
                                <th scope="col" className="px-4 py-3">Current stock</th>
                                <th scope="col" className="px-4 py-3">Turnover rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productPerformance.all.map((row) => (
                                <tr key={row.id} className="border-b border-front-line last:border-b-0">
                                    <td className="px-4 py-3 text-sm text-front-ink/90">{row.name}</td>
                                    <td className="px-4 py-3 text-sm text-front-muted">{row.category ?? "—"}</td>
                                    <td className="px-4 py-3 text-sm tabular-figures text-front-ink/85">{row.quantity_sold}</td>
                                    <td className="px-4 py-3 text-sm tabular-figures text-front-ink/85">{row.current_stock}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`text-sm font-medium tabular-figures ${
                                                row.turnover_rate >= 1 ? "text-front-green" : row.turnover_rate > 0 ? "text-front-accent" : "text-front-muted"
                                            }`}
                                        >
                                            {row.turnover_rate}x
                                        </span>
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
