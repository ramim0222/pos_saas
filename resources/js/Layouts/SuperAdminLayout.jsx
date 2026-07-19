import { useState } from "react";
import { Head } from "@inertiajs/react";
import {
    LayoutDashboard,
    Store,
    CreditCard,
    Wallet,
    Layers,
    LifeBuoy,
    BarChart3,
    Users,
    Settings,
} from "lucide-react";

import Sidebar from "@/Components/Admin/Sidebar";
import Topbar from "@/Components/Admin/Topbar";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Tenants", href: "/admin/tenants", icon: Store },
    { label: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
    { label: "Billing", href: "/admin/billing", icon: Wallet },
    { label: "Plans", href: "/admin/plans", icon: Layers },
    { label: "Support", href: "/admin/support", icon: LifeBuoy },
    { label: "Reports", href: "/admin/reports", icon: BarChart3 },
    { label: "Team", href: "/admin/team", icon: Users },
    { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function SuperAdminLayout({
    title,
    topbarTitle = "Platform overview",
    topbarSubtitle = "Every store on Dokan, in one place",
    children,
}) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-front-bg font-sans">
            {title && <Head title={title} />}

            <Sidebar
                navItems={NAV_ITEMS}
                brandLabel="Dokan Admin"
                homeHref="/admin/dashboard"
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                <Topbar setMobileOpen={setMobileOpen} title={topbarTitle} subtitle={topbarSubtitle} />
                <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
            </div>
        </div>
    );
}
