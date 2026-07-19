import { useRef } from "react";
import { Link } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import BrandPanel from "@/Components/Auth/BrandPanel";

export default function AuthLayout({
    children,
    panelEyebrow,
    panelTitle,
    panelIntro,
}) {
    const formColRef = useRef(null);

    useGSAP(
        () => {
            gsap.from("[data-auth-item]", {
                opacity: 0,
                y: 14,
                duration: 0.6,
                stagger: 0.07,
                ease: "power2.out",
            });
        },
        { scope: formColRef },
    );

    return (
        <div className="flex min-h-screen bg-front-bg font-sans">
            <div
                ref={formColRef}
                className="flex w-full flex-col justify-center px-6 py-12 sm:px-10 lg:w-[46%] lg:px-16 xl:px-20"
            >
                <Link
                    href="/"
                    data-auth-item
                    className="mb-10 inline-flex w-fit items-center gap-2 font-display text-xl font-semibold text-front-ink"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-front-accent text-sm font-bold text-front-accent-ink">
                        D
                    </span>
                    Dokan
                </Link>

                <div className="w-full max-w-sm">{children}</div>
            </div>

            <div className="relative hidden flex-1 lg:block">
                <BrandPanel eyebrow={panelEyebrow} title={panelTitle} intro={panelIntro} />
            </div>
        </div>
    );
}
