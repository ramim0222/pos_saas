import { useState } from "react";
import { Head } from "@inertiajs/react";

import Sidebar from "@/Components/Admin/Sidebar";
import Topbar from "@/Components/Admin/Topbar";

export default function AdminLayout({ title, children }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-front-bg font-sans">
            {title && <Head title={title} />}

            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                <Topbar setMobileOpen={setMobileOpen} />
                <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
            </div>
        </div>
    );
}
