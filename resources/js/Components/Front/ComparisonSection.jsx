import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Minus, X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const COLUMNS = ["Paper & spreadsheets", "Generic POS software", "Dokan"];

const ROWS = [
    { label: "Works through a dropped connection", values: [false, "partial", true] },
    { label: "One view across every branch", values: [false, "partial", true] },
    { label: "Renew with bKash directly", values: [false, false, true] },
    { label: "Bangla and English side by side", values: [false, "partial", true] },
    { label: "Stock updates the moment you sell", values: [false, true, true] },
    { label: "Ready to use same day", values: [true, false, true] },
];

function Cell({ value }) {
    if (value === true) return <Check size={16} className="text-front-accent" />;
    if (value === "partial") return <Minus size={16} className="text-front-muted" />;
    return <X size={16} className="text-front-muted/50" />;
}

export default function ComparisonSection() {
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
                        Why switch
                    </p>
                    <h2 className="font-display text-4xl font-semibold tracking-tight text-front-ink lg:text-5xl">
                        A notebook can't sync branches. A generic POS wasn't built for bKash.
                    </h2>
                </div>

                <div
                    data-table
                    className="overflow-x-auto rounded-2xl border border-front-line bg-front-surface"
                >
                    <table className="w-full min-w-[640px] border-collapse text-left">
                        <thead>
                            <tr>
                                <th className="px-6 py-5 text-sm font-normal text-front-muted" />
                                {COLUMNS.map((col, i) => (
                                    <th
                                        key={col}
                                        scope="col"
                                        className={`border-l border-front-line px-6 py-5 font-display text-base font-medium ${
                                            i === 2
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
                                                i === 2 ? "bg-front-accent/[0.07]" : ""
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
