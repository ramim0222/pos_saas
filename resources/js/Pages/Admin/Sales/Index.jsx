import { useEffect, useRef, useState } from "react";
import { router } from "@inertiajs/react";

import AdminLayout from "@/Layouts/AdminLayout";
import SalesPageHeader from "@/Components/Admin/SalesPageHeader";
import StatCard from "@/Components/Admin/StatCard";
import SalesTable from "@/Components/Admin/SalesTable";
import SaleDetailPanel from "@/Components/Admin/SaleDetailPanel";
import RefundVoidModal from "@/Components/Admin/RefundVoidModal";

export default function Index({ filters, branches, cashiers, summary, sales }) {
    const [search, setSearch] = useState(filters.search ?? "");
    const [detailSale, setDetailSale] = useState(null);
    const [actionModal, setActionModal] = useState(null);
    const debounceRef = useRef(null);

    const applyFilters = (patch) => {
        const next = { ...filters, search, ...patch };
        router.get(route("admin.sales.index"), next, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    useEffect(() => {
        if (search === (filters.search ?? "")) return;
        window.clearTimeout(debounceRef.current);
        debounceRef.current = window.setTimeout(() => {
            applyFilters({ search });
        }, 400);
        return () => window.clearTimeout(debounceRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const openDetail = (sale) => {
        const full = sales.find((s) => s.id === sale.id) ?? sale;
        setDetailSale(full);
    };

    const openAction = (sale, mode) => {
        setDetailSale(null);
        setActionModal({ sale, mode });
    };

    const exportCsv = () => {
        const params = new URLSearchParams({ from: filters.from, to: filters.to }).toString();
        window.location.href = `${route("admin.sales.export")}?${params}`;
    };

    return (
        <AdminLayout title="Sales" topbarTitle="Sales" topbarSubtitle="All POS transactions across your branches">
            <div className="space-y-6">
                <SalesPageHeader
                    total={sales.length}
                    filters={filters}
                    onFilterChange={applyFilters}
                    branches={branches}
                    cashiers={cashiers}
                    search={search}
                    onSearchChange={setSearch}
                    onExport={exportCsv}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Total sales" value={summary.total_sales} format="currency" />
                    <StatCard label="Transactions" value={summary.total_transactions} format="number" />
                    <StatCard label="Average order value" value={summary.average_order_value} format="currency" />
                    <StatCard label="Total refunds" value={summary.total_refunds} format="currency" tone="warning" />
                </div>

                <SalesTable sales={sales} onView={openDetail} />
            </div>

            <SaleDetailPanel
                open={Boolean(detailSale)}
                onClose={() => setDetailSale(null)}
                sale={detailSale}
                onRefund={(sale) => openAction(sale, "refund")}
                onVoid={(sale) => openAction(sale, "void")}
            />

            <RefundVoidModal
                open={Boolean(actionModal)}
                onClose={() => setActionModal(null)}
                sale={actionModal?.sale}
                mode={actionModal?.mode}
            />
        </AdminLayout>
    );
}
