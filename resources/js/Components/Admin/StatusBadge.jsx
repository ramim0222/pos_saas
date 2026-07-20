import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const STATUS_META = {
    draft: { label: "Draft", className: "bg-front-line text-front-muted" },
    sent: { label: "Sent", className: "bg-front-accent/15 text-front-accent" },
    partially_received: { label: "Partially received", className: "bg-blue-400/15 text-blue-300" },
    received: { label: "Received", className: "bg-front-green/15 text-front-green" },
    cancelled: { label: "Cancelled", className: "bg-red-400/15 text-red-400" },
    active: { label: "Active", className: "bg-front-green/10 text-front-green" },
    inactive: { label: "Inactive", className: "bg-front-line text-front-muted" },
    completed: { label: "Completed", className: "bg-front-green/15 text-front-green" },
    refunded: { label: "Refunded", className: "bg-red-400/15 text-red-400" },
    voided: { label: "Voided", className: "bg-front-line text-front-muted" },
    paid: { label: "Paid", className: "bg-front-green/15 text-front-green" },
    failed: { label: "Failed", className: "bg-red-400/15 text-red-400" },
    pending: { label: "Pending", className: "bg-front-accent/15 text-front-accent" },
    approved: { label: "Approved", className: "bg-front-green/15 text-front-green" },
    rejected: { label: "Rejected", className: "bg-red-400/15 text-red-400" },
    pending: { label: "Invited — Pending", className: "bg-front-accent/15 text-front-accent" },
    suspended: { label: "Suspended", className: "bg-red-400/10 text-red-400" },
};

export default function StatusBadge({ status }) {
    const ref = useRef(null);
    const meta = STATUS_META[status] ?? { label: status, className: "bg-front-line text-front-muted" };

    useGSAP(
        () => {
            if (!ref.current) return;
            gsap.fromTo(
                ref.current,
                { scale: 0.85, opacity: 0.4 },
                { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2)" },
            );
        },
        { dependencies: [status] },
    );

    return (
        <span
            ref={ref}
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${meta.className}`}
        >
            {meta.label}
        </span>
    );
}
