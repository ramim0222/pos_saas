import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
    ArrowUpDown,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Copy,
    ImageIcon,
    Pencil,
    Trash2,
} from "lucide-react";

function SortHeader({ field, label, sort, direction, onSort, className = "" }) {
    const active = sort === field;
    return (
        <th scope="col" className={`px-4 py-3 text-left text-xs font-medium text-front-muted uppercase ${className}`}>
            <button
                type="button"
                onClick={() => onSort(field)}
                className={`flex items-center gap-1 transition-colors hover:text-front-ink ${
                    active ? "text-front-ink" : ""
                }`}
            >
                {label}
                {active ? (
                    direction === "asc" ? (
                        <ChevronUp size={12} />
                    ) : (
                        <ChevronDown size={12} />
                    )
                ) : (
                    <ArrowUpDown size={12} className="opacity-40" />
                )}
            </button>
        </th>
    );
}

function StatusPill({ status }) {
    return (
        <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                status === "active"
                    ? "bg-front-green/10 text-front-green"
                    : "bg-front-line text-front-muted"
            }`}
        >
            {status === "active" ? "Active" : "Inactive"}
        </span>
    );
}

function StockCell({ product }) {
    if (product.is_out_of_stock) {
        return <span className="text-sm font-medium text-red-400">Out of stock</span>;
    }
    if (product.is_low_stock) {
        return (
            <span className="text-sm font-medium text-front-accent">
                {product.total_stock} low
            </span>
        );
    }
    return <span className="text-sm text-front-ink/85 tabular-figures">{product.total_stock}</span>;
}

export default function ProductTable({
    products,
    categories,
    selectedIds,
    onToggleSelect,
    onToggleSelectAll,
    onEdit,
    onDuplicate,
    onDelete,
    onBulkDelete,
    onBulkCategoryChange,
    sort,
    direction,
    onSort,
    pagination,
    onPageChange,
}) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.fromTo(
                "[data-product-row]",
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.35, stagger: 0.03, ease: "power2.out" },
            );
        },
        { scope: rootRef, dependencies: [products], revertOnUpdate: true },
    );

    const allSelected = products.length > 0 && products.every((p) => selectedIds.has(p.id));

    return (
        <div ref={rootRef} className="rounded-2xl border border-front-line bg-front-surface">
            {selectedIds.size > 0 && (
                <div className="flex flex-wrap items-center gap-3 border-b border-front-line bg-front-accent/[0.06] px-4 py-3">
                    <span className="text-sm font-medium text-front-ink">
                        {selectedIds.size} selected
                    </span>
                    <select
                        onChange={(e) => {
                            if (e.target.value !== "") onBulkCategoryChange(e.target.value);
                            e.target.value = "";
                        }}
                        defaultValue=""
                        className="rounded-lg border border-front-line bg-front-bg px-2.5 py-1.5 text-xs text-front-ink"
                    >
                        <option value="" disabled>
                            Change category…
                        </option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={onBulkDelete}
                        className="ml-auto flex items-center gap-1.5 rounded-full border border-red-400/30 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-400/10"
                    >
                        <Trash2 size={13} />
                        Delete selected
                    </button>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse">
                    <thead>
                        <tr className="border-b border-front-line">
                            <th scope="col" className="w-10 px-4 py-3">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={onToggleSelectAll}
                                    aria-label="Select all products on this page"
                                    className="h-4 w-4 rounded border-front-line accent-front-accent"
                                />
                            </th>
                            <th scope="col" className="px-4 py-3" />
                            <SortHeader field="name" label="Product" sort={sort} direction={direction} onSort={onSort} />
                            <SortHeader field="sku" label="SKU" sort={sort} direction={direction} onSort={onSort} />
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-front-muted uppercase">
                                Category
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-front-muted uppercase">
                                Variants
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-front-muted uppercase">
                                Stock
                            </th>
                            <SortHeader field="price" label="Price" sort={sort} direction={direction} onSort={onSort} />
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-front-muted uppercase">
                                Tax
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-front-muted uppercase">
                                Status
                            </th>
                            <th scope="col" className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr
                                key={product.id}
                                data-product-row
                                className="border-b border-front-line last:border-b-0 hover:bg-front-bg/60"
                            >
                                <td className="px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(product.id)}
                                        onChange={() => onToggleSelect(product.id)}
                                        aria-label={`Select ${product.name}`}
                                        className="h-4 w-4 rounded border-front-line accent-front-accent"
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    {product.images?.[0] ? (
                                        <img
                                            src={product.images[0].url}
                                            alt=""
                                            className="h-10 w-10 rounded-lg border border-front-line object-cover"
                                        />
                                    ) : (
                                        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-front-line bg-front-bg text-front-muted">
                                            <ImageIcon size={16} />
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <button
                                        type="button"
                                        onClick={() => onEdit(product)}
                                        className="text-left text-sm font-medium text-front-ink hover:text-front-accent"
                                    >
                                        {product.name}
                                    </button>
                                    {product.brand && (
                                        <p className="text-xs text-front-muted">{product.brand}</p>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-sm text-front-muted tabular-figures">
                                    {product.sku}
                                </td>
                                <td className="px-4 py-3 text-sm text-front-muted">
                                    {product.category?.name ?? "—"}
                                </td>
                                <td className="px-4 py-3 text-sm text-front-muted tabular-figures">
                                    {product.variants.length || "—"}
                                </td>
                                <td className="px-4 py-3">
                                    <StockCell product={product} />
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-front-ink/90 tabular-figures">
                                    ৳ {product.price.toLocaleString("en-US")}
                                </td>
                                <td className="px-4 py-3 text-sm text-front-muted capitalize">
                                    {product.tax_class}
                                </td>
                                <td className="px-4 py-3">
                                    <StatusPill status={product.status} />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(product)}
                                            aria-label={`Edit ${product.name}`}
                                            className="rounded-lg p-1.5 text-front-muted hover:bg-front-bg hover:text-front-ink"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDuplicate(product)}
                                            aria-label={`Duplicate ${product.name}`}
                                            className="rounded-lg p-1.5 text-front-muted hover:bg-front-bg hover:text-front-ink"
                                        >
                                            <Copy size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(product)}
                                            aria-label={`Delete ${product.name}`}
                                            className="rounded-lg p-1.5 text-front-muted hover:bg-red-400/10 hover:text-red-400"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination.last_page > 1 && (
                <div className="flex items-center justify-between border-t border-front-line px-4 py-3">
                    <p className="text-xs text-front-muted">
                        Page {pagination.current_page} of {pagination.last_page} ·{" "}
                        {pagination.total} products
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={pagination.current_page <= 1}
                            onClick={() => onPageChange(pagination.current_page - 1)}
                            className="rounded-lg border border-front-line p-1.5 text-front-muted hover:text-front-ink disabled:opacity-30"
                        >
                            <ChevronLeft size={15} />
                        </button>
                        <button
                            type="button"
                            disabled={pagination.current_page >= pagination.last_page}
                            onClick={() => onPageChange(pagination.current_page + 1)}
                            className="rounded-lg border border-front-line p-1.5 text-front-muted hover:text-front-ink disabled:opacity-30"
                        >
                            <ChevronRight size={15} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
