import { useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Bell, Loader2 } from "lucide-react";

function Toggle({ checked, onChange, label }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            onClick={() => onChange(!checked)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-front-accent" : "bg-front-line"}`}
        >
            <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-front-bg shadow transition-transform ${
                    checked ? "translate-x-5" : "translate-x-0.5"
                }`}
            />
        </button>
    );
}

export default function ReminderSettingsCard({ subscription }) {
    const rootRef = useRef(null);
    const [email, setEmail] = useState(subscription.reminder_email);
    const [sms, setSms] = useState(subscription.reminder_sms);
    const [daysBefore, setDaysBefore] = useState(subscription.reminder_days_before);
    const [processing, setProcessing] = useState(false);
    const [saved, setSaved] = useState(false);

    useGSAP(
        () => {
            gsap.from(rootRef.current, { opacity: 0, y: 14, duration: 0.5, ease: "power2.out" });
        },
        { scope: rootRef },
    );

    const save = (patch = {}) => {
        const payload = {
            reminder_email: patch.email ?? email,
            reminder_sms: patch.sms ?? sms,
            reminder_days_before: patch.daysBefore ?? daysBefore,
        };
        setProcessing(true);
        router.post(route("admin.billing.reminders"), payload, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
            onSuccess: () => {
                setSaved(true);
                window.setTimeout(() => setSaved(false), 1800);
            },
        });
    };

    return (
        <div ref={rootRef} className="rounded-2xl border border-front-line bg-front-surface p-6 sm:p-8">
            <div className="flex items-center gap-2">
                <Bell size={16} className="text-front-accent" />
                <p className="font-display text-lg font-medium text-front-ink">Renewal reminders</p>
            </div>
            <p className="mt-1 text-sm text-front-muted">Get notified before your subscription is due, so payment never catches you off guard.</p>

            <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-front-line bg-front-bg px-4 py-3">
                    <div>
                        <p className="text-sm font-medium text-front-ink">Email reminders</p>
                        <p className="text-xs text-front-muted">Sent to your account email</p>
                    </div>
                    <Toggle
                        checked={email}
                        onChange={(v) => {
                            setEmail(v);
                            save({ email: v });
                        }}
                        label="Toggle email reminders"
                    />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-front-line bg-front-bg px-4 py-3">
                    <div>
                        <p className="text-sm font-medium text-front-ink">SMS reminders</p>
                        <p className="text-xs text-front-muted">Sent to your registered phone number</p>
                    </div>
                    <Toggle
                        checked={sms}
                        onChange={(v) => {
                            setSms(v);
                            save({ sms: v });
                        }}
                        label="Toggle SMS reminders"
                    />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-front-line bg-front-bg px-4 py-3">
                    <div>
                        <p className="text-sm font-medium text-front-ink">Remind me before renewal</p>
                        <p className="text-xs text-front-muted">Days ahead of your due date</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={daysBefore}
                            onChange={(e) => {
                                const v = Number(e.target.value);
                                setDaysBefore(v);
                                save({ daysBefore: v });
                            }}
                            className="rounded-full border border-front-line bg-front-surface px-3 py-1.5 text-sm text-front-ink outline-none focus:border-front-accent"
                        >
                            {[1, 3, 5, 7, 14].map((d) => (
                                <option key={d} value={d}>
                                    {d} day{d === 1 ? "" : "s"}
                                </option>
                            ))}
                        </select>
                        {processing && <Loader2 size={14} className="animate-spin text-front-muted" />}
                        {saved && !processing && <span className="text-xs font-medium text-front-green">Saved</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}
