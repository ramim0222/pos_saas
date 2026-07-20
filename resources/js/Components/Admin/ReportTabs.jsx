import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { BarChart3, PackageSearch, TrendingUp, UserCheck, Warehouse } from "lucide-react";

const TABS = [
    { value: "overview", label: "Sales overview", icon: TrendingUp },
    { value: "profit-loss", label: "Profit & Loss", icon: BarChart3 },
    { value: "products", label: "Product performance", icon: PackageSearch },
    { value: "cashiers", label: "Cashier performance", icon: UserCheck },
    { value: "stock", label: "Stock valuation", icon: Warehouse },
];

export default function ReportTabs({ active, onChange, children }) {
    const panelRef = useRef(null);

    useGSAP(
        () => {
            if (!panelRef.current) return;
            gsap.fromTo(
                panelRef.current,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
            );
        },
        { dependencies: [active], revertOnUpdate: true },
    );

    return (
        <div>
            <div role="tablist" aria-label="Report type" className="flex flex-wrap gap-1 rounded-full border border-front-line p-1">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = active === tab.value;
                    return (
                        <button
                            key={tab.value}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => onChange(tab.value)}
                            className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-colors sm:text-sm ${
                                isActive ? "bg-front-accent text-front-accent-ink" : "text-front-muted hover:text-front-ink"
                            }`}
                        >
                            <Icon size={14} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <div ref={panelRef} className="mt-6">
                {children}
            </div>
        </div>
    );
}
