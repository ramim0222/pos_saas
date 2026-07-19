import { useRef } from "react";
import { Link } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";

import { FrontButton } from "@/Components/Front/Button";
import ReceiptVisual from "@/Components/Front/ReceiptVisual";

export default function Hero({ canRegister }) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.from("[data-eyebrow]", { opacity: 0, y: 14, duration: 0.6 })
                .from(
                    "[data-headline-word]",
                    { opacity: 0, y: 28, duration: 0.75, stagger: 0.08 },
                    "-=0.35",
                )
                .from("[data-sub]", { opacity: 0, y: 16, duration: 0.6 }, "-=0.4")
                .from(
                    "[data-cta] > *",
                    { opacity: 0, y: 14, duration: 0.5, stagger: 0.08 },
                    "-=0.3",
                );
        },
        { scope: rootRef },
    );

    const headline = "Run the shop.\nNot the spreadsheet.";

    return (
        <section
            ref={rootRef}
            className="relative overflow-hidden bg-front-bg pt-32 pb-24 lg:pt-44 lg:pb-32"
        >
            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24 opacity-[0.35]"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(to top, var(--color-front-line) 0 1px, transparent 1px 28px)",
                }}
                aria-hidden="true"
            />

            <div className="mx-auto grid max-w-[1400px] items-center gap-16 px-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:px-10">
                <div>
                    <p
                        data-eyebrow
                        className="mb-6 inline-flex items-center gap-2 rounded-full border border-front-line px-3.5 py-1.5 text-xs font-medium tracking-wide text-front-muted"
                    >
                        Inventory · POS · bKash billing — one counter
                    </p>

                    <h1 className="font-display text-[2.75rem] leading-[1.05] font-semibold tracking-tight text-front-ink sm:text-6xl lg:text-[4.2rem]">
                        {headline.split("\n").map((line) => (
                            <span key={line} className="block overflow-hidden">
                                <span data-headline-word className="inline-block">
                                    {line}
                                </span>
                            </span>
                        ))}
                    </h1>

                    <p
                        data-sub
                        className="mt-7 max-w-[34rem] text-lg leading-relaxed text-front-muted"
                    >
                        Dokan keeps stock, sales, and staff in sync across every branch —
                        and keeps ringing up sales even when the internet doesn&apos;t.
                        Renew your plan with bKash in two taps, no bank visit required.
                    </p>

                    <div data-cta className="mt-10 flex flex-wrap items-center gap-6">
                        {canRegister ? (
                            <FrontButton render={<Link href={route("register")} />}>
                                Start free trial
                            </FrontButton>
                        ) : (
                            <FrontButton render={<a href="#pricing" />}>
                                Start free trial
                            </FrontButton>
                        )}
                        <a
                            href="#pricing"
                            className="group inline-flex items-center gap-1.5 text-sm font-medium text-front-ink/85 transition-colors hover:text-front-accent"
                        >
                            See pricing
                            <ArrowRight
                                size={15}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </a>
                    </div>
                </div>

                <ReceiptVisual className="lg:justify-self-end" />
            </div>
        </section>
    );
}
