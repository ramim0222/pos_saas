import { Head, Link, useForm } from "@inertiajs/react";
import { Loader2 } from "lucide-react";

import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import AuthCheckbox from "@/Components/Auth/AuthCheckbox";
import StatusBanner from "@/Components/Auth/StatusBanner";
import FrontTextInput from "@/Components/Front/FrontTextInput";
import { FrontButton } from "@/Components/Front/Button";
import AuthLayout from "@/Layouts/AuthLayout";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <AuthLayout
            panelEyebrow="Dokan"
            panelTitle="Everything your shop needs, still open."
            panelIntro="Sign back in to pick up where you left off — sales, stock, and staff, all in one place."
        >
            <Head title="Log in" />

            <div data-auth-item>
                <h1 className="font-display text-3xl font-semibold tracking-tight text-front-ink">
                    Welcome back.
                </h1>
                <p className="mt-2 text-sm text-front-muted">
                    Sign in to your Dokan account.
                </p>
            </div>

            {status && (
                <div data-auth-item className="mt-6">
                    <StatusBanner message={status} />
                </div>
            )}

            <form onSubmit={submit} noValidate className="mt-8 space-y-6">
                <div data-auth-item>
                    <InputLabel
                        htmlFor="email"
                        value="Email"
                        className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase"
                    />
                    <FrontTextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2 !text-red-400" />
                </div>

                <div data-auth-item>
                    <InputLabel
                        htmlFor="password"
                        value="Password"
                        className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase"
                    />
                    <FrontTextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-2"
                        autoComplete="current-password"
                        onChange={(e) => setData("password", e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2 !text-red-400" />
                </div>

                <div data-auth-item className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                        <AuthCheckbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData("remember", e.target.checked)}
                        />
                        <span className="text-sm text-front-muted">Remember me</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="text-sm font-medium text-front-accent hover:underline"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <FrontButton
                    type="submit"
                    disabled={processing}
                    data-auth-item
                    className="w-full"
                >
                    {processing ? (
                        <>
                            <Loader2 size={15} className="animate-spin" />
                            Signing in
                        </>
                    ) : (
                        "Log in"
                    )}
                </FrontButton>
            </form>

            <p data-auth-item className="mt-8 text-sm text-front-muted">
                New here?{" "}
                <Link
                    href={route("register")}
                    className="font-medium text-front-accent hover:underline"
                >
                    Create your store
                </Link>
            </p>
        </AuthLayout>
    );
}
