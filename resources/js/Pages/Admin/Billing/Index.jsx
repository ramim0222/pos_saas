import { useState } from "react";

import AdminLayout from "@/Layouts/AdminLayout";
import CurrentPlanCard from "@/Components/Admin/CurrentPlanCard";
import PayNowSection from "@/Components/Admin/PayNowSection";
import PlanComparisonSection from "@/Components/Admin/PlanComparisonSection";
import PaymentHistoryTable from "@/Components/Admin/PaymentHistoryTable";
import ManualPaymentSection from "@/Components/Admin/ManualPaymentSection";
import ReminderSettingsCard from "@/Components/Admin/ReminderSettingsCard";

export default function Index({ subscription, plans, payments, manualSubmissions }) {
    const [justPaid, setJustPaid] = useState(false);

    return (
        <AdminLayout title="Billing" topbarTitle="Subscription & Billing" topbarSubtitle="Manage your plan and bKash payments">
            <div className="space-y-6">
                <CurrentPlanCard subscription={subscription} justPaid={justPaid} />
                <PayNowSection subscription={subscription} onPaid={() => setJustPaid(true)} />
                <PlanComparisonSection subscription={subscription} plans={plans} />
                <PaymentHistoryTable payments={payments} />
                <ManualPaymentSection manualSubmissions={manualSubmissions} />
                <ReminderSettingsCard subscription={subscription} />
            </div>
        </AdminLayout>
    );
}
