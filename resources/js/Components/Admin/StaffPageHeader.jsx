import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Plus, Sparkles } from "lucide-react";

export default function StaffPageHeader({ usage, onInvite }) {
    const rootRef = useRef(null);
    const barRef = useRef(null);

    const atLimit = usage.limit !== null && usage.used >= usage.limit;
    const percent = usage.limit ? Math.min(100, (usage.used / usage.limit) * 100) : 0;

    useGSAP(
        () => {
            gsap.from(rootRef.current, { opacity: 0, y: 10, duration: 0.4, ease: "power2.out" });
            if (barRef.current) {
                gsap.fromTo(
                    barRef.current,
                    { width: "0%" },
                    { width: `${percent}%`, duration: 0.9, ease: "power2.out", delay: 0.15 },
                );
            }
        },
        { scope: rootRef },
    );

    return (
        <div ref={rootRef} className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="font-display text-2xl font-semibold text-front-ink">Staff</h1>
                    <p className="mt-1 text-sm text-front-muted">Manage team access, roles, and branch assignments</p>
                </div>
                <button
                    type="button"
                    onClick={onInvite}
                    disabled={atLimit}
                    className="flex shrink-0 items-center gap-2 rounded-full bg-front-accent px-4 py-2 text-sm font-medium text-front-accent-ink transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                >
                    <Plus size={15} />
                    Invite staff
                </button>
            </div>

            <div className="rounded-xl border border-front-line bg-front-surface px-5 py-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-front-ink/85">
                        {usage.limit === null ? (
                            <>
                                {usage.used} team member{usage.used === 1 ? "" : "s"} · <span className="text-front-muted">Unlimited on {usage.plan}</span>
                            </>
                        ) : (
                            <>
                                {usage.used} of {usage.limit} users used
                            </>
                        )}
                    </span>
                    <span className="text-xs text-front-muted">{usage.plan} plan</span>
                </div>
                {usage.limit !== null && (
                    <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-front-line">
                        <div ref={barRef} className={`h-full rounded-full ${atLimit ? "bg-front-accent" : "bg-front-green"}`} />
                    </div>
                )}

                {atLimit && (
                    <div className="mt-3 flex items-start gap-2 rounded-lg border border-front-accent/30 bg-front-accent/[0.06] px-3.5 py-2.5 text-xs text-front-ink/80">
                        <Sparkles size={14} className="mt-0.5 shrink-0 text-front-accent" />
                        <span>
                            You've reached your {usage.plan} plan's staff limit. Head to{" "}
                            <a href={route("admin.billing.index")} className="font-medium text-front-accent hover:underline">
                                Billing
                            </a>{" "}
                            to upgrade and invite more team members.
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
