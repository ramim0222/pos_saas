import { useState } from "react";
import { router } from "@inertiajs/react";

import AdminLayout from "@/Layouts/AdminLayout";
import BranchesPageHeader from "@/Components/Admin/BranchesPageHeader";
import BranchGrid from "@/Components/Admin/BranchGrid";
import BranchFormPanel from "@/Components/Admin/BranchFormPanel";
import BranchDetailPanel from "@/Components/Admin/BranchDetailPanel";
import TransferRequestsPanel from "@/Components/Admin/TransferRequestsPanel";

export default function Index({ branches, usage, managers, transferRequests }) {
    const [formOpen, setFormOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState(null);
    const [detailBranch, setDetailBranch] = useState(null);

    const openAdd = () => {
        setEditingBranch(null);
        setFormOpen(true);
    };

    const openEdit = (branch) => {
        setDetailBranch(null);
        setEditingBranch(branch);
        setFormOpen(true);
    };

    const openDetail = (branch) => {
        const full = branches.find((b) => b.id === branch.id) ?? branch;
        setDetailBranch(full);
    };

    const toggleActive = (branch) => {
        const route_ = branch.is_active ? "admin.branches.deactivate" : "admin.branches.reactivate";
        if (branch.is_active && !confirm(`Deactivate ${branch.name}? Staff will lose access to this branch.`)) return;
        router.post(route(route_, branch.id), {}, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Branches" topbarTitle="Branches" topbarSubtitle="Locations, staffing, and inter-branch transfers">
            <div className="space-y-6">
                <BranchesPageHeader usage={usage} onAdd={openAdd} />

                <BranchGrid branches={branches} onView={openDetail} onEdit={openEdit} onToggleActive={toggleActive} />

                <TransferRequestsPanel requests={transferRequests} />
            </div>

            <BranchFormPanel open={formOpen} onClose={() => setFormOpen(false)} branch={editingBranch} managers={managers} />

            <BranchDetailPanel open={Boolean(detailBranch)} onClose={() => setDetailBranch(null)} branch={detailBranch} />
        </AdminLayout>
    );
}
