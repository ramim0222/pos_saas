import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Bell, Building2, Coins, Database, Receipt, Store } from "lucide-react";

const SECTIONS = [
    { value: "profile", label: "Store Profile", icon: Store },
    { value: "receipt", label: "Receipt", icon: Receipt },
    { value: "tax", label: "Tax", icon: Building2 },
    { value: "localization", label: "Currency & Localization", icon: Coins },
    { value: "data", label: "Data & Backup", icon: Database },
    { value: "notifications", label: "Notifications", icon: Bell },
];

export default function SettingsTabs({ active, onChange, children }) {
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
        <div className="flex flex-col gap-6 lg:flex-row">
            <nav
                aria-label="Settings sections"
                className="flex shrink-0 gap-1 overflow-x-auto pb-1 lg:w-56 lg:flex-col lg:overflow-visible lg:pb-0"
            >
                {SECTIONS.map((section) => {
                    const Icon = section.icon;
                    const isActive = active === section.value;
                    return (
                        <button
                            key={section.value}
                            type="button"
                            onClick={() => onChange(section.value)}
                            aria-current={isActive}
                            className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium whitespace-nowrap transition-colors ${
                                isActive ? "bg-front-accent text-front-accent-ink" : "text-front-muted hover:bg-front-surface hover:text-front-ink"
                            }`}
                        >
                            <Icon size={15} />
                            {section.label}
                        </button>
                    );
                })}
            </nav>

            <div ref={panelRef} className="min-w-0 flex-1">
                {children}
            </div>
        </div>
    );
}
