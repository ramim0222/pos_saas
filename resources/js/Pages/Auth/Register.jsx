import { Head, Link, useForm } from "@inertiajs/react";
import { Loader2 } from "lucide-react";

import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import AuthCheckbox from "@/Components/Auth/AuthCheckbox";
import TrustStrip from "@/Components/Auth/TrustStrip";
import FrontTextInput from "@/Components/Front/FrontTextInput";
import { FrontButton } from "@/Components/Front/Button";
import AuthLayout from "@/Layouts/AuthLayout";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        store_name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
        terms: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <AuthLayout
            panelEyebrow="Dokan"
            panelTitle="Open your store in an afternoon."
            panelIntro="Set up inventory, invite your team, and start selling — no long onboarding, no sales call required."
        >
            <Head title="Create your store" />

            <div data-auth-item>
                <h1 className="font-display text-3xl font-semibold tracking-tight text-front-ink">
                    Create your store.
                </h1>
                <p className="mt-2 text-sm text-front-muted">
                    Start free — you can invite your team once you're in.
                </p>
            </div>

            <div data-auth-item className="mt-5">
                <TrustStrip />
            </div>

            <form onSubmit={submit} noValidate className="mt-7 space-y-5">
                <div data-auth-item className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <InputLabel
                            htmlFor="name"
                            value="Full name"
                            className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase"
                        />
                        <FrontTextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-2"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2 !text-red-400" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="store_name"
                            value="Store name"
                            className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase"
                        />
                        <FrontTextInput
                            id="store_name"
                            name="store_name"
                            value={data.store_name}
                            className="mt-2"
                            autoComplete="organization"
                            onChange={(e) => setData("store_name", e.target.value)}
                            required
                        />
                        <InputError message={errors.store_name} className="mt-2 !text-red-400" />
                    </div>
                </div>

                <div data-auth-item className="grid gap-5 sm:grid-cols-2">
                    <div>
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
                            onChange={(e) => setData("email", e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2 !text-red-400" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="phone"
                            value="Phone number"
                            className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase"
                        />
                        <FrontTextInput
                            id="phone"
                            type="tel"
                            name="phone"
                            value={data.phone}
                            className="mt-2"
                            autoComplete="tel"
                            placeholder="01XXX-XXXXXX"
                            onChange={(e) => setData("phone", e.target.value)}
                            required
                        />
                        <InputError message={errors.phone} className="mt-2 !text-red-400" />
                    </div>
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
                        autoComplete="new-password"
                        onChange={(e) => setData("password", e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2 !text-red-400" />
                </div>

                <div data-auth-item>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm password"
                        className="!text-xs !font-medium !tracking-wide !text-front-muted uppercase"
                    />
                    <FrontTextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-2"
                        autoComplete="new-password"
                        onChange={(e) => setData("password_confirmation", e.target.value)}
                        required
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2 !text-red-400"
                    />
                </div>

                <div data-auth-item>
                    <label className="flex items-start gap-2.5">
                        <AuthCheckbox
                            name="terms"
                            checked={data.terms}
                            onChange={(e) => setData("terms", e.target.checked)}
                            className="mt-0.5"
                            required
                        />
                        <span className="text-sm text-front-muted">
                            I agree to the{" "}
                            <Link
                                href="/terms"
                                className="font-medium text-front-accent hover:underline"
                            >
                                Terms of Service
                            </Link>
                        </span>
                    </label>
                    <InputError message={errors.terms} className="mt-2 !text-red-400" />
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
                            Creating your store
                        </>
                    ) : (
                        "Create my store"
                    )}
                </FrontButton>
            </form>

            <p data-auth-item className="mt-8 text-sm text-front-muted">
                Already have a store?{" "}
                <Link
                    href={route("login")}
                    className="font-medium text-front-accent hover:underline"
                >
                    Sign in
                </Link>
            </p>
        </AuthLayout>
    );
}
