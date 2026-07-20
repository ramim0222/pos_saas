import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Download } from "lucide-react";

import StatusBadge from "@/Components/Admin/StatusBadge";

function downloadInvoice(payment) {
    const lines = [
        "DOKAN — PAYMENT RECEIPT",
        "".padEnd(32, "-"),
        `Plan: ${payment.plan}`,
        `Billing period: ${payment.period}`,
        `Amount: BDT ${payment.amount.toLocaleString("en-US")}`,
        `Method: ${payment.method === "bkash" ? "bKash" : payment.method}`,
        `Transaction ID: ${payment.transaction_id ?? "—"}`,
        `Status: ${payment.status}`,
        `Date: ${payment.date}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dokan-invoice-${payment.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

export default function PaymentHistoryTable({ payments }) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            if (payments.length <= 8) {
                gsap.fromTo(
                    "[data-payment-row]",
                    { opacity: 0, y: 8 },
                    { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" },
                );
            } else {
                gsap.from(rootRef.current, { opacity: 0, duration: 0.4, ease: "power2.out" });
            }
        },
        { scope: rootRef },
    );

    return (
        <div ref={rootRef} className="rounded-2xl border border-front-line bg-front-surface p-6">
            <p className="font-display text-lg font-medium text-front-ink">Payment history</p>
            <p className="mb-5 text-xs text-front-muted">All bKash payments recorded against your subscription</p>

            {payments.length === 0 ? (
                <p className="py-8 text-center text-sm text-front-muted">No payments yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] border-collapse">
                        <thead>
                            <tr className="border-b border-front-line text-left text-xs font-medium text-front-muted uppercase">
                                <th scope="col" className="px-4 py-3">Date</th>
                                <th scope="col" className="px-4 py-3">Amount</th>
                                <th scope="col" className="px-4 py-3">Billing period</th>
                                <th scope="col" className="px-4 py-3">Transaction ID</th>
                                <th scope="col" className="px-4 py-3">Status</th>
                                <th scope="col" className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment.id} data-payment-row className="border-b border-front-line last:border-b-0">
                                    <td className="px-4 py-3 text-sm text-front-ink/90">{payment.date}</td>
                                    <td className="px-4 py-3 text-sm font-medium tabular-figures text-front-ink/90">
                                        ৳ {payment.amount.toLocaleString("en-US")}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-front-muted">{payment.period}</td>
                                    <td className="px-4 py-3 text-sm tabular-figures text-front-muted">
                                        {payment.transaction_id ?? "—"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={payment.status} />
                                    </td>
                                    <td className="px-4 py-3">
                                        {payment.status === "paid" && (
                                            <button
                                                type="button"
                                                onClick={() => downloadInvoice(payment)}
                                                aria-label={`Download invoice for ${payment.date}`}
                                                className="flex items-center gap-1.5 rounded-full border border-front-line px-3 py-1.5 text-xs font-medium text-front-ink hover:border-front-accent"
                                            >
                                                <Download size={12} />
                                                Invoice
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
