import { Head } from "@inertiajs/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "@/Components/Front/Navbar";
import PageHeader from "@/Components/Front/PageHeader";
import ContactForm from "@/Components/Front/ContactForm";
import ContactDetails from "@/Components/Front/ContactDetails";
import AltContactOptions from "@/Components/Front/AltContactOptions";
import ContactFAQMini from "@/Components/Front/ContactFAQMini";
import Footer from "@/Components/Front/Footer";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Contact({ canLogin, canRegister }) {
    return (
        <>
            <Head title="Contact — Dokan" />

            <div className="bg-front-bg font-sans">
                <Navbar canLogin={canLogin} canRegister={canRegister} />
                <main>
                    <PageHeader
                        eyebrow="Get in touch"
                        title="Let's talk."
                        intro="Questions about a plan, a demo for your team, or something's not working — tell us and we'll get back to you."
                    />

                    <section className="bg-front-bg pb-24 lg:pb-32">
                        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                            <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
                                <ContactForm />
                                <ContactDetails />
                            </div>
                        </div>
                    </section>

                    <AltContactOptions />
                    <ContactFAQMini />
                </main>
                <Footer />
            </div>
        </>
    );
}
