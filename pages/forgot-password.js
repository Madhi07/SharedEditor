import AuthLayout from "@/components/AuthLayout";
import { forgetPasswordApiPath } from "@/constants/apiPaths";
import { createOrUpdate } from "@/utils/fetchUtils";
import clsx from "clsx";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { Fragment, useState } from "react";
import { FaCheckCircle, FaChevronRight, FaEnvelope, FaExclamationTriangle, FaPaperPlane } from "react-icons/fa";
import { FaCircleInfo, FaCircleXmark, FaMessage, FaShieldHalved } from "react-icons/fa6";
import { LuLoaderCircle } from "react-icons/lu";

export default function ForgotPasswordPage() {

    const [resMessages, setResMessages] = useState({
        status: null,
        messsage: null
    });


    const handleSubmit = async (event) => {

        event.preventDefault();

        if (resMessages?.status) {
            setResMessages({
                status: null,
                messsage: null
            });
        };

        setResMessages(prev => ({
            ...prev,
            status: "loading",
            messsage: null
        }));

        const formData = new FormData(event.target);

        const payload = {
            ...Object.fromEntries(formData.entries()),
            redirect_uri: `${process.env.WEB_URL}/reset-password`
        };

        const result = await postForgetPassword(payload);

        if (!result) return;

        setResMessages(prev => ({
            ...prev,
            status: "ok",
            messsage: result?.message || "Password reset link sent! Please check your email to continue."
        }));

        event.target.reset();

    }


    const postForgetPassword = async (payload = {}) => {

        if (Object.values(payload).length === 0) return;

        const res = await createOrUpdate(payload, "POST", forgetPasswordApiPath, false);
        let resData = null;
        try {
            resData = await res?.json();
        }
        catch (e) { }

        if (res?.status >= 400 && res?.status < 500) {

            setResMessages(prev => ({
                ...prev,
                status: "err4xx",
                messsage: resData?.message || "Unable to process your request. Please check your details and try again."
            }));

            return false;
        }

        if (res?.status >= 500) {
            setResMessages(prev => ({
                ...prev,
                status: "err5xx",
                messsage: res?.message || resData?.message || "Something went wrong on our side. Please try again later."
            }));

            return false;
        }

        if (res?.status === 202) {
            return resData;
        };

        return false;
    }

    return (
        <Fragment>
            <NextSeo
                title="Agentzee AI | Forget Password"
            />
            <AuthLayout>
                <div className="flex flex-col w-full h-full">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold">Forget Password</h2>
                    </div>

                    <div className="mb-6">
                        <p className="text-gray-300 text-sm">Enter your email address and we'll send you a link to reset your password.</p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        <div id="email-field" className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="text-gray-500" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="block w-full pl-10 pr-3 py-3 bg-transparent border border-dark-border-primary rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none"
                                    placeholder="Your email"
                                    required
                                />
                            </div>
                        </div>

                        {(resMessages?.status === "ok" || resMessages?.status === "err4xx" || resMessages?.status === "err5xx") && (
                            <div className="flex items-center gap-2">

                                {resMessages?.status === "err4xx" && (
                                    <FaCircleXmark className="text-red-400 flex-shrink-0" />
                                )}

                                {resMessages?.status === "err5xx" && (
                                    <FaExclamationTriangle className="text-orange-400 flex-shrink-0" />
                                )}

                                {resMessages?.status === "ok" && (
                                    <FaCheckCircle className="text-green-400 flex-shrink-0" />
                                )}

                                {resMessages?.messsage && (
                                    <p className={clsx("text-sm",
                                        resMessages?.status === "err4xx" && "text-red-400",
                                        resMessages?.status === "err5xx" && "text-orange-400",
                                        resMessages?.status === "ok" && "text-green-400",
                                    )}>
                                        {resMessages?.messsage}
                                    </p>
                                )}
                            </div>
                        )}

                        <button
                            disabled={resMessages?.status === "loading"}
                            type="submit"
                            id="reset-button"
                            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-white py-3 rounded-lg font-medium flex items-center justify-center disabled:opacity-90"
                        >
                            {resMessages?.status === "loading" ?
                                <Fragment>
                                    <LuLoaderCircle className="mr-2 animate-spin" />
                                    <span>Sending...</span>
                                </Fragment> :
                                <Fragment>
                                    <span>Send Reset Link</span>
                                    <FaPaperPlane className="ml-2" />
                                </Fragment>
                            }
                        </button>


                    </form>

                    <div id="login-link" className="mt-8 text-center">
                        <span className="text-gray-400">Remember your password?</span>
                        <Link
                            href={'/login'}
                            className="text-secondary hover:opacity-80 hover:underline ml-1 font-medium transition cursor-pointer"
                        >
                            Back to Sign in
                        </Link>
                    </div>
                </div>
            </AuthLayout>
        </Fragment>
    )
}
