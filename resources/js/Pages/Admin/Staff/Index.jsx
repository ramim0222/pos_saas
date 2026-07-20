import { useState } from "react";
import { router } from "@inertiajs/react";

import AdminLayout from "@/Layouts/AdminLayout";
import StaffPageHeader from "@/Components/Admin/StaffPageHeader";
import StaffTable from "@/Components/Admin/StaffTable";
import InviteStaffModal from "@/Components/Admin/InviteStaffModal";
import EditStaffModal from "@/Components/Admin/EditStaffModal";
import RolePermissionsPanel from "@/Components/Admin/RolePermissionsPanel";
import ActivityLogPanel from "@/Components/Admin/ActivityLogPanel";

export default function Index({ staff, branches, usage, activityLogs, filterUser }) {
    const [inviteOpen, setInviteOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);

    const suspend = (member) => {
        if (!confirm(`Suspend ${member.name}? They'll lose access immediately.`)) return;
        router.post(route("admin.staff.suspend", member.id), {}, { preserveScroll: true });
    };

    const reactivate = (member) => {
        router.post(route("admin.staff.reactivate", member.id), {}, { preserveScroll: true });
    };

    const remove = (member) => {
        if (!confirm(`Remove ${member.name} from the team? This cannot be undone.`)) return;
        router.delete(route("admin.staff.remove", member.id), { preserveScroll: true });
    };

    const accept = (member) => {
        router.post(route("admin.staff.accept", member.id), {}, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Staff" topbarTitle="Staff" topbarSubtitle="Team access, roles, and activity">
            <div className="space-y-6">
                <StaffPageHeader usage={usage} onInvite={() => setInviteOpen(true)} />

                <StaffTable
                    staff={staff}
                    onEditRole={setEditingStaff}
                    onEditBranches={setEditingStaff}
                    onSuspend={suspend}
                    onReactivate={reactivate}
                    onRemove={remove}
                    onAccept={accept}
                />

                <RolePermissionsPanel />

                <ActivityLogPanel logs={activityLogs} staff={staff} filterUser={filterUser} />
            </div>

            <InviteStaffModal open={inviteOpen} onClose={() => setInviteOpen(false)} branches={branches} />

            <EditStaffModal
                open={Boolean(editingStaff)}
                onClose={() => setEditingStaff(null)}
                staff={editingStaff}
                branches={branches}
            />
        </AdminLayout>
    );
}
