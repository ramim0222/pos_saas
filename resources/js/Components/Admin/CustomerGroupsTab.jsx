import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Pencil, Plus, Users } from "lucide-react";

export default function CustomerGroupsTab({ groups, onAdd, onEdit }) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.fromTo(
                "[data-group-card]",
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" },
            );
        },
        { scope: rootRef, dependencies: [groups] },
    );

    return (
        <div ref={rootRef} className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-display text-2xl font-semibold text-front-ink">Customer groups</h1>
                    <p className="mt-1 text-sm text-front-muted">Pricing tiers applied at checkout</p>
                </div>
                <button
                    type="button"
                    onClick={onAdd}
                    className="flex items-center gap-2 rounded-full bg-front-accent px-4 py-2 text-sm font-medium text-front-accent-ink transition-transform hover:scale-[1.03]"
                >
                    <Plus size={15} />
                    Add group
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {groups.map((group) => (
                    <div key={group.id} data-group-card className="rounded-2xl border border-front-line bg-front-surface p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-display text-lg font-medium text-front-ink">{group.name}</p>
                                <p className="mt-1 font-display text-3xl font-semibold tabular-figures text-front-accent">
                                    {group.discount_percent}%
                                </p>
                                <p className="text-xs text-front-muted">discount at checkout</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => onEdit(group)}
                                aria-label={`Edit ${group.name}`}
                                className="rounded-lg p-1.5 text-front-muted hover:bg-front-bg hover:text-front-ink"
                            >
                                <Pencil size={14} />
                            </button>
                        </div>

                        {group.description && <p className="mt-4 text-sm text-front-ink/70">{group.description}</p>}

                        <div className="mt-4 flex items-center gap-1.5 border-t border-front-line pt-4 text-xs text-front-muted">
                            <Users size={13} />
                            {group.customers_count} customer{group.customers_count === 1 ? "" : "s"}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
