import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ChevronDown, ShieldCheck } from "lucide-react";

const ROLES = [
    {
        name: "Owner",
        summary: "Full control over every part of the store.",
        access: ["Dashboard & reports", "Products & inventory", "Sales, purchases & customers", "Billing & subscription", "Staff & permissions", "Store settings"],
    },
    {
        name: "Manager",
        summary: "Runs day-to-day operations across assigned branches.",
        access: ["Dashboard & reports", "Products & inventory", "Sales, purchases & customers", "Staff (view only)"],
        restricted: ["Billing & subscription", "Store settings"],
    },
    {
        name: "Cashier",
        summary: "Handles the POS counter and customer-facing sales.",
        access: ["Sales & POS", "Customer lookup"],
        restricted: ["Inventory & purchases", "Reports", "Billing & subscription", "Staff & settings"],
    },
    {
        name: "Inventory Staff",
        summary: "Keeps stock accurate — receiving, adjustments, transfers.",
        access: ["Products & inventory", "Purchase orders (view & receive)"],
        restricted: ["Sales & POS", "Billing & subscription", "Staff & settings"],
    },
];

export default function RolePermissionsPanel() {
    const rootRef = useRef(null);
    const [expanded, setExpanded] = useState(null);

    useGSAP(
        () => {
            gsap.from(rootRef.current, { opacity: 0, y: 14, duration: 0.5, ease: "power2.out" });
        },
        { scope: rootRef },
    );

    return (
        <div ref={rootRef} className="rounded-2xl border border-front-line bg-front-surface p-6">
            <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-front-accent" />
                <p className="font-display text-lg font-medium text-front-ink">Roles & permissions</p>
            </div>
            <p className="mt-1 mb-5 text-xs text-front-muted">What each role can see and do across the store</p>

            <div className="space-y-2">
                {ROLES.map((role) => {
                    const isOpen = expanded === role.name;
                    return (
                        <div key={role.name} className="rounded-xl border border-front-line">
                            <button
                                type="button"
                                onClick={() => setExpanded(isOpen ? null : role.name)}
                                aria-expanded={isOpen}
                                className="flex w-full items-center justify-between px-4 py-3 text-left"
                            >
                                <div>
                                    <p className="text-sm font-medium text-front-ink">{role.name}</p>
                                    <p className="text-xs text-front-muted">{role.summary}</p>
                                </div>
                                <ChevronDown size={16} className={`shrink-0 text-front-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
                            </button>
                            {isOpen && (
                                <div className="grid grid-cols-1 gap-4 border-t border-front-line px-4 py-4 sm:grid-cols-2">
                                    <div>
                                        <p className="mb-2 text-xs font-medium tracking-wide text-front-green uppercase">Can access</p>
                                        <ul className="space-y-1.5">
                                            {role.access.map((item) => (
                                                <li key={item} className="text-sm text-front-ink/80">
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {role.restricted && (
                                        <div>
                                            <p className="mb-2 text-xs font-medium tracking-wide text-front-muted uppercase">No access</p>
                                            <ul className="space-y-1.5">
                                                {role.restricted.map((item) => (
                                                    <li key={item} className="text-sm text-front-muted">
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
