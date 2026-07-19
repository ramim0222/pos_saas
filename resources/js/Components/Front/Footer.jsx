import { Link } from "@inertiajs/react";
import { Mail, MessageCircle, Phone } from "lucide-react";

const PRODUCT_LINKS = [
    { label: "Features", href: "/features", page: true },
    { label: "Pricing", href: "/pricing", page: true },
    { label: "How it works", href: "/#how-it-works" },
    { label: "FAQ", href: "/#faq" },
];

const LEGAL_LINKS = [
    { label: "Privacy policy", href: "/privacy" },
    { label: "Terms of service", href: "/terms" },
];

export default function Footer() {
    return (
        <footer className="border-t border-front-line bg-front-bg">
            <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
                <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr]">
                    <div>
                        <Link
                            href="/"
                            className="flex items-center gap-2 font-display text-xl font-semibold text-front-ink"
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-front-accent text-sm font-bold text-front-accent-ink">
                                D
                            </span>
                            Dokan
                        </Link>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-front-muted">
                            Store management and POS for shop owners across Bangladesh —
                            inventory, sales, and billing, one counter.
                        </p>
                        <div className="mt-6 flex gap-4">
                            <a
                                href="mailto:hello@dokan.app"
                                aria-label="Email Dokan support"
                                className="text-front-muted transition-colors hover:text-front-accent"
                            >
                                <Mail size={18} />
                            </a>
                            <a
                                href="tel:+8809610000000"
                                aria-label="Call Dokan support"
                                className="text-front-muted transition-colors hover:text-front-accent"
                            >
                                <Phone size={18} />
                            </a>
                            <a
                                href="#"
                                aria-label="Chat with Dokan support"
                                className="text-front-muted transition-colors hover:text-front-accent"
                            >
                                <MessageCircle size={18} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <p className="mb-4 text-xs font-medium tracking-wide text-front-ink/70 uppercase">
                            Product
                        </p>
                        <ul className="space-y-3">
                            {PRODUCT_LINKS.map((link) => (
                                <li key={link.href}>
                                    {link.page ? (
                                        <Link
                                            href={link.href}
                                            className="text-sm text-front-muted transition-colors hover:text-front-ink"
                                        >
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <a
                                            href={link.href}
                                            className="text-sm text-front-muted transition-colors hover:text-front-ink"
                                        >
                                            {link.label}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <p className="mb-4 text-xs font-medium tracking-wide text-front-ink/70 uppercase">
                            Legal
                        </p>
                        <ul className="space-y-3">
                            {LEGAL_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-front-muted transition-colors hover:text-front-ink"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-16 flex flex-col gap-4 border-t border-front-line pt-8 text-xs text-front-muted sm:flex-row sm:items-center sm:justify-between">
                    <p>© {new Date().getFullYear()} Dokan. All rights reserved.</p>
                    <p>Made for shop owners, by people who&apos;ve stood at the till.</p>
                </div>
            </div>
        </footer>
    );
}
