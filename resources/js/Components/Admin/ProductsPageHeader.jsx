import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Plus, Upload } from "lucide-react";

import { FrontButton } from "@/Components/Front/Button";

export default function ProductsPageHeader({ total, onAddProduct, onImportExport }) {
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
                    Products
                </h1>
                <p className="mt-1 text-sm text-front-muted">
                    {total} product{total === 1 ? "" : "s"} in your catalog
                </p>
            </div>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onImportExport}
                    className="flex items-center gap-2 rounded-full border border-front-line px-4 py-2 text-sm font-medium text-front-ink transition-colors hover:border-front-accent hover:text-front-accent"
                >
                    <Upload size={15} />
                    Import / Export
                </button>
                <FrontButton size="sm" onClick={onAddProduct}>
                    <Plus size={15} />
                    Add product
                </FrontButton>
            </div>
        </div>
    );
}
