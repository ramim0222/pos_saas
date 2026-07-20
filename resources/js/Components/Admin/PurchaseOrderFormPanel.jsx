import { useEffect, useMemo, useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Loader2, X } from "lucide-react";

import InputLabel from "@/Components/InputLabel";
import FrontSelect from "@/Components/Front/FrontSelect";
import FrontTextarea from "@/Components/Front/FrontTextarea";
import { FrontButton } from "@/Components/Front/Button";
import PurchaseOrderItemsBuilder, { emptyItem } from "@/Components/Admin/PurchaseOrderItemsBuilder";

function toFormItems(po) {
    if (!po) return [emptyItem()];
    return po.items.map((item) => ({
        clientId: `existing-${item.id}`,
        product_id: String(item.product_id),
        variant_id: item.variant_id ? String(item.variant_id) : "",
        quantity: String(item.quantity),
        unit_cost: String(item.unit_cost),
    }));
}

export default function PurchaseOrderFormPanel({ open, onClose, order, suppliers, branches, products }) {
    const rootRef = useRef(null);
    const panelRef = useRef(null);
    const totalRef = useRef(null);

    const [supplierId, setSupplierId] = useState("");
    const [branchId, setBranchId] = useState("");
    const [expectedDelivery, setExpectedDelivery] = useState("");
    const [notes, setNotes] = useState("");
    const [items, setItems] = useState([emptyItem()]);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const isEdit = Boolean(order);

    useEffect(() => {
        if (!open) return;
        setSupplierId(order ? String(order.supplier_id) : suppliers.find((s) => s.is_active)?.id ? String(suppliers.find((s) => s.is_active).id) : "");
        setBranchId(order ? String(order.branch_id) : String(branches[0]?.id ?? ""));
        setExpectedDelivery(order?.expected_delivery_raw ?? "");
        setNotes(order?.notes ?? "");
        setItems(toFormItems(order));
        setErrors({});
    }, [open, order, suppliers, branches]);

    useGSAP(
        () => {
            if (!open) return;
            gsap.fromTo("[data-backdrop]", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out" });
            gsap.fromTo(panelRef.current, { xPercent: 100 }, { xPercent: 0, duration: 0.4, ease: "power3.out" });
        },
        { scope: rootRef, dependencies: [open] },
    );

    const total = useMemo(
        () => items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unit_cost) || 0), 0),
        [items],
    );

    useGSAP(
        () => {
            if (!totalRef.current) return;
            const current = parseFloat(String(totalRef.current.textContent).replace(/[^0-9.-]/g, "")) || 0;
            const counter = { value: current };
            const tween = gsap.to(counter, {
                value: total,
                duration: 0.4,
                ease: "power2.out",
                onUpdate: () => {
                    totalRef.current.textContent = counter.value.toLocaleString("en-US", { maximumFractionDigits: 0 });
                },
                onComplete: () => {
                    totalRef.current.textContent = total.toLocaleString("en-US", { maximumFractionDigits: 0 });
                },
            });
            const fallback = window.setTimeout(() => {
                totalRef.current.textContent = total.toLocaleString("en-US", { maximumFractionDigits: 0 });
            }, 700);

            return () => {
                tween.kill();
                window.clearTimeout(fallback);
            };
        },
        { scope: rootRef, dependencies: [total], revertOnUpdate: true },
    );

    if (!open) return null;

    const buildPayload = (status) => ({
        supplier_id: supplierId,
        branch_id: branchId,
        status,
        expected_delivery: expectedDelivery || null,
        notes,
        items: items
            .filter((item) => item.product_id && item.quantity && item.unit_cost !== "")
            .map((item) => ({
                product_id: item.product_id,
                variant_id: item.variant_id || null,
                quantity: item.quantity,
                unit_cost: item.unit_cost,
            })),
    });

    const submit = (status) => {
        setErrors({});
        setProcessing(true);

        const payload = buildPayload(status);
        const options = {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
            onSuccess: () => onClose(),
            onError: (err) => setErrors(err),
        };

        if (isEdit) {
            router.put(route("admin.purchases.orders.update", order.id), payload, options);
        } else {
            router.post(route("admin.purchases.orders.store"), payload, options);
        }
    };

    return (
        <div ref={rootRef} className="fixed inset-0 z-50 flex">
            <div data-backdrop className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
            <div ref={panelRef} className="relative ml-auto flex h-full w-full max-w-2xl flex-col bg-front-bg shadow-2xl">
                <div className="flex shrink-0 items-center justify-between border-b border-front-line px-6 py-5">
                    <h2 className="font-display text-xl font-medium text-front-ink">
                        {isEdit ? `Edit ${order.po_number}` : "New purchase order"}
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

                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel value="Supplier" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                            <FrontSelect value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="mt-2" required>
                                <option value="">Select a supplier</option>
                                {suppliers.map((s) => (
                                    <option key={s.id} value={s.id} disabled={!s.is_active}>
                                        {s.name} {s.is_active ? "" : "(inactive)"}
                                    </option>
                                ))}
                            </FrontSelect>
                            {errors.supplier_id && <p className="mt-2 text-sm text-red-400">{errors.supplier_id}</p>}
                        </div>

                        <div>
                            <InputLabel value="Receiving branch" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                            <FrontSelect value={branchId} onChange={(e) => setBranchId(e.target.value)} className="mt-2" required>
                                {branches.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name}
                                    </option>
                                ))}
                            </FrontSelect>
                        </div>

                        <div>
                            <InputLabel value="Expected delivery" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                            <input
                                type="date"
                                value={expectedDelivery}
                                onChange={(e) => setExpectedDelivery(e.target.value)}
                                className="mt-2 w-full rounded-lg border border-front-line bg-front-bg px-3 py-2.5 text-sm text-front-ink outline-none focus:border-front-accent"
                            />
                        </div>
                    </div>

                    <PurchaseOrderItemsBuilder items={items} onChange={setItems} products={products} />
                    {errors.items && <p className="text-sm text-red-400">{errors.items}</p>}

                    <div>
                        <InputLabel value="Notes (optional)" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                        <FrontTextarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-front-line bg-front-surface px-4 py-4">
                        <span className="text-sm font-medium text-front-muted">Order total</span>
                        <span className="font-display text-2xl font-semibold tabular-figures text-front-ink">
                            ৳ <span ref={totalRef}>{total.toLocaleString("en-US")}</span>
                        </span>
                    </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-front-line px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-front-line px-4 py-2 text-sm font-medium text-front-ink hover:border-front-accent"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={processing || !supplierId || !branchId}
                        onClick={() => submit("draft")}
                        className="rounded-full border border-front-line px-4 py-2 text-sm font-medium text-front-ink hover:border-front-accent disabled:opacity-40"
                    >
                        Save as draft
                    </button>
                    <FrontButton disabled={processing || !supplierId || !branchId} onClick={() => submit("sent")}>
                        {processing ? (
                            <>
                                <Loader2 size={15} className="animate-spin" />
                                Saving
                            </>
                        ) : (
                            "Save & send"
                        )}
                    </FrontButton>
                </div>
            </div>
        </div>
    );
}
