import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CheckCircle2 } from "lucide-react";

export default function StatusBanner({ message }) {
    const rootRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo(
            rootRef.current,
            { opacity: 0, y: -8, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.6)" },
        );
    }, []);

    return (
        <div
            ref={rootRef}
            role="status"
            className="flex items-start gap-3 rounded-lg border border-front-green/30 bg-front-green/10 px-4 py-3 text-sm font-medium text-front-green"
        >
            <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
            <span>{message}</span>
        </div>
    );
}
