import { useRef, useState } from "react";
import { Link } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, X } from "lucide-react";

import { FrontButton } from "@/Components/Front/Button";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
    { label: "Features", href: "/features", page: true },
    { label: "Pricing", href: "/pricing", page: true },
    { label: "About", href: "/about", page: true },
    { label: "Contact", href: "/contact", page: true },
];

export default function Navbar({ canLogin, canRegister }) {
    const navRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useGSAP(
        () => {
            const bar = navRef.current;
            if (!bar) return;

            gsap.from(bar.querySelectorAll("[data-nav-item]"), {
                y: -16,
                opacity: 0,
                duration: 0.7,
                ease: "power3.out",
                stagger: 0.06,
                delay: 0.15,
            });

            const trigger = ScrollTrigger.create({
                start: 4,
                end: 99999,
                onUpdate: (self) => {
                    gsap.to(bar, {
                        backgroundColor: self.progress > 0 || self.scroll() > 4
                            ? "oklch(0.19 0.014 75 / 0.82)"
                            : "oklch(0.19 0.014 75 / 0)",
                        backdropFilter: self.scroll() > 4 ? "blur(14px)" : "blur(0px)",
                        borderColor: self.scroll() > 4 ? "var(--color-front-line)" : "transparent",
                        duration: 0.35,
                        overwrite: "auto",
                    });
                },
            });

            return () => trigger.kill();
        },
        { scope: navRef },
    );

    return (
        <header
            ref={navRef}
            className="fixed inset-x-0 top-0 z-50 border-b border-transparent font-sans"
        >
            <div className="mx-auto flex h-18 max-w-[1400px] items-center justify-between px-6 lg:px-10">
                <Link
                    href="/"
                    data-nav-item
                    className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-front-ink"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-front-accent text-sm font-bold text-front-accent-ink">
                        D
                    </span>
                    Dokan
                </Link>

                <nav className="hidden items-center gap-8 lg:flex">
                    {NAV_LINKS.map((link) =>
                        link.page ? (
                            <Link
                                key={link.href}
                                href={link.href}
                                data-nav-item
                                className="text-sm text-front-muted transition-colors hover:text-front-ink"
                            >
                                {link.label}
                            </Link>
                        ) : (
                            <a
                                key={link.href}
                                href={link.href}
                                data-nav-item
                                className="text-sm text-front-muted transition-colors hover:text-front-ink"
                            >
                                {link.label}
                            </a>
                        ),
                    )}
                </nav>

                <div className="hidden items-center gap-3 lg:flex" data-nav-item>
                    {canLogin && (
                        <Link
                            href={route("login")}
                            className="text-sm font-medium text-front-ink/80 transition-colors hover:text-front-ink"
                        >
                            Log in
                        </Link>
                    )}
                    {canRegister && (
                        <FrontButton size="sm" render={<Link href={route("register")} />}>
                            Start free trial
                        </FrontButton>
                    )}
                </div>

                <button
                    type="button"
                    data-nav-item
                    onClick={() => setMenuOpen((v) => !v)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-front-line text-front-ink lg:hidden"
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
            </div>

            {menuOpen && (
                <div className="border-t border-front-line bg-front-bg px-6 py-6 lg:hidden">
                    <nav className="flex flex-col gap-5">
                        {NAV_LINKS.map((link) =>
                            link.page ? (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="text-base text-front-ink/90"
                                >
                                    {link.label}
                                </Link>
                            ) : (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="text-base text-front-ink/90"
                                >
                                    {link.label}
                                </a>
                            ),
                        )}
                    </nav>
                    <div className="mt-6 flex flex-col gap-3">
                        {canLogin && (
                            <Link
                                href={route("login")}
                                className="text-center text-sm font-medium text-front-ink/80"
                            >
                                Log in
                            </Link>
                        )}
                        {canRegister && (
                            <FrontButton
                                magnetic={false}
                                render={<Link href={route("register")} />}
                            >
                                Start free trial
                            </FrontButton>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
