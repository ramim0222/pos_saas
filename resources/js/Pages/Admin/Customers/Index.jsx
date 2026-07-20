import { useEffect, useRef, useState } from "react";
import { router } from "@inertiajs/react";

import AdminLayout from "@/Layouts/AdminLayout";
import CustomersTabs from "@/Components/Admin/CustomersTabs";
import CustomersHeader from "@/Components/Admin/CustomersHeader";
import CustomerTable from "@/Components/Admin/CustomerTable";
import CustomerFormPanel from "@/Components/Admin/CustomerFormPanel";
import CustomerDetailPanel from "@/Components/Admin/CustomerDetailPanel";
import AdjustPointsModal from "@/Components/Admin/AdjustPointsModal";
import CustomerGroupsTab from "@/Components/Admin/CustomerGroupsTab";
import GroupFormModal from "@/Components/Admin/GroupFormModal";

export default function Index({ search: initialSearch, customers, groups }) {
    const [tab, setTab] = useState("customers");
    const [search, setSearch] = useState(initialSearch ?? "");
    const debounceRef = useRef(null);

    const [formOpen, setFormOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [detailCustomer, setDetailCustomer] = useState(null);
    const [pointsCustomer, setPointsCustomer] = useState(null);

    const [groupFormOpen, setGroupFormOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);

    useEffect(() => {
        if (search === (initialSearch ?? "")) return;
        window.clearTimeout(debounceRef.current);
        debounceRef.current = window.setTimeout(() => {
            router.get(route("admin.customers.index"), { search }, { preserveState: true, preserveScroll: true, replace: true });
        }, 400);
        return () => window.clearTimeout(debounceRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const openAdd = () => {
        setEditingCustomer(null);
        setFormOpen(true);
    };

    const openEdit = (customer) => {
        setDetailCustomer(null);
        setEditingCustomer(customer);
        setFormOpen(true);
    };

    const openDetail = (customer) => {
        const full = customers.find((c) => c.id === customer.id) ?? customer;
        setDetailCustomer(full);
    };

    useEffect(() => {
        if (!detailCustomer) return;
        const updated = customers.find((c) => c.id === detailCustomer.id);
        if (updated) setDetailCustomer(updated);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customers]);

    const openAddGroup = () => {
        setEditingGroup(null);
        setGroupFormOpen(true);
    };

    const openEditGroup = (group) => {
        setEditingGroup(group);
        setGroupFormOpen(true);
    };

    return (
        <AdminLayout title="Customers" topbarTitle="Customers" topbarSubtitle="CRM, loyalty, and pricing groups">
            <CustomersTabs active={tab} onChange={setTab}>
                {tab === "customers" ? (
                    <div className="space-y-6">
                        <CustomersHeader total={customers.length} search={search} onSearchChange={setSearch} onAddCustomer={openAdd} />
                        <CustomerTable customers={customers} onView={openDetail} onEdit={openEdit} />
                    </div>
                ) : (
                    <CustomerGroupsTab groups={groups} onAdd={openAddGroup} onEdit={openEditGroup} />
                )}
            </CustomersTabs>

            <CustomerFormPanel open={formOpen} onClose={() => setFormOpen(false)} customer={editingCustomer} groups={groups} />

            <CustomerDetailPanel
                open={Boolean(detailCustomer)}
                onClose={() => setDetailCustomer(null)}
                customer={detailCustomer}
                groups={groups}
                onEdit={openEdit}
                onAdjustPoints={(customer) => setPointsCustomer(customer)}
            />

            <AdjustPointsModal open={Boolean(pointsCustomer)} onClose={() => setPointsCustomer(null)} customer={pointsCustomer} />

            <GroupFormModal open={groupFormOpen} onClose={() => setGroupFormOpen(false)} group={editingGroup} />
        </AdminLayout>
    );
}
