import { useEffect, useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Loader2, X } from "lucide-react";

import InputLabel from "@/Components/InputLabel";
import FrontSelect from "@/Components/Front/FrontSelect";
import FrontTextarea from "@/Components/Front/FrontTextarea";
import { FrontButton } from "@/Components/Front/Button";

const EMPTY = { name: "", phone: "", email: "", address: "", customer_group_id: "", notes: "" };

export default function CustomerFormPanel({ open, onClose, customer, groups }) {
    const rootRef = useRef(null);
    const panelRef = useRef(null);
    const [form, setForm] = useState(EMPTY);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const isEdit = Boolean(customer);

    useEffect(() => {
        if (!open) return;
        setForm(
            customer
                ? {
                      name: customer.name ?? "",
                      phone: customer.phone ?? "",
                      email: customer.email ?? "",
                      address: customer.address ?? "",
                      customer_group_id: customer.group?.id ? String(customer.group.id) : "",
                      notes: customer.notes ?? "",
                  }
                : EMPTY,
        );
        setErrors({});
    }, [open, customer]);

    useGSAP(
        () => {
            if (!open) return;
            gsap.fromTo("[data-backdrop]", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out" });
            gsap.fromTo(panelRef.current, { xPercent: 100 }, { xPercent: 0, duration: 0.4, ease: "power3.out" });
        },
        { scope: rootRef, dependencies: [open] },
    );

    if (!open) return null;

    const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

    const submit = (e) => {
        e.preventDefault();
        setErrors({});
        setProcessing(true);

        const payload = { ...form, customer_group_id: form.customer_group_id || null };
        const options = {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
            onSuccess: () => onClose(),
            onError: (err) => setErrors(err),
        };

        if (isEdit) {
            router.put(route("admin.customers.update", customer.id), payload, options);
        } else {
            router.post(route("admin.customers.store"), payload, options);
        }
    };

    const fieldClass =
        "mt-2 w-full rounded-lg border border-front-line bg-front-bg px-3 py-2.5 text-sm text-front-ink outline-none focus:border-front-accent";

    return (
        <div ref={rootRef} className="fixed inset-0 z-50 flex">
            <div data-backdrop className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
            <div ref={panelRef} className="relative ml-auto flex h-full w-full max-w-md flex-col bg-front-bg shadow-2xl">
                <div className="flex shrink-0 items-center justify-between border-b border-front-line px-6 py-5">
                    <h2 className="font-display text-xl font-medium text-front-ink">
                        {isEdit ? "Edit customer" : "Add customer"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close panel"
                        className="rounded-full p-2 text-front-muted hover:bg-front-surface hover:text-front-ink"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form id="customer-form" onSubmit={submit} noValidate className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
                    <div>
                        <InputLabel value="Customer name" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                        <input value={form.name} onChange={(e) => update({ name: e.target.value })} className={fieldClass} required />
                        {errors.name && <p className="mt-2 text-sm text-red-400">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel value="Phone" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                            <input value={form.phone} onChange={(e) => update({ phone: e.target.value })} className={fieldClass} />
                        </div>
                        <div>
                            <InputLabel value="Email" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                            <input type="email" value={form.email} onChange={(e) => update({ email: e.target.value })} className={fieldClass} />
                            {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
                        </div>
                    </div>

                    <div>
                        <InputLabel value="Address" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                        <FrontTextarea value={form.address} onChange={(e) => update({ address: e.target.value })} rows={2} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel value="Customer group" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                        <FrontSelect value={form.customer_group_id} onChange={(e) => update({ customer_group_id: e.target.value })} className="mt-2">
                            <option value="">No group</option>
                            {groups.map((g) => (
                                <option key={g.id} value={g.id}>
                                    {g.name} ({g.discount_percent}% off)
                                </option>
                            ))}
                        </FrontSelect>
                    </div>

                    <div>
                        <InputLabel value="Notes (optional)" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                        <FrontTextarea value={form.notes} onChange={(e) => update({ notes: e.target.value })} rows={3} className="mt-2" />
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
                    <FrontButton type="submit" form="customer-form" disabled={processing || !form.name}>
                        {processing ? (
                            <>
                                <Loader2 size={15} className="animate-spin" />
                                Saving
                            </>
                        ) : (
                            "Save customer"
                        )}
                    </FrontButton>
                </div>
            </div>
        </div>
    );
}
