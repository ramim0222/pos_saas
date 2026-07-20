import { useEffect, useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Loader2, X } from "lucide-react";

import InputLabel from "@/Components/InputLabel";
import FrontSelect from "@/Components/Front/FrontSelect";
import { FrontButton } from "@/Components/Front/Button";

const DEFAULT_HOURS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => ({
    day,
    open: "09:00",
    close: "21:00",
    closed: false,
}));

export default function BranchFormPanel({ open, onClose, branch, managers }) {
    const rootRef = useRef(null);
    const panelRef = useRef(null);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [managerId, setManagerId] = useState("");
    const [hours, setHours] = useState(DEFAULT_HOURS);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const isEdit = Boolean(branch);

    useEffect(() => {
        if (!open) return;
        setName(branch?.name ?? "");
        setAddress(branch?.address ?? "");
        setPhone(branch?.phone ?? "");
        setManagerId(branch?.manager?.id ? String(branch.manager.id) : "");
        setHours(branch?.business_hours ?? DEFAULT_HOURS);
        setErrors({});
    }, [open, branch]);

    useGSAP(
        () => {
            if (!open) return;
            gsap.fromTo("[data-backdrop]", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out" });
            gsap.fromTo(panelRef.current, { xPercent: 100 }, { xPercent: 0, duration: 0.4, ease: "power3.out" });
        },
        { scope: rootRef, dependencies: [open] },
    );

    if (!open) return null;

    const updateDay = (index, patch) => {
        setHours((prev) => prev.map((d, i) => (i === index ? { ...d, ...patch } : d)));
    };

    const submit = (e) => {
        e.preventDefault();
        setErrors({});
        setProcessing(true);

        const payload = { name, address, phone, manager_id: managerId || null, business_hours: hours };
        const options = {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
            onSuccess: () => onClose(),
            onError: (err) => setErrors(err),
        };

        if (isEdit) {
            router.put(route("admin.branches.update", branch.id), payload, options);
        } else {
            router.post(route("admin.branches.store"), payload, options);
        }
    };

    const fieldClass =
        "mt-2 w-full rounded-lg border border-front-line bg-front-bg px-3 py-2.5 text-sm text-front-ink outline-none focus:border-front-accent";

    return (
        <div ref={rootRef} className="fixed inset-0 z-50 flex">
            <div data-backdrop className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
            <div ref={panelRef} className="relative ml-auto flex h-full w-full max-w-md flex-col bg-front-bg shadow-2xl">
                <div className="flex shrink-0 items-center justify-between border-b border-front-line px-6 py-5">
                    <h2 className="font-display text-xl font-medium text-front-ink">{isEdit ? `Edit ${branch.name}` : "Add branch"}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close panel"
                        className="rounded-full p-2 text-front-muted hover:bg-front-surface hover:text-front-ink"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form id="branch-form" onSubmit={submit} noValidate className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
                    <div>
                        <InputLabel value="Branch name" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                        <input value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} required />
                        {errors.name && <p className="mt-2 text-sm text-red-400">{errors.name}</p>}
                    </div>

                    <div>
                        <InputLabel value="Address" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                        <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} className={fieldClass} />
                    </div>

                    <div>
                        <InputLabel value="Phone" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} className={fieldClass} />
                    </div>

                    <div>
                        <InputLabel value="Branch manager" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                        <FrontSelect value={managerId} onChange={(e) => setManagerId(e.target.value)} className="mt-2">
                            <option value="">No manager assigned</option>
                            {managers.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.name}
                                </option>
                            ))}
                        </FrontSelect>
                    </div>

                    <div>
                        <InputLabel value="Operating hours" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                        <div className="mt-2 space-y-1.5">
                            {hours.map((day, index) => (
                                <div key={day.day} className="flex flex-wrap items-center gap-2.5 rounded-lg border border-front-line px-3 py-2">
                                    <span className="w-20 shrink-0 text-xs text-front-ink/85">{day.day.slice(0, 3)}</span>
                                    {day.closed ? (
                                        <span className="text-xs text-front-muted">Closed</span>
                                    ) : (
                                        <div className="flex items-center gap-1.5">
                                            <input
                                                type="time"
                                                value={day.open ?? ""}
                                                onChange={(e) => updateDay(index, { open: e.target.value })}
                                                className="rounded-md border border-front-line bg-front-bg px-2 py-1 text-xs text-front-ink outline-none focus:border-front-accent"
                                            />
                                            <span className="text-xs text-front-muted">to</span>
                                            <input
                                                type="time"
                                                value={day.close ?? ""}
                                                onChange={(e) => updateDay(index, { close: e.target.value })}
                                                className="rounded-md border border-front-line bg-front-bg px-2 py-1 text-xs text-front-ink outline-none focus:border-front-accent"
                                            />
                                        </div>
                                    )}
                                    <label className="ml-auto flex items-center gap-1.5 text-xs text-front-muted">
                                        <input
                                            type="checkbox"
                                            checked={day.closed}
                                            onChange={(e) => updateDay(index, { closed: e.target.checked })}
                                            className="h-3.5 w-3.5 rounded border-front-line accent-front-accent"
                                        />
                                        Closed
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </form>

                <div className="flex shrink-0 items-center justify-end gap-3 border-t border-front-line px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-front-line px-4 py-2 text-sm font-medium text-front-ink hover:border-front-accent"
                    >
                        Cancel
                    </button>
                    <FrontButton type="submit" form="branch-form" disabled={processing || !name}>
                        {processing ? (
                            <>
                                <Loader2 size={15} className="animate-spin" />
                                Saving
                            </>
                        ) : (
                            "Save branch"
                        )}
                    </FrontButton>
                </div>
            </div>
        </div>
    );
}
