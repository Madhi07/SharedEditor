
import { leadCollectorApiPath } from "@/constants/apiPaths";
import { useIpContext } from "@/context/useIpContext";
import { createOrUpdate } from "@/utils/fetchUtils";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Country } from "country-state-city";
import { Fragment, useEffect, useState } from "react";
import { FaCheck, FaCheckCircle, FaExclamationTriangle, FaTimes } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { LuLoaderCircle } from "react-icons/lu";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { useRouter } from "next/router";
import { offerPopupDisabledPaths } from "@/constants";


export default function OfferPopup() {

    const router = useRouter();

    const { ipConfigData } = useIpContext();

    const [phoneNumber, setPhoneNumber] = useState();

    const [formMessages, setFormMessage] = useState({
        status: null,
        message: null
    });

    const [showOfferPopup, setShowOfferPopup] = useState(false);

    useEffect(() => {

        if (localStorage.getItem("offerShown") === "true") return;

        const onLoad = () => {
            const timer = setTimeout(() => {
                setShowOfferPopup(true);
                localStorage.setItem("offerShown", true);
            }, 5000);

            return () => clearTimeout(timer);
        };

        window.addEventListener("load", onLoad);

        return () => window.removeEventListener("load", onLoad);
    }, []);

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        const payload = {
            ...Object.fromEntries(formData.entries()),
            phone: phoneNumber,
            status: "interested",
            ...ipConfigData
        };

        setFormMessage(prev => ({
            ...prev,
            status: "loading",
            message: null
        }));

        const result = await postLeadCollector(payload);

        if (result) {
            setFormMessage(prev => ({
                ...prev,
                status: "ok",
                message: "Thank you for your interest! We'll connect with you soon to set up your 6-month trial."
            }));
        }
    }

    const onCloseClick = async () => {
        setShowOfferPopup(false);

        localStorage.setItem("offerShown", true);
        const payload = { ...ipConfigData, status: "cancelled" };
        await postLeadCollector(payload);
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

    const shouldLoadOfferPopup = useMemo(() => {

        if (!router.isReady) return false;

        const cleanPath = router.asPath.split(/[?#]/)[0]; // remove query/hash
        return !offerPopupDisabledPaths.includes(cleanPath);
        // return !offerPopupDisabledPaths.some(path => router.asPath.includes(path));
    }, [router.asPath, router.isReady]);


    return (
        <Dialog open={showOfferPopup && shouldLoadOfferPopup} onClose={() => null} className="relative z-20">
            <DialogBackdrop
                transition
                className="fixed z-10 inset-0 bg-dark-bg-secondary/80 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />


            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full justify-center p-6 text-center items-center">
                    <DialogPanel
                        transition
                        className="flex w-full relative transform transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >

                        <div className="relative bg-gradient-to-br from-secondary/10 to-primary/10 bg-dark-bg-secondary border border-white/20 rounded-3xl p-8 max-w-lg w-full mx-auto shadow-2xl animate-bounce-in">


                            {formMessages?.status === "ok" ? (
                                <div className="p-6 w-full flex items-center justify-center flex-col">
                                    <FaCheckCircle className="text-green-400 size-8 mb-4" />
                                    <p className="font-[500] text-lg mb-4">
                                        {formMessages?.message}
                                    </p>
                                    <button
                                        onClick={() => setShowOfferPopup(false)}
                                        type="button"
                                        className="rounded-full px-4 py-1 font-[500] text-white bg-gradient-to-r from-secondary to-primary transform hover:scale-105"
                                    >
                                        Done
                                    </button>
                                </div>
                            ) : (
                                <Fragment>
                                    <button
                                        onClick={onCloseClick}
                                        type="button"
                                        id="close-popup"
                                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-primary/20 flex items-center justify-center transition-all duration-300 group"
                                    >
                                        <FaTimes className="text-white group-hover:text-primary" />
                                    </button>


                                    <div className="mb-8 mt-4 flex items-center justify-center flex-col">

                                        <h3 className="text-3xl font-bold mb-3">
                                            Claim Your <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">6-Month Free Trial!</span>
                                        </h3>
                                        <p className="text-gray-300 text-lg">Share the details below to receive your exclusive coupon code and start building with AI Agents today.</p>
                                    </div>


                                    <form
                                        onChange={onFormChange}
                                        onSubmit={handleFormSubmit}
                                        id="popup-form"
                                        className="space-y-4 mb-6"
                                    >
                                        <div>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                placeholder="Your name"
                                                required
                                                className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-secondary focus:shadow-[0_0_10px_rgba(255,45,146,0.3)] focus:outline-none transition-all duration-300 outline-none"
                                            />
                                        </div>

                                        <div>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                placeholder="Your email"
                                                required
                                                className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-secondary focus:shadow-[0_0_10px_rgba(255,45,146,0.3)] focus:outline-none transition-all duration-300 outline-none"
                                            />
                                        </div>

                                        <div>
                                            <PhoneInput
                                                defaultCountry={ipConfigData?.country || "IN"}
                                                placeholder="Enter phone number"
                                                value={phoneNumber}
                                                onChange={setPhoneNumber}
                                                countrySelectProps={{
                                                    className: "focus:bg-dark-card-primary"
                                                }}
                                                numberInputProps={{
                                                    className: "bg-transparent outline-none ml-2",
                                                    required: true
                                                }}
                                                smartCaret
                                                limitMaxLength
                                                className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus-within:border-secondary focus-within:shadow-[0_0_10px_rgba(255,45,146,0.3)] transition-all duration-300 outline-none"
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

                                        <button
                                            type="submit"
                                            disabled={formMessages?.status === "loading"}
                                            className="w-full flex items-center justify-center bg-gradient-to-r from-secondary to-primary hover:shadow-[0_0_20px_rgba(255,45,146,0.4)] transition-all duration-300 px-8 py-3 rounded-2xl text-white font-bold text-lg transform hover:scale-105 hover:animate-pulse"
                                        >
                                            {formMessages?.status === "loading" ? (
                                                <Fragment>
                                                    <LuLoaderCircle className="text-white font-[500] mr-2 animate-spin" />
                                                    <span className="text-white font-[500]">Submitting...</span>
                                                </Fragment>
                                            ) : (

                                                "🎉 Get My Coupon Code"
                                            )}

                                        </button>
                                    </form>

                                    <div className="space-y-2 text-sm text-gray-400">
                                        <div className="flex items-center">
                                            <FaCheck className=" text-green-400 mr-2" />
                                            <span>Instant access to your 6-month trial code</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaCheck className="text-green-400 mr-2" />
                                            <span>No spam — we respect your privacy</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaCheck className="text-green-400 mr-2" />
                                            <span>Cancel anytime</span>
                                        </div>
                                    </div>
                                </Fragment>
                            )}


                        </div>


                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}
