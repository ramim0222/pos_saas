import { useEffect, useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight, Loader2, Minus, Plus, X } from "lucide-react";

import InputLabel from "@/Components/InputLabel";
import FrontSelect from "@/Components/Front/FrontSelect";
import FrontTextarea from "@/Components/Front/FrontTextarea";
import { FrontButton } from "@/Components/Front/Button";

const REASONS = [
    { value: "damage", label: "Damage" },
    { value: "return", label: "Return" },
    { value: "correction", label: "Correction" },
    { value: "other", label: "Other" },
];

function findQuantity(stockLevels, productId, variantId, branchId) {
    if (!productId || !branchId) return 0;
    return stockLevels
        .filter(
            (l) =>
                l.product_id === Number(productId) &&
                (l.variant_id ?? null) === (variantId ? Number(variantId) : null) &&
                l.branch_id === Number(branchId),
        )
        .reduce((sum, l) => sum + l.quantity, 0);
}

export default function StockAdjustmentModal({
    open,
    onClose,
    products,
    branches,
    stockLevels,
    defaultBranch,
    presetProduct,
}) {
    const rootRef = useRef(null);
    const panelRef = useRef(null);
    const resultRef = useRef(null);

    const [productId, setProductId] = useState("");
    const [variantId, setVariantId] = useState("");
    const [branchId, setBranchId] = useState("");
    const [type, setType] = useState("add");
    const [quantity, setQuantity] = useState("");
    const [reason, setReason] = useState("damage");
    const [notes, setNotes] = useState("");
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!open) return;
        setProductId(presetProduct?.id ? String(presetProduct.id) : "");
        setVariantId("");
        setBranchId(defaultBranch && defaultBranch !== "all" ? String(defaultBranch) : String(branches[0]?.id ?? ""));
        setType("add");
        setQuantity("");
        setReason("damage");
        setNotes("");
        setErrors({});
    }, [open, presetProduct, defaultBranch, branches]);

    useGSAP(
        () => {
            if (!open) return;
            gsap.fromTo("[data-backdrop]", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out" });
            gsap.fromTo(panelRef.current, { xPercent: 100 }, { xPercent: 0, duration: 0.4, ease: "power3.out" });
        },
        { scope: rootRef, dependencies: [open] },
    );

    const selectedProduct = products.find((p) => p.id === Number(productId));
    const currentStock = findQuantity(stockLevels, productId, variantId, branchId);
    const qty = Number(quantity) || 0;
    const resultingStock = type === "add" ? currentStock + qty : Math.max(0, currentStock - qty);

    useGSAP(
        () => {
            if (!resultRef.current) return;
            const counter = { value: Number(resultRef.current.textContent) || currentStock };
            const tween = gsap.to(counter, {
                value: resultingStock,
                duration: 0.35,
                ease: "power2.out",
                onUpdate: () => {
                    resultRef.current.textContent = Math.round(counter.value);
                },
                onComplete: () => {
                    resultRef.current.textContent = resultingStock;
                },
            });

            // Safety net: guarantees correctness even if the tween never
            // gets to progress (e.g. a throttled/backgrounded tab).
            const fallback = window.setTimeout(() => {
                resultRef.current.textContent = resultingStock;
            }, 600);

            return () => {
                tween.kill();
                window.clearTimeout(fallback);
            };
        },
        { scope: rootRef, dependencies: [resultingStock], revertOnUpdate: true },
    );

    if (!open) return null;

    const submit = (e) => {
        e.preventDefault();
        setErrors({});
        setProcessing(true);

        router.post(
            route("admin.inventory.adjust"),
            {
                product_id: productId,
                variant_id: variantId || null,
                branch_id: branchId,
                type,
                quantity: qty,
                reason,
                notes,
            },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
                onSuccess: () => onClose(),
                onError: (err) => setErrors(err),
            },
        );
    };

    return (
        <div ref={rootRef} className="fixed inset-0 z-50 flex">
            <div data-backdrop className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
            <div ref={panelRef} className="relative ml-auto flex h-full w-full max-w-md flex-col bg-front-bg shadow-2xl">
                <div className="flex shrink-0 items-center justify-between border-b border-front-line px-6 py-5">
                    <h2 className="font-display text-xl font-medium text-front-ink">Stock adjustment</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close panel"
                        className="rounded-full p-2 text-front-muted hover:bg-front-surface hover:text-front-ink"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form id="adjustment-form" onSubmit={submit} noValidate className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
                    <div>
                        <InputLabel value="Product" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                        <FrontSelect
                            value={productId}
                            onChange={(e) => {
                                setProductId(e.target.value);
                                setVariantId("");
                            }}
                            className="mt-2"
                            required
                        >
                            <option value="">Select a product</option>
                            {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} ({p.sku})
                                </option>
                            ))}
                        </FrontSelect>
                    </div>

                    {selectedProduct?.variants?.length > 0 && (
                        <div>
                            <InputLabel value="Variant" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                            <FrontSelect value={variantId} onChange={(e) => setVariantId(e.target.value)} className="mt-2">
                                <option value="">All variants (base product)</option>
                                {selectedProduct.variants.map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.name} ({v.sku})
                                    </option>
                                ))}
                            </FrontSelect>
                        </div>
                    )}

                    <div>
                        <InputLabel value="Branch" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                        <FrontSelect value={branchId} onChange={(e) => setBranchId(e.target.value)} className="mt-2" required>
                            {branches.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.name}
                                </option>
                            ))}
                        </FrontSelect>
                    </div>

                    <div>
                        <InputLabel value="Adjustment type" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                        <div className="mt-2 inline-flex rounded-full border border-front-line p-1">
                            <button
                                type="button"
                                onClick={() => setType("add")}
                                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                                    type === "add" ? "bg-front-accent text-front-accent-ink" : "text-front-muted"
                                }`}
                            >
                                <Plus size={13} />
                                Add
                            </button>
                            <button
                                type="button"
                                onClick={() => setType("remove")}
                                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                                    type === "remove" ? "bg-front-accent text-front-accent-ink" : "text-front-muted"
                                }`}
                            >
                                <Minus size={13} />
                                Remove
                            </button>
                        </div>
                    </div>

                    <div>
                        <InputLabel value="Quantity" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="mt-2 w-full rounded-lg border border-front-line bg-front-bg px-3 py-2.5 text-sm text-front-ink outline-none focus:border-front-accent"
                            required
                        />
                        {errors.quantity && <p className="mt-2 text-sm text-red-400">{errors.quantity}</p>}
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-front-line bg-front-surface px-4 py-4">
                        <div className="text-center">
                            <p className="text-xs text-front-muted">Current</p>
                            <p className="font-display text-2xl font-semibold tabular-figures text-front-ink">
                                {currentStock}
                            </p>
                        </div>
                        <ArrowRight size={18} className="text-front-muted" />
                        <div className="text-center">
                            <p className="text-xs text-front-muted">Resulting</p>
                            <p className="font-display text-2xl font-semibold tabular-figures text-front-accent">
                                <span ref={resultRef}>{currentStock}</span>
                            </p>
                        </div>
                    </div>

                    <div>
                        <InputLabel value="Reason" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                        <FrontSelect value={reason} onChange={(e) => setReason(e.target.value)} className="mt-2">
                            {REASONS.map((r) => (
                                <option key={r.value} value={r.value}>
                                    {r.label}
                                </option>
                            ))}
                        </FrontSelect>
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
                    <FrontButton type="submit" form="adjustment-form" disabled={processing || !productId || !qty}>
                        {processing ? (
                            <>
                                <Loader2 size={15} className="animate-spin" />
                                Saving
                            </>
                        ) : (
                            "Apply adjustment"
                        )}
                    </FrontButton>
                </div>
            </div>
        </div>
    );
}
