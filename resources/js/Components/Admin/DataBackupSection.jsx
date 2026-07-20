import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CheckCircle2, Database, Download } from "lucide-react";

export default function DataBackupSection({ settings }) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from(rootRef.current, { opacity: 0, y: 12, duration: 0.4, ease: "power2.out" });
        },
        { scope: rootRef },
    );

    return (
        <div ref={rootRef} className="rounded-2xl border border-front-line bg-front-surface p-6 sm:p-8">
            <div className="flex items-center gap-2">
                <Database size={16} className="text-front-accent" />
                <p className="font-display text-lg font-medium text-front-ink">Data & backup</p>
            </div>
            <p className="mt-1 text-sm text-front-muted">Export a snapshot of your store data, or check on automatic backups.</p>

            <div className="mt-6 rounded-xl border border-front-line bg-front-bg px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-front-ink">Export store data</p>
                        <p className="mt-1 text-xs text-front-muted">
                            Includes product catalog, customers, sales history, and purchase orders as a JSON snapshot.
                        </p>
                    </div>
                    <a
                        href={route("admin.settings.export")}
                        className="flex shrink-0 items-center gap-2 rounded-full border border-front-line px-4 py-2 text-sm font-medium text-front-ink hover:border-front-accent"
                    >
                        <Download size={14} />
                        Export data
                    </a>
                </div>
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-front-line bg-front-bg px-5 py-4">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-front-green" />
                <div>
                    <p className="text-sm font-medium text-front-ink">Automatic backups are running</p>
                    <p className="mt-1 text-xs text-front-muted">
                        Your data is backed up daily. Last backup: <span className="text-front-ink/85">{settings.last_backup_at ?? "Not yet run"}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
