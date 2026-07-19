import { useRef } from "react";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const FAQS = [
    {
        q: "How does billing through bKash actually work?",
        a: "Each cycle, you get a reminder before your renewal date. Pay through bKash from the reminder or inside the app, and your plan renews immediately. If a payment is missed, you keep a short grace period before the account is paused — nothing is deleted.",
    },
    {
        q: "What happens to sales if the internet goes down?",
        a: "The till keeps working. Sales are saved on the device and sync to your account automatically once the connection returns — no lost transactions, no manual re-entry.",
    },
    {
        q: "Is our sales and customer data secure?",
        a: "Every store's data is scoped and isolated from every other store on the platform, and it's backed up regularly. Staff only see what their role allows.",
    },
    {
        q: "We're switching from paper registers — is setup difficult?",
        a: "Most shops are ready to sell within an afternoon: add your items (or import a list), invite your staff, and you're at the till. No accounting background needed.",
    },
    {
        q: "Can we run more than one branch on the same account?",
        a: "Yes. Add as many branches as your plan allows, each with its own stock and till, all reporting into one owner dashboard.",
    },
    {
        q: "What if I need to cancel?",
        a: "Cancel anytime from your account settings. You keep access until the end of the period you've already paid for, and you can export your data before you go.",
    },
];

export default function FAQ({
    id = "faq",
    eyebrow = "Questions",
    title = "Before you switch over",
    items = FAQS,
}) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from("[data-faq-item]", {
                opacity: 0,
                y: 16,
                duration: 0.5,
                stagger: 0.08,
                ease: "power2.out",
                scrollTrigger: { trigger: rootRef.current, start: "top 80%" },
            });
        },
        { scope: rootRef },
    );

    return (
        <section id={id} ref={rootRef} className="bg-front-bg py-24 lg:py-32">
            <div className="mx-auto max-w-3xl px-6 lg:px-10">
                <div className="mb-14">
                    <p className="mb-4 text-xs font-medium tracking-[0.2em] text-front-accent uppercase">
                        {eyebrow}
                    </p>
                    <h2 className="font-display text-4xl font-semibold tracking-tight text-front-ink lg:text-5xl">
                        {title}
                    </h2>
                </div>

                <div className="border-t border-front-line">
                    {items.map((item) => (
                        <div key={item.q} data-faq-item>
                            <FAQItem question={item.q} answer={item.a} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FAQItem({ question, answer }) {
    return (
        <Disclosure as="div" className="border-b border-front-line">
            {({ open }) => <FAQItemBody open={open} question={question} answer={answer} />}
        </Disclosure>
    );
}

function FAQItemBody({ open, question, answer }) {
    const panelRef = useRef(null);
    const iconRef = useRef(null);

    useGSAP(() => {
        const el = panelRef.current;
        if (!el) return;

        if (open) {
            gsap.set(el, { display: "block" });
            gsap.fromTo(
                el,
                { height: 0, opacity: 0 },
                { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" },
            );
            gsap.to(iconRef.current, { rotate: 45, duration: 0.3, ease: "power2.out" });
        } else {
            gsap.to(el, {
                height: 0,
                opacity: 0,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => gsap.set(el, { display: "none" }),
            });
            gsap.to(iconRef.current, { rotate: 0, duration: 0.3, ease: "power2.out" });
        }
    }, [open]);

    return (
        <>
            <DisclosureButton className="flex w-full items-center justify-between gap-6 py-6 text-left">
                <span className="font-display text-lg font-medium text-front-ink">
                    {question}
                </span>
                <span
                    ref={iconRef}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-front-line text-front-ink"
                >
                    <Plus size={14} />
                </span>
            </DisclosureButton>
            <DisclosurePanel static ref={panelRef} className="overflow-hidden" style={{ display: "none" }}>
                <p className="max-w-xl pb-6 text-sm leading-relaxed text-front-muted">{answer}</p>
            </DisclosurePanel>
        </>
    );
}
