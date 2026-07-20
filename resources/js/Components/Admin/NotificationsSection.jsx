import { useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Bell } from "lucide-react";

import Toggle from "@/Components/Admin/Toggle";
import SaveButton from "@/Components/Admin/SaveButton";

export default function NotificationsSection({ notifications }) {
    const rootRef = useRef(null);
    const [lowStock, setLowStock] = useState(notifications.notify_low_stock);
    const [dailySales, setDailySales] = useState(notifications.notify_daily_sales_email);
    const [reminderEmail, setReminderEmail] = useState(notifications.reminder_email);
    const [reminderSms, setReminderSms] = useState(notifications.reminder_sms);
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
            route("admin.settings.notifications"),
            {
                notify_low_stock: lowStock,
                notify_daily_sales_email: dailySales,
                reminder_email: reminderEmail,
                reminder_sms: reminderSms,
            },
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

    const rows = [
        { label: "Low stock alerts", hint: "Notify when a product falls below its reorder point", checked: lowStock, onChange: setLowStock },
        { label: "Daily sales email", hint: "A summary of yesterday's sales, sent each morning", checked: dailySales, onChange: setDailySales },
        { label: "Renewal reminders — Email", hint: "Sent before your subscription is due", checked: reminderEmail, onChange: setReminderEmail },
        { label: "Renewal reminders — SMS", hint: "Sent to your registered phone number", checked: reminderSms, onChange: setReminderSms },
    ];

    return (
        <div ref={rootRef} className="rounded-2xl border border-front-line bg-front-surface p-6 sm:p-8">
            <div className="flex items-center gap-2">
                <Bell size={16} className="text-front-accent" />
                <p className="font-display text-lg font-medium text-front-ink">Notification preferences</p>
            </div>
            <p className="mt-1 text-sm text-front-muted">Choose what you want to be alerted about, and how.</p>

            <form id="notifications-form" onSubmit={submit} noValidate className="mt-6 space-y-3">
                {rows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between rounded-xl border border-front-line bg-front-bg px-4 py-3">
                        <div>
                            <p className="text-sm font-medium text-front-ink">{row.label}</p>
                            <p className="text-xs text-front-muted">{row.hint}</p>
                        </div>
                        <Toggle checked={row.checked} onChange={row.onChange} label={`Toggle ${row.label}`} />
                    </div>
                ))}
            </form>

            <div className="mt-6 flex justify-end border-t border-front-line pt-5">
                <SaveButton processing={processing} saved={saved} form="notifications-form" />
            </div>
        </div>
    );
}
