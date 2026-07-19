import { Head } from "@inertiajs/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "@/Components/Front/Navbar";
import PageHeader from "@/Components/Front/PageHeader";
import SectionNav from "@/Components/Front/SectionNav";
import FeatureCategory from "@/Components/Front/FeatureCategory";
import ComparisonSection from "@/Components/Front/ComparisonSection";
import CompatibilityNote from "@/Components/Front/CompatibilityNote";
import FinalCTA from "@/Components/Front/FinalCTA";
import Footer from "@/Components/Front/Footer";
import {
    InventoryVisual,
    PosVisual,
    ReportingVisual,
    CustomerVisual,
    BranchVisual,
    TeamVisual,
    BillingVisual,
} from "@/Components/Front/FeatureVisuals";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const CATEGORIES = [
    {
        id: "inventory",
        eyebrow: "Inventory & product management",
        title: "Know what's on the shelf, everywhere, at once.",
        description:
            "Stock, variants, and batches stay in sync across every warehouse and branch, so you're never guessing what's actually on hand.",
        bullets: [
            "Track stock across every warehouse and branch in real time",
            "Manage variants — size, color, unit — under one product",
            "Scan barcodes to add, sell, or count stock",
            "Batch and expiry tracking for perishable or dated goods",
            "Automatic low-stock alerts before you run out",
        ],
        layout: "split-right",
        Visual: InventoryVisual,
    },
    {
        id: "pos",
        eyebrow: "Point of sale",
        title: "A till built to keep up with a busy counter.",
        description:
            "Fast search, split payments, and a hold-and-resume queue — designed for the moments when three customers are waiting at once.",
        bullets: [
            "Search or scan to find any item in seconds",
            "Keep selling offline, sync automatically when back online",
            "Split a single sale across cash, card, and bKash",
            "Hold a sale and resume it later without losing the cart",
            "Print receipts on standard thermal printers",
        ],
        layout: "split-left",
        Visual: PosVisual,
    },
    {
        id: "reporting",
        eyebrow: "Sales & reporting",
        title: "Reports that tell you what to do next, not just what happened.",
        description:
            "See profit and loss, best-sellers, and cashier performance broken down by branch — and export anything your accountant needs.",
        bullets: [
            "Daily, weekly, and branch-by-branch sales dashboards",
            "Profit and loss broken down by item and category",
            "See your best — and worst — sellers at a glance",
            "Track cashier performance and till accuracy",
            "Export any report to CSV",
        ],
        layout: "stacked",
        Visual: ReportingVisual,
    },
    {
        id: "customers",
        eyebrow: "Customer management",
        title: "Recognize a regular the moment they reach the counter.",
        description:
            "Loyalty points, purchase history, and pricing tiers travel with the customer — not just the sale.",
        bullets: [
            "Loyalty points that add up automatically at checkout",
            "Full purchase history per customer",
            "Customer groups with their own pricing tiers",
            "Wholesale and retail pricing side by side",
            "Quick lookup by phone number at the till",
        ],
        layout: "split-right",
        Visual: CustomerVisual,
    },
    {
        id: "branches",
        eyebrow: "Multi-branch support",
        title: "Run five branches like they're one shop.",
        description:
            "Central control with branch-level detail — approve transfers, set prices, and see every location without switching accounts.",
        bullets: [
            "One dashboard for every branch you run",
            "Request and approve inter-branch stock transfers",
            "Branch-level reporting alongside the company-wide view",
            "Set prices centrally or per branch",
            "Add a new branch without starting from scratch",
        ],
        layout: "split-left",
        Visual: BranchVisual,
    },
    {
        id: "team",
        eyebrow: "Team & roles",
        title: "Everyone sees exactly what their job needs.",
        description:
            "Owners, managers, cashiers, and inventory staff each get a view built for their role — nothing more, nothing hidden.",
        bullets: [
            "Role-based permissions for Owner, Manager, Cashier, and Inventory Staff",
            "Each role sees only what it needs",
            "Track shifts and till handovers",
            "Add or remove staff access instantly",
            "Audit trail of who did what, and when",
        ],
        layout: "split-right",
        Visual: TeamVisual,
    },
    {
        id: "billing",
        eyebrow: "Billing via bKash",
        title: "Subscription billing that doesn't need a bank visit.",
        description:
            "Renew directly through bKash, with a reminder before your date and a short grace period if you're running behind.",
        bullets: [
            "Renew your subscription directly through bKash",
            "Reminders land before your renewal date",
            "Short grace period if a payment is late",
            "Clear, itemized billing history",
            "No bank visits, no manual invoices",
        ],
        layout: "split-left",
        Visual: BillingVisual,
    },
];

const NAV_SECTIONS = CATEGORIES.map((c) => ({ id: c.id, label: c.eyebrow }));

export default function Features({ canLogin, canRegister }) {
    return (
        <>
            <Head title="Features — Dokan" />

            <div className="bg-front-bg font-sans">
                <Navbar canLogin={canLogin} canRegister={canRegister} />
                <main>
                    <PageHeader
                        eyebrow="Everything on the counter"
                        title="Every part of the shop, in one platform."
                        intro="From the first scan at the till to the report you send your accountant — here's what Dokan actually does, category by category."
                    />

                    <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                        <div className="xl:flex xl:items-start xl:gap-16">
                            <SectionNav sections={NAV_SECTIONS} />
                            <div className="min-w-0 xl:flex-1">
                                {CATEGORIES.map(({ Visual, ...category }) => (
                                    <FeatureCategory
                                        key={category.id}
                                        {...category}
                                        visual={<Visual />}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <ComparisonSection />
                    <CompatibilityNote />
                    <FinalCTA
                        canRegister={canRegister}
                        title="See it running in your own shop."
                        subtitle="Start free and try every feature on this page with your own stock and your own till."
                    />
                </main>
                <Footer />
            </div>
        </>
    );
}
