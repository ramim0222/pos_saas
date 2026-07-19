import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
    {
        title: "Multi-branch inventory",
        copy: "Stock counts, transfers, and low-stock alerts across every branch, updated the moment something sells.",
        Panel: InventoryPanel,
    },
    {
        title: "POS with offline mode",
        copy: "The till keeps ringing up sales through a dropped connection, then syncs everything once you're back online.",
        Panel: OfflinePosPanel,
    },
    {
        title: "Sales & reporting",
        copy: "Daily, weekly, and branch-by-branch reports that tell you what moved, what didn't, and who sold it.",
        Panel: ReportingPanel,
    },
    {
        title: "Customer loyalty",
        copy: "Punch cards and repeat-customer tracking, built right into the checkout — no separate app to manage.",
        Panel: LoyaltyPanel,
    },
    {
        title: "bKash billing",
        copy: "Renew your subscription with bKash. Reminders land before you're due, with a short grace period if you're late.",
        Panel: BillingPanel,
    },
    {
        title: "Multi-user roles",
        copy: "Cashiers, managers, and owners each see exactly what their role needs — nothing more.",
        Panel: RolesPanel,
    },
];

export default function FeaturesShowcase() {
    const [active, setActive] = useState(0);
    const rootRef = useRef(null);
    const panelRef = useRef(null);

    useGSAP(
        () => {
            gsap.from("[data-feature-row]", {
                opacity: 0,
                x: -16,
                duration: 0.5,
                stagger: 0.08,
                ease: "power2.out",
                scrollTrigger: { trigger: rootRef.current, start: "top 80%" },
            });
        },
        { scope: rootRef },
    );

    useGSAP(
        () => {
            if (!panelRef.current) return;
            gsap.fromTo(
                panelRef.current,
                { opacity: 0, y: 14 },
                { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
            );
        },
        { scope: rootRef, dependencies: [active], revertOnUpdate: true },
    );

    const ActivePanel = FEATURES[active].Panel;

    return (
        <section id="features" ref={rootRef} className="bg-front-bg py-24 lg:py-32">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                <div className="mb-16 max-w-2xl">
                    <p className="mb-4 text-xs font-medium tracking-[0.2em] text-front-accent uppercase">
                        What's on the counter
                    </p>
                    <h2 className="font-display text-4xl font-semibold tracking-tight text-front-ink lg:text-5xl">
                        Six things every shop needs. One place to run them.
                    </h2>
                </div>

                <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
                    <ul className="border-t border-front-line">
                        {FEATURES.map((feature, i) => (
                            <li key={feature.title} data-feature-row>
                                <button
                                    type="button"
                                    onClick={() => setActive(i)}
                                    className={`group flex w-full items-start gap-4 border-b border-front-line py-5 text-left transition-colors ${
                                        active === i ? "text-front-ink" : "text-front-muted hover:text-front-ink/80"
                                    }`}
                                    aria-pressed={active === i}
                                >
                                    <span
                                        className={`mt-1 h-2 w-2 shrink-0 rounded-full transition-colors ${
                                            active === i ? "bg-front-accent" : "bg-front-line"
                                        }`}
                                        aria-hidden="true"
                                    />
                                    <span>
                                        <span className="block font-display text-lg font-medium">
                                            {feature.title}
                                        </span>
                                        {active === i && (
                                            <span className="mt-1.5 block max-w-sm text-sm leading-relaxed text-front-muted">
                                                {feature.copy}
                                            </span>
                                        )}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div
                        ref={panelRef}
                        className="front-grain flex min-h-[26rem] items-center justify-center rounded-2xl border border-front-line bg-front-surface p-8"
                    >
                        <ActivePanel />
                    </div>
                </div>
            </div>
        </section>
    );
}

function PanelFrame({ children }) {
    return <div className="w-full max-w-sm">{children}</div>;
}

function InventoryPanel() {
    const branches = [
        { name: "Gulshan", pct: 82 },
        { name: "Uttara", pct: 46 },
        { name: "Mirpur", pct: 91 },
        { name: "Chattogram", pct: 28 },
    ];
    return (
        <PanelFrame>
            <p className="mb-4 text-xs tracking-wide text-front-muted uppercase">Stock by branch</p>
            <div className="space-y-4">
                {branches.map((b) => (
                    <div key={b.name}>
                        <div className="mb-1.5 flex justify-between text-sm text-front-ink/85">
                            <span>{b.name}</span>
                            <span className="tabular-figures text-front-muted">{b.pct}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-front-bg">
                            <div
                                className="h-2 rounded-full bg-front-accent"
                                style={{ width: `${b.pct}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </PanelFrame>
    );
}

function OfflinePosPanel() {
    return (
        <PanelFrame>
            <div className="rounded-xl border border-front-line bg-front-bg p-5">
                <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs tracking-wide text-front-muted uppercase">Till 02</span>
                    <span className="rounded-full bg-front-green/15 px-2.5 py-1 text-[0.65rem] font-medium text-front-green">
                        Saved locally · syncing on reconnect
                    </span>
                </div>
                <div className="space-y-2.5">
                    {["Soap bar x4", "Biscuit, family pack", "Mustard oil, 1L"].map((row) => (
                        <div key={row} className="flex justify-between text-sm text-front-ink/80">
                            <span>{row}</span>
                            <span className="tabular-figures text-front-muted">৳ {(row.length * 15)}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex justify-between border-t border-dashed border-front-line pt-3 font-medium text-front-ink">
                    <span>Total</span>
                    <span className="tabular-figures">৳ 985</span>
                </div>
            </div>
        </PanelFrame>
    );
}

function ReportingPanel() {
    const bars = [40, 65, 30, 80, 55, 90, 48];
    return (
        <PanelFrame>
            <p className="mb-5 text-xs tracking-wide text-front-muted uppercase">This week's sales</p>
            <div className="flex h-40 items-end gap-2.5">
                {bars.map((h, i) => (
                    <div
                        key={i}
                        className="flex-1 rounded-t-sm bg-front-accent/70"
                        style={{ height: `${h}%` }}
                    />
                ))}
            </div>
            <div className="mt-3 flex justify-between text-[0.65rem] text-front-muted">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <span key={i}>{d}</span>
                ))}
            </div>
        </PanelFrame>
    );
}

function LoyaltyPanel() {
    return (
        <PanelFrame>
            <p className="mb-4 text-xs tracking-wide text-front-muted uppercase">Customer card — Rafiq Uddin</p>
            <div className="grid grid-cols-5 gap-2.5">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div
                        key={i}
                        className={`flex aspect-square items-center justify-center rounded-full border text-[0.65rem] ${
                            i < 7
                                ? "border-front-accent bg-front-accent/15 text-front-accent"
                                : "border-front-line text-front-muted"
                        }`}
                    >
                        {i < 7 ? "✓" : ""}
                    </div>
                ))}
            </div>
            <p className="mt-4 text-sm text-front-muted">3 more visits until a free item.</p>
        </PanelFrame>
    );
}

function BillingPanel() {
    return (
        <PanelFrame>
            <div className="rounded-xl border border-front-line bg-front-bg p-5">
                <div className="flex items-center justify-between text-sm text-front-ink/85">
                    <span>Plan</span>
                    <span className="font-medium">Pro — monthly</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-front-ink/85">
                    <span>Renews</span>
                    <span className="tabular-figures">18 Aug 2026</span>
                </div>
                <div className="mt-4 flex items-center justify-between rounded-lg bg-front-green/10 px-3 py-2.5 text-sm text-front-green">
                    <span>Paid via bKash</span>
                    <span className="tabular-figures">৳ 1,499</span>
                </div>
            </div>
        </PanelFrame>
    );
}

function RolesPanel() {
    const roles = [
        { name: "Nasrin A.", role: "Owner" },
        { name: "Kabir H.", role: "Manager" },
        { name: "Shefali R.", role: "Cashier" },
    ];
    return (
        <PanelFrame>
            <p className="mb-4 text-xs tracking-wide text-front-muted uppercase">Gulshan branch team</p>
            <div className="space-y-3">
                {roles.map((p) => (
                    <div
                        key={p.name}
                        className="flex items-center justify-between rounded-lg border border-front-line px-4 py-3"
                    >
                        <span className="text-sm text-front-ink/85">{p.name}</span>
                        <span className="rounded-full bg-front-surface-2 px-2.5 py-1 text-[0.65rem] tracking-wide text-front-muted uppercase">
                            {p.role}
                        </span>
                    </div>
                ))}
            </div>
        </PanelFrame>
    );
}
