import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Wifi, Languages, Smartphone, ShieldCheck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const POINTS = [
    { icon: Wifi, label: "Works offline at the till" },
    { icon: Languages, label: "Bangla and English, side by side" },
    { icon: Smartphone, label: "bKash renewal, no bank visit" },
    { icon: ShieldCheck, label: "Every branch, one ledger" },
];

export default function TrustBar() {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from("[data-point]", {
                opacity: 0,
                y: 12,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: rootRef.current,
                    start: "top 85%",
                },
            });
        },
        { scope: rootRef },
    );

    return (
        <section ref={rootRef} className="border-y border-front-line bg-front-bg">
            <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10">
                <p className="mb-6 text-center text-xs tracking-wide text-front-muted/80 lg:text-left">
                    Built for shop owners across Dhaka, Chattogram, and Sylhet
                </p>
                <div className="grid grid-cols-2 gap-y-6 gap-x-4 lg:grid-cols-4 lg:gap-8">
                    {POINTS.map(({ icon: Icon, label }) => (
                        <div
                            key={label}
                            data-point
                            className="flex items-center gap-3 text-front-ink/85"
                        >
                            <Icon size={17} className="shrink-0 text-front-accent" />
                            <span className="text-sm leading-snug">{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
