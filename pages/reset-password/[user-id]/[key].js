import AuthLayout from "@/components/AuthLayout";
import { resetPasswordApiPath } from "@/constants/apiPaths";
import { createOrUpdate } from "@/utils/fetchUtils";
import clsx from "clsx";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { FaArrowRight, FaCheckCircle, FaExclamationTriangle, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { LuLoaderCircle } from "react-icons/lu";

export default function ResetPasswordPage() {

    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);

    const [resMessages, setResMessages] = useState({
        status: null,
        messsage: null
    });


    const postResetPassword = async (payload = {}) => {

        if (Object.values(payload).length === 0) return;

        const res = await createOrUpdate(payload, "POST", resetPasswordApiPath, false);
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
            id: router?.query?.['user-id'],
            key: router?.query?.key,
        };

        const result = await postResetPassword(payload);

        if (!result) return;

        setResMessages(prev => ({
            ...prev,
            status: "ok",
            messsage: result?.message || "Your password has been reset successfully. You can now log in with your new password."
        }));

        event.target.reset();

    }

    return (
        <Fragment>
            <NextSeo
                title="Agentzee AI | Reset Password"
            />
            <AuthLayout>
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-purple-light/20 mb-4">
                        <FaLock className="text-purple-light text-2xl" />
                    </div>
                    <h1 className="text-2xl font-bold">Reset Password</h1>
                    <p className="text-gray-400 mt-2">Create a new password for your account</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    id="reset-password-form"
                    className="space-y-6"
                >
                    <div id="new-password-field" className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-gray-300">New Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="fa-solid fa-lock text-gray-500" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                className="block w-full pl-10 pr-10 py-3 bg-transparent border border-dark-border-primary rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                type="button"
                                className="absolute inset-y-0 right-3"
                            >
                                {!showPassword ?
                                    <FaEye className="text-gray-500" /> :
                                    <FaEyeSlash className="text-gray-500" />
                                }
                            </button>
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

                    <div className="pt-2.5">
                        <button
                            disabled={resMessages?.status === "loading"}
                            type="submit"
                            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-white py-3 rounded-lg font-medium flex items-center justify-center disabled:opacity-90"
                        >
                            {resMessages?.status === "loading" ?
                                <Fragment>
                                    <LuLoaderCircle className="mr-2 animate-spin" />
                                    <span>Updating...</span>
                                </Fragment> :
                                <Fragment>
                                    <span>Update Password</span>
                                    <FaArrowRight className="ml-2" />
                                </Fragment>
                            }
                        </button>
                    </div>

                </form>

                <div id="login-link" className="mt-6 text-center">
                    <span className="text-gray-400">Remember your password?</span>
                    <Link
                        href={'/login'}
                        className="text-secondary hover:opacity-80 hover:underline ml-1 font-medium transition cursor-pointer"
                    >
                        Back to Sign in
                    </Link>
                </div>
            </AuthLayout>
        </Fragment>
    )
}
