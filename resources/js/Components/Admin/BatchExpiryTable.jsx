import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AlertOctagon, CalendarClock, PackageCheck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

function expiryMeta(days) {
    if (days === null) {
        return { label: "No expiry set", icon: PackageCheck, className: "text-front-muted" };
    }
    if (days < 0) {
        return { label: `Expired ${Math.abs(days)}d ago`, icon: AlertOctagon, className: "text-red-400" };
    }
    if (days <= 7) {
        return { label: `Expires in ${days}d`, icon: CalendarClock, className: "text-front-accent" };
    }
    return { label: `Expires in ${days}d`, icon: PackageCheck, className: "text-front-muted" };
}

export default function BatchExpiryTable({ batches }) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from("[data-batch-row]", {
                opacity: 0,
                y: 10,
                duration: 0.4,
                stagger: 0.05,
                ease: "power2.out",
                scrollTrigger: { trigger: rootRef.current, start: "top 85%" },
            });
        },
        { scope: rootRef },
    );

    if (batches.length === 0) {
        return null;
    }

    return (
        <div ref={rootRef} className="rounded-2xl border border-front-line bg-front-surface p-6">
            <p className="font-display text-lg font-medium text-front-ink">Batches & expiry</p>
            <p className="mb-5 text-xs text-front-muted">
                Tracked batches across your branches, soonest expiry first
            </p>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse">
                    <thead>
                        <tr className="border-b border-front-line text-left text-xs font-medium text-front-muted uppercase">
                            <th scope="col" className="px-4 py-3">Product</th>
                            <th scope="col" className="px-4 py-3">Batch</th>
                            <th scope="col" className="px-4 py-3">Branch</th>
                            <th scope="col" className="px-4 py-3">Quantity</th>
                            <th scope="col" className="px-4 py-3">Expiry</th>
                        </tr>
                    </thead>
                    <tbody>
                        {batches.map((batch) => {
                            const meta = expiryMeta(batch.days_until_expiry);
                            const Icon = meta.icon;
                            return (
                                <tr key={batch.id} data-batch-row className="border-b border-front-line last:border-b-0">
                                    <td className="px-4 py-3 text-sm text-front-ink/90">{batch.product}</td>
                                    <td className="px-4 py-3 text-sm text-front-muted tabular-figures">
                                        {batch.batch_number}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-front-muted">{batch.branch}</td>
                                    <td className="px-4 py-3 text-sm text-front-ink/90 tabular-figures">
                                        {batch.quantity}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`flex items-center gap-1.5 text-sm font-medium ${meta.className}`}>
                                            <Icon size={13} />
                                            {meta.label}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
