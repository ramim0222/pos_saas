import { useEffect, useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Loader2, X } from "lucide-react";

import InputLabel from "@/Components/InputLabel";
import FrontSelect from "@/Components/Front/FrontSelect";
import { FrontButton } from "@/Components/Front/Button";

const ROLES = [
    { value: "manager", label: "Manager" },
    { value: "cashier", label: "Cashier" },
    { value: "inventory_staff", label: "Inventory Staff" },
];

export default function InviteStaffModal({ open, onClose, branches }) {
    const rootRef = useRef(null);
    const panelRef = useRef(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("cashier");
    const [branchIds, setBranchIds] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!open) return;
        setName("");
        setEmail("");
        setRole("cashier");
        setBranchIds([]);
        setErrors({});
    }, [open]);

    useGSAP(
        () => {
            if (!open) return;
            gsap.fromTo("[data-backdrop]", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out" });
            gsap.fromTo(panelRef.current, { xPercent: 100 }, { xPercent: 0, duration: 0.4, ease: "power3.out" });
        },
        { scope: rootRef, dependencies: [open] },
    );

    if (!open) return null;

    const toggleBranch = (id) => {
        setBranchIds((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));
    };

    const submit = (e) => {
        e.preventDefault();
        setErrors({});
        setProcessing(true);

        router.post(
            route("admin.staff.invite"),
            { name, email, role, branch_ids: branchIds },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
                onSuccess: () => onClose(),
                onError: (err) => setErrors(err),
            },
        );
    };

    const fieldClass =
        "mt-2 w-full rounded-lg border border-front-line bg-front-bg px-3 py-2.5 text-sm text-front-ink outline-none focus:border-front-accent";

    return (
        <div ref={rootRef} className="fixed inset-0 z-50 flex">
            <div data-backdrop className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
            <div ref={panelRef} className="relative ml-auto flex h-full w-full max-w-md flex-col bg-front-bg shadow-2xl">
                <div className="flex shrink-0 items-center justify-between border-b border-front-line px-6 py-5">
                    <h2 className="font-display text-xl font-medium text-front-ink">Invite staff</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close panel"
                        className="rounded-full p-2 text-front-muted hover:bg-front-surface hover:text-front-ink"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form id="invite-staff-form" onSubmit={submit} noValidate className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
                    <div>
                        <InputLabel value="Full name" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                        <input value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} required />
                        {errors.name && <p className="mt-2 text-sm text-red-400">{errors.name}</p>}
                    </div>

                    <div>
                        <InputLabel value="Email" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} required />
                        {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
                    </div>

                    <div>
                        <InputLabel value="Role" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                        <FrontSelect value={role} onChange={(e) => setRole(e.target.value)} className="mt-2">
                            {ROLES.map((r) => (
                                <option key={r.value} value={r.value}>
                                    {r.label}
                                </option>
                            ))}
                        </FrontSelect>
                    </div>

                    <div>
                        <InputLabel value="Assigned branches" className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase" />
                        <div className="mt-2 space-y-2">
                            {branches.map((b) => (
                                <label key={b.id} className="flex items-center gap-2.5 rounded-lg border border-front-line px-3 py-2 text-sm text-front-ink/85">
                                    <input
                                        type="checkbox"
                                        checked={branchIds.includes(b.id)}
                                        onChange={() => toggleBranch(b.id)}
                                        className="h-4 w-4 rounded border-front-line accent-front-accent"
                                    />
                                    {b.name}
                                </label>
                            ))}
                        </div>
                    </div>
                </form>

                <div className="flex shrink-0 items-center justify-end gap-3 border-t border-front-line px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-front-line px-4 py-2 text-sm font-medium text-front-ink hover:border-front-accent"
                    >
                        Cancel
                    </button>
                    <FrontButton type="submit" form="invite-staff-form" disabled={processing || !name || !email}>
                        {processing ? (
                            <>
                                <Loader2 size={15} className="animate-spin" />
                                Sending
                            </>
                        ) : (
                            "Send invite"
                        )}
                    </FrontButton>
                </div>
            </div>
        </div>
    );
}
