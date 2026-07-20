import { useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Copy, Loader2, Paperclip, X } from "lucide-react";

import InputLabel from "@/Components/InputLabel";
import { FrontButton } from "@/Components/Front/Button";
import StatusBadge from "@/Components/Admin/StatusBadge";

const BKASH_NUMBER = "01711-223344";

export default function ManualPaymentSection({ manualSubmissions }) {
    const rootRef = useRef(null);
    const [transactionId, setTransactionId] = useState("");
    const [amount, setAmount] = useState("");
    const [notes, setNotes] = useState("");
    const [screenshot, setScreenshot] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [copied, setCopied] = useState(false);

    useGSAP(
        () => {
            gsap.from(rootRef.current, { opacity: 0, y: 14, duration: 0.5, ease: "power2.out" });
        },
        { scope: rootRef },
    );

    const copyNumber = () => {
        navigator.clipboard?.writeText(BKASH_NUMBER.replace("-", ""));
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
    };

    const submit = (e) => {
        e.preventDefault();
        setErrors({});
        setProcessing(true);

        router.post(
            route("admin.billing.manual-payment"),
            { transaction_id: transactionId, amount, notes, screenshot },
            {
                forceFormData: true,
                preserveScroll: true,
                onFinish: () => setProcessing(false),
                onSuccess: () => {
                    setTransactionId("");
                    setAmount("");
                    setNotes("");
                    setScreenshot(null);
                },
                onError: (err) => setErrors(err),
            },
        );
    };

    const fieldClass =
        "mt-2 w-full rounded-lg border border-front-line bg-front-bg px-3 py-2.5 text-sm text-front-ink outline-none focus:border-front-accent";

    return (
        <div ref={rootRef} className="rounded-2xl border border-front-line bg-front-surface p-6 sm:p-8">
            <p className="font-display text-lg font-medium text-front-ink">Manual payment fallback</p>
            <p className="mt-1 text-sm text-front-muted">
                If the bKash checkout above doesn't go through, send payment manually and we'll verify it within one business day.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-front-line bg-front-bg px-5 py-4">
                <div>
                    <p className="text-xs text-front-muted uppercase">Send payment to (bKash — Send Money)</p>
                    <p className="mt-1 font-display text-xl font-semibold tabular-figures text-front-ink">{BKASH_NUMBER}</p>
                </div>
                <button
                    type="button"
                    onClick={copyNumber}
                    className="flex items-center gap-1.5 rounded-full border border-front-line px-3.5 py-2 text-xs font-medium text-front-ink hover:border-front-accent"
                >
                    <Copy size={13} />
                    {copied ? "Copied" : "Copy number"}
                </button>
            </div>

            <form onSubmit={submit} noValidate className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <InputLabel value="bKash Transaction ID" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                    <input
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. BK7X9K2M4P"
                        className={fieldClass}
                        required
                    />
                    {errors.transaction_id && <p className="mt-2 text-sm text-red-400">{errors.transaction_id}</p>}
                </div>

                <div>
                    <InputLabel value="Amount sent (৳)" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                    <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className={fieldClass}
                        required
                    />
                    {errors.amount && <p className="mt-2 text-sm text-red-400">{errors.amount}</p>}
                </div>

                <div className="sm:col-span-2">
                    <InputLabel value="Screenshot (optional)" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                    <label className="mt-2 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-front-line px-3 py-2.5 text-sm text-front-muted hover:border-front-accent">
                        <Paperclip size={14} />
                        {screenshot ? screenshot.name : "Attach a screenshot of the payment confirmation"}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)}
                            className="hidden"
                        />
                        {screenshot && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setScreenshot(null);
                                }}
                                aria-label="Remove attachment"
                                className="ml-auto rounded-full p-1 hover:bg-front-bg"
                            >
                                <X size={13} />
                            </button>
                        )}
                    </label>
                    {errors.screenshot && <p className="mt-2 text-sm text-red-400">{errors.screenshot}</p>}
                </div>

                <div className="sm:col-span-2">
                    <InputLabel value="Notes (optional)" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2}
                        className={fieldClass}
                    />
                </div>

                <div className="sm:col-span-2">
                    <FrontButton type="submit" disabled={processing || !transactionId || !amount}>
                        {processing ? (
                            <>
                                <Loader2 size={15} className="animate-spin" />
                                Submitting
                            </>
                        ) : (
                            "Submit for verification"
                        )}
                    </FrontButton>
                </div>
            </form>

            {manualSubmissions.length > 0 && (
                <div className="mt-6 border-t border-front-line pt-5">
                    <p className="mb-3 text-xs font-medium tracking-wide text-front-muted uppercase">Submitted for review</p>
                    <div className="space-y-2">
                        {manualSubmissions.map((sub) => (
                            <div key={sub.id} className="flex items-center justify-between rounded-lg border border-front-line px-3.5 py-2.5">
                                <div>
                                    <p className="text-sm text-front-ink/90">
                                        {sub.transaction_id} · ৳ {sub.amount.toLocaleString("en-US")}
                                    </p>
                                    <p className="text-xs text-front-muted">Submitted {sub.submitted_at}</p>
                                </div>
                                <StatusBadge status={sub.status} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
