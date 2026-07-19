import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function initials(name) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

const TEAM = [
    { name: "Rumana Chowdhury", role: "Co-founder & CEO" },
    { name: "Farhan Islam", role: "Co-founder & CTO" },
    { name: "Proma Sarker", role: "Head of Support" },
    { name: "Ishtiaque Rahman", role: "Head of Product" },
];

export default function TeamSection() {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from("[data-team-member]", {
                opacity: 0,
                y: 16,
                duration: 0.55,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: { trigger: rootRef.current, start: "top 80%" },
            });
        },
        { scope: rootRef },
    );

    return (
        <section ref={rootRef} className="border-t border-front-line bg-front-bg py-24 lg:py-32">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                <div className="mb-14 max-w-2xl">
                    <p className="mb-4 text-xs font-medium tracking-[0.2em] text-front-accent uppercase">
                        Who's behind it
                    </p>
                    <h2 className="font-display text-4xl font-semibold tracking-tight text-front-ink lg:text-5xl">
                        A small team that's stood behind a counter.
                    </h2>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
                    {TEAM.map((person) => (
                        <div key={person.name} data-team-member>
                            <div
                                className="flex h-16 w-16 items-center justify-center rounded-full bg-front-surface-2 font-display text-lg font-medium text-front-accent"
                                aria-hidden="true"
                            >
                                {initials(person.name)}
                            </div>
                            <p className="mt-4 font-display text-lg font-medium text-front-ink">
                                {person.name}
                            </p>
                            <p className="text-sm text-front-muted">{person.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
