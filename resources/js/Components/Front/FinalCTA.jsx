import { useRef } from "react";
import { Link } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { FrontButton } from "@/Components/Front/Button";

gsap.registerPlugin(ScrollTrigger);

export default function FinalCTA({
    canRegister,
    title = "Your next sale can go through the register.",
    subtitle = "Start free. No card, no bank visit — just your shop, set up in an afternoon.",
    ctaLabel = "Start free trial",
    fallbackHref = "/#pricing",
}) {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from("[data-cta-reveal]", {
                opacity: 0,
                y: 24,
                duration: 0.7,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: { trigger: rootRef.current, start: "top 82%" },
            });
        },
        { scope: rootRef },
    );

    return (
        <section ref={rootRef} className="bg-front-paper py-24 lg:py-32">
            <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
                <h2
                    data-cta-reveal
                    className="font-display text-4xl font-semibold tracking-tight text-front-bg sm:text-5xl lg:text-6xl"
                >
                    {title}
                </h2>
                <p data-cta-reveal className="mx-auto mt-5 max-w-md text-base text-front-bg/70">
                    {subtitle}
                </p>
                <div data-cta-reveal className="mt-9">
                    {canRegister ? (
                        <FrontButton
                            variant="primary"
                            render={<Link href={route("register")} />}
                        >
                            {ctaLabel}
                        </FrontButton>
                    ) : (
                        <FrontButton variant="primary" render={<a href={fallbackHref} />}>
                            {ctaLabel}
                        </FrontButton>
                    )}
                </div>
            </div>
        </section>
    );
}
