import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import BranchCard from "@/Components/Admin/BranchCard";

export default function BranchGrid({ branches, onView, onEdit, onToggleActive }) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.fromTo(
                "[data-branch-card]",
                { opacity: 0, y: 16 },
                { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: "power2.out" },
            );
        },
        { scope: rootRef, dependencies: [branches], revertOnUpdate: true },
    );

    if (branches.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-front-line p-12 text-center">
                <p className="text-sm text-front-muted">No branches yet. Add your first location to get started.</p>
            </div>
        );
    }

    return (
        <div ref={rootRef} className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {branches.map((branch) => (
                <BranchCard key={branch.id} branch={branch} onView={onView} onEdit={onEdit} onToggleActive={onToggleActive} />
            ))}
        </div>
    );
}
