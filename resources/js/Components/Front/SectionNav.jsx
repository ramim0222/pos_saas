import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SectionNav({ sections }) {
    const rootRef = useRef(null);
    const [active, setActive] = useState(sections[0]?.id);

    useGSAP(
        () => {
            const first = document.getElementById(sections[0].id);
            const last = document.getElementById(sections[sections.length - 1].id);
            if (!first || !last) return;

            const triggers = sections.map((section) => {
                const el = document.getElementById(section.id);
                if (!el) return null;
                return ScrollTrigger.create({
                    trigger: el,
                    start: "top center",
                    end: "bottom center",
                    onToggle: (self) => {
                        if (self.isActive) setActive(section.id);
                    },
                });
            });

            const fillTrigger = ScrollTrigger.create({
                trigger: first,
                start: "top center",
                endTrigger: last,
                end: "bottom center",
                onUpdate: (self) => {
                    gsap.to("[data-nav-fill]", {
                        scaleY: self.progress,
                        overwrite: "auto",
                        duration: 0.1,
                    });
                },
            });

            return () => {
                triggers.forEach((t) => t?.kill());
                fillTrigger.kill();
            };
        },
        { scope: rootRef, dependencies: [sections] },
    );

    return (
        <nav
            ref={rootRef}
            aria-label="Feature sections"
            className="sticky top-32 hidden w-52 shrink-0 self-start xl:block"
        >
            <div className="relative pl-5">
                <div className="absolute top-1 bottom-1 left-0 w-px bg-front-line">
                    <div
                        data-nav-fill
                        className="h-full w-px origin-top scale-y-0 bg-front-accent"
                    />
                </div>
                <ul className="space-y-4">
                    {sections.map((section) => (
                        <li key={section.id}>
                            <a
                                href={`#${section.id}`}
                                className={`block text-sm transition-colors ${
                                    active === section.id
                                        ? "font-medium text-front-ink"
                                        : "text-front-muted hover:text-front-ink/80"
                                }`}
                                aria-current={active === section.id ? "true" : undefined}
                            >
                                {section.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
