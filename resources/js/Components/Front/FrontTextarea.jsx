import { forwardRef, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const FrontTextarea = forwardRef(function FrontTextarea(
    { className = "", ...props },
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
            <textarea
                {...props}
                ref={forwardedRef}
                onFocus={onFocus}
                onBlur={onBlur}
                className={`w-full resize-none border-0 border-b border-front-line bg-transparent px-0 py-2.5 text-sm text-front-ink outline-none placeholder:text-front-muted focus:ring-0 ${className}`}
            />
            <span
                data-underline
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-front-accent"
                aria-hidden="true"
            />
        </div>
    );
});

export default FrontTextarea;
