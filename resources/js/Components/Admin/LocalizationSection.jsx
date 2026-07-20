import { useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Coins } from "lucide-react";

import InputLabel from "@/Components/InputLabel";
import FrontSelect from "@/Components/Front/FrontSelect";
import SaveButton from "@/Components/Admin/SaveButton";

const DATE_FORMATS = [
    { value: "d M Y", example: "20 Jul 2026" },
    { value: "M d, Y", example: "Jul 20, 2026" },
    { value: "Y-m-d", example: "2026-07-20" },
    { value: "d/m/Y", example: "20/07/2026" },
];

const TIMEZONES = ["Asia/Dhaka", "Asia/Kolkata", "Asia/Karachi", "UTC", "Asia/Singapore"];

export default function LocalizationSection({ settings }) {
    const rootRef = useRef(null);
    const [currencySymbol, setCurrencySymbol] = useState(settings.currency_symbol);
    const [currencyCode, setCurrencyCode] = useState(settings.currency_code);
    const [dateFormat, setDateFormat] = useState(settings.date_format);
    const [timezone, setTimezone] = useState(settings.timezone);
    const [processing, setProcessing] = useState(false);
    const [saved, setSaved] = useState(false);

    useGSAP(
        () => {
            gsap.from(rootRef.current, { opacity: 0, y: 12, duration: 0.4, ease: "power2.out" });
        },
        { scope: rootRef },
    );

    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setSaved(false);

        router.post(
            route("admin.settings.localization"),
            { currency_symbol: currencySymbol, currency_code: currencyCode, date_format: dateFormat, timezone },
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

    const fieldClass =
        "mt-2 w-full rounded-lg border border-front-line bg-front-bg px-3 py-2.5 text-sm text-front-ink outline-none focus:border-front-accent";

    return (
        <div ref={rootRef} className="rounded-2xl border border-front-line bg-front-surface p-6 sm:p-8">
            <div className="flex items-center gap-2">
                <Coins size={16} className="text-front-accent" />
                <p className="font-display text-lg font-medium text-front-ink">Currency & localization</p>
            </div>
            <p className="mt-1 text-sm text-front-muted">How money, dates, and times are displayed across the store.</p>

            <form id="localization-form" onSubmit={submit} noValidate className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <InputLabel value="Currency symbol" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                    <input value={currencySymbol} onChange={(e) => setCurrencySymbol(e.target.value)} className={fieldClass} maxLength={5} />
                </div>
                <div>
                    <InputLabel value="Currency code" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                    <input value={currencyCode} onChange={(e) => setCurrencyCode(e.target.value.toUpperCase())} className={fieldClass} maxLength={5} />
                </div>
                <div>
                    <InputLabel value="Date format" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                    <FrontSelect value={dateFormat} onChange={(e) => setDateFormat(e.target.value)} className="mt-2">
                        {DATE_FORMATS.map((f) => (
                            <option key={f.value} value={f.value}>
                                {f.example}
                            </option>
                        ))}
                    </FrontSelect>
                </div>
                <div>
                    <InputLabel value="Timezone" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                    <FrontSelect value={timezone} onChange={(e) => setTimezone(e.target.value)} className="mt-2">
                        {TIMEZONES.map((tz) => (
                            <option key={tz} value={tz}>
                                {tz}
                            </option>
                        ))}
                    </FrontSelect>
                </div>
            </form>

            <div className="mt-6 flex justify-end border-t border-front-line pt-5">
                <SaveButton processing={processing} saved={saved} form="localization-form" />
            </div>
        </div>
    );
}
