import { useRef } from "react";
import { router } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { History, LogIn, Pencil, RefreshCcw, ShieldAlert, UserPlus } from "lucide-react";

const ACTION_META = {
    login: { icon: LogIn, className: "text-front-green" },
    "staff.invite": { icon: UserPlus, className: "text-front-accent" },
    "staff.manage": { icon: Pencil, className: "text-front-accent" },
    "staff.suspend": { icon: ShieldAlert, className: "text-red-400" },
    "staff.accept_invite": { icon: RefreshCcw, className: "text-front-green" },
};

export default function ActivityLogPanel({ logs, staff, filterUser }) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.fromTo(
                "[data-log-row]",
                { opacity: 0, x: 10 },
                { opacity: 1, x: 0, duration: 0.35, stagger: 0.04, ease: "power2.out" },
            );
        },
        { scope: rootRef, dependencies: [logs] },
    );

    const applyFilter = (userId) => {
        router.get(
            route("admin.staff.index"),
            userId ? { user: userId } : {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    return (
        <div ref={rootRef} className="rounded-2xl border border-front-line bg-front-surface p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <History size={16} className="text-front-accent" />
                    <p className="font-display text-lg font-medium text-front-ink">Activity log</p>
                </div>
                <select
                    value={filterUser ?? ""}
                    onChange={(e) => applyFilter(e.target.value)}
                    aria-label="Filter activity by staff member"
                    className="rounded-full border border-front-line bg-front-bg px-3 py-1.5 text-xs text-front-ink outline-none focus:border-front-accent"
                >
                    <option value="">All team members</option>
                    {staff.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>
            </div>

            {logs.length === 0 ? (
                <p className="py-8 text-center text-sm text-front-muted">No activity recorded for this filter yet.</p>
            ) : (
                <div className="max-h-96 space-y-1 overflow-y-auto">
                    {logs.map((log) => {
                        const meta = ACTION_META[log.action] ?? { icon: History, className: "text-front-muted" };
                        const Icon = meta.icon;
                        return (
                            <div key={log.id} data-log-row className="flex items-start gap-3 rounded-lg px-2 py-2.5 hover:bg-front-bg/60">
                                <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-front-bg ${meta.className}`}>
                                    <Icon size={14} />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-front-ink/90">
                                        <span className="font-medium">{log.user}</span> — {log.description}
                                    </p>
                                    <p className="text-xs text-front-muted">
                                        {log.created_at}
                                        {log.ip_address && ` · ${log.ip_address}`}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
