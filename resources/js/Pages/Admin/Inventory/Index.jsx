import { useState } from "react";
import { router } from "@inertiajs/react";

import AdminLayout from "@/Layouts/AdminLayout";
import InventoryPageHeader from "@/Components/Admin/InventoryPageHeader";
import StatCard from "@/Components/Admin/StatCard";
import StockTable from "@/Components/Admin/StockTable";
import StockAdjustmentModal from "@/Components/Admin/StockAdjustmentModal";
import StockTransferModal from "@/Components/Admin/StockTransferModal";
import StockHistoryPanel from "@/Components/Admin/StockHistoryPanel";
import BatchExpiryTable from "@/Components/Admin/BatchExpiryTable";

export default function Index({
    branches,
    selectedBranch,
    summary,
    rows,
    products,
    history,
    batches,
    stockLevels,
}) {
    const [adjustmentOpen, setAdjustmentOpen] = useState(false);
    const [transferOpen, setTransferOpen] = useState(false);
    const [presetProduct, setPresetProduct] = useState(null);
    const [historyFilterProduct, setHistoryFilterProduct] = useState(null);

    const changeBranch = (branch) => {
        router.get(
            route("admin.inventory.index"),
            { branch },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const openAdjust = (row) => {
        setPresetProduct(row ? { id: row.id } : null);
        setAdjustmentOpen(true);
    };

    const openTransfer = (row) => {
        setPresetProduct(row ? { id: row.id } : null);
        setTransferOpen(true);
    };

    const viewHistory = (row) => {
        setHistoryFilterProduct(row.name);
        document.getElementById("stock-history")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <AdminLayout title="Inventory" topbarTitle="Inventory" topbarSubtitle="Stock across your branches">
            <div className="space-y-6">
                <InventoryPageHeader
                    branches={branches}
                    selectedBranch={selectedBranch}
                    onBranchChange={changeBranch}
                    onAdjust={() => openAdjust(null)}
                    onTransfer={() => openTransfer(null)}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Total SKUs" value={summary.total_skus} format="number" />
                    <StatCard label="Total stock value" value={summary.total_stock_value} format="currency" />
                    <StatCard label="Low stock" value={summary.low_stock} format="number" />
                    <StatCard label="Out of stock" value={summary.out_of_stock} format="number" />
                </div>

                <StockTable
                    rows={rows}
                    onAdjust={openAdjust}
                    onTransfer={openTransfer}
                    onViewHistory={viewHistory}
                />

                <div id="stock-history">
                    <StockHistoryPanel
                        history={history}
                        filterProduct={historyFilterProduct}
                        onClearFilter={() => setHistoryFilterProduct(null)}
                    />
                </div>

                <BatchExpiryTable batches={batches} />
            </div>

            <StockAdjustmentModal
                open={adjustmentOpen}
                onClose={() => setAdjustmentOpen(false)}
                products={products}
                branches={branches}
                stockLevels={stockLevels}
                defaultBranch={selectedBranch}
                presetProduct={presetProduct}
            />

            <StockTransferModal
                open={transferOpen}
                onClose={() => setTransferOpen(false)}
                products={products}
                branches={branches}
                presetProduct={presetProduct}
            />
        </AdminLayout>
    );
}
