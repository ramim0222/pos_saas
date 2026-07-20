import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Users, Layers } from "lucide-react";

const TABS = [
    { value: "customers", label: "Customers", icon: Users },
    { value: "groups", label: "Groups & pricing", icon: Layers },
];

export default function CustomersTabs({ active, onChange, children }) {
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
            <div role="tablist" aria-label="Customers view" className="inline-flex rounded-full border border-front-line p-1">
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
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                isActive ? "bg-front-accent text-front-accent-ink" : "text-front-muted hover:text-front-ink"
                            }`}
                        >
                            <Icon size={15} />
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
