import { useState } from "react";
import { router } from "@inertiajs/react";

import AdminLayout from "@/Layouts/AdminLayout";
import ReportsPageHeader, { computePreset } from "@/Components/Admin/ReportsPageHeader";
import ReportTabs from "@/Components/Admin/ReportTabs";
import SalesOverviewReport from "@/Components/Admin/SalesOverviewReport";
import ProfitLossReport from "@/Components/Admin/ProfitLossReport";
import ProductPerformanceReport from "@/Components/Admin/ProductPerformanceReport";
import CashierPerformanceReport from "@/Components/Admin/CashierPerformanceReport";
import StockValuationReport from "@/Components/Admin/StockValuationReport";

export default function Index({ filters, branches, overview, profitLoss, productPerformance, cashierPerformance, stockValuation }) {
    const [tab, setTab] = useState("overview");
    const [activePreset, setActivePreset] = useState("month");

    const applyFilters = (patch) => {
        const next = { ...filters, ...patch };
        router.get(route("admin.reports.index"), next, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const changePreset = (preset) => {
        setActivePreset(preset);
        if (preset === "custom") return;
        const range = computePreset(preset);
        if (range) applyFilters(range);
    };

    const exportCsv = () => {
        const params = new URLSearchParams(filters).toString();
        window.location.href = `${route("admin.reports.export")}?${params}`;
    };

    return (
        <AdminLayout title="Reports" topbarTitle="Reports" topbarSubtitle="Profit, performance, and inventory analytics">
            <div className="space-y-6">
                <ReportsPageHeader
                    filters={filters}
                    activePreset={activePreset}
                    onPresetChange={changePreset}
                    onDateChange={applyFilters}
                    branches={branches}
                    onBranchChange={(branch) => applyFilters({ branch })}
                    onExport={exportCsv}
                />

                <ReportTabs active={tab} onChange={setTab}>
                    {tab === "overview" && <SalesOverviewReport overview={overview} />}
                    {tab === "profit-loss" && <ProfitLossReport profitLoss={profitLoss} />}
                    {tab === "products" && <ProductPerformanceReport productPerformance={productPerformance} />}
                    {tab === "cashiers" && <CashierPerformanceReport cashierPerformance={cashierPerformance} />}
                    {tab === "stock" && <StockValuationReport stockValuation={stockValuation} />}
                </ReportTabs>
            </div>
        </AdminLayout>
    );
}
