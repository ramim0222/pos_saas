import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { PackageOpen, Plus, Upload } from "lucide-react";

import { FrontButton } from "@/Components/Front/Button";

export default function EmptyState({ hasFilters, onAddProduct, onImportExport, onClearFilters }) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from(rootRef.current, {
                opacity: 0,
                y: 16,
                duration: 0.5,
                ease: "power2.out",
            });
        },
        { scope: rootRef },
    );

    if (hasFilters) {
        return (
            <div
                ref={rootRef}
                className="flex flex-col items-center rounded-2xl border border-dashed border-front-line bg-front-surface px-6 py-20 text-center"
            >
                <PackageOpen size={30} className="text-front-muted" />
                <h3 className="mt-4 font-display text-lg font-medium text-front-ink">
                    No products match these filters
                </h3>
                <p className="mt-1.5 max-w-sm text-sm text-front-muted">
                    Try a different search term, or clear your filters to see the
                    full catalog.
                </p>
                <button
                    type="button"
                    onClick={onClearFilters}
                    className="mt-6 text-sm font-medium text-front-accent hover:underline"
                >
                    Clear filters
                </button>
            </div>
        );
    }

    return (
        <div
            ref={rootRef}
            className="front-grain flex flex-col items-center rounded-2xl border border-dashed border-front-line bg-front-surface px-6 py-24 text-center"
        >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-front-accent/10 text-front-accent">
                <PackageOpen size={26} />
            </span>
            <h3 className="mt-5 font-display text-xl font-medium text-front-ink">
                Your catalog is empty
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-front-muted">
                Add your first product, or import your existing list from a
                spreadsheet to get your shop set up in minutes.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <FrontButton onClick={onAddProduct}>
                    <Plus size={15} />
                    Add your first product
                </FrontButton>
                <button
                    type="button"
                    onClick={onImportExport}
                    className="flex items-center gap-2 rounded-full border border-front-line px-4 py-2.5 text-sm font-medium text-front-ink transition-colors hover:border-front-accent hover:text-front-accent"
                >
                    <Upload size={15} />
                    Import from CSV
                </button>
            </div>
        </div>
    );
}
