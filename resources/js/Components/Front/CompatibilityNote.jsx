import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WifiOff, Printer, Smartphone, Globe } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const NOTES = [
    {
        icon: WifiOff,
        title: "Offline-first at the till",
        copy: "Sales keep going through a dropped connection. Everything syncs back once you're online — nothing is lost in between.",
    },
    {
        icon: Printer,
        title: "Standard receipt printers",
        copy: "Works with common 58mm and 80mm thermal receipt printers over USB or network — no proprietary hardware required.",
    },
    {
        icon: Smartphone,
        title: "Any device at the counter",
        copy: "Runs in the browser on a phone, tablet, or an old desktop behind the counter — no dedicated POS terminal needed.",
    },
    {
        icon: Globe,
        title: "Bangla and English",
        copy: "Switch the interface language per staff member, so cashiers and owners can each work the way they're comfortable.",
    },
];

export default function CompatibilityNote() {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from("[data-note]", {
                opacity: 0,
                y: 16,
                duration: 0.55,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: { trigger: rootRef.current, start: "top 82%" },
            });
        },
        { scope: rootRef },
    );

    return (
        <section ref={rootRef} className="border-t border-front-line bg-front-surface/40 py-20 lg:py-28">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                <p className="mb-10 text-xs font-medium tracking-[0.2em] text-front-accent uppercase">
                    Built for the counter, not the cloud demo
                </p>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {NOTES.map(({ icon: Icon, title, copy }) => (
                        <div key={title} data-note>
                            <Icon size={20} className="mb-4 text-front-accent" />
                            <h3 className="font-display text-lg font-medium text-front-ink">
                                {title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-front-muted">
                                {copy}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
