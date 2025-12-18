import MainLayout from "@/components/MainLayout";
import { contactUsApiPath } from "@/constants/apiPaths";
import { seoData } from "@/constants/seoData";
import { createOrUpdate } from "@/utils/fetchUtils";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { Fragment, useState } from "react";
import { FaCheckCircle, FaEnvelope, FaExclamationTriangle, FaHeadset, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { LuLoader, LuLoaderCircle } from "react-icons/lu";

export default function ContactUsPage() {

    const [formMessages, setFormMessages] = useState({
        status: null,
        message: null
    });


    const postContactUs = async (payload = {}) => {

        if (Object.values(payload).length === 0) return;

        const res = await createOrUpdate(payload, "POST", contactUsApiPath);

        if (res?.status >= 400 && res?.status < 500) {
            const resData = await res?.json();
            setFormMessages(prev => ({
                ...prev,
                status: "err4xx",
                message: resData?.message || "Unable to send your message."
            }));

            return false;
        }

        if (res?.status >= 500) {
            setFormMessages(prev => ({
                ...prev,
                status: "err5xx",
                message: "We're experiencing technical issues. Please try again later."
            }));

            return false;
        }

        if (res?.status === 200 || res?.status === 201) {
            return true;
        }
    }


    const handleFormSubmit = async (event) => {

        event.preventDefault();

        const formData = new FormData(event.target);

        const payload = {
            ...Object.fromEntries(formData.entries()),
            name: `${formData.get("first_name")} ${formData.get("last_name")}`
        };

        setFormMessages(prev => ({
            ...prev,
            status: "loading",
            message: null
        }));

        const result = await postContactUs(payload);

        if (result) {
            event.target.reset();
            setFormMessages(prev => ({
                ...prev,
                status: "ok",
                message: "Thank you for contacting us. We'll reach out shortly."
            }));

            setTimeout(() => {
                setFormMessages(prev => ({
                    ...prev,
                    status: null,
                    message: null
                }));
            }, 3000);
        }
    }


    const handleFormChange = () => {
        const hasValue = Object.values(formMessages).some(val => val);

        if (hasValue) {
            setFormMessages({
                status: null,
                message: null
            });
        }
    }

    return (
        <Fragment>
            <NextSeo {...seoData.contactUsPage} />
            <MainLayout>
                <section className="relative py-24 md:py-40 overflow-hidden">
                    <div className="container mx-auto px-4 md:px-8 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                            <div className="space-y-8 flex flex-col">

                                <div className="mx-auto px-4 md:px-8 relative z-10">
                                    <div className="text-center max-w-3xl mx-auto">
                                        <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-white/10 mb-6">
                                            <p className="text-sm font-medium flex items-center justify-center">
                                                <FaHeadset className="text-primary mr-2" />
                                                Get In Touch
                                            </p>
                                        </div>

                                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                                            Let's Build the <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Future</span> Together
                                        </h1>

                                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                                            Have questions about Agentzee AI? Want to see a personalized demo? Our team is here to help you transform your customer experience.
                                        </p>
                                    </div>
                                </div>


                                <div id="contact-info" className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-3xl p-8">
                                    <h3 className="text-2xl font-bold mb-6">Get in touch</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-start">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center flex-shrink-0">
                                                <FaEnvelope className="text-white" />
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="font-medium">Email us</h4>
                                                <Link
                                                    href={"mailto:contact@agentzee.ai"}
                                                    className="text-gray-400 hover:underline"
                                                >
                                                    contact@agentzee.ai
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center flex-shrink-0">
                                                <FaPhone className="text-white" />
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="font-medium">Call us</h4>
                                                <Link
                                                    href={"tel:+919095958663"}
                                                    className="text-gray-400 hover:underline"
                                                >
                                                    +91 9095958663
                                                </Link>
                                                <p className="text-gray-400">Mon-Fri 9AM-6PM</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center flex-shrink-0">
                                                <FaMapMarkerAlt className="text-white" />
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="font-medium">Visit us</h4>
                                                <Link
                                                    href={'https://episyche.com/'}
                                                    target="_blank"
                                                    rel="noopener"
                                                    className="text-gray-400 hover:underline"
                                                >
                                                    Episyche Technologies
                                                </Link>
                                                <p className="text-gray-400">Coimbatore-641045, India</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="form-container" className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-3xl p-8 md:p-12">
                                <h2 className="text-3xl font-bold mb-8">Send us a message</h2>

                                <form
                                    onChange={handleFormChange}
                                    onSubmit={handleFormSubmit}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="first_name" className="block text-sm font-medium mb-2">First Name</label>
                                            <input
                                                type="text"
                                                className="w-full bg-dark-card-primary border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none transition-colors"
                                                placeholder="John"
                                                id="first_name"
                                                name="first_name"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="last_name" className="block text-sm font-medium mb-2">Last Name</label>
                                            <input
                                                type="text"
                                                className="w-full bg-dark-card-primary border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none transition-colors"
                                                placeholder="Doe"
                                                id="last_name"
                                                name="last_name"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            className="w-full bg-dark-card-primary border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none transition-colors"
                                            placeholder="john@company.com"
                                            id="email"
                                            name="email"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="company" className="block text-sm font-medium mb-2">Company</label>
                                        <input
                                            type="text"
                                            className="w-full bg-dark-card-primary border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none transition-colors"
                                            placeholder="Your Company"
                                            id="company"
                                            name="company"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                                        <input
                                            type="text"
                                            className="w-full bg-dark-card-primary border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none transition-colors"
                                            placeholder="Subject"
                                            id="subject"
                                            name="subject"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Message</label>
                                        <textarea
                                            rows="5"
                                            className="w-full bg-dark-card-primary border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none transition-colors"
                                            placeholder="Tell us about your project and how we can help..."
                                            id="message"
                                            name="message"
                                        ></textarea>
                                    </div>

                                    <div className="flex items-start">
                                        <input
                                            type="checkbox"
                                            className="mt-1 mr-3 accent-primary"
                                            id="agree_terms"
                                            name="agree_terms"
                                        />
                                        <label htmlFor="agree_terms" className="text-sm text-gray-400">I agree to receive communications from Agentzee AI and understand that I can unsubscribe at any time.</label>
                                    </div>

                                    {(formMessages?.status === "err4xx" || formMessages?.status === "err5xx" || formMessages?.status === "ok") && (
                                        <div className="flex items-center gap-2 w-full text-sm font-[500]">
                                            {formMessages?.status === "err4xx" && (
                                                <Fragment>
                                                    <FaCircleXmark className="text-red-400" />
                                                    <p className="text-red-400">
                                                        {formMessages?.message}
                                                    </p>
                                                </Fragment>
                                            )}

                                            {formMessages?.status === "err5xx" && (
                                                <Fragment>
                                                    <FaExclamationTriangle className="text-orange-400" />
                                                    <p className="text-orange-400">
                                                        {formMessages?.message}
                                                    </p>
                                                </Fragment>
                                            )}

                                            {formMessages?.status === "ok" && (
                                                <Fragment>
                                                    <FaCheckCircle className="text-green-400" />
                                                    <p className="text-green-400">
                                                        {formMessages?.message}
                                                    </p>
                                                </Fragment>
                                            )}
                                        </div>
                                    )}

                                    <button
                                        disabled={Object.values(formMessages).some(val => val)}
                                        type="submit"
                                        className="w-full flex items-center justify-center bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity px-8 py-3 rounded-full text-white font-medium disabled:cursor-not-allowed"
                                    >
                                        {formMessages?.status === "loading" ? (
                                            <Fragment>
                                                <LuLoaderCircle className="text-white font-[500] mr-2 animate-spin" />
                                                <span className="text-white font-[500]">Submitting...</span>
                                            </Fragment>
                                        ) : (

                                            "Send Message"
                                        )}
                                    </button>
                                </form>
                            </div>



                        </div>
                    </div>
                </section>
            </MainLayout>
        </Fragment>
    )
}
