import { useRef } from "react";
import { router } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight, Check, PackageSearch, X } from "lucide-react";

export default function TransferRequestsPanel({ requests }) {
    const rootRef = useRef(null);
    const rowRefs = useRef({});

    useGSAP(
        () => {
            gsap.fromTo(
                "[data-transfer-row]",
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" },
            );
        },
        { scope: rootRef, dependencies: [requests], revertOnUpdate: true },
    );

    const decide = (id, action) => {
        const el = rowRefs.current[id];
        const routeName = action === "approve" ? "admin.branches.transfers.approve" : "admin.branches.transfers.reject";

        // The collapse animation is purely cosmetic — fire the real request
        // immediately rather than waiting on the tween's onComplete, since
        // GSAP tweens aren't guaranteed to progress in every environment
        // (e.g. a backgrounded/throttled tab).
        router.post(route(routeName, id), {}, { preserveScroll: true });

        if (el) {
            gsap.to(el, {
                height: 0,
                opacity: 0,
                marginBottom: 0,
                paddingTop: 0,
                paddingBottom: 0,
                duration: 0.32,
                ease: "power2.in",
            });
        }
    };

    return (
        <div ref={rootRef} className="rounded-2xl border border-front-line bg-front-surface p-6">
            <div className="mb-5 flex items-center gap-2">
                <PackageSearch size={16} className="text-front-accent" />
                <p className="font-display text-lg font-medium text-front-ink">Inter-branch transfer requests</p>
            </div>

            {requests.length === 0 ? (
                <p className="py-8 text-center text-sm text-front-muted">No pending transfer requests.</p>
            ) : (
                <div className="space-y-2">
                    {requests.map((req) => (
                        <div
                            key={req.id}
                            ref={(el) => {
                                if (el) rowRefs.current[req.id] = el;
                            }}
                            data-transfer-row
                            className="overflow-hidden rounded-xl border border-front-line px-4 py-3"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-front-ink">
                                        {req.quantity}x {req.product}
                                        <span className="ml-1 text-xs font-normal text-front-muted">({req.sku})</span>
                                    </p>
                                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-front-muted">
                                        {req.from_branch}
                                        <ArrowRight size={11} />
                                        {req.to_branch}
                                        <span>· requested by {req.requested_by} · {req.created_at}</span>
                                    </p>
                                    {req.notes && <p className="mt-1 text-xs text-front-muted italic">{req.notes}</p>}
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => decide(req.id, "reject")}
                                        className="flex items-center gap-1.5 rounded-full border border-red-400/30 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-400/10"
                                    >
                                        <X size={12} />
                                        Reject
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => decide(req.id, "approve")}
                                        className="flex items-center gap-1.5 rounded-full bg-front-accent px-3 py-1.5 text-xs font-medium text-front-accent-ink"
                                    >
                                        <Check size={12} />
                                        Approve
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
