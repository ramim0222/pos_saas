import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowLeftRight, SlidersHorizontal } from "lucide-react";

import { FrontButton } from "@/Components/Front/Button";

export default function InventoryPageHeader({
    branches,
    selectedBranch,
    onBranchChange,
    onAdjust,
    onTransfer,
}) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from(rootRef.current, {
                opacity: 0,
                y: 10,
                duration: 0.4,
                ease: "power2.out",
            });
        },
        { scope: rootRef },
    );

    return (
        <div
            ref={rootRef}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <h1 className="font-display text-2xl font-semibold text-front-ink">
                    Inventory
                </h1>
                <p className="mt-1 text-sm text-front-muted">
                    Stock levels, transfers, and adjustments across your branches
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
                <select
                    value={selectedBranch}
                    onChange={(e) => onBranchChange(e.target.value)}
                    className="rounded-full border border-front-line bg-front-surface px-4 py-2 text-sm text-front-ink outline-none focus:border-front-accent"
                >
                    <option value="all">All branches</option>
                    {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                            {b.name}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    onClick={onTransfer}
                    className="flex items-center gap-2 rounded-full border border-front-line px-4 py-2 text-sm font-medium text-front-ink transition-colors hover:border-front-accent hover:text-front-accent"
                >
                    <ArrowLeftRight size={15} />
                    Transfer stock
                </button>
                <FrontButton size="sm" onClick={onAdjust}>
                    <SlidersHorizontal size={15} />
                    Stock adjustment
                </FrontButton>
            </div>
        </div>
    );
}
