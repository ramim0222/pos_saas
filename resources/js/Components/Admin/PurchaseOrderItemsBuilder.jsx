import { useRef } from "react";
import gsap from "gsap";
import { Plus, X } from "lucide-react";

let tempIdCounter = 0;
function nextTempId() {
    tempIdCounter += 1;
    return `poi-${Date.now()}-${tempIdCounter}`;
}

export function emptyItem() {
    return {
        clientId: nextTempId(),
        product_id: "",
        variant_id: "",
        quantity: "",
        unit_cost: "",
    };
}

export default function PurchaseOrderItemsBuilder({ items, onChange, products }) {
    const rowRefs = useRef({});

    const updateItem = (clientId, patch) => {
        onChange(items.map((item) => (item.clientId === clientId ? { ...item, ...patch } : item)));
    };

    const addItem = () => {
        const row = emptyItem();
        onChange([...items, row]);

        requestAnimationFrame(() => {
            const el = rowRefs.current[row.clientId];
            if (!el) return;
            const height = el.scrollHeight;
            gsap.fromTo(
                el,
                { height: 0, opacity: 0 },
                {
                    height,
                    opacity: 1,
                    duration: 0.32,
                    ease: "power2.out",
                    onComplete: () => gsap.set(el, { height: "auto" }),
                },
            );
        });
    };

    const removeItem = (clientId) => {
        const el = rowRefs.current[clientId];
        if (!el) {
            onChange(items.filter((item) => item.clientId !== clientId));
            return;
        }
        gsap.to(el, {
            height: 0,
            opacity: 0,
            marginBottom: 0,
            duration: 0.26,
            ease: "power2.in",
            onComplete: () => {
                onChange(items.filter((item) => item.clientId !== clientId));
                delete rowRefs.current[clientId];
            },
        });
    };

    const fieldClass =
        "w-full rounded-lg border border-front-line bg-front-bg px-2.5 py-2 text-xs text-front-ink outline-none placeholder:text-front-muted focus:border-front-accent";

    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium tracking-wide text-front-muted uppercase">Line items</p>
                <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-1 text-xs font-medium text-front-accent hover:underline"
                >
                    <Plus size={13} />
                    Add item
                </button>
            </div>

            {items.length === 0 ? (
                <p className="rounded-lg border border-dashed border-front-line px-3 py-4 text-center text-xs text-front-muted">
                    No items yet. Add at least one product to this order.
                </p>
            ) : (
                <div className="space-y-3">
                    {items.map((item) => {
                        const product = products.find((p) => p.id === Number(item.product_id));
                        const lineTotal = (Number(item.quantity) || 0) * (Number(item.unit_cost) || 0);

                        return (
                            <div
                                key={item.clientId}
                                ref={(el) => {
                                    if (el) rowRefs.current[item.clientId] = el;
                                }}
                                className="overflow-hidden rounded-lg border border-front-line p-3"
                            >
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
                                    <select
                                        value={item.product_id}
                                        onChange={(e) =>
                                            updateItem(item.clientId, { product_id: e.target.value, variant_id: "" })
                                        }
                                        className={`${fieldClass} sm:col-span-2`}
                                    >
                                        <option value="">Select product</option>
                                        {products.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} ({p.sku})
                                            </option>
                                        ))}
                                    </select>

                                    {product?.variants?.length > 0 ? (
                                        <select
                                            value={item.variant_id}
                                            onChange={(e) => updateItem(item.clientId, { variant_id: e.target.value })}
                                            className={fieldClass}
                                        >
                                            <option value="">Base product</option>
                                            {product.variants.map((v) => (
                                                <option key={v.id} value={v.id}>
                                                    {v.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div />
                                    )}

                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => updateItem(item.clientId, { quantity: e.target.value })}
                                        placeholder="Qty"
                                        className={fieldClass}
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={item.unit_cost}
                                        onChange={(e) => updateItem(item.clientId, { unit_cost: e.target.value })}
                                        placeholder="Unit cost"
                                        className={fieldClass}
                                    />
                                    <div className="flex items-center justify-between gap-1.5 sm:col-span-2">
                                        <span className="text-xs font-medium text-front-ink/85 tabular-figures">
                                            ৳ {lineTotal.toLocaleString("en-US")}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(item.clientId)}
                                            aria-label="Remove line item"
                                            className="shrink-0 rounded-lg p-2 text-front-muted hover:bg-red-400/10 hover:text-red-400"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
