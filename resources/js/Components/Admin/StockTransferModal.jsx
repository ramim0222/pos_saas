import { useEffect, useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Loader2, Plus, X } from "lucide-react";

import InputLabel from "@/Components/InputLabel";
import FrontSelect from "@/Components/Front/FrontSelect";
import FrontTextarea from "@/Components/Front/FrontTextarea";
import { FrontButton } from "@/Components/Front/Button";

let lineIdCounter = 0;
function emptyLine() {
    lineIdCounter += 1;
    return { clientId: `line-${lineIdCounter}`, productId: "", variantId: "", quantity: "" };
}

export default function StockTransferModal({ open, onClose, products, branches, presetProduct }) {
    const rootRef = useRef(null);
    const panelRef = useRef(null);

    const [fromBranchId, setFromBranchId] = useState("");
    const [toBranchId, setToBranchId] = useState("");
    const [notes, setNotes] = useState("");
    const [items, setItems] = useState([emptyLine()]);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!open) return;
        setFromBranchId(String(branches[0]?.id ?? ""));
        setToBranchId(String(branches[1]?.id ?? branches[0]?.id ?? ""));
        setNotes("");
        setItems([
            presetProduct?.id
                ? { ...emptyLine(), productId: String(presetProduct.id) }
                : emptyLine(),
        ]);
        setErrors({});
    }, [open, presetProduct, branches]);

    useGSAP(
        () => {
            if (!open) return;
            gsap.fromTo("[data-backdrop]", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out" });
            gsap.fromTo(panelRef.current, { xPercent: 100 }, { xPercent: 0, duration: 0.4, ease: "power3.out" });
        },
        { scope: rootRef, dependencies: [open] },
    );

    if (!open) return null;

    const updateItem = (clientId, patch) => {
        setItems((prev) => prev.map((it) => (it.clientId === clientId ? { ...it, ...patch } : it)));
    };

    const addItem = () => setItems((prev) => [...prev, emptyLine()]);
    const removeItem = (clientId) => setItems((prev) => prev.filter((it) => it.clientId !== clientId));

    const submit = (e) => {
        e.preventDefault();
        setErrors({});
        setProcessing(true);

        router.post(
            route("admin.inventory.transfer"),
            {
                from_branch_id: fromBranchId,
                to_branch_id: toBranchId,
                notes,
                items: items
                    .filter((it) => it.productId && it.quantity)
                    .map((it) => ({
                        product_id: it.productId,
                        variant_id: it.variantId || null,
                        quantity: it.quantity,
                    })),
            },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
                onSuccess: () => onClose(),
                onError: (err) => setErrors(err),
            },
        );
    };

    const sameBranch = fromBranchId && toBranchId && fromBranchId === toBranchId;

    return (
        <div ref={rootRef} className="fixed inset-0 z-50 flex">
            <div data-backdrop className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
            <div ref={panelRef} className="relative ml-auto flex h-full w-full max-w-lg flex-col bg-front-bg shadow-2xl">
                <div className="flex shrink-0 items-center justify-between border-b border-front-line px-6 py-5">
                    <h2 className="font-display text-xl font-medium text-front-ink">Transfer stock</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close panel"
                        className="rounded-full p-2 text-front-muted hover:bg-front-surface hover:text-front-ink"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form id="transfer-form" onSubmit={submit} noValidate className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="From branch" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                            <FrontSelect value={fromBranchId} onChange={(e) => setFromBranchId(e.target.value)} className="mt-2" required>
                                {branches.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name}
                                    </option>
                                ))}
                            </FrontSelect>
                        </div>
                        <div>
                            <InputLabel value="To branch" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                            <FrontSelect value={toBranchId} onChange={(e) => setToBranchId(e.target.value)} className="mt-2" required>
                                {branches.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name}
                                    </option>
                                ))}
                            </FrontSelect>
                        </div>
                    </div>
                    {sameBranch && (
                        <p className="text-sm text-red-400">Pick two different branches to transfer between.</p>
                    )}
                    {errors.from_branch_id && <p className="text-sm text-red-400">{errors.from_branch_id}</p>}

                    <div>
                        <div className="mb-3 flex items-center justify-between">
                            <p className="text-xs font-medium tracking-wide text-front-muted uppercase">
                                Items
                            </p>
                            <button
                                type="button"
                                onClick={addItem}
                                className="flex items-center gap-1 text-xs font-medium text-front-accent hover:underline"
                            >
                                <Plus size={13} />
                                Add line
                            </button>
                        </div>

                        <div className="space-y-3">
                            {items.map((item) => {
                                const product = products.find((p) => p.id === Number(item.productId));
                                return (
                                    <div key={item.clientId} className="rounded-lg border border-front-line p-3">
                                        <div className="grid grid-cols-6 gap-2">
                                            <FrontSelect
                                                value={item.productId}
                                                onChange={(e) => updateItem(item.clientId, { productId: e.target.value, variantId: "" })}
                                                className="col-span-3"
                                            >
                                                <option value="">Select product</option>
                                                {products.map((p) => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.name}
                                                    </option>
                                                ))}
                                            </FrontSelect>
                                            <FrontSelect
                                                value={item.variantId}
                                                onChange={(e) => updateItem(item.clientId, { variantId: e.target.value })}
                                                className="col-span-2"
                                                disabled={!product?.variants?.length}
                                            >
                                                <option value="">
                                                    {product?.variants?.length ? "Base / all" : "No variants"}
                                                </option>
                                                {product?.variants?.map((v) => (
                                                    <option key={v.id} value={v.id}>
                                                        {v.name}
                                                    </option>
                                                ))}
                                            </FrontSelect>
                                            <div className="col-span-1 flex items-center gap-1">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(item.clientId, { quantity: e.target.value })}
                                                    placeholder="Qty"
                                                    className="w-full rounded-lg border border-front-line bg-front-bg px-2 py-2 text-xs text-front-ink outline-none focus:border-front-accent"
                                                />
                                                {items.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.clientId)}
                                                        aria-label="Remove line"
                                                        className="shrink-0 rounded-lg p-1.5 text-front-muted hover:bg-red-400/10 hover:text-red-400"
                                                    >
                                                        <X size={13} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {errors.items && <p className="mt-2 text-sm text-red-400">{errors.items}</p>}
                    </div>

                    <div>
                        <InputLabel value="Notes (optional)" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                        <FrontTextarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-2" />
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
                    <FrontButton type="submit" form="transfer-form" disabled={processing || sameBranch}>
                        {processing ? (
                            <>
                                <Loader2 size={15} className="animate-spin" />
                                Transferring
                            </>
                        ) : (
                            "Transfer stock"
                        )}
                    </FrontButton>
                </div>
            </div>
        </div>
    );
}
