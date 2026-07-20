import { useEffect, useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Receipt, Store } from "lucide-react";

import InputLabel from "@/Components/InputLabel";
import Toggle from "@/Components/Admin/Toggle";
import SaveButton from "@/Components/Admin/SaveButton";

const MOCK_ITEMS = [
    { name: "Chinigura Rice, 5kg", qty: 1, price: 620 },
    { name: "Cooking Oil, 5L", qty: 1, price: 890 },
    { name: "Toothpaste, 100g", qty: 2, price: 180 },
];

export default function ReceiptSection({ settings }) {
    const rootRef = useRef(null);
    const previewRef = useRef(null);
    const [logoEnabled, setLogoEnabled] = useState(settings.receipt_logo_enabled);
    const [header, setHeader] = useState(settings.receipt_header ?? "");
    const [footer, setFooter] = useState(settings.receipt_footer ?? "");
    const [debounced, setDebounced] = useState({ header, footer, logoEnabled });
    const [processing, setProcessing] = useState(false);
    const [saved, setSaved] = useState(false);

    useGSAP(
        () => {
            gsap.from(rootRef.current, { opacity: 0, y: 12, duration: 0.4, ease: "power2.out" });
        },
        { scope: rootRef },
    );

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setDebounced({ header, footer, logoEnabled });
        }, 350);
        return () => window.clearTimeout(timeout);
    }, [header, footer, logoEnabled]);

    useGSAP(
        () => {
            if (!previewRef.current) return;
            gsap.fromTo(previewRef.current, { opacity: 0.3, y: 3 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });
        },
        { scope: rootRef, dependencies: [debounced] },
    );

    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setSaved(false);

        router.post(
            route("admin.settings.receipt"),
            { receipt_logo_enabled: logoEnabled, receipt_header: header, receipt_footer: footer },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
                onSuccess: () => {
                    setSaved(true);
                    window.setTimeout(() => setSaved(false), 2000);
                },
            },
        );
    };

    const subtotal = MOCK_ITEMS.reduce((sum, item) => sum + item.qty * item.price, 0);
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    const fieldClass =
        "mt-2 w-full rounded-lg border border-front-line bg-front-bg px-3 py-2.5 text-sm text-front-ink outline-none focus:border-front-accent";

    return (
        <div ref={rootRef} className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto]">
            <div className="rounded-2xl border border-front-line bg-front-surface p-6 sm:p-8">
                <div className="flex items-center gap-2">
                    <Receipt size={16} className="text-front-accent" />
                    <p className="font-display text-lg font-medium text-front-ink">Receipt customization</p>
                </div>
                <p className="mt-1 text-sm text-front-muted">What prints at the top and bottom of every customer receipt.</p>

                <form id="receipt-form" onSubmit={submit} noValidate className="mt-6 space-y-5">
                    <div className="flex items-center justify-between rounded-xl border border-front-line bg-front-bg px-4 py-3">
                        <div>
                            <p className="text-sm font-medium text-front-ink">Show logo on receipt</p>
                            <p className="text-xs text-front-muted">Prints your store logo above the header text</p>
                        </div>
                        <Toggle checked={logoEnabled} onChange={setLogoEnabled} label="Toggle logo on receipt" />
                    </div>

                    <div>
                        <InputLabel value="Header text" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                        <input value={header} onChange={(e) => setHeader(e.target.value)} className={fieldClass} maxLength={255} />
                    </div>

                    <div>
                        <InputLabel value="Footer text" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                        <textarea value={footer} onChange={(e) => setFooter(e.target.value)} rows={3} className={fieldClass} maxLength={1000} />
                    </div>
                </form>

                <div className="mt-6 flex justify-end border-t border-front-line pt-5">
                    <SaveButton processing={processing} saved={saved} form="receipt-form" />
                </div>
            </div>

            <div className="lg:w-72">
                <p className="mb-3 text-xs font-medium tracking-wide text-front-muted uppercase">Live preview</p>
                <div className="rounded-lg border border-front-line bg-white px-4 py-5 font-mono text-[11px] leading-relaxed text-neutral-800 shadow-inner">
                    <div ref={previewRef}>
                        <div className="text-center">
                            {debounced.logoEnabled && (
                                <div className="mb-1.5 flex justify-center">
                                    <Store size={20} className="text-neutral-700" />
                                </div>
                            )}
                            <p className="font-semibold">{settings.store_name}</p>
                            {debounced.header && <p className="mt-1 text-neutral-600">{debounced.header}</p>}
                        </div>

                        <div className="my-3 border-t border-dashed border-neutral-300" />

                        {MOCK_ITEMS.map((item) => (
                            <div key={item.name} className="flex justify-between gap-2">
                                <span className="truncate">{item.qty}x {item.name}</span>
                                <span className="tabular-nums">{(item.qty * item.price).toFixed(2)}</span>
                            </div>
                        ))}

                        <div className="my-3 border-t border-dashed border-neutral-300" />

                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="tabular-nums">{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-neutral-600">
                            <span>Tax (5%)</span>
                            <span className="tabular-nums">{tax.toFixed(2)}</span>
                        </div>
                        <div className="mt-1 flex justify-between font-semibold">
                            <span>TOTAL</span>
                            <span className="tabular-nums">{total.toFixed(2)}</span>
                        </div>

                        <div className="my-3 border-t border-dashed border-neutral-300" />

                        <p className="text-center whitespace-pre-line text-neutral-600">
                            {debounced.footer || "Thank you for your business."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
