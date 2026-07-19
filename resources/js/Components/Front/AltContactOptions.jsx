import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessageCircle } from "lucide-react";

import { FrontButton } from "@/Components/Front/Button";

gsap.registerPlugin(ScrollTrigger);

export default function AltContactOptions() {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from(rootRef.current, {
                opacity: 0,
                y: 16,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: { trigger: rootRef.current, start: "top 85%" },
            });
        },
        { scope: rootRef },
    );

    return (
        <section className="border-t border-front-line bg-front-bg py-16 lg:py-20">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                <div
                    ref={rootRef}
                    className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-front-line bg-front-surface p-8 sm:flex-row sm:items-center"
                >
                    <div className="flex items-start gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-front-accent/15 text-front-accent">
                            <MessageCircle size={18} />
                        </span>
                        <div>
                            <p className="font-display text-xl font-medium text-front-ink">
                                Prefer WhatsApp?
                            </p>
                            <p className="mt-1 text-sm text-front-muted">
                                Message us directly — we're usually quick to reply during
                                business hours.
                            </p>
                        </div>
                    </div>
                    <FrontButton
                        render={
                            <a
                                href="https://wa.me/8801XXXXXXXXX"
                                target="_blank"
                                rel="noreferrer"
                            />
                        }
                    >
                        Chat on WhatsApp
                    </FrontButton>
                </div>
            </div>
        </section>
    );
}
