import { useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ImageUp, Store } from "lucide-react";

import InputLabel from "@/Components/InputLabel";
import SaveButton from "@/Components/Admin/SaveButton";

export default function StoreProfileSection({ settings }) {
    const rootRef = useRef(null);
    const [storeName, setStoreName] = useState(settings.store_name);
    const [address, setAddress] = useState(settings.address ?? "");
    const [phone, setPhone] = useState(settings.phone ?? "");
    const [email, setEmail] = useState(settings.email ?? "");
    const [hours, setHours] = useState(settings.business_hours ?? []);
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(settings.logo_url);
    const [processing, setProcessing] = useState(false);
    const [saved, setSaved] = useState(false);
    const [errors, setErrors] = useState({});

    useGSAP(
        () => {
            gsap.from(rootRef.current, { opacity: 0, y: 12, duration: 0.4, ease: "power2.out" });
        },
        { scope: rootRef },
    );

    const updateDay = (index, patch) => {
        setHours((prev) => prev.map((d, i) => (i === index ? { ...d, ...patch } : d)));
    };

    const pickLogo = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const submit = (e) => {
        e.preventDefault();
        setErrors({});
        setProcessing(true);
        setSaved(false);

        router.post(
            route("admin.settings.profile"),
            {
                store_name: storeName,
                address,
                phone,
                email,
                business_hours: hours,
                logo: logoFile,
            },
            {
                forceFormData: true,
                preserveScroll: true,
                onFinish: () => setProcessing(false),
                onSuccess: () => {
                    setSaved(true);
                    window.setTimeout(() => setSaved(false), 2000);
                },
                onError: (err) => setErrors(err),
            },
        );
    };

    const fieldClass =
        "mt-2 w-full rounded-lg border border-front-line bg-front-bg px-3 py-2.5 text-sm text-front-ink outline-none focus:border-front-accent";

    return (
        <div ref={rootRef} className="rounded-2xl border border-front-line bg-front-surface p-6 sm:p-8">
            <div className="flex items-center gap-2">
                <Store size={16} className="text-front-accent" />
                <p className="font-display text-lg font-medium text-front-ink">Store profile</p>
            </div>
            <p className="mt-1 text-sm text-front-muted">Your store's identity across receipts, invoices, and the customer-facing side.</p>

            <form id="profile-form" onSubmit={submit} noValidate className="mt-6 space-y-5">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-front-line bg-front-bg">
                        {logoPreview ? (
                            <img src={logoPreview} alt="Store logo" className="h-full w-full object-cover" />
                        ) : (
                            <Store size={22} className="text-front-muted" />
                        )}
                    </div>
                    <label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-front-line px-3.5 py-2 text-xs font-medium text-front-ink hover:border-front-accent">
                        <ImageUp size={13} />
                        Upload logo
                        <input type="file" accept="image/*" onChange={pickLogo} className="hidden" />
                    </label>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <InputLabel value="Store name" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                        <input value={storeName} onChange={(e) => setStoreName(e.target.value)} className={fieldClass} required />
                        {errors.store_name && <p className="mt-2 text-sm text-red-400">{errors.store_name}</p>}
                    </div>
                    <div>
                        <InputLabel value="Phone" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} className={fieldClass} />
                    </div>
                    <div>
                        <InputLabel value="Email" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} />
                    </div>
                    <div className="sm:col-span-2">
                        <InputLabel value="Address" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                        <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} className={fieldClass} />
                    </div>
                </div>

                <div>
                    <InputLabel value="Business hours" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                    <div className="mt-2 space-y-1.5">
                        {hours.map((day, index) => (
                            <div key={day.day} className="flex flex-wrap items-center gap-2.5 rounded-lg border border-front-line px-3 py-2">
                                <span className="w-24 shrink-0 text-sm text-front-ink/85">{day.day}</span>
                                {day.closed ? (
                                    <span className="text-xs text-front-muted">Closed</span>
                                ) : (
                                    <div className="flex items-center gap-1.5">
                                        <input
                                            type="time"
                                            value={day.open ?? ""}
                                            onChange={(e) => updateDay(index, { open: e.target.value })}
                                            className="rounded-md border border-front-line bg-front-bg px-2 py-1 text-xs text-front-ink outline-none focus:border-front-accent"
                                        />
                                        <span className="text-xs text-front-muted">to</span>
                                        <input
                                            type="time"
                                            value={day.close ?? ""}
                                            onChange={(e) => updateDay(index, { close: e.target.value })}
                                            className="rounded-md border border-front-line bg-front-bg px-2 py-1 text-xs text-front-ink outline-none focus:border-front-accent"
                                        />
                                    </div>
                                )}
                                <label className="ml-auto flex items-center gap-1.5 text-xs text-front-muted">
                                    <input
                                        type="checkbox"
                                        checked={day.closed}
                                        onChange={(e) => updateDay(index, { closed: e.target.checked })}
                                        className="h-3.5 w-3.5 rounded border-front-line accent-front-accent"
                                    />
                                    Closed
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </form>

            <div className="mt-6 flex justify-end border-t border-front-line pt-5">
                <SaveButton processing={processing} saved={saved} form="profile-form" />
            </div>
        </div>
    );
}
