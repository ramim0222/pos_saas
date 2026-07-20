import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import AdminLayout from "@/Layouts/AdminLayout";
import SettingsTabs from "@/Components/Admin/SettingsTabs";
import StoreProfileSection from "@/Components/Admin/StoreProfileSection";
import ReceiptSection from "@/Components/Admin/ReceiptSection";
import TaxSection from "@/Components/Admin/TaxSection";
import LocalizationSection from "@/Components/Admin/LocalizationSection";
import DataBackupSection from "@/Components/Admin/DataBackupSection";
import NotificationsSection from "@/Components/Admin/NotificationsSection";

export default function Index({ settings, notifications }) {
    const [section, setSection] = useState("profile");
    const headerRef = useRef(null);

    useGSAP(
        () => {
            gsap.from(headerRef.current, { opacity: 0, y: 10, duration: 0.4, ease: "power2.out" });
        },
        { scope: headerRef },
    );

    return (
        <AdminLayout title="Settings" topbarTitle="Settings" topbarSubtitle="Store profile, receipts, tax, and data">
            <div className="space-y-6">
                <div ref={headerRef}>
                    <h1 className="font-display text-2xl font-semibold text-front-ink">Settings</h1>
                    <p className="mt-1 text-sm text-front-muted">Central configuration for how your store looks, taxes, and communicates</p>
                </div>

                <SettingsTabs active={section} onChange={setSection}>
                    {section === "profile" && <StoreProfileSection settings={settings} />}
                    {section === "receipt" && <ReceiptSection settings={settings} />}
                    {section === "tax" && <TaxSection settings={settings} />}
                    {section === "localization" && <LocalizationSection settings={settings} />}
                    {section === "data" && <DataBackupSection settings={settings} />}
                    {section === "notifications" && <NotificationsSection notifications={notifications} />}
                </SettingsTabs>
            </div>
        </AdminLayout>
    );
}
