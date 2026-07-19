import { Link, usePage } from "@inertiajs/react";
import { Bell, ChevronDown, LogOut, Menu, User } from "lucide-react";

import Dropdown from "@/Components/Dropdown";

export default function Topbar({
    setMobileOpen,
    title = "Overview",
    subtitle,
}) {
    const user = usePage().props.auth?.user;
    const name = user?.name ?? "Admin";
    const initials = name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-front-line bg-front-bg/90 px-4 backdrop-blur sm:px-6">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    className="text-front-muted lg:hidden"
                    aria-label="Open menu"
                >
                    <Menu size={20} />
                </button>
                <div>
                    <p className="font-display text-base font-medium text-front-ink">
                        {title}
                    </p>
                    {subtitle && (
                        <p className="hidden text-xs text-front-muted sm:block">{subtitle}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    type="button"
                    className="relative text-front-muted transition-colors hover:text-front-ink"
                    aria-label="Notifications"
                >
                    <Bell size={19} />
                    <span
                        className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-front-accent"
                        aria-hidden="true"
                    />
                </button>

                <Dropdown>
                    <Dropdown.Trigger>
                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-full py-1 pr-1 pl-1 text-sm text-front-ink hover:bg-front-surface"
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-front-surface-2 text-xs font-medium text-front-accent">
                                {initials}
                            </span>
                            <span className="hidden font-medium sm:block">{name}</span>
                            <ChevronDown size={14} className="hidden text-front-muted sm:block" />
                        </button>
                    </Dropdown.Trigger>
                    <Dropdown.Content
                        align="right"
                        contentClasses="bg-front-surface border border-front-line py-1"
                    >
                        <Dropdown.Link
                            href={route("profile.edit")}
                            className="!flex !items-center !gap-2 !text-front-muted hover:!bg-front-bg hover:!text-front-ink"
                        >
                            <User size={14} />
                            Profile
                        </Dropdown.Link>
                        <Dropdown.Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className="!flex !w-full !items-center !gap-2 !text-front-muted hover:!bg-front-bg hover:!text-front-ink"
                        >
                            <LogOut size={14} />
                            Log out
                        </Dropdown.Link>
                    </Dropdown.Content>
                </Dropdown>
            </div>
        </header>
    );
}
