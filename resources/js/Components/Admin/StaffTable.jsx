import { useRef } from "react";
import { router } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CheckCircle2, MapPin, Pencil, Power, Trash2 } from "lucide-react";

import StatusBadge from "@/Components/Admin/StatusBadge";

const ROLE_STYLES = {
    Owner: "bg-front-accent/15 text-front-accent",
    Manager: "bg-blue-400/15 text-blue-300",
    Cashier: "bg-front-line text-front-muted",
    "Inventory Staff": "bg-front-green/15 text-front-green",
};

export default function StaffTable({ staff, onEditRole, onEditBranches, onSuspend, onReactivate, onRemove, onAccept }) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.fromTo(
                "[data-staff-row]",
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: "power2.out" },
            );
        },
        { scope: rootRef, dependencies: [staff], revertOnUpdate: true },
    );

    return (
        <div ref={rootRef} className="overflow-x-auto rounded-2xl border border-front-line bg-front-surface">
            <table className="w-full min-w-[880px] border-collapse">
                <thead>
                    <tr className="border-b border-front-line text-left text-xs font-medium text-front-muted uppercase">
                        <th scope="col" className="px-4 py-3">Name</th>
                        <th scope="col" className="px-4 py-3">Role</th>
                        <th scope="col" className="px-4 py-3">Branches</th>
                        <th scope="col" className="px-4 py-3">Status</th>
                        <th scope="col" className="px-4 py-3">Last login</th>
                        <th scope="col" className="px-4 py-3" />
                    </tr>
                </thead>
                <tbody>
                    {staff.map((member) => {
                        const isPending = member.status === "invited";
                        const isOwner = member.role === "owner";

                        return (
                            <tr
                                key={member.id}
                                data-staff-row
                                className={`border-b border-front-line last:border-b-0 transition-colors ${
                                    isPending ? "border-dashed bg-front-bg/40" : "hover:bg-front-bg/60"
                                }`}
                            >
                                <td className="px-4 py-3">
                                    <p className={`text-sm font-medium ${isPending ? "text-front-muted" : "text-front-ink"}`}>{member.name}</p>
                                    <p className="text-xs text-front-muted">{member.email}</p>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${ROLE_STYLES[member.role_label] ?? "bg-front-line text-front-muted"}`}>
                                        {member.role_label}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-front-muted">
                                    {member.branches.length === 0 ? (
                                        "—"
                                    ) : (
                                        <span className="flex items-center gap-1">
                                            <MapPin size={12} />
                                            {member.branches.map((b) => b.name).join(", ")}
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <StatusBadge status={member.status === "invited" ? "pending" : member.status} />
                                </td>
                                <td className="px-4 py-3 text-sm text-front-muted">
                                    {isPending ? `Invited ${member.invited_at}` : (member.last_login_at ?? "Never")}
                                </td>
                                <td className="px-4 py-3">
                                    {!isOwner && (
                                        <div className="flex items-center justify-end gap-1">
                                            {isPending && (
                                                <button
                                                    type="button"
                                                    onClick={() => onAccept(member)}
                                                    aria-label={`Simulate ${member.name} accepting invite`}
                                                    className="rounded-lg p-1.5 text-front-muted hover:bg-front-green/10 hover:text-front-green"
                                                    title="Simulate accepted invite"
                                                >
                                                    <CheckCircle2 size={14} />
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => onEditRole(member)}
                                                aria-label={`Edit role for ${member.name}`}
                                                className="rounded-lg p-1.5 text-front-muted hover:bg-front-bg hover:text-front-ink"
                                                title="Edit role & branches"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            {member.status === "suspended" ? (
                                                <button
                                                    type="button"
                                                    onClick={() => onReactivate(member)}
                                                    aria-label={`Reactivate ${member.name}`}
                                                    className="rounded-lg p-1.5 text-front-muted hover:bg-front-green/10 hover:text-front-green"
                                                    title="Reactivate"
                                                >
                                                    <Power size={14} />
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => onSuspend(member)}
                                                    aria-label={`Suspend ${member.name}`}
                                                    className="rounded-lg p-1.5 text-front-muted hover:bg-front-accent/10 hover:text-front-accent"
                                                    title="Suspend"
                                                >
                                                    <Power size={14} />
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => onRemove(member)}
                                                aria-label={`Remove ${member.name}`}
                                                className="rounded-lg p-1.5 text-front-muted hover:bg-red-400/10 hover:text-red-400"
                                                title="Remove"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
