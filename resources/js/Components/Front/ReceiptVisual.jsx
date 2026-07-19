import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const LINE_ITEMS = [
    { name: "Rice, 5kg — Chinigura", qty: "x1", price: "৳ 620" },
    { name: "Cooking oil, 5L", qty: "x2", price: "৳ 1,780" },
    { name: "Dal, Moshur, 1kg", qty: "x3", price: "৳ 345" },
    { name: "Tea, Ispahani — 400g", qty: "x1", price: "৳ 210" },
];

export default function ReceiptVisual({ className = "" }) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            const tape = rootRef.current.querySelector("[data-tape]");
            const lines = rootRef.current.querySelectorAll("[data-line]");
            const stamp = rootRef.current.querySelector("[data-stamp]");

            const tl = gsap.timeline({ delay: 0.5 });

            tl.fromTo(
                tape,
                { scaleY: 0 },
                { scaleY: 1, duration: 1.1, ease: "power3.out", transformOrigin: "top center" },
            )
                .from(
                    lines,
                    {
                        opacity: 0,
                        y: 10,
                        duration: 0.45,
                        ease: "power2.out",
                        stagger: 0.12,
                    },
                    "-=0.5",
                )
                .fromTo(
                    stamp,
                    { opacity: 0, scale: 1.6, rotate: -26 },
                    { opacity: 1, scale: 1, rotate: -12, duration: 0.5, ease: "back.out(2.4)" },
                    "-=0.15",
                )
                .to(tape, {
                    rotate: -1.5,
                    duration: 4.5,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1,
                }, "+=0.2");
        },
        { scope: rootRef },
    );

    return (
        <div ref={rootRef} className={className}>
            <div className="relative mx-auto w-full max-w-sm rotate-[3deg]">
                <div className="mx-auto h-4 w-[88%] rounded-t-md bg-front-surface-2 shadow-[0_-2px_0_rgba(0,0,0,0.2)_inset]" />
                <div
                    data-tape
                    className="front-grain relative bg-front-paper px-6 pt-7 pb-10 text-front-bg shadow-[0_30px_60px_-25px_rgba(0,0,0,0.65)]"
                    style={{
                        clipPath:
                            "polygon(0% 0%,100% 0%,100% 96%,95% 100%,90% 96%,85% 100%,80% 96%,75% 100%,70% 96%,65% 100%,60% 96%,55% 100%,50% 96%,45% 100%,40% 96%,35% 100%,30% 96%,25% 100%,20% 96%,15% 100%,10% 96%,5% 100%,0% 96%)",
                    }}
                >
                    <div
                        data-stamp
                        className="pointer-events-none absolute top-24 right-5 rounded-sm border-[3px] border-front-green/80 px-2 py-1 text-[0.65rem] font-bold tracking-[0.2em] text-front-green/90"
                    >
                        APPROVED
                    </div>

                    <p data-line className="font-display text-sm font-semibold tracking-wide">
                        DOKAN — GULSHAN BRANCH
                    </p>
                    <p data-line className="mt-0.5 text-[0.7rem] tabular-figures text-front-bg/60">
                        19 Jul 2026, 4:12 PM · Till 02
                    </p>

                    <div className="mt-4 border-t border-dashed border-front-bg/25 pt-4">
                        {LINE_ITEMS.map((item) => (
                            <div
                                key={item.name}
                                data-line
                                className="mb-2 flex items-baseline justify-between gap-3 text-[0.72rem] leading-tight"
                            >
                                <span className="min-w-0 flex-1">
                                    {item.name}{" "}
                                    <span className="text-front-bg/50">{item.qty}</span>
                                </span>
                                <span className="tabular-figures shrink-0 font-medium">
                                    {item.price}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div
                        data-line
                        className="mt-4 flex items-baseline justify-between border-t border-front-bg/25 pt-3 font-display text-base font-semibold"
                    >
                        <span>Total</span>
                        <span className="tabular-figures">৳ 2,955</span>
                    </div>

                    <p data-line className="mt-2 text-[0.68rem] tabular-figures text-front-bg/55">
                        Paid via bKash · ***4471
                    </p>

                    <div
                        data-line
                        className="mt-6 h-8 w-full opacity-70"
                        style={{
                            backgroundImage:
                                "repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 5px, currentColor 5px 6px, transparent 6px 11px, currentColor 11px 14px, transparent 14px 17px)",
                            color: "var(--color-front-bg)",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
