import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import AdminLayout from "@/Layouts/AdminLayout";
import StatCard from "@/Components/Admin/StatCard";
import RevenueChart from "@/Components/Admin/RevenueChart";
import TopStoresTable from "@/Components/Admin/TopStoresTable";
import AttentionPanel from "@/Components/Admin/AttentionPanel";
import RecentPaymentsFeed from "@/Components/Admin/RecentPaymentsFeed";
import PlanDistribution from "@/Components/Admin/PlanDistribution";
import BillingPipelineWidget from "@/Components/Admin/BillingPipelineWidget";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Dashboard({
    stats,
    revenueTrend,
    topStores,
    attentionStores,
    recentPayments,
    planDistribution,
    billingPipeline,
}) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from("[data-dash-section]", {
                opacity: 0,
                y: 18,
                duration: 0.55,
                stagger: 0.14,
                ease: "power2.out",
            });
        },
        { scope: rootRef },
    );

    return (
        <AdminLayout title="Dashboard">
            <div ref={rootRef} className="space-y-6">
                <div
                    data-dash-section
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
                >
                    {stats.map((stat) => (
                        <StatCard key={stat.id} {...stat} />
                    ))}
                </div>

                <div data-dash-section>
                    <RevenueChart series={revenueTrend} />
                </div>

                <div data-dash-section className="grid gap-6 xl:grid-cols-2">
                    <TopStoresTable stores={topStores} />
                    <AttentionPanel stores={attentionStores} />
                </div>

                <div data-dash-section className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
                    <RecentPaymentsFeed payments={recentPayments} />
                    <div className="space-y-6">
                        <PlanDistribution plans={planDistribution} />
                        <BillingPipelineWidget pipeline={billingPipeline} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
