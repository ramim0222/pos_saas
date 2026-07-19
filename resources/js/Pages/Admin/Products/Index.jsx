import { useState } from "react";
import { router } from "@inertiajs/react";

import AdminLayout from "@/Layouts/AdminLayout";
import ProductsPageHeader from "@/Components/Admin/ProductsPageHeader";
import FilterBar from "@/Components/Admin/FilterBar";
import ProductTable from "@/Components/Admin/ProductTable";
import EmptyState from "@/Components/Admin/EmptyState";
import ProductFormPanel from "@/Components/Admin/ProductFormPanel";
import ImportExportModal from "@/Components/Admin/ImportExportModal";

export default function Index({ products, pagination, categories, brands, filters }) {
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [panelOpen, setPanelOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [importExportOpen, setImportExportOpen] = useState(false);

    const hasActiveFilters = Boolean(
        filters.search || filters.category || filters.brand || filters.stock_status,
    );

    const navigate = (patch) => {
        router.get(
            route("admin.products.index"),
            { ...filters, ...patch, page: patch.page ?? 1 },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const toggleSelect = (id) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        setSelectedIds((prev) => {
            const allOnPage = products.every((p) => prev.has(p.id));
            if (allOnPage) return new Set();
            return new Set(products.map((p) => p.id));
        });
    };

    const openAdd = () => {
        setEditingProduct(null);
        setPanelOpen(true);
    };

    const openEdit = (product) => {
        setEditingProduct(product);
        setPanelOpen(true);
    };

    const handleDuplicate = (product) => {
        router.post(route("admin.products.duplicate", product.id), {}, { preserveScroll: true });
    };

    const handleDelete = (product) => {
        if (!window.confirm(`Delete "${product.name}"? This can't be undone.`)) return;
        router.delete(route("admin.products.destroy", product.id), { preserveScroll: true });
    };

    const handleBulkDelete = () => {
        if (!window.confirm(`Delete ${selectedIds.size} selected products? This can't be undone.`)) return;
        router.post(
            route("admin.products.bulk-destroy"),
            { ids: Array.from(selectedIds) },
            {
                preserveScroll: true,
                onSuccess: () => setSelectedIds(new Set()),
            },
        );
    };

    const handleBulkCategory = (categoryId) => {
        router.post(
            route("admin.products.bulk-category"),
            { ids: Array.from(selectedIds), category_id: categoryId },
            {
                preserveScroll: true,
                onSuccess: () => setSelectedIds(new Set()),
            },
        );
    };

    const handleSort = (field) => {
        const direction = filters.sort === field && filters.direction === "asc" ? "desc" : "asc";
        navigate({ sort: field, direction });
    };

    const clearFilters = () => {
        navigate({ search: "", category: "", brand: "", stock_status: "" });
    };

    const isEmptyCatalog = products.length === 0 && pagination.total === 0 && !hasActiveFilters;

    return (
        <AdminLayout title="Products" topbarTitle="Products" topbarSubtitle="Your product catalog">
            <div className="space-y-6">
                <ProductsPageHeader
                    total={pagination.total}
                    onAddProduct={openAdd}
                    onImportExport={() => setImportExportOpen(true)}
                />

                {!isEmptyCatalog && (
                    <FilterBar
                        filters={filters}
                        categories={categories}
                        brands={brands}
                        onChange={navigate}
                    />
                )}

                {products.length === 0 ? (
                    <EmptyState
                        hasFilters={hasActiveFilters}
                        onAddProduct={openAdd}
                        onImportExport={() => setImportExportOpen(true)}
                        onClearFilters={clearFilters}
                    />
                ) : (
                    <ProductTable
                        products={products}
                        categories={categories}
                        selectedIds={selectedIds}
                        onToggleSelect={toggleSelect}
                        onToggleSelectAll={toggleSelectAll}
                        onEdit={openEdit}
                        onDuplicate={handleDuplicate}
                        onDelete={handleDelete}
                        onBulkDelete={handleBulkDelete}
                        onBulkCategoryChange={handleBulkCategory}
                        sort={filters.sort ?? "name"}
                        direction={filters.direction ?? "asc"}
                        onSort={handleSort}
                        pagination={pagination}
                        onPageChange={(page) => navigate({ page })}
                    />
                )}
            </div>

            <ProductFormPanel
                open={panelOpen}
                product={editingProduct}
                categories={categories}
                onClose={() => setPanelOpen(false)}
            />

            <ImportExportModal
                open={importExportOpen}
                onClose={() => setImportExportOpen(false)}
            />
        </AdminLayout>
    );
}
