import AuthLayout from "@/components/AuthLayout";
import { ssoProviders } from "@/components/AuthLayout/constants";
import { googleSSOApiPath, signUpVerifyApiPath } from "@/constants/apiPaths";
import { useAuthContext } from "@/context/useAuthContext";
import { createOrUpdate, retrieveOrRemove } from "@/utils/fetchUtils";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { FaArrowRight, FaCheckCircle, FaEnvelope, FaExclamationCircle, FaExclamationTriangle, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { LuLoaderCircle } from "react-icons/lu";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getSession, signIn, useSession} from "next-auth/react";
import { FaCircleXmark } from "react-icons/fa6";

export default function LoginPage() {

    const { data: session, update: updateSession, status } = useSession()
    const { updateLoginUser, loading, loginUser } = useAuthContext();
    const router = useRouter();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [formMessages, setFormMessages] = useState({
        status: null,
        message: null
    });

    const [fetching, setFetching] = useState({
        status: null,
        message: null
    })


    useEffect(() => {
        if (loading) return;

        if (loginUser && loginUser?.token) {
            router.push((!loginUser?.user_plan || loginUser?.user_plan === "free") ? "/dashboard/settings?tab=billing" : "/dashboard/agents/chats");
            return;
        };
    }, [loading]);

    useEffect(() => {
        if (!router.isReady) return;

        if (router?.query?.['signup-verify']) {
            signUpVerify(router?.query?.['signup-verify']);
            return;
        }

        if (router?.query?.sso && status === "authenticated") {
            loginBySSO();
            return;
        }

    }, [status, router.isReady])


    const login = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const payload = {
            email: formData.get("email"),
            password: formData.get('password')
        };

        setFormMessages(prev => ({
            ...prev,
            status: "loading",
            message: null
        }));

        const res = await signIn('credentials', { redirect: false, ...payload });
        if (res?.status === 200) {
            setFormMessages(prev => ({
                ...prev,
                status: null,
                message: null
            }));
            const session = await getSession();
            updateLoginUser(session?.user);

            if (!session?.user?.country || !session?.user?.company_profile_id) {
                router.push("/");
            }
            else {
                if (!session?.user?.user_plan || session?.user?.user_plan === "free") {
                    router.push("/dashboard/settings?tab=billing");
                }
                else {
                    router.push("/dashboard/agents/chats");
                }
            }

            return true;
        }

        if (res?.status >= 400 && res?.status < 500) {
            console.log("the error", error)
            const error = JSON.parse(res?.error);

            if (error?.status >= 500) {
                setFormMessages(prev => ({
                    ...prev,
                    status: "err5xx",
                    message: "Server error occurred. Please try signing in again shortly."
                }));
                return false;
            }
            setFormMessages(prev => ({
                ...prev,
                status: "err4xx",
                message: error?.message || "Something went wrong with your request. Please check and try again."
            }));
            return false;
        }

        if (res?.status >= 500) {
            setFormMessages(prev => ({
                ...prev,
                status: "err5xx",
                message: "Server error occurred. Please try signing in again shortly."
            }));
            return false;
        }

    }

    const loginBySSO = async () => {
        if (!router.query?.sso || status !== "authenticated") return;

        const path = session?.user?.provider === "google" ? googleSSOApiPath : ""
        const payload = {
            auth_token: session?.user?.id_token
        }

        setFormMessages(prev => ({
            ...prev,
            status: "loading",
            message: null
        }));

        const res = await createOrUpdate(payload, "POST", path, false);
        let resData = null;
        try {
            resData = await res?.json();
        }
        catch (e) { }

        if (res?.status === 200) {
            setFormMessages(prev => ({
                ...prev,
                status: null,
                message: null
            }));
            updateLoginUser({
                ...session?.user,
                ...resData,
            });
            updateSession({
                user: {
                    ...session?.user,
                    ...resData
                }
            });

            router.replace({
                pathname:router.pathname,
                query:{}
            });

            if (!resData?.country || !resData?.company_profile_id) {
                router.push("/");
            }
            else {
                if (!resData?.user_plan || resData?.user_plan === "free") {
                    router.push("/dashboard/settings?tab=billing");
                }
                else {
                    router.push("/dashboard/agents/chats");
                }
            }

            return true;
        }

        if (res?.status >= 400 && res?.status < 500) {
            setFormMessages(prev => ({
                ...prev,
                status: "err4xx",
                message: resData?.message || "Something went wrong with your request. Please check and try again."
            }));
            return false;
        }

        if (res?.status >= 500) {
            setFormMessages(prev => ({
                ...prev,
                status: "err5xx",
                message: res?.message || resData?.message || "Server error occurred. Please try signing in again shortly."
            }));
            return false;
        }


    }

    const signUpVerify = async (id) => {
        setFetching(prev => ({
            ...prev,
            status: "loading",
            message: "Activating your account, please wait..."
        }));

        const path = signUpVerifyApiPath.replace('<id>', id);
        const res = await retrieveOrRemove('GET', path);

        if (res?.status >= 400 && res?.status < 500) {

            setFetching(prev => ({
                ...prev,
                status: "err4xx",
                message: "Something went wrong with your request. Please check and try again."
            }));
            return false;
        }

        if (res?.status >= 500) {
            setFetching(prev => ({
                ...prev,
                status: "err5xx",
                message: "Server error occurred. Please try signing in again shortly."
            }));
            return false;
        }

        if (res?.status >= 200 && res?.status <= 208) {
            const resData = await res?.json();
            setFetching(prev => ({
                ...prev,
                status: "ok",
                message: resData?.message || "Your account has been activated successfully, please login and check."
            }));
            return true;
        }

    }

    const handleClickSSO = async (providerName = "") => {
        if (!providerName) return;

        const provider = providerName === "Google" ? "google" : "";
        await signIn(provider, { callbackUrl: `/login?sso=${provider}` });
    }


    const onFormChange = () => {
        const hasAnyFormMessages = Object.values(formMessages).some(
            val => val
        );

        if (hasAnyFormMessages) {
            setFormMessages(prev => ({
                ...prev,
                status: null,
                message: null
            }))
        }
    }

    if (loading || !router.isReady) return;

    return (
        <AuthLayout>
            {!router?.query?.['signup-verify'] ?
                (loginUser && loginUser?.token) ?
                    <div className="h-full flex flex-col items-center justify-center transition-all duration-300">
                        <FaCheckCircle className="mb-4 size-10 text-green-500" />

                        <p className="from-primary to-secondary bg-clip-text bg-gradient-to-r text-transparent font-medium text-lg text-center">
                            Login successful! Redirecting…
                        </p>
                    </div>
                    :
                    <Fragment>
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold">Sign In</h2>
                        </div>

                        <form
                            className="space-y-6 mb-6"
                            onSubmit={login}
                            onChange={onFormChange}
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
                                        className="block w-full pl-10 pr-3 py-3 bg-transparent border border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                        placeholder="name@company.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div id="password-field" className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className=" text-gray-500" />
                                    </div>
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        className="block w-full pl-10 pr-3 py-3 bg-transparent border border-dark-border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {passwordVisible ?
                                            <FaEyeSlash className="text-gray-500" />
                                            :
                                            <FaEye className="text-gray-500" />
                                        }
                                    </button>
                                </div>

                                <Link
                                    href={'/forgot-password'}
                                    className="ml-auto w-max block text-sm text-secondary hover:opacity-80 transition cursor-pointer"
                                >
                                    Forgot password?
                                </Link>

                            </div>

                            {/* <div id="remember-me" className="flex items-center">
                    <input
                        type="checkbox"
                        id="remember"
                        name="remember"
                        className="h-4 w-4 rounded border-dark-border-primary accent-primary focus:ring-purple-light"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-300">Remember me for 30 days</label>
                </div> */}

                            {(formMessages?.status === "err4xx" || formMessages?.status === "err5xx") && (
                                <div className="mt-2 text-sm font-[500] flex items-center">
                                    {formMessages?.status === "err4xx" && (
                                        <Fragment>
                                            <FaCircleXmark className="text-red-400 mr-2" />
                                            <p className="text-red-400">
                                                {formMessages?.message}
                                            </p>
                                        </Fragment>
                                    )}

                                    {formMessages?.status === "err5xx" && (
                                        <Fragment>
                                            <FaExclamationTriangle className="text-orange-400 mr-2" />
                                            <p className="text-orange-400">
                                                {formMessages?.message}
                                            </p>
                                        </Fragment>
                                    )}

                                </div>
                            )}

                            <button
                                disabled={formMessages?.status === "loading"}
                                type="submit"
                                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-white py-3 rounded-lg font-medium flex items-center justify-center disabled:cursor-not-allowed"
                            >
                                {formMessages?.status !== "loading" ?
                                    <Fragment>
                                        <span>Sign in</span>
                                        <FaArrowRight className="ml-2" />
                                    </Fragment> :
                                    <Fragment>
                                        <AiOutlineLoading3Quarters className="mr-2 animate-spin" />
                                        <span>Logging in...</span>
                                    </Fragment>
                                }
                            </button>


                        </form>

                        <div className="relative flex items-center mb-6">
                            <div className="flex-grow border-t border-dark-border-primary"></div>
                            <span className="flex-shrink mx-4 text-gray-400 text-sm">Or continue with</span>
                            <div className="flex-grow border-t border-dark-border-primary"></div>
                        </div>

                        <div id="sso-providers" className="flex gap-4 items-center justify-center">
                            {ssoProviders.map((provider, index) => (
                                <button
                                    onClick={() => handleClickSSO(provider.name)}
                                    key={index}
                                    type="button"
                                    title={`Sign in with ${provider.name}`}
                                    className="flex justify-center items-center gap-2 py-1.5 px-2.5 border border-dark-border-primary rounded-full hover:bg-gray-50/5 transition font-[500]"
                                >
                                    <provider.icon className="text-lg" />
                                    Google
                                </button>
                            ))}
                        </div>

                        <div id="signup-link" className="mt-8 text-center">
                            <span className="text-gray-400">Don't have an account?</span>
                            <Link
                                href={"/sign-up"}
                                className="text-primary hover:opacity-80 ml-1 font-medium transition cursor-pointer"
                            >
                                Sign up
                            </Link>
                        </div>
                    </Fragment>
                :
                <div className="h-full w-full flex flex-col items-center justify-center text-center transition-all duration-300">
                    {fetching?.status === "loading" && (
                        <Fragment>
                            <LuLoaderCircle className="size-8 animate-spin mb-4 text-primary" />
                            <p className="text-lg font-[500]">
                                {fetching?.message}
                            </p>
                        </Fragment>
                    )}
                    {fetching?.status === "ok" && (
                        <Fragment>
                            <FaCheckCircle className="size-8 mb-4 text-green-400" />
                            <p className="text-lg font-[500] mb-4">
                                {fetching?.message}
                            </p>
                            <Link
                                href={"/login"}
                                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition text-white py-2 px-4 rounded-full font-[500]"
                            >
                                Go to Login
                            </Link>
                        </Fragment>
                    )}

                    {fetching?.status === "err4xx" && (
                        <Fragment>
                            <FaCircleXmark className="size-8 mb-4 text-red-400" />
                            <p className="text-lg font-[500] mb-4">
                                {fetching?.message}
                            </p>
                            <button
                                onClick={async () => await signUpVerify(router?.query?.['signup-verify'])}
                                type="button"
                                className="border border-secondary text-secondary hover:bg-secondary transition hover:text-white py-2 px-4 rounded-full font-[500]"
                            >
                                Retry
                            </button>
                        </Fragment>
                    )}

                    {fetching?.status === "err5xx" && (
                        <Fragment>
                            <FaExclamationTriangle className="size-8 mb-4 text-orange-400" />
                            <p className="text-lg font-[500] mb-4">
                                {fetching?.message}
                            </p>
                            <button
                                onClick={async () => await signUpVerify(router?.query?.['signup-verify'])}
                                type="button"
                                className="border border-secondary text-secondary hover:bg-secondary transition hover:text-white py-2 px-4 rounded-full font-[500]"
                            >
                                Retry
                            </button>
                        </Fragment>
                    )}

                </div>
            }

        </AuthLayout>


    )
}
