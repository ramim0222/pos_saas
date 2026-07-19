import { useEffect, useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Loader2, RotateCw, X } from "lucide-react";

import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import FrontTextInput from "@/Components/Front/FrontTextInput";
import FrontTextarea from "@/Components/Front/FrontTextarea";
import FrontSelect from "@/Components/Front/FrontSelect";
import { FrontButton } from "@/Components/Front/Button";
import VariantBuilder, { emptyVariant } from "@/Components/Admin/VariantBuilder";
import ImageUploader from "@/Components/Admin/ImageUploader";

const BRANCHES = ["Gulshan", "Uttara", "Mirpur", "Chattogram"];

function generateBarcode() {
    const digits = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
    const sum = digits.reduce((acc, d, i) => acc + (i % 2 === 0 ? d : d * 3), 0);
    const check = (10 - (sum % 10)) % 10;
    return [...digits, check].join("");
}

function blankForm(product) {
    if (!product) {
        return {
            name: "",
            sku: "",
            barcode: "",
            category_id: "",
            brand: "",
            unit_type: "pcs",
            tax_class: "standard",
            description: "",
            status: "active",
            price: "",
            reorder_point: 10,
            branch_stocks: Object.fromEntries(BRANCHES.map((b) => [b, ""])),
        };
    }

    return {
        name: product.name,
        sku: product.sku,
        barcode: product.barcode ?? "",
        category_id: product.category?.id ?? "",
        brand: product.brand ?? "",
        unit_type: product.unit_type,
        tax_class: product.tax_class,
        description: product.description ?? "",
        status: product.status,
        price: product.price,
        reorder_point: product.reorder_point,
        branch_stocks: Object.fromEntries(
            BRANCHES.map((b) => [b, product.branch_stocks?.[b] ?? ""]),
        ),
    };
}

function variantsFromProduct(product) {
    if (!product?.variants?.length) return [];
    return product.variants.map((v) => ({
        clientId: `existing-${v.id}`,
        id: v.id,
        name: v.name,
        sku: v.sku,
        size: v.attributes?.Size ?? "",
        color: v.attributes?.Color ?? "",
        price: v.price ?? "",
        stock: v.stock ?? "",
        nameTouched: true,
    }));
}

function imagesFromProduct(product) {
    if (!product?.images?.length) return [];
    return product.images.map((img) => ({
        key: `existing-${img.id}`,
        type: "existing",
        id: img.id,
        url: img.url,
    }));
}

export default function ProductFormPanel({ open, product, categories, onClose }) {
    const rootRef = useRef(null);
    const panelRef = useRef(null);
    const [fields, setFields] = useState(() => blankForm(product));
    const [variants, setVariants] = useState(() => variantsFromProduct(product));
    const [images, setImages] = useState(() => imagesFromProduct(product));
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open) {
            setFields(blankForm(product));
            setVariants(variantsFromProduct(product));
            setImages(imagesFromProduct(product));
            setErrors({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, product?.id]);

    useGSAP(
        () => {
            if (open) {
                gsap.set(rootRef.current, { display: "flex" });
                gsap.fromTo(
                    "[data-backdrop]",
                    { opacity: 0 },
                    { opacity: 1, duration: 0.3, ease: "power1.out" },
                );
                gsap.fromTo(
                    panelRef.current,
                    { xPercent: 100 },
                    { xPercent: 0, duration: 0.4, ease: "power3.out" },
                );
            } else if (rootRef.current) {
                gsap.to(panelRef.current, {
                    xPercent: 100,
                    duration: 0.32,
                    ease: "power2.in",
                });
                gsap.to("[data-backdrop]", {
                    opacity: 0,
                    duration: 0.25,
                    onComplete: () => gsap.set(rootRef.current, { display: "none" }),
                });
            }
        },
        { scope: rootRef, dependencies: [open] },
    );

    const setField = (key, value) => setFields((f) => ({ ...f, [key]: value }));

    const submit = (e) => {
        e.preventDefault();
        setErrors({});

        const hasVariants = variants.length > 0;

        const payload = {
            ...fields,
            branch_stocks: hasVariants ? null : fields.branch_stocks,
            variants: variants.map((v) => ({
                id: v.id,
                name: v.name || [v.size, v.color].filter(Boolean).join(" / ") || "Variant",
                sku: v.sku,
                price: v.price === "" ? null : v.price,
                stock: v.stock === "" ? 0 : v.stock,
                attributes: {
                    ...(v.size ? { Size: v.size } : {}),
                    ...(v.color ? { Color: v.color } : {}),
                },
            })),
            existing_images: images
                .filter((i) => i.type === "existing")
                .map((i, index) => ({ id: i.id, sort_order: index })),
            images: images.filter((i) => i.type === "new").map((i) => i.file),
        };

        const options = {
            forceFormData: true,
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onSuccess: () => onClose(),
            onError: (err) => setErrors(err),
        };

        if (product) {
            router.put(route("admin.products.update", product.id), payload, options);
        } else {
            router.post(route("admin.products.store"), payload, options);
        }
    };

    return (
        <div ref={rootRef} className="fixed inset-0 z-50 hidden">
            <div
                data-backdrop
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                ref={panelRef}
                className="relative ml-auto flex h-full w-full max-w-xl flex-col bg-front-bg shadow-2xl"
            >
                <div className="flex shrink-0 items-center justify-between border-b border-front-line px-6 py-5">
                    <h2 className="font-display text-xl font-medium text-front-ink">
                        {product ? "Edit product" : "Add product"}
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

                <form
                    id="product-form"
                    onSubmit={submit}
                    noValidate
                    className="flex-1 space-y-6 overflow-y-auto px-6 py-6"
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <InputLabel value="Product name" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                            <FrontTextInput
                                value={fields.name}
                                onChange={(e) => setField("name", e.target.value)}
                                className="mt-2"
                                required
                            />
                            <InputError message={errors.name} className="mt-2 !text-red-400" />
                        </div>

                        <div>
                            <InputLabel value="SKU" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                            <FrontTextInput
                                value={fields.sku}
                                onChange={(e) => setField("sku", e.target.value)}
                                className="mt-2"
                                required
                            />
                            <InputError message={errors.sku} className="mt-2 !text-red-400" />
                        </div>

                        <div>
                            <InputLabel value="Barcode" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                            <div className="mt-2 flex gap-2">
                                <FrontTextInput
                                    value={fields.barcode}
                                    onChange={(e) => setField("barcode", e.target.value)}
                                    className="flex-1"
                                />
                                <button
                                    type="button"
                                    onClick={() => setField("barcode", generateBarcode())}
                                    className="flex shrink-0 items-center gap-1.5 rounded-full border border-front-line px-3 text-xs font-medium text-front-muted hover:border-front-accent hover:text-front-accent"
                                >
                                    <RotateCw size={12} />
                                    Generate
                                </button>
                            </div>
                            <InputError message={errors.barcode} className="mt-2 !text-red-400" />
                        </div>

                        <div>
                            <InputLabel value="Category" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                            <FrontSelect
                                value={fields.category_id}
                                onChange={(e) => setField("category_id", e.target.value)}
                                className="mt-2"
                            >
                                <option value="">No category</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </FrontSelect>
                        </div>

                        <div>
                            <InputLabel value="Brand" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                            <FrontTextInput
                                value={fields.brand}
                                onChange={(e) => setField("brand", e.target.value)}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel value="Unit type" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                            <FrontSelect
                                value={fields.unit_type}
                                onChange={(e) => setField("unit_type", e.target.value)}
                                className="mt-2"
                            >
                                {["pcs", "kg", "litre", "box", "pack"].map((u) => (
                                    <option key={u} value={u}>
                                        {u}
                                    </option>
                                ))}
                            </FrontSelect>
                        </div>

                        <div>
                            <InputLabel value="Tax class" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                            <FrontSelect
                                value={fields.tax_class}
                                onChange={(e) => setField("tax_class", e.target.value)}
                                className="mt-2"
                            >
                                {["standard", "reduced", "zero"].map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </FrontSelect>
                        </div>

                        <div>
                            <InputLabel value="Base price (৳)" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                            <FrontTextInput
                                type="number"
                                step="0.01"
                                value={fields.price}
                                onChange={(e) => setField("price", e.target.value)}
                                className="mt-2"
                                required
                            />
                            <InputError message={errors.price} className="mt-2 !text-red-400" />
                        </div>

                        <div>
                            <InputLabel value="Status" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                            <FrontSelect
                                value={fields.status}
                                onChange={(e) => setField("status", e.target.value)}
                                className="mt-2"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </FrontSelect>
                        </div>

                        <div>
                            <InputLabel value="Reorder point" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                            <FrontTextInput
                                type="number"
                                value={fields.reorder_point}
                                onChange={(e) => setField("reorder_point", e.target.value)}
                                className="mt-2"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <InputLabel value="Description" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                            <FrontTextarea
                                value={fields.description}
                                onChange={(e) => setField("description", e.target.value)}
                                rows={3}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    {variants.length === 0 && (
                        <div>
                            <p className="mb-3 text-xs font-medium tracking-wide text-front-muted uppercase">
                                Stock by branch
                            </p>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {BRANCHES.map((branch) => (
                                    <div key={branch}>
                                        <label className="text-xs text-front-muted">{branch}</label>
                                        <input
                                            type="number"
                                            value={fields.branch_stocks[branch]}
                                            onChange={(e) =>
                                                setField("branch_stocks", {
                                                    ...fields.branch_stocks,
                                                    [branch]: e.target.value,
                                                })
                                            }
                                            className="mt-1 w-full rounded-lg border border-front-line bg-front-bg px-2.5 py-2 text-sm text-front-ink outline-none focus:border-front-accent"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <VariantBuilder
                        variants={variants}
                        onChange={setVariants}
                        basePrice={fields.price}
                    />

                    <ImageUploader images={images} onChange={setImages} />
                </form>

                <div className="flex shrink-0 items-center justify-end gap-3 border-t border-front-line px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-front-line px-4 py-2 text-sm font-medium text-front-ink hover:border-front-accent"
                    >
                        Cancel
                    </button>
                    <FrontButton type="submit" form="product-form" disabled={processing}>
                        {processing ? (
                            <>
                                <Loader2 size={15} className="animate-spin" />
                                Saving
                            </>
                        ) : product ? (
                            "Save changes"
                        ) : (
                            "Add product"
                        )}
                    </FrontButton>
                </div>
            </div>
        </div>
    );
}
