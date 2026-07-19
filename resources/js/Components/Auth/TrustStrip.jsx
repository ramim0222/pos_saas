import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Check } from "lucide-react";

const POINTS = ["14-day free trial", "No credit card required", "Cancel anytime"];

export default function TrustStrip() {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from(rootRef.current, {
                opacity: 0,
                duration: 0.5,
                ease: "power1.out",
                delay: 0.35,
            });
        },
        { scope: rootRef },
    );

    return (
        <div
            ref={rootRef}
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-front-muted"
        >
            {POINTS.map((point) => (
                <span key={point} className="flex items-center gap-1.5">
                    <Check size={13} className="text-front-accent" />
                    {point}
                </span>
            ))}
        </div>
    );
}
