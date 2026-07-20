import { useEffect, useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Loader2, X } from "lucide-react";

import { FrontButton } from "@/Components/Front/Button";

const EMPTY = { name: "", discount_percent: "0", description: "" };

export default function GroupFormModal({ open, onClose, group }) {
    const rootRef = useRef(null);
    const panelRef = useRef(null);
    const [form, setForm] = useState(EMPTY);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const isEdit = Boolean(group);

    useEffect(() => {
        if (!open) return;
        setForm(
            group
                ? { name: group.name, discount_percent: String(group.discount_percent), description: group.description ?? "" }
                : EMPTY,
        );
        setErrors({});
    }, [open, group]);

    useGSAP(
        () => {
            if (!open) return;
            gsap.fromTo("[data-backdrop]", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out" });
            gsap.fromTo(panelRef.current, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
        },
        { scope: rootRef, dependencies: [open] },
    );

    if (!open) return null;

    const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

    const submit = (e) => {
        e.preventDefault();
        setErrors({});
        setProcessing(true);

        const options = {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
            onSuccess: () => onClose(),
            onError: (err) => setErrors(err),
        };

        if (isEdit) {
            router.put(route("admin.customers.groups.update", group.id), form, options);
        } else {
            router.post(route("admin.customers.groups.store"), form, options);
        }
    };

    return (
        <div ref={rootRef} className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div data-backdrop className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
            <div ref={panelRef} className="relative w-full max-w-md rounded-2xl border border-front-line bg-front-bg shadow-2xl">
                <div className="flex items-center justify-between border-b border-front-line px-6 py-5">
                    <h2 className="font-display text-lg font-medium text-front-ink">{isEdit ? "Edit group" : "Add group"}</h2>
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
                    <div>
                        <label className="text-xs font-medium tracking-wide text-front-muted uppercase">Group name</label>
                        <input
                            value={form.name}
                            onChange={(e) => update({ name: e.target.value })}
                            className="mt-2 w-full rounded-lg border border-front-line bg-front-surface px-3 py-2.5 text-sm text-front-ink outline-none focus:border-front-accent"
                            required
                        />
                        {errors.name && <p className="mt-2 text-sm text-red-400">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="text-xs font-medium tracking-wide text-front-muted uppercase">Discount percent</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.5"
                            value={form.discount_percent}
                            onChange={(e) => update({ discount_percent: e.target.value })}
                            className="mt-2 w-full rounded-lg border border-front-line bg-front-surface px-3 py-2.5 text-sm text-front-ink outline-none focus:border-front-accent"
                            required
                        />
                        {errors.discount_percent && <p className="mt-2 text-sm text-red-400">{errors.discount_percent}</p>}
                    </div>

                    <div>
                        <label className="text-xs font-medium tracking-wide text-front-muted uppercase">Description (optional)</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => update({ description: e.target.value })}
                            rows={3}
                            className="mt-2 w-full rounded-lg border border-front-line bg-front-surface px-3 py-2.5 text-sm text-front-ink outline-none focus:border-front-accent"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full border border-front-line px-4 py-2 text-sm font-medium text-front-ink hover:border-front-accent"
                        >
                            Cancel
                        </button>
                        <FrontButton type="submit" disabled={processing || !form.name}>
                            {processing ? (
                                <>
                                    <Loader2 size={15} className="animate-spin" />
                                    Saving
                                </>
                            ) : (
                                "Save group"
                            )}
                        </FrontButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
