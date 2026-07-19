import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

gsap.registerPlugin(ScrollTrigger);

function CustomTooltip({ active, payload, label }) {
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

export default function RevenueChart({ series }) {
    const rootRef = useRef(null);
    const [range, setRange] = useState("7d");

    useGSAP(
        () => {
            gsap.from(rootRef.current, {
                opacity: 0,
                y: 20,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: { trigger: rootRef.current, start: "top 85%" },
            });
        },
        { scope: rootRef },
    );

    const data = series[range];

    return (
        <div
            ref={rootRef}
            className="rounded-2xl border border-front-line bg-front-surface p-6"
        >
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="font-display text-lg font-medium text-front-ink">
                        Revenue trend
                    </p>
                    <p className="text-xs text-front-muted">
                        Subscription revenue collected via bKash
                    </p>
                </div>
                <div className="inline-flex rounded-full border border-front-line p-1">
                    {["7d", "30d"].map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => setRange(option)}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                range === option
                                    ? "bg-front-accent text-front-accent-ink"
                                    : "text-front-muted hover:text-front-ink"
                            }`}
                        >
                            {option === "7d" ? "7 days" : "30 days"}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                        <defs>
                            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--color-front-accent)" stopOpacity={0.35} />
                                <stop offset="100%" stopColor="var(--color-front-accent)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            vertical={false}
                            stroke="var(--color-front-line)"
                            strokeDasharray="3 6"
                        />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: "var(--color-front-muted)", fontSize: 11 }}
                            axisLine={{ stroke: "var(--color-front-line)" }}
                            tickLine={false}
                            interval={range === "30d" ? 4 : 0}
                        />
                        <YAxis
                            tick={{ fill: "var(--color-front-muted)", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `৳${Math.round(v / 1000)}k`}
                            width={52}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--color-front-line)" }} />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="var(--color-front-accent)"
                            strokeWidth={2}
                            fill="url(#revenueFill)"
                            isAnimationActive={true}
                            animationDuration={900}
                            animationEasing="ease-out"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
