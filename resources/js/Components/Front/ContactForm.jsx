import { useRef, useState } from "react";
import { useForm } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CheckCircle2, Loader2, Send } from "lucide-react";

import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import FrontTextInput from "@/Components/Front/FrontTextInput";
import FrontTextarea from "@/Components/Front/FrontTextarea";
import FrontSelect from "@/Components/Front/FrontSelect";
import { FrontButton } from "@/Components/Front/Button";

const SUBJECTS = [
    { value: "general", label: "General" },
    { value: "sales", label: "Sales" },
    { value: "support", label: "Support" },
    { value: "demo", label: "Demo request" },
];

export default function ContactForm() {
    const rootRef = useRef(null);
    const formRef = useRef(null);
    const successRef = useRef(null);
    const [submitted, setSubmitted] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        store_name: "",
        subject: "general",
        message: "",
    });

    useGSAP(
        () => {
            if (submitted) {
                gsap
                    .timeline()
                    .to(formRef.current, {
                        opacity: 0,
                        y: -12,
                        duration: 0.35,
                        ease: "power2.in",
                        onComplete: () => gsap.set(formRef.current, { display: "none" }),
                    })
                    .fromTo(
                        successRef.current,
                        { opacity: 0, y: 14, display: "block" },
                        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
                    );
            }
        },
        { scope: rootRef, dependencies: [submitted] },
    );

    const submit = (e) => {
        e.preventDefault();
        post(route("contact.store"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setSubmitted(true);
            },
        });
    };

    const resetForm = () => {
        setSubmitted(false);
        gsap.set(successRef.current, { display: "none", opacity: 0 });
        gsap.set(formRef.current, { display: "block", opacity: 1, y: 0 });
    };

    return (
        <div ref={rootRef} className="relative">
            <form ref={formRef} onSubmit={submit} noValidate className="space-y-7">
                <div>
                    <InputLabel
                        htmlFor="name"
                        value="Name"
                        className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase"
                    />
                    <FrontTextInput
                        id="name"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className="mt-2"
                        autoComplete="name"
                        required
                    />
                    <InputError message={errors.name} className="mt-2 !text-red-400" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="email"
                        value="Email"
                        className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase"
                    />
                    <FrontTextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className="mt-2"
                        autoComplete="email"
                        required
                    />
                    <InputError message={errors.email} className="mt-2 !text-red-400" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="store_name"
                        value="Store name (optional)"
                        className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase"
                    />
                    <FrontTextInput
                        id="store_name"
                        name="store_name"
                        value={data.store_name}
                        onChange={(e) => setData("store_name", e.target.value)}
                        className="mt-2"
                        autoComplete="organization"
                    />
                    <InputError message={errors.store_name} className="mt-2 !text-red-400" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="subject"
                        value="Subject"
                        className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase"
                    />
                    <FrontSelect
                        id="subject"
                        name="subject"
                        value={data.subject}
                        onChange={(e) => setData("subject", e.target.value)}
                        className="mt-2"
                        required
                    >
                        {SUBJECTS.map((s) => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </FrontSelect>
                    <InputError message={errors.subject} className="mt-2 !text-red-400" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="message"
                        value="Message"
                        className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase"
                    />
                    <FrontTextarea
                        id="message"
                        name="message"
                        rows={5}
                        value={data.message}
                        onChange={(e) => setData("message", e.target.value)}
                        className="mt-2"
                        required
                    />
                    <InputError message={errors.message} className="mt-2 !text-red-400" />
                </div>

                <FrontButton type="submit" disabled={processing} className="w-full sm:w-auto">
                    {processing ? (
                        <>
                            <Loader2 size={15} className="animate-spin" />
                            Sending
                        </>
                    ) : (
                        <>
                            Send message
                            <Send size={15} />
                        </>
                    )}
                </FrontButton>
            </form>

            <div
                ref={successRef}
                style={{ display: "none" }}
                className="rounded-2xl border border-front-line bg-front-surface p-8"
            >
                <CheckCircle2 size={28} className="text-front-accent" />
                <h3 className="mt-4 font-display text-2xl font-medium text-front-ink">
                    Message sent.
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-front-muted">
                    Thanks for reaching out — we read every message and usually reply
                    within a business day.
                </p>
                <button
                    type="button"
                    onClick={resetForm}
                    className="mt-6 text-sm font-medium text-front-accent hover:underline"
                >
                    Send another message
                </button>
            </div>
        </div>
    );
}
