import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-background pt-6 sm:justify-center sm:pt-0 font-[family-name:var(--font-sans)]">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-primary hover:text-accent transition-colors" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden glass-card px-6 py-4 shadow-lg sm:max-w-md sm:rounded-lg border border-border">
                <div className="font-[family-name:var(--font-heading)] text-foreground">
                    {children}
                </div>
            </div>
        </div>
    );
}
