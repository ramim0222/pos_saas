import { useEffect, useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Loader2, X } from "lucide-react";

import { FrontButton } from "@/Components/Front/Button";

const TYPES = [
    { value: "earned", label: "Add points (earned)" },
    { value: "redeemed", label: "Deduct points (redeemed)" },
    { value: "adjusted", label: "Manual adjustment (bonus)" },
];

export default function AdjustPointsModal({ open, onClose, customer }) {
    const rootRef = useRef(null);
    const panelRef = useRef(null);
    const [type, setType] = useState("earned");
    const [points, setPoints] = useState("");
    const [reason, setReason] = useState("");
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!open) return;
        setType("earned");
        setPoints("");
        setReason("");
        setErrors({});
    }, [open, customer]);

    useGSAP(
        () => {
            if (open) {
                gsap.set(rootRef.current, { display: "flex" });
                gsap.fromTo("[data-backdrop]", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out" });
                gsap.fromTo(panelRef.current, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
            } else if (rootRef.current) {
                gsap.to(panelRef.current, { scale: 0.95, opacity: 0, duration: 0.2, ease: "power2.in" });
                gsap.to("[data-backdrop]", {
                    opacity: 0,
                    duration: 0.2,
                    onComplete: () => gsap.set(rootRef.current, { display: "none" }),
                });
            }
        },
        { scope: rootRef, dependencies: [open] },
    );

    if (!customer) return null;

    const submit = (e) => {
        e.preventDefault();
        setErrors({});
        setProcessing(true);

        router.post(
            route("admin.customers.points", customer.id),
            { type, points, reason },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
                onSuccess: () => onClose(),
                onError: (err) => setErrors(err),
            },
        );
    };

    return (
        <div ref={rootRef} className="fixed inset-0 z-[60] hidden items-center justify-center p-4">
            <div data-backdrop className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
            <div ref={panelRef} className="relative w-full max-w-md rounded-2xl border border-front-line bg-front-bg shadow-2xl">
                <div className="flex items-center justify-between border-b border-front-line px-6 py-5">
                    <h2 className="font-display text-lg font-medium text-front-ink">Adjust loyalty points</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded-full p-2 text-front-muted hover:bg-front-surface hover:text-front-ink"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={submit} noValidate className="space-y-4 px-6 py-5">
                    <p className="text-sm text-front-muted">
                        {customer.name} currently has <strong className="text-front-ink/85">{customer.loyalty_points} pts</strong>.
                    </p>

                    <div>
                        <label className="text-xs font-medium tracking-wide text-front-muted uppercase">Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="mt-2 w-full rounded-lg border border-front-line bg-front-surface px-3 py-2.5 text-sm text-front-ink outline-none focus:border-front-accent"
                        >
                            {TYPES.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-medium tracking-wide text-front-muted uppercase">Points</label>
                        <input
                            type="number"
                            min="1"
                            value={points}
                            onChange={(e) => setPoints(e.target.value)}
                            className="mt-2 w-full rounded-lg border border-front-line bg-front-surface px-3 py-2.5 text-sm text-front-ink outline-none focus:border-front-accent"
                            required
                        />
                        {errors.points && <p className="mt-2 text-sm text-red-400">{errors.points}</p>}
                    </div>

                    <div>
                        <label className="text-xs font-medium tracking-wide text-front-muted uppercase">Reason</label>
                        <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g. Loyalty campaign bonus"
                            className="mt-2 w-full rounded-lg border border-front-line bg-front-surface px-3 py-2.5 text-sm text-front-ink outline-none placeholder:text-front-muted focus:border-front-accent"
                            required
                        />
                        {errors.reason && <p className="mt-2 text-sm text-red-400">{errors.reason}</p>}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full border border-front-line px-4 py-2 text-sm font-medium text-front-ink hover:border-front-accent"
                        >
                            Cancel
                        </button>
                        <FrontButton type="submit" disabled={processing || !points || !reason.trim()}>
                            {processing ? (
                                <>
                                    <Loader2 size={15} className="animate-spin" />
                                    Saving
                                </>
                            ) : (
                                "Apply"
                            )}
                        </FrontButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
