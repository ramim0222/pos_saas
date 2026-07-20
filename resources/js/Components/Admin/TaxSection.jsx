import { useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Landmark } from "lucide-react";

import InputLabel from "@/Components/InputLabel";
import Toggle from "@/Components/Admin/Toggle";
import SaveButton from "@/Components/Admin/SaveButton";

export default function TaxSection({ settings }) {
    const rootRef = useRef(null);
    const [inclusive, setInclusive] = useState(settings.tax_inclusive);
    const [classes, setClasses] = useState(settings.tax_classes);
    const [processing, setProcessing] = useState(false);
    const [saved, setSaved] = useState(false);

    useGSAP(
        () => {
            gsap.from(rootRef.current, { opacity: 0, y: 12, duration: 0.4, ease: "power2.out" });
        },
        { scope: rootRef },
    );

    const updateClass = (index, patch) => {
        setClasses((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
    };

    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setSaved(false);

        router.post(
            route("admin.settings.tax"),
            { tax_inclusive: inclusive, tax_classes: classes },
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

    return (
        <div ref={rootRef} className="rounded-2xl border border-front-line bg-front-surface p-6 sm:p-8">
            <div className="flex items-center gap-2">
                <Landmark size={16} className="text-front-accent" />
                <p className="font-display text-lg font-medium text-front-ink">Tax configuration</p>
            </div>
            <p className="mt-1 text-sm text-front-muted">Rates applied to sales based on each product's tax class.</p>

            <form id="tax-form" onSubmit={submit} noValidate className="mt-6 space-y-5">
                <div className="flex items-center justify-between rounded-xl border border-front-line bg-front-bg px-4 py-3">
                    <div>
                        <p className="text-sm font-medium text-front-ink">Prices are tax-inclusive</p>
                        <p className="text-xs text-front-muted">
                            {inclusive ? "Listed prices already include tax" : "Tax is added on top of listed prices at checkout"}
                        </p>
                    </div>
                    <Toggle checked={inclusive} onChange={setInclusive} label="Toggle tax-inclusive pricing" />
                </div>

                <div>
                    <InputLabel value="Tax classes" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                    <div className="mt-2 space-y-2">
                        {classes.map((taxClass, index) => (
                            <div key={taxClass.name} className="flex items-center gap-3 rounded-lg border border-front-line px-3.5 py-2.5">
                                <input
                                    value={taxClass.label}
                                    onChange={(e) => updateClass(index, { label: e.target.value })}
                                    className="flex-1 rounded-md border border-front-line bg-front-bg px-2.5 py-1.5 text-sm text-front-ink outline-none focus:border-front-accent"
                                />
                                <div className="flex items-center gap-1.5">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        value={taxClass.rate}
                                        onChange={(e) => updateClass(index, { rate: Number(e.target.value) })}
                                        className="w-20 rounded-md border border-front-line bg-front-bg px-2.5 py-1.5 text-right text-sm tabular-nums text-front-ink outline-none focus:border-front-accent"
                                    />
                                    <span className="text-sm text-front-muted">%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="mt-2 text-xs text-front-muted">
                        Classes match each product's tax class field (Standard / Reduced / Zero) set in Products.
                    </p>
                </div>
            </form>

            <div className="mt-6 flex justify-end border-t border-front-line pt-5">
                <SaveButton processing={processing} saved={saved} form="tax-form" />
            </div>
        </div>
    );
}
