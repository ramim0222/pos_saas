import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Mail, Phone, MessageCircle, MapPin, Clock } from "lucide-react";

const DETAILS = [
    {
        icon: Mail,
        label: "Email",
        value: "hello@dokan.app",
        href: "mailto:hello@dokan.app",
    },
    {
        icon: Phone,
        label: "Phone",
        value: "+880 9610-000000",
        href: "tel:+8809610000000",
    },
    {
        icon: MessageCircle,
        label: "WhatsApp",
        value: "+880 1XXX-XXXXXX",
        href: "https://wa.me/8801XXXXXXXXX",
    },
];

export default function ContactDetails() {
    const rootRef = useRef(null);

    useGSAP(
        () => {
            gsap.from("[data-detail-item]", {
                opacity: 0,
                y: 14,
                duration: 0.6,
                stagger: 0.09,
                ease: "power2.out",
                delay: 0.15,
            });
        },
        { scope: rootRef },
    );

    return (
        <div ref={rootRef} className="lg:pl-4">
            <div
                data-detail-item
                className="front-grain relative mb-10 h-40 overflow-hidden rounded-2xl border border-front-line bg-front-surface"
            >
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage:
                            "repeating-linear-gradient(0deg, var(--color-front-line) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, var(--color-front-line) 0 1px, transparent 1px 24px)",
                    }}
                    aria-hidden="true"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative flex flex-col items-center">
                        <MapPin
                            size={30}
                            className="fill-front-accent text-front-accent-ink"
                            strokeWidth={1.5}
                        />
                        <span className="mt-1 rounded-full border border-front-line bg-front-bg px-3 py-1 text-[0.65rem] tracking-wide text-front-muted uppercase">
                            Gulshan, Dhaka
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {DETAILS.map(({ icon: Icon, label, value, href }) => (
                    <a
                        key={label}
                        href={href}
                        data-detail-item
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noreferrer" : undefined}
                        className="group flex items-start gap-4"
                    >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-front-line text-front-accent transition-colors group-hover:border-front-accent">
                            <Icon size={16} />
                        </span>
                        <span>
                            <span className="block text-xs tracking-wide text-front-muted uppercase">
                                {label}
                            </span>
                            <span className="block text-sm font-medium text-front-ink/90">
                                {value}
                            </span>
                        </span>
                    </a>
                ))}

                <div data-detail-item className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-front-line text-front-accent">
                        <MapPin size={16} />
                    </span>
                    <span>
                        <span className="block text-xs tracking-wide text-front-muted uppercase">
                            Office
                        </span>
                        <span className="block text-sm font-medium text-front-ink/90">
                            House 14, Road 7, Gulshan 1
                            <br />
                            Dhaka 1212, Bangladesh
                        </span>
                    </span>
                </div>

                <div data-detail-item className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-front-line text-front-accent">
                        <Clock size={16} />
                    </span>
                    <span>
                        <span className="block text-xs tracking-wide text-front-muted uppercase">
                            Business hours
                        </span>
                        <span className="block text-sm font-medium text-front-ink/90">
                            Sun–Thu, 10am–7pm (Dhaka time)
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
}
