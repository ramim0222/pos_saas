import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const QUOTES = [
    {
        quote: "I used to close the shop for an hour every night just to tally the register. Now I check the report on my phone on the rickshaw home.",
        name: "Nasima Akter",
        role: "Owner, Akter General Store — Mirpur",
    },
    {
        quote: "The internet drops twice a day in our area. It never used to matter — Dokan just keeps selling and catches up later.",
        name: "Kamrul Hasan",
        role: "Owner, Hasan Electronics — Chattogram",
    },
    {
        quote: "Renewing used to mean a trip to the bank. Now it's two taps on bKash and a message confirming it's done.",
        name: "Shirin Sultana",
        role: "Owner, Sultana Fashion House — Sylhet",
    },
];

export default function Testimonials() {
    const rootRef = useRef(null);
    const quoteRef = useRef(null);
    const [active, setActive] = useState(0);

    useGSAP(
        () => {
            gsap.from(rootRef.current.querySelectorAll("[data-reveal]"), {
                opacity: 0,
                y: 20,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: { trigger: rootRef.current, start: "top 80%" },
            });
        },
        { scope: rootRef },
    );

    useGSAP(
        () => {
            if (!quoteRef.current) return;
            gsap.fromTo(
                quoteRef.current,
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
            );
        },
        { scope: rootRef, dependencies: [active], revertOnUpdate: true },
    );

    useEffect(() => {
        const id = setInterval(() => {
            setActive((i) => (i + 1) % QUOTES.length);
        }, 6000);
        return () => clearInterval(id);
    }, []);

    const current = QUOTES[active];

    return (
        <section ref={rootRef} className="bg-front-bg py-24 lg:py-32">
            <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
                <Quote
                    data-reveal
                    size={30}
                    className="mx-auto mb-8 text-front-accent"
                    aria-hidden="true"
                />

                <blockquote ref={quoteRef} className="min-h-[9rem]">
                    <p className="font-display text-2xl leading-snug font-medium text-front-ink sm:text-3xl">
                        &ldquo;{current.quote}&rdquo;
                    </p>
                    <footer className="mt-6 text-sm text-front-muted">
                        <span className="font-medium text-front-ink/85">{current.name}</span>
                        {" — "}
                        {current.role}
                    </footer>
                </blockquote>

                <div data-reveal className="mt-10 flex justify-center gap-2">
                    {QUOTES.map((q, i) => (
                        <button
                            key={q.name}
                            type="button"
                            onClick={() => setActive(i)}
                            className={`h-1.5 rounded-full transition-all ${
                                i === active ? "w-6 bg-front-accent" : "w-1.5 bg-front-line"
                            }`}
                            aria-label={`Show testimonial from ${q.name}`}
                            aria-current={i === active}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
