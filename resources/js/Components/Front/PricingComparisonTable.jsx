import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const COLUMNS = ["Starter", "Pro", "Enterprise"];

const ROWS = [
    { label: "Branches", values: ["1", "Up to 5", "Unlimited"] },
    { label: "Staff accounts", values: ["2", "15", "Unlimited"] },
    { label: "Products", values: ["Up to 500", "Unlimited", "Unlimited"] },
    { label: "POS terminals", values: ["1", "Up to 5", "Unlimited"] },
    { label: "Offline POS mode", values: [true, true, true] },
    { label: "Customer loyalty", values: [false, true, true] },
    { label: "Inter-branch transfers", values: [false, true, true] },
    { label: "Report exports", values: [false, true, true] },
    { label: "bKash auto-reminders", values: [true, true, true] },
    { label: "Support level", values: ["Email", "Priority", "Dedicated manager"] },
];

function Cell({ value }) {
    if (value === true) return <Check size={16} className="text-front-accent" />;
    if (value === false) return <span className="text-front-muted">—</span>;
    return <span className="tabular-figures text-front-ink/85">{value}</span>;
}

export default function PricingComparisonTable() {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from(rootRef.current.querySelector("[data-table]"), {
                opacity: 0,
                y: 20,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: { trigger: rootRef.current, start: "top 78%" },
            });
        },
        { scope: rootRef },
    );

    return (
        <section ref={rootRef} className="border-t border-front-line bg-front-bg py-24 lg:py-32">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                <div className="mb-14 max-w-2xl">
                    <p className="mb-4 text-xs font-medium tracking-[0.2em] text-front-accent uppercase">
                        Compare in detail
                    </p>
                    <h2 className="font-display text-4xl font-semibold tracking-tight text-front-ink lg:text-5xl">
                        Every plan, side by side.
                    </h2>
                </div>

                <div
                    data-table
                    className="overflow-x-auto rounded-2xl border border-front-line bg-front-surface"
                >
                    <table className="w-full min-w-[640px] border-collapse text-left">
                        <caption className="sr-only">
                            Feature comparison across Starter, Pro, and Enterprise plans
                        </caption>
                        <thead>
                            <tr>
                                <th scope="col" className="px-6 py-5 text-sm font-normal text-front-muted">
                                    Feature
                                </th>
                                {COLUMNS.map((col, i) => (
                                    <th
                                        key={col}
                                        scope="col"
                                        className={`border-l border-front-line px-6 py-5 font-display text-base font-medium ${
                                            i === 1
                                                ? "bg-front-accent/[0.07] text-front-ink"
                                                : "text-front-muted"
                                        }`}
                                    >
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {ROWS.map((row) => (
                                <tr key={row.label}>
                                    <th
                                        scope="row"
                                        className="border-t border-front-line px-6 py-4 text-sm font-normal text-front-ink/85"
                                    >
                                        {row.label}
                                    </th>
                                    {row.values.map((val, i) => (
                                        <td
                                            key={`${row.label}-${COLUMNS[i]}`}
                                            className={`border-t border-l border-front-line px-6 py-4 ${
                                                i === 1 ? "bg-front-accent/[0.07]" : ""
                                            }`}
                                        >
                                            <Cell value={val} />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
