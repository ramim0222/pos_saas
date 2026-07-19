import { useEffect, useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Loader2, Plus, X } from "lucide-react";

import StatusBadge from "@/Components/Admin/StatusBadge";
import { FrontButton } from "@/Components/Front/Button";

export default function SupplierDetailPanel({ open, onClose, supplier, purchaseOrders, payments }) {
    const rootRef = useRef(null);
    const panelRef = useRef(null);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("bank_transfer");
    const [paidAt, setPaidAt] = useState(() => new Date().toISOString().slice(0, 10));
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!open) return;
        setShowPaymentForm(false);
        setAmount("");
        setMethod("bank_transfer");
        setPaidAt(new Date().toISOString().slice(0, 10));
        setErrors({});
    }, [open, supplier]);

    useGSAP(
        () => {
            if (open) {
                gsap.set(rootRef.current, { display: "flex" });
                gsap.fromTo("[data-backdrop]", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out" });
                gsap.fromTo(panelRef.current, { xPercent: 100 }, { xPercent: 0, duration: 0.4, ease: "power3.out" });
            } else if (rootRef.current) {
                gsap.to(panelRef.current, { xPercent: 100, duration: 0.32, ease: "power2.in" });
                gsap.to("[data-backdrop]", {
                    opacity: 0,
                    duration: 0.25,
                    onComplete: () => gsap.set(rootRef.current, { display: "none" }),
                });
            }
        },
        { scope: rootRef, dependencies: [open] },
    );

    if (!supplier) return null;

    const history = purchaseOrders.filter((po) => po.supplier_id === supplier.id);
    const ledger = payments.filter((p) => p.supplier_id === supplier.id);

    const submitPayment = (e) => {
        e.preventDefault();
        setErrors({});
        setProcessing(true);

        router.post(
            route("admin.purchases.suppliers.payments.store", supplier.id),
            { amount, method, paid_at: paidAt },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
                onSuccess: () => {
                    setShowPaymentForm(false);
                    setAmount("");
                },
                onError: (err) => setErrors(err),
            },
        );
    };

    return (
        <div ref={rootRef} className="fixed inset-0 z-50 hidden">
            <div data-backdrop className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
            <div ref={panelRef} className="relative ml-auto flex h-full w-full max-w-2xl flex-col bg-front-bg shadow-2xl">
                <div className="flex shrink-0 items-start justify-between border-b border-front-line px-6 py-5">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="font-display text-xl font-medium text-front-ink">{supplier.name}</h2>
                            <StatusBadge status={supplier.is_active ? "active" : "inactive"} />
                        </div>
                        <p className="mt-1 text-sm text-front-muted">
                            {supplier.contact_person ?? "No contact set"} · {supplier.phone ?? supplier.email ?? "—"}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close panel"
                        className="rounded-full p-2 text-front-muted hover:bg-front-surface hover:text-front-ink"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-xl border border-front-line bg-front-surface px-4 py-3">
                            <p className="text-xs text-front-muted uppercase">Total POs</p>
                            <p className="mt-1 font-display text-xl font-semibold text-front-ink tabular-figures">{supplier.total_pos}</p>
                        </div>
                        <div className="rounded-xl border border-front-line bg-front-surface px-4 py-3">
                            <p className="text-xs text-front-muted uppercase">Total spend</p>
                            <p className="mt-1 font-display text-xl font-semibold text-front-ink tabular-figures">
                                ৳ {supplier.total_spend.toLocaleString("en-US")}
                            </p>
                        </div>
                        <div className="rounded-xl border border-front-line bg-front-surface px-4 py-3">
                            <p className="text-xs text-front-muted uppercase">Outstanding</p>
                            <p className="mt-1 font-display text-xl font-semibold text-front-accent tabular-figures">
                                ৳ {supplier.outstanding_balance.toLocaleString("en-US")}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="mb-3 text-xs font-medium tracking-wide text-front-muted uppercase">Purchase history</p>
                        {history.length === 0 ? (
                            <p className="rounded-lg border border-dashed border-front-line px-3 py-4 text-center text-xs text-front-muted">
                                No purchase orders yet for this supplier.
                            </p>
                        ) : (
                            <div className="overflow-hidden rounded-xl border border-front-line">
                                <table className="w-full border-collapse text-sm">
                                    <thead>
                                        <tr className="border-b border-front-line bg-front-surface text-left text-xs font-medium text-front-muted uppercase">
                                            <th scope="col" className="px-3 py-2.5">PO number</th>
                                            <th scope="col" className="px-3 py-2.5">Date</th>
                                            <th scope="col" className="px-3 py-2.5">Total</th>
                                            <th scope="col" className="px-3 py-2.5">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((po) => (
                                            <tr key={po.id} className="border-b border-front-line last:border-b-0">
                                                <td className="px-3 py-2.5 text-front-ink/90">{po.po_number}</td>
                                                <td className="px-3 py-2.5 text-front-muted">{po.order_date}</td>
                                                <td className="px-3 py-2.5 font-medium tabular-figures text-front-ink/90">
                                                    ৳ {po.total_amount.toLocaleString("en-US")}
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <StatusBadge status={po.status} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="mb-3 flex items-center justify-between">
                            <p className="text-xs font-medium tracking-wide text-front-muted uppercase">Payment ledger</p>
                            <button
                                type="button"
                                onClick={() => setShowPaymentForm((v) => !v)}
                                className="flex items-center gap-1 text-xs font-medium text-front-accent hover:underline"
                            >
                                <Plus size={13} />
                                Record payment
                            </button>
                        </div>

                        {showPaymentForm && (
                            <form onSubmit={submitPayment} noValidate className="mb-4 grid grid-cols-1 gap-3 rounded-lg border border-front-line p-3 sm:grid-cols-4">
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Amount"
                                    className="rounded-lg border border-front-line bg-front-bg px-2.5 py-2 text-xs text-front-ink outline-none focus:border-front-accent"
                                    required
                                />
                                <select
                                    value={method}
                                    onChange={(e) => setMethod(e.target.value)}
                                    className="rounded-lg border border-front-line bg-front-bg px-2.5 py-2 text-xs text-front-ink outline-none focus:border-front-accent"
                                >
                                    <option value="bank_transfer">Bank transfer</option>
                                    <option value="cash">Cash</option>
                                    <option value="bkash">bKash</option>
                                    <option value="cheque">Cheque</option>
                                </select>
                                <input
                                    type="date"
                                    value={paidAt}
                                    onChange={(e) => setPaidAt(e.target.value)}
                                    className="rounded-lg border border-front-line bg-front-bg px-2.5 py-2 text-xs text-front-ink outline-none focus:border-front-accent"
                                    required
                                />
                                <FrontButton type="submit" size="sm" disabled={processing || !amount}>
                                    {processing ? <Loader2 size={14} className="animate-spin" /> : "Save"}
                                </FrontButton>
                                {errors.amount && <p className="col-span-full text-xs text-red-400">{errors.amount}</p>}
                            </form>
                        )}

                        {ledger.length === 0 ? (
                            <p className="rounded-lg border border-dashed border-front-line px-3 py-4 text-center text-xs text-front-muted">
                                No payments recorded yet.
                            </p>
                        ) : (
                            <div className="space-y-1">
                                {ledger.map((payment) => (
                                    <div key={payment.id} className="flex items-center justify-between rounded-lg px-2 py-2.5 hover:bg-front-surface">
                                        <div>
                                            <p className="text-sm text-front-ink/90">
                                                {payment.po_number ? `Against ${payment.po_number}` : "General payment"}
                                            </p>
                                            <p className="text-xs text-front-muted capitalize">
                                                {payment.method?.replace("_", " ")} · {payment.paid_at}
                                            </p>
                                        </div>
                                        <span className="text-sm font-medium text-front-green tabular-figures">
                                            ৳ {payment.amount.toLocaleString("en-US")}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
