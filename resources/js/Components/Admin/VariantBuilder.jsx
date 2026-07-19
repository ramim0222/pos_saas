import { useRef } from "react";
import gsap from "gsap";
import { Plus, X } from "lucide-react";

let tempIdCounter = 0;
function nextTempId() {
    tempIdCounter += 1;
    return `new-${Date.now()}-${tempIdCounter}`;
}

export function emptyVariant() {
    return {
        clientId: nextTempId(),
        id: null,
        name: "",
        sku: "",
        size: "",
        color: "",
        price: "",
        stock: "",
    };
}

export default function VariantBuilder({ variants, onChange, basePrice }) {
    const rowRefs = useRef({});

    const updateVariant = (clientId, patch) => {
        onChange(
            variants.map((v) => {
                if (v.clientId !== clientId) return v;
                const next = { ...v, ...patch };
                if ((patch.size !== undefined || patch.color !== undefined) && !next.nameTouched) {
                    next.name = [next.size, next.color].filter(Boolean).join(" / ");
                }
                return next;
            }),
        );
    };

    const addVariant = () => {
        const row = emptyVariant();
        onChange([...variants, row]);

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

    const removeVariant = (clientId) => {
        const el = rowRefs.current[clientId];
        if (!el) {
            onChange(variants.filter((v) => v.clientId !== clientId));
            return;
        }
        gsap.to(el, {
            height: 0,
            opacity: 0,
            marginBottom: 0,
            duration: 0.26,
            ease: "power2.in",
            onComplete: () => {
                onChange(variants.filter((v) => v.clientId !== clientId));
                delete rowRefs.current[clientId];
            },
        });
    };

    const fieldClass =
        "w-full rounded-lg border border-front-line bg-front-bg px-2.5 py-2 text-xs text-front-ink outline-none placeholder:text-front-muted focus:border-front-accent";

    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium tracking-wide text-front-muted uppercase">
                    Variants
                </p>
                <button
                    type="button"
                    onClick={addVariant}
                    className="flex items-center gap-1 text-xs font-medium text-front-accent hover:underline"
                >
                    <Plus size={13} />
                    Add variant
                </button>
            </div>

            {variants.length === 0 ? (
                <p className="rounded-lg border border-dashed border-front-line px-3 py-4 text-center text-xs text-front-muted">
                    No variants yet. Add one for size, color, or other combinations
                    — leave empty to sell this as a single item.
                </p>
            ) : (
                <div className="space-y-3">
                    {variants.map((variant) => (
                        <div
                            key={variant.clientId}
                            ref={(el) => {
                                if (el) rowRefs.current[variant.clientId] = el;
                            }}
                            className="overflow-hidden rounded-lg border border-front-line p-3"
                        >
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
                                <input
                                    type="text"
                                    value={variant.size}
                                    onChange={(e) => updateVariant(variant.clientId, { size: e.target.value })}
                                    placeholder="Size"
                                    className={fieldClass}
                                />
                                <input
                                    type="text"
                                    value={variant.color}
                                    onChange={(e) => updateVariant(variant.clientId, { color: e.target.value })}
                                    placeholder="Color"
                                    className={fieldClass}
                                />
                                <input
                                    type="text"
                                    value={variant.sku}
                                    onChange={(e) => updateVariant(variant.clientId, { sku: e.target.value })}
                                    placeholder="Variant SKU"
                                    className={`${fieldClass} sm:col-span-2`}
                                />
                                <input
                                    type="number"
                                    step="0.01"
                                    value={variant.price}
                                    onChange={(e) => updateVariant(variant.clientId, { price: e.target.value })}
                                    placeholder={`৳ ${basePrice || 0}`}
                                    className={fieldClass}
                                />
                                <div className="flex items-center gap-1.5">
                                    <input
                                        type="number"
                                        value={variant.stock}
                                        onChange={(e) => updateVariant(variant.clientId, { stock: e.target.value })}
                                        placeholder="Stock"
                                        className={fieldClass}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeVariant(variant.clientId)}
                                        aria-label="Remove variant"
                                        className="shrink-0 rounded-lg p-2 text-front-muted hover:bg-red-400/10 hover:text-red-400"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>
                            <input
                                type="text"
                                value={variant.name}
                                onChange={(e) =>
                                    updateVariant(variant.clientId, { name: e.target.value, nameTouched: true })
                                }
                                placeholder="Variant name (auto-filled from size/color)"
                                className={`${fieldClass} mt-2`}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
