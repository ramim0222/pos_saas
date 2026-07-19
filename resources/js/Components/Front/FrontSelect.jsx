import { forwardRef, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";

const FrontSelect = forwardRef(function FrontSelect(
    { className = "", children, ...props },
    forwardedRef,
) {
    const wrapRef = useRef(null);

    useGSAP(
        () => {
            const underline = wrapRef.current?.querySelector("[data-underline]");
            if (!underline) return;
            gsap.set(underline, { scaleX: 0 });
        },
        { scope: wrapRef },
    );

    const onFocus = (e) => {
        gsap.to(wrapRef.current.querySelector("[data-underline]"), {
            scaleX: 1,
            duration: 0.35,
            ease: "power2.out",
        });
        props.onFocus?.(e);
    };

    const onBlur = (e) => {
        gsap.to(wrapRef.current.querySelector("[data-underline]"), {
            scaleX: 0,
            duration: 0.3,
            ease: "power2.in",
        });
        props.onBlur?.(e);
    };

    return (
        <div ref={wrapRef} className="relative">
            <select
                {...props}
                ref={forwardedRef}
                onFocus={onFocus}
                onBlur={onBlur}
                className={`w-full appearance-none border-0 border-b border-front-line bg-transparent px-0 py-2.5 pr-7 text-sm text-front-ink outline-none focus:ring-0 ${className}`}
            >
                {children}
            </select>
            <ChevronDown
                size={15}
                className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 text-front-muted"
                aria-hidden="true"
            />
            <span
                data-underline
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-front-accent"
                aria-hidden="true"
            />
        </div>
    );
});

export default FrontSelect;
