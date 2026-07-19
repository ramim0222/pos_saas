import { Barcode, PackageSearch, Search, Split, Pause } from "lucide-react";

function Frame({ children, className = "" }) {
    return (
        <div
            className={`front-grain w-full max-w-md rounded-2xl border border-front-line bg-front-surface p-6 ${className}`}
        >
            {children}
        </div>
    );
}

export function InventoryVisual() {
    const warehouses = [
        { name: "Gulshan warehouse", stock: 74, alert: false },
        { name: "Uttara warehouse", stock: 18, alert: true },
        { name: "Chattogram depot", stock: 55, alert: false },
    ];
    return (
        <Frame>
            <div className="mb-4 flex items-center justify-between">
                <p className="text-xs tracking-wide text-front-muted uppercase">
                    Stock by warehouse
                </p>
                <Barcode size={16} className="text-front-muted" />
            </div>
            <div className="space-y-4">
                {warehouses.map((w) => (
                    <div key={w.name}>
                        <div className="mb-1.5 flex items-center justify-between text-sm">
                            <span className="text-front-ink/85">{w.name}</span>
                            {w.alert ? (
                                <span className="rounded-full bg-front-accent/15 px-2 py-0.5 text-[0.65rem] font-medium text-front-accent">
                                    Low stock
                                </span>
                            ) : (
                                <span className="tabular-figures text-front-muted">
                                    {w.stock}%
                                </span>
                            )}
                        </div>
                        <div className="h-2 rounded-full bg-front-bg">
                            <div
                                className={`h-2 rounded-full ${w.alert ? "bg-front-accent" : "bg-front-accent/60"}`}
                                style={{ width: `${w.stock}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-5 flex items-center gap-2 rounded-lg border border-dashed border-front-line px-3 py-2.5 text-xs text-front-muted">
                <PackageSearch size={14} className="shrink-0" />
                Batch 4471 — expires 12 Sep 2026
            </div>
        </Frame>
    );
}

export function PosVisual() {
    return (
        <Frame>
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-front-line bg-front-bg px-3 py-2">
                <Search size={14} className="text-front-muted" />
                <span className="text-sm text-front-muted">Search item or scan barcode…</span>
            </div>
            <div className="mb-4 flex gap-2">
                <span className="rounded-full bg-front-accent/15 px-3 py-1 text-xs font-medium text-front-accent">
                    Sale #048 — active
                </span>
                <span className="flex items-center gap-1 rounded-full border border-front-line px-3 py-1 text-xs text-front-muted">
                    <Pause size={11} /> 2 held
                </span>
            </div>
            <div className="space-y-2 border-t border-dashed border-front-line pt-4 text-sm">
                <div className="flex justify-between text-front-ink/85">
                    <span>Cash</span>
                    <span className="tabular-figures">৳ 1,000</span>
                </div>
                <div className="flex justify-between text-front-ink/85">
                    <span>bKash</span>
                    <span className="tabular-figures">৳ 560</span>
                </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-lg bg-front-bg px-3 py-2.5">
                <span className="flex items-center gap-1.5 text-xs text-front-muted">
                    <Split size={13} /> Split payment
                </span>
                <span className="font-display text-base font-semibold tabular-figures text-front-ink">
                    ৳ 1,560
                </span>
            </div>
        </Frame>
    );
}

export function ReportingVisual() {
    const bars = [45, 62, 38, 80, 95, 58, 70];
    const bestSellers = [
        { name: "Rice, 5kg — Chinigura", units: 142 },
        { name: "Cooking oil, 5L", units: 96 },
        { name: "Tea, Ispahani 400g", units: 81 },
    ];
    return (
        <div className="front-grain grid w-full gap-6 rounded-2xl border border-front-line bg-front-surface p-6 lg:grid-cols-[1.3fr_1fr]">
            <div>
                <div className="mb-4 flex items-baseline justify-between">
                    <p className="text-xs tracking-wide text-front-muted uppercase">
                        Profit &amp; loss, this month
                    </p>
                    <span className="font-display text-lg font-semibold tabular-figures text-front-accent">
                        ৳ 2,18,400
                    </span>
                </div>
                <div className="flex h-36 items-end gap-2.5">
                    {bars.map((h, i) => (
                        <div
                            key={i}
                            className="flex-1 rounded-t-sm bg-front-accent/60"
                            style={{ height: `${h}%` }}
                        />
                    ))}
                </div>
            </div>
            <div>
                <p className="mb-4 text-xs tracking-wide text-front-muted uppercase">
                    Best sellers
                </p>
                <div className="space-y-3">
                    {bestSellers.map((item) => (
                        <div key={item.name} className="flex justify-between text-sm">
                            <span className="text-front-ink/85">{item.name}</span>
                            <span className="tabular-figures text-front-muted">{item.units}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function CustomerVisual() {
    return (
        <Frame>
            <p className="mb-4 text-xs tracking-wide text-front-muted uppercase">
                Rafiq Uddin — Gold tier
            </p>
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
            <div className="mt-5 flex items-center justify-between border-t border-dashed border-front-line pt-4 text-sm">
                <span className="text-front-muted">Lifetime purchases</span>
                <span className="tabular-figures text-front-ink/85">৳ 84,200</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-front-muted">Pricing tier</span>
                <span className="rounded-full bg-front-surface-2 px-2.5 py-1 text-[0.65rem] tracking-wide text-front-ink/80 uppercase">
                    Wholesale
                </span>
            </div>
        </Frame>
    );
}

export function BranchVisual() {
    const branches = ["Gulshan", "Uttara", "Mirpur", "Chattogram"];
    return (
        <Frame className="max-w-lg">
            <p className="mb-6 text-xs tracking-wide text-front-muted uppercase">
                Branch network
            </p>
            <div className="relative flex items-center justify-center py-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-front-accent bg-front-accent/10 text-xs font-medium text-front-accent">
                    HQ
                </div>
                <svg
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    viewBox="0 0 400 200"
                    aria-hidden="true"
                >
                    <line x1="200" y1="100" x2="40" y2="30" stroke="var(--color-front-line)" />
                    <line x1="200" y1="100" x2="360" y2="30" stroke="var(--color-front-line)" />
                    <line x1="200" y1="100" x2="40" y2="170" stroke="var(--color-front-line)" />
                    <line x1="200" y1="100" x2="360" y2="170" stroke="var(--color-front-line)" />
                </svg>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {branches.map((b) => (
                    <div
                        key={b}
                        className="rounded-lg border border-front-line px-3 py-2 text-center text-xs text-front-ink/80"
                    >
                        {b}
                    </div>
                ))}
            </div>
            <p className="mt-5 text-xs text-front-muted">
                Transfer request: 40 units Mirpur → Uttara, in transit
            </p>
        </Frame>
    );
}

export function TeamVisual() {
    const roster = [
        { name: "Nasrin A.", role: "Owner", shift: "—" },
        { name: "Kabir H.", role: "Manager", shift: "9am – 6pm" },
        { name: "Shefali R.", role: "Cashier", shift: "9am – 3pm" },
        { name: "Jamal U.", role: "Inventory", shift: "1pm – 9pm" },
    ];
    return (
        <Frame>
            <p className="mb-4 text-xs tracking-wide text-front-muted uppercase">
                Gulshan branch — today
            </p>
            <div className="space-y-2.5">
                {roster.map((p) => (
                    <div
                        key={p.name}
                        className="flex items-center justify-between rounded-lg border border-front-line px-4 py-3"
                    >
                        <div>
                            <p className="text-sm text-front-ink/85">{p.name}</p>
                            <p className="text-xs text-front-muted">{p.shift}</p>
                        </div>
                        <span className="rounded-full bg-front-surface-2 px-2.5 py-1 text-[0.65rem] tracking-wide text-front-muted uppercase">
                            {p.role}
                        </span>
                    </div>
                ))}
            </div>
        </Frame>
    );
}

export function BillingVisual() {
    return (
        <Frame>
            <div className="flex items-center justify-between text-sm text-front-ink/85">
                <span>Plan</span>
                <span className="font-medium">Pro — monthly</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-front-ink/85">
                <span>Next reminder</span>
                <span className="tabular-figures">14 Aug 2026</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-front-ink/85">
                <span>Renews</span>
                <span className="tabular-figures">18 Aug 2026</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-front-ink/85">
                <span>Grace period</span>
                <span className="tabular-figures">5 days</span>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-lg bg-front-green/10 px-3 py-2.5 text-sm text-front-green">
                <span>Last payment · bKash</span>
                <span className="tabular-figures">৳ 2,499</span>
            </div>
        </Frame>
    );
}
