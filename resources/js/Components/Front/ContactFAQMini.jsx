import { useRef } from "react";
import { Link } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const QUESTIONS = [
    {
        q: "How does billing work?",
        a: "Billed through bKash, with a reminder before your renewal date and a short grace period if you're late.",
        href: "/pricing#billing-faq",
    },
    {
        q: "Do you offer a free trial?",
        a: "Every plan starts free — no card required to get going.",
        href: "/pricing#billing-faq",
    },
    {
        q: "Does the till work offline?",
        a: "Yes. Sales keep going through a dropped connection and sync once you're back online.",
        href: "/#faq",
    },
    {
        q: "Can I switch plans later?",
        a: "Upgrade or downgrade anytime from your account, prorated on your next cycle.",
        href: "/pricing#billing-faq",
    },
];

export default function ContactFAQMini() {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from("[data-mini-faq]", {
                opacity: 0,
                y: 14,
                duration: 0.55,
                stagger: 0.08,
                ease: "power2.out",
                scrollTrigger: { trigger: rootRef.current, start: "top 82%" },
            });
        },
        { scope: rootRef },
    );

    return (
        <section ref={rootRef} className="border-t border-front-line bg-front-bg py-20 lg:py-28">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                <p className="mb-10 text-xs font-medium tracking-[0.2em] text-front-accent uppercase">
                    Quick answers
                </p>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {QUESTIONS.map((item) => (
                        <div key={item.q} data-mini-faq>
                            <h3 className="font-display text-lg font-medium text-front-ink">
                                {item.q}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-front-muted">
                                {item.a}
                            </p>
                            <Link
                                href={item.href}
                                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-front-accent hover:underline"
                            >
                                Full answer
                                <ArrowUpRight size={12} />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
