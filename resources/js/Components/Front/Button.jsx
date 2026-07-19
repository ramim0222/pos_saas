import { forwardRef, useRef } from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva } from "class-variance-authority";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "front-btn group/btn relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border text-[0.8125rem] font-semibold tracking-wide uppercase transition-colors outline-none select-none focus-visible:ring-3 focus-visible:ring-front-accent/40 disabled:pointer-events-none disabled:opacity-40",
    {
        variants: {
            variant: {
                primary:
                    "border-transparent bg-front-accent text-front-accent-ink hover:bg-front-accent",
                ghost:
                    "border-front-line bg-transparent text-front-ink hover:border-front-accent/50",
                paper:
                    "border-transparent bg-front-paper text-front-bg hover:bg-front-paper",
            },
            size: {
                default: "h-12 px-6",
                sm: "h-10 px-5 text-xs",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "default",
        },
    },
);

const FrontButton = forwardRef(function FrontButton(
    { className, variant, size, children, magnetic = true, ...props },
    forwardedRef,
) {
    const localRef = useRef(null);

    useGSAP(
        () => {
            const el = localRef.current;
            if (!el || !magnetic) return;

            const strength = 0.35;

            const onMove = (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - (rect.left + rect.width / 2);
                const y = e.clientY - (rect.top + rect.height / 2);
                gsap.to(el, {
                    x: x * strength,
                    y: y * strength,
                    duration: 0.5,
                    ease: "power3.out",
                });
            };

            const onLeave = () => {
                gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
            };

            const onDown = () => gsap.to(el, { scale: 0.94, duration: 0.15, ease: "power2.out" });
            const onUp = () => gsap.to(el, { scale: 1, duration: 0.3, ease: "power2.out" });

            el.addEventListener("pointermove", onMove);
            el.addEventListener("pointerleave", onLeave);
            el.addEventListener("pointerdown", onDown);
            el.addEventListener("pointerup", onUp);

            return () => {
                el.removeEventListener("pointermove", onMove);
                el.removeEventListener("pointerleave", onLeave);
                el.removeEventListener("pointerdown", onDown);
                el.removeEventListener("pointerup", onUp);
            };
        },
        { scope: localRef, dependencies: [magnetic] },
    );

    return (
        <ButtonPrimitive
            ref={(node) => {
                localRef.current = node;
                if (typeof forwardedRef === "function") forwardedRef(node);
                else if (forwardedRef) forwardedRef.current = node;
            }}
            data-slot="front-button"
            nativeButton={!props.render}
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        >
            {children}
        </ButtonPrimitive>
    );
});

export { FrontButton, buttonVariants as frontButtonVariants };
