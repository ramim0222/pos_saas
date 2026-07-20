import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Boxes, MapPin, Pencil, Phone, Power, TrendingUp, UserCog, Users } from "lucide-react";

import StatusBadge from "@/Components/Admin/StatusBadge";

export default function BranchCard({ branch, onView, onEdit, onToggleActive }) {
    const cardRef = useRef(null);

    useGSAP(() => {
        const el = cardRef.current;
        if (!el) return;

        const onEnter = () => gsap.to(el, { y: -4, duration: 0.25, ease: "power2.out" });
        const onLeave = () => gsap.to(el, { y: 0, duration: 0.3, ease: "power2.out" });

        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);

        return () => {
            el.removeEventListener("mouseenter", onEnter);
            el.removeEventListener("mouseleave", onLeave);
        };
    }, []);

    return (
        <div
            ref={cardRef}
            data-branch-card
            className={`rounded-2xl border bg-front-surface p-6 shadow-sm transition-shadow hover:shadow-lg ${
                branch.is_active ? "border-front-line" : "border-front-line opacity-70"
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <button
                        type="button"
                        onClick={() => onView(branch)}
                        className="text-left font-display text-lg font-medium text-front-ink hover:text-front-accent"
                    >
                        {branch.name}
                    </button>
                    {branch.address && (
                        <p className="mt-1 flex items-start gap-1 text-xs text-front-muted">
                            <MapPin size={12} className="mt-0.5 shrink-0" />
                            <span className="line-clamp-2">{branch.address}</span>
                        </p>
                    )}
                </div>
                <StatusBadge status={branch.is_active ? "active" : "inactive"} />
            </div>

            <div className="mt-4 space-y-1.5 text-xs text-front-muted">
                {branch.phone && (
                    <p className="flex items-center gap-1.5">
                        <Phone size={12} />
                        {branch.phone}
                    </p>
                )}
                <p className="flex items-center gap-1.5">
                    <UserCog size={12} />
                    {branch.manager?.name ?? "No manager assigned"}
                </p>
                <p className="flex items-center gap-1.5">
                    <Users size={12} />
                    {branch.staff_count} staff member{branch.staff_count === 1 ? "" : "s"}
                </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-front-line pt-4">
                <div>
                    <p className="flex items-center gap-1 text-[11px] text-front-muted uppercase">
                        <TrendingUp size={11} />
                        Today's sales
                    </p>
                    <p className="mt-1 font-display text-base font-semibold tabular-figures text-front-ink">
                        ৳ {branch.today_sales.toLocaleString("en-US")}
                    </p>
                </div>
                <div>
                    <p className="flex items-center gap-1 text-[11px] text-front-muted uppercase">
                        <Boxes size={11} />
                        Stock value
                    </p>
                    <p className="mt-1 font-display text-base font-semibold tabular-figures text-front-ink">
                        ৳ {branch.stock_value.toLocaleString("en-US")}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-1 border-t border-front-line pt-3">
                <button
                    type="button"
                    onClick={() => onEdit(branch)}
                    aria-label={`Edit ${branch.name}`}
                    className="rounded-lg p-1.5 text-front-muted hover:bg-front-bg hover:text-front-ink"
                >
                    <Pencil size={14} />
                </button>
                <button
                    type="button"
                    onClick={() => onToggleActive(branch)}
                    aria-label={branch.is_active ? `Deactivate ${branch.name}` : `Reactivate ${branch.name}`}
                    className={`rounded-lg p-1.5 text-front-muted ${branch.is_active ? "hover:bg-front-accent/10 hover:text-front-accent" : "hover:bg-front-green/10 hover:text-front-green"}`}
                >
                    <Power size={14} />
                </button>
            </div>
        </div>
    );
}
