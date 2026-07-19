import { useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ChevronsLeft, X } from "lucide-react";

export default function Sidebar({
    navItems,
    brandLabel = "Dokan",
    homeHref = "/admin/dashboard",
    collapsed,
    setCollapsed,
    mobileOpen,
    setMobileOpen,
}) {
    const asideRef = useRef(null);
    const { url } = usePage();

    useGSAP(
        () => {
            gsap.to(asideRef.current, {
                width: collapsed ? 76 : 248,
                duration: 0.35,
                ease: "power3.out",
            });
            gsap.to("[data-nav-label]", {
                opacity: collapsed ? 0 : 1,
                duration: collapsed ? 0.12 : 0.28,
                delay: collapsed ? 0 : 0.1,
                ease: "power1.out",
            });
        },
        { scope: asideRef, dependencies: [collapsed] },
    );

    useGSAP(
        () => {
            const isDesktop = () => window.innerWidth >= 1024;

            gsap.set(asideRef.current, { xPercent: isDesktop() ? 0 : mobileOpen ? 0 : -100 });

            const onResize = () => {
                if (isDesktop()) {
                    gsap.set(asideRef.current, { xPercent: 0 });
                } else {
                    gsap.set(asideRef.current, { xPercent: mobileOpen ? 0 : -100 });
                }
            };

            window.addEventListener("resize", onResize);
            return () => window.removeEventListener("resize", onResize);
        },
        { scope: asideRef, dependencies: [] },
    );

    useGSAP(
        () => {
            if (window.innerWidth >= 1024) return;
            gsap.to(asideRef.current, {
                xPercent: mobileOpen ? 0 : -100,
                duration: 0.35,
                ease: "power3.out",
            });
        },
        { scope: asideRef, dependencies: [mobileOpen] },
    );

    const isCurrent = (href) => url === href || url.startsWith(`${href}/`);

    return (
        <>
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            <aside
                ref={asideRef}
                className="fixed inset-y-0 left-0 z-50 overflow-hidden border-r border-front-line bg-front-surface lg:sticky lg:top-0 lg:h-screen"
                style={{ width: 248 }}
            >
                <div className="flex h-full w-[248px] flex-col">
                    <div className="flex h-16 shrink-0 items-center justify-between px-4">
                        <Link href={homeHref} className="flex items-center gap-2 overflow-hidden">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-front-accent text-sm font-bold text-front-accent-ink">
                                D
                            </span>
                            <span
                                data-nav-label
                                className="font-display text-lg font-semibold whitespace-nowrap text-front-ink"
                            >
                                {brandLabel}
                            </span>
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileOpen(false)}
                            className="text-front-muted lg:hidden"
                            aria-label="Close menu"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                        {navItems.map((item) => {
                            const active = isCurrent(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                                        active
                                            ? "bg-front-accent/10 font-medium text-front-accent"
                                            : "text-front-muted hover:bg-front-bg hover:text-front-ink"
                                    }`}
                                >
                                    <item.icon size={17} className="shrink-0" />
                                    <span data-nav-label className="whitespace-nowrap">
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="shrink-0 border-t border-front-line p-3">
                        <button
                            type="button"
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-front-muted hover:bg-front-bg hover:text-front-ink lg:flex"
                        >
                            <ChevronsLeft
                                size={17}
                                className={`shrink-0 transition-transform ${collapsed ? "rotate-180" : ""}`}
                            />
                            <span data-nav-label className="whitespace-nowrap">
                                Collapse
                            </span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
