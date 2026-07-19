import { useMemo, useState } from "react";
import { router } from "@inertiajs/react";

import AdminLayout from "@/Layouts/AdminLayout";
import PurchasesTabs from "@/Components/Admin/PurchasesTabs";
import PurchaseOrdersHeader from "@/Components/Admin/PurchaseOrdersHeader";
import PurchaseOrderTable from "@/Components/Admin/PurchaseOrderTable";
import PurchaseOrderFormPanel from "@/Components/Admin/PurchaseOrderFormPanel";
import PurchaseOrderDetailPanel from "@/Components/Admin/PurchaseOrderDetailPanel";
import ReceiveStockModal from "@/Components/Admin/ReceiveStockModal";
import SuppliersHeader from "@/Components/Admin/SuppliersHeader";
import SupplierTable from "@/Components/Admin/SupplierTable";
import SupplierFormPanel from "@/Components/Admin/SupplierFormPanel";
import SupplierDetailPanel from "@/Components/Admin/SupplierDetailPanel";

export default function Index({ branches, suppliers, products, purchaseOrders, payments }) {
    const [tab, setTab] = useState("orders");

    const [orderSearch, setOrderSearch] = useState("");
    const [orderStatus, setOrderStatus] = useState("");
    const [orderFormOpen, setOrderFormOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [detailOrder, setDetailOrder] = useState(null);
    const [receivingOrder, setReceivingOrder] = useState(null);

    const [supplierSearch, setSupplierSearch] = useState("");
    const [supplierFormOpen, setSupplierFormOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [detailSupplier, setDetailSupplier] = useState(null);

    const filteredOrders = useMemo(() => {
        return purchaseOrders.filter((po) => {
            if (orderStatus && po.status !== orderStatus) return false;
            if (orderSearch) {
                const q = orderSearch.toLowerCase();
                if (!po.po_number.toLowerCase().includes(q) && !po.supplier.toLowerCase().includes(q)) {
                    return false;
                }
            }
            return true;
        });
    }, [purchaseOrders, orderStatus, orderSearch]);

    const filteredSuppliers = useMemo(() => {
        if (!supplierSearch) return suppliers;
        const q = supplierSearch.toLowerCase();
        return suppliers.filter((s) => s.name.toLowerCase().includes(q) || s.contact_person?.toLowerCase().includes(q));
    }, [suppliers, supplierSearch]);

    const openNewOrder = () => {
        setEditingOrder(null);
        setOrderFormOpen(true);
    };

    const openEditOrder = (po) => {
        setDetailOrder(null);
        setEditingOrder(po);
        setOrderFormOpen(true);
    };

    const sendOrder = (po) => {
        router.post(route("admin.purchases.orders.send", po.id), {}, { preserveScroll: true });
        setDetailOrder(null);
    };

    const cancelOrder = (po) => {
        if (!confirm(`Cancel ${po.po_number}? This cannot be undone.`)) return;
        router.post(route("admin.purchases.orders.cancel", po.id), {}, { preserveScroll: true });
        setDetailOrder(null);
    };

    const deleteOrder = (po) => {
        if (!confirm(`Delete draft ${po.po_number}?`)) return;
        router.delete(route("admin.purchases.orders.destroy", po.id), { preserveScroll: true });
    };

    const openReceive = (po) => {
        setDetailOrder(null);
        setReceivingOrder(po);
    };

    const openNewSupplier = () => {
        setEditingSupplier(null);
        setSupplierFormOpen(true);
    };

    const openEditSupplier = (supplier) => {
        setDetailSupplier(null);
        setEditingSupplier(supplier);
        setSupplierFormOpen(true);
    };

    const toggleSupplierActive = (supplier) => {
        router.post(route("admin.purchases.suppliers.deactivate", supplier.id), {}, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Purchases" topbarTitle="Purchases" topbarSubtitle="Suppliers and purchase order lifecycle">
            <PurchasesTabs active={tab} onChange={setTab}>
                {tab === "orders" ? (
                    <div className="space-y-6">
                        <PurchaseOrdersHeader
                            total={filteredOrders.length}
                            search={orderSearch}
                            onSearchChange={setOrderSearch}
                            status={orderStatus}
                            onStatusChange={setOrderStatus}
                            onNewOrder={openNewOrder}
                        />
                        <PurchaseOrderTable
                            orders={filteredOrders}
                            onView={setDetailOrder}
                            onSend={sendOrder}
                            onReceive={openReceive}
                            onCancel={cancelOrder}
                            onDelete={deleteOrder}
                        />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <SuppliersHeader
                            total={filteredSuppliers.length}
                            search={supplierSearch}
                            onSearchChange={setSupplierSearch}
                            onAddSupplier={openNewSupplier}
                        />
                        <SupplierTable
                            suppliers={filteredSuppliers}
                            onView={setDetailSupplier}
                            onEdit={openEditSupplier}
                            onToggleActive={toggleSupplierActive}
                        />
                    </div>
                )}
            </PurchasesTabs>

            <PurchaseOrderFormPanel
                open={orderFormOpen}
                onClose={() => setOrderFormOpen(false)}
                order={editingOrder}
                suppliers={suppliers}
                branches={branches}
                products={products}
            />

            <PurchaseOrderDetailPanel
                open={Boolean(detailOrder)}
                onClose={() => setDetailOrder(null)}
                order={detailOrder}
                onEdit={openEditOrder}
                onSend={sendOrder}
                onReceive={openReceive}
                onCancel={cancelOrder}
            />

            <ReceiveStockModal open={Boolean(receivingOrder)} onClose={() => setReceivingOrder(null)} order={receivingOrder} />

            <SupplierFormPanel open={supplierFormOpen} onClose={() => setSupplierFormOpen(false)} supplier={editingSupplier} />

            <SupplierDetailPanel
                open={Boolean(detailSupplier)}
                onClose={() => setDetailSupplier(null)}
                supplier={detailSupplier}
                purchaseOrders={purchaseOrders}
                payments={payments}
            />
        </AdminLayout>
    );
}
