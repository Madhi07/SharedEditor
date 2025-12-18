import HeroSection from "@/components/LandingPage/HeroSection";
import MainLayout from "@/components/MainLayout";
import { AgentZeeHead } from "@/components/SVG";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { FaCheckCircle, FaExclamationTriangle, FaRocket } from "react-icons/fa";
import { MdHome } from "react-icons/md";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { useIpContext } from "@/context/useIpContext";
import { createOrUpdate } from "@/utils/fetchUtils";
import { leadCollectorApiPath } from "@/constants/apiPaths";
import { FaCircleXmark } from "react-icons/fa6";
import { LuLoaderCircle } from "react-icons/lu";
import WelcomeAvatar from "@/components/Modals/WelcomeAvatar";


const aiAgentPlaceholders = [
    "I need an AI agent to automate my social media handling (content posting, reels, and trend analysis).",
    "We are looking for AI agents to manage customer support across WhatsApp and website chat.",
    "I want to use AI agents for automated software testing and continuous integration.",
    "Our sales team needs AI agents to summarize client calls and track follow-ups.",
    "We want analytics agents to generate dashboards and insights without manual reporting.",
    "I need an AI assistant for onboarding new employees and answering HR FAQs.",
    "Looking for AI agents to improve marketing campaigns with automated content generation.",
    "I want to deploy AI agents for finance — invoice follow-ups and expense tracking."
];



export default function TNGSSPage() {

    const { ipConfigData } = useIpContext();
    const [index, setIndex] = useState(0);
    const [text, setText] = useState("");

    const [phoneNumber, setPhoneNumber] = useState();

    const [formMessages, setFormMessage] = useState({
        status: null,
        message: null
    });

    const [tryNowAvatar, setTryNowAvatar] = useState(false);

    // const []

    useEffect(() => {
        let timeout;
        const current = aiAgentPlaceholders[index];
        let i = 0;

        function typeWriter() {
            if (i <= current.length) {
                setText(current.slice(0, i));
                i++;
                timeout = setTimeout(typeWriter, 50); // typing speed
            } else {
                timeout = setTimeout(() => {
                    i = 0;
                    setIndex((prev) => (prev + 1) % aiAgentPlaceholders.length);
                }, 2000); // wait 2s before next
            }
        }

        typeWriter();

        return () => clearTimeout(timeout);
    }, [index]);


    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        const payload = {
            ...Object.fromEntries(formData.entries()),
            phone: phoneNumber,
            status: "interested",
            referrer_url: document.referrer,
            ...ipConfigData
        };

        setFormMessage(prev => ({
            ...prev,
            status: "loading",
            message: null
        }));

        const result = await postLeadCollector(payload);

        if (result) {

            event.target.reset();

            setFormMessage(prev => ({
                ...prev,
                status: "ok",
                message: null
            }));

            const timeout = setTimeout(() => {
                clearTimeout(timeout);
                setFormMessage(prev => ({
                    ...prev,
                    status: null,
                    message: null
                }));
            }, 2000)
        }
    }


    const postLeadCollector = async (payload = {}) => {
        if (Object.values(payload).length === 0) return;

        const res = await createOrUpdate(payload, "POST", leadCollectorApiPath);

        if (res?.status >= 400 && res?.status < 500) {
            let resData = null;
            try {
                resData = await res?.json();
            }
            catch (e) { }
            setFormMessage(prev => ({
                ...prev,
                status: "err4xx",
                message: resData?.message || "Oops! Something went wrong. Please try again shortly."
            }));
            return false;
        }

        if (res?.status >= 500) {
            setFormMessage(prev => ({
                ...prev,
                status: "err5xx",
                message: "Our servers are having a little trouble right now. Please try again later."
            }));
            return false;
        }

        if (res?.status === 201) {
            return true;
        }
    }

    const onFormChange = () => {
        const hasAnyFormMessages = Object.values(formMessages).some(
            val => val
        );

        if (hasAnyFormMessages) {
            setFormMessage(prev => ({
                ...prev,
                status: null,
                message: null
            }))
        }
    }

    return (
        <Fragment>
            <NextSeo title="Agentzee AI | TNGSS" />
            <MainLayout>

                <section className="overflow-hidden md:pt-32 pb-12 pt-24 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-secondary/20"></div>
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-20 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <div className="absolute top-40 right-32 w-1 h-1 bg-secondary rounded-full animate-pulse"></div>
                        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></div>
                        <div className="absolute bottom-20 right-20 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    </div>

                    <div className="relative z-10 max-w-6xl mx-auto text-center">
                        <div className="mb-6">
                            <span className="inline-block px-6 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-full text-sm font-medium mb-6">
                                Exclusive Summit Offer
                            </span>
                        </div>

                        <Image
                            src="https://www.tngss.startuptn.in/c75842fbc202512d0b67.png"
                            width={1024}
                            height={1024}
                            alt="TNGSS"
                            quality={100}
                            className="w-auto h-48 mx-auto mb-6"
                        />

                        <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight">
                            <span className="bg-gradient-to-r from-primary via-secondary to-secondary bg-clip-text text-transparent neon-glow">
                                Claim Your 6-Month
                            </span>
                            <br />
                            <span className="text-white">Free Trial of AI Agents</span>
                        </h1>



                        <p className="text-xl text-dark-text-secondary max-w-3xl mx-auto leading-relaxed">
                            Transform your startup with cutting-edge AI automation. Get full access to our enterprise-grade AI agent platform - completely free for 6 months.
                        </p>

                    </div>
                </section>

                <section className="md:py-12 py-8 overflow-hidden">
                    <HeroSection />
                </section>

                <section id="lead-capture" className="md:py-12 py-8 overflow-hidden relative">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-[linear-gradient(45deg,#A855F7,#F72585,#FF00FF)] p-0.5 rounded-xl mb-6">
                            <div className="rounded-xl p-8 bg-dark-bg-primary">
                                <div className="text-center mb-12">
                                    <h2 className="font-bold text-4xl mb-6">
                                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                            Start Your Free Trial
                                        </span>
                                    </h2>
                                    <p className="text-dark-text-secondary text-lg">Join the future of AI automation - no credit card required</p>
                                </div>

                                <form
                                    onChange={onFormChange}
                                    onSubmit={handleFormSubmit}
                                    id="trial-form"
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label
                                                htmlFor="name"
                                                className="block text-sm font-medium mb-2"
                                            >
                                                Full Name
                                            </label>
                                            <input
                                                required
                                                name="name"
                                                id="name"
                                                type="text"
                                                className="w-full bg-dark-card-primary border border-secondary/30 rounded-lg px-4 py-3 focus:border-secondary focus:outline-none transition-colors"
                                                placeholder="Enter your name"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                className="block text-sm font-medium mb-2"
                                                htmlFor="company"
                                            >
                                                Company
                                            </label>
                                            <input
                                                required
                                                name="company"
                                                id="company"
                                                type="company"
                                                className="w-full bg-dark-card-primary border border-secondary/30 rounded-lg px-4 py-3 focus:border-secondary focus:outline-none transition-colors"
                                                placeholder="Company Name"
                                            />
                                        </div>


                                    </div>

                                    <div>
                                        <label
                                            className="block text-sm font-medium mb-2"
                                            htmlFor="email"
                                        >
                                            Email Address
                                        </label>
                                        <input
                                            required
                                            name="email"
                                            id="email"
                                            type="email"
                                            className="w-full bg-dark-card-primary border border-secondary/30 rounded-lg px-4 py-3 focus:border-secondary focus:outline-none transition-colors"
                                            placeholder="Company Email ID"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label
                                                htmlFor="phone"
                                                className="block text-sm font-medium mb-2"
                                            >
                                                Phone Number
                                            </label>
                                            <PhoneInput
                                                defaultCountry={ipConfigData?.country || "IN"}
                                                placeholder="Enter phone number"
                                                value={phoneNumber}
                                                onChange={setPhoneNumber}
                                                countrySelectProps={{
                                                    className: "bg-dark-card-primary"
                                                }}
                                                numberInputProps={{
                                                    className: "bg-transparent outline-none ml-2",
                                                    required: true,
                                                    name: "phone",
                                                    id: "phone"
                                                }}
                                                smartCaret
                                                limitMaxLength
                                                className="w-full bg-dark-card-primary border border-secondary/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus-within:border-secondary focus-within:shadow-[0_0_10px_rgba(255,45,146,0.3)] transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="department"
                                                className="block text-sm font-medium mb-2"
                                            >
                                                Department
                                            </label>
                                            <select
                                                required
                                                name="department"
                                                id="department"
                                                className="w-full bg-dark-card-primary border border-secondary/30 rounded-lg px-4 py-3 focus:border-secondary focus:outline-none transition-colors"
                                            >
                                                <option>Customer Support</option>
                                                <option>Sales</option>
                                                <option>Marketing</option>
                                                <option>Testing / QA</option>
                                                <option>Analytics & Business Intelligence</option>
                                                <option>Human Resources (HR)</option>
                                                <option selected>Operations & IT</option>
                                                <option>Finance & Accounts</option>
                                            </select>
                                        </div>

                                    </div>

                                    <div>
                                        <label
                                            htmlFor="notes"
                                            className="block text-sm font-medium mb-2"
                                        >
                                            Notes
                                        </label>
                                        <textarea
                                            onInput={(e) => {
                                                e.target.style.height = "auto";
                                                e.target.style.height = e.target.scrollHeight + "px";
                                            }}
                                            placeholder={text}
                                            required
                                            name="notes"
                                            id="notes"
                                            className="w-full text-sm min-h-20 max-h-48 overflow-y-auto no-scrollbar bg-dark-card-primary border border-secondary/30 rounded-lg px-4 py-3 focus:border-secondary focus:outline-none transition-colors"
                                        />
                                    </div>

                                    {(formMessages?.status === "err4xx" || formMessages?.status === "err5xx") && (
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

                                        </div>
                                    )}

                                    <div className="text-center pt-4">
                                        <div className="bg-[linear-gradient(45deg,#A855F7,#F72585,#FF00FF)] p-0.5 inline-block animate-pulse-glow rounded-xl">
                                            <button
                                                disabled={formMessages?.status === "loading" || formMessages?.status === "ok"}
                                                type="submit"
                                                className="bg-dark-bg-primary px-8 py-4 rounded-xl font-bold md:text-lg hover:bg-gray-900 transition-all duration-300 flex items-center justify-center disabled:cursor-not-allowed"
                                            >
                                                {formMessages?.status === "loading" ?
                                                    <Fragment>
                                                        <LuLoaderCircle className="mr-3 animate-spin" />
                                                        Submitting...
                                                    </Fragment> :
                                                    (formMessages?.status === "ok") ?
                                                        <Fragment>
                                                            <FaCheckCircle className="mr-3" />
                                                            Submitted
                                                        </Fragment> :
                                                        <Fragment>
                                                            <FaRocket className="mr-3" />
                                                            Activate Your Free Trial Now
                                                        </Fragment>
                                                }


                                            </button>
                                        </div>
                                        <p className="text-xs text-dark-text-secondary mt-4">By signing up, you agree to our Terms of Service and Privacy Policy</p>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-4">
                            <div className="bg-[linear-gradient(45deg,#A855F7,#F72585,#FF00FF)] p-0.5 inline-block rounded-xl">
                                <Link
                                    href="/"
                                    type="button"
                                    className="bg-dark-bg-primary px-4 py-2 rounded-xl font-bold hover:bg-gray-900 transition-all duration-300 flex items-center justify-center"
                                >
                                    <MdHome className="mr-2" />
                                    Go Home
                                </Link>
                            </div>
                            <div className="bg-[linear-gradient(45deg,#A855F7,#F72585,#FF00FF)] p-0.5 inline-block rounded-xl">
                                <Link
                                    target="_blank"
                                    // onClick={() => setTryNowAvatar(true)}
                                    href="https://agentzee.ai/features/realistic-3d-models"
                                    type="button"
                                    className="bg-dark-bg-primary px-4 py-2 rounded-xl font-bold hover:bg-gray-900 transition-all duration-300 flex items-center justify-center"
                                >
                                    <AgentZeeHead className="mr-2 !size-5" />
                                    Try 3D Avatar
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </MainLayout>

            {tryNowAvatar && (
                <WelcomeAvatar
                    onClickClose={() => setTryNowAvatar(false)}
                />
            )}
        </Fragment>
    )
}
