import { Head, Link, useForm } from "@inertiajs/react";
import { Loader2 } from "lucide-react";

import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import StatusBanner from "@/Components/Auth/StatusBanner";
import FrontTextInput from "@/Components/Front/FrontTextInput";
import { FrontButton } from "@/Components/Front/Button";
import AuthLayout from "@/Layouts/AuthLayout";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("password.email"));
    };

    return (
        <AuthLayout
            panelEyebrow="Dokan"
            panelTitle="Locked out happens to everyone."
            panelIntro="A reset link only takes a minute — you'll be back at the till before the next customer walks in."
        >
            <Head title="Forgot password" />

            <div data-auth-item>
                <h1 className="font-display text-3xl font-semibold tracking-tight text-front-ink">
                    Reset your password.
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-front-muted">
                    Enter your email and we'll send you a link to choose a new
                    password.
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
                        required
                    />
                    <InputError message={errors.email} className="mt-2 !text-red-400" />
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
                            Sending link
                        </>
                    ) : (
                        "Email password reset link"
                    )}
                </FrontButton>
            </form>

            <p data-auth-item className="mt-8 text-sm text-front-muted">
                Remembered it after all?{" "}
                <Link
                    href={route("login")}
                    className="font-medium text-front-accent hover:underline"
                >
                    Back to sign in
                </Link>
            </p>
        </AuthLayout>
    );
}
