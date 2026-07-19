import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TrendingDown, TrendingUp } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

function initials(name) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export default function TopStoresTable({ stores }) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from("[data-store-row]", {
                opacity: 0,
                x: -10,
                duration: 0.45,
                stagger: 0.06,
                ease: "power2.out",
                scrollTrigger: { trigger: rootRef.current, start: "top 85%" },
            });
        },
        { scope: rootRef },
    );

    return (
        <div ref={rootRef} className="rounded-2xl border border-front-line bg-front-surface p-6">
            <p className="font-display text-lg font-medium text-front-ink">
                Top stores by revenue
            </p>
            <p className="mb-5 text-xs text-front-muted">
                Ranked by this month's subscription value
            </p>

            <div className="space-y-1">
                {stores.map((store, i) => (
                    <div
                        key={store.id}
                        data-store-row
                        className="flex items-center gap-4 rounded-lg px-2 py-2.5 hover:bg-front-bg"
                    >
                        <span className="w-4 font-mono text-xs text-front-muted tabular-figures">
                            {i + 1}
                        </span>
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-front-surface-2 text-xs font-medium text-front-accent">
                            {initials(store.name)}
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-front-ink/90">
                                {store.name}
                            </p>
                            <p className="text-xs text-front-muted">
                                {store.plan} · {store.branches} branch{store.branches > 1 ? "es" : ""}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium tabular-figures text-front-ink/90">
                                ৳ {store.monthlyValue.toLocaleString("en-US")}
                            </p>
                            <p
                                className={`flex items-center justify-end gap-1 text-xs ${
                                    store.trend >= 0 ? "text-front-green" : "text-red-400"
                                }`}
                            >
                                {store.trend >= 0 ? (
                                    <TrendingUp size={11} />
                                ) : (
                                    <TrendingDown size={11} />
                                )}
                                {Math.abs(store.trend)}%
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
