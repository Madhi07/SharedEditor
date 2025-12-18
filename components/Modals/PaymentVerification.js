import { userInfoApiPath } from "@/constants/apiPaths";
import { useAuthContext } from "@/context/useAuthContext";
import { retrieveOrRemove } from "@/utils/fetchUtils";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { FaCheck, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { LuLoaderCircle } from "react-icons/lu";

export default function PaymentVerification({ open = false, onClose = () => null }) {

    const router = useRouter();

    const { updateLoginUser } = useAuthContext();

    const [paymentStatus, setPaymentStatus] = useState("loading");

    useEffect(() => {
        if (!router.query?.payment) return;


        if (router.query?.payment === "razorpay") {
            razorpayVerifyPayment();
            return
        }

        if (router.query?.payment === "stripe") {
            stripeVerifyPayment();
            return
        }

        if (router.query?.payment === "free-trial") {
            freeTrialVerifyPayment();
            return
        }



    }, [router.query?.payment]);


    const razorpayVerifyPayment = () => {

        if (paymentStatus !== "loading") setPaymentStatus("loading");

        let count = 0;
        const maxTries = 20;
        const intervalTime = 6000; // 6 seconds

        const timer = setInterval(async () => {
            count++;

            const res = await retrieveOrRemove("GET", userInfoApiPath, true);

            if (res.status >= 400 && res.status < 500) {
                setPaymentStatus("err4xx");
                clearInterval(timer);
                return;
            }

            if (res.status >= 500) {
                setPaymentStatus("err5xx");
                clearInterval(timer);
                return;
            }

            if (res.status === 200) {
                const resData = await res.json();
                if (resData?.data?.user_plan !== "free") {
                    setPaymentStatus("success");
                    clearInterval(timer);
                    setTimeout(() => {
                        updateLoginUser(resData?.data);
                        router.replace("/dashboard/agents/chats");
                    }, 3000);
                    return;
                }
            }

            // Stop polling if max tries reached
            if (count >= maxTries) {
                setPaymentStatus("fail");
                clearInterval(timer);
                router.replace("/dashboard/settings?tab=billing");
                return
            }
        }, intervalTime);
    };

    const stripeVerifyPayment = async () => {

        if (paymentStatus !== "loading") setPaymentStatus("loading");

        const res = await retrieveOrRemove("GET", userInfoApiPath, true);

        if (res.status >= 400 && res.status < 500) {
            setPaymentStatus("err4xx");
            return;
        }

        if (res.status >= 500) {
            setPaymentStatus("err5xx");
            return;
        }

        if (res.status === 200) {
            const resData = await res.json();
            if (resData?.data?.user_plan !== "free") {
                setPaymentStatus("success");
                setTimeout(() => {
                    updateLoginUser(resData?.data);
                    router.replace("/dashboard/agents/chats");
                }, 3000);
                return;
            }
            else {
                setPaymentStatus("fail");
                setTimeout(() => {
                    router.replace("/dashboard/settings?tab=billing");
                }, 3000);
                return;
            }
        }

    };

    const freeTrialVerifyPayment = async () => {

        if (paymentStatus !== "loading") setPaymentStatus("loading");

        const res = await retrieveOrRemove("GET", userInfoApiPath, true);

        if (res.status >= 400 && res.status < 500) {
            setPaymentStatus("err4xx");
            return;
        }

        if (res.status >= 500) {
            setPaymentStatus("err5xx");
            return;
        }

        if (res.status === 200) {
            const resData = await res.json();
            if (resData?.data?.user_plan !== "free") {
                setPaymentStatus("success");
                setTimeout(() => {
                    updateLoginUser(resData?.data);
                    router.replace("/dashboard/agents/chats");
                }, 3000);
                return;
            }
            else {
                setPaymentStatus("fail");
                setTimeout(() => {
                    router.replace("/dashboard/settings?tab=billing");
                }, 3000);
                return;
            }
        }

    };

    const onClickRetry = async () => {
        if (router.query?.payment === "razorpay") {
            razorpayVerifyPayment();
            return
        }

        if (router.query?.payment === "stripe") {
            await stripeVerifyPayment();
            return
        }

        if (router.query?.payment === "free-trial") {
            await freeTrialVerifyPayment();
            return
        }
    }


    return (
        <Dialog open={open} onClose={onClose} className="relative z-20">
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
                        <div className="dark:bg-dark-card-primary bg-light-card-primary border dark:border-dark-border-primary border-light-border-primary rounded-xl p-6 max-w-lg w-full mx-auto flex flex-col justify-center items-center">
                            {paymentStatus === "loading" && (
                                <Fragment>
                                    <LuLoaderCircle className="size-10 text-secondary animate-spin mb-6" />
                                    <p className="font-[500] text-lg mb-4 text-light-text-secondary">
                                        Verifying your payment
                                    </p>
                                    <p className="font-[500] text-sm dark:text-dark-text-secondary text-light-text-secondary">
                                        Please wait a moment...
                                    </p>
                                </Fragment>
                            )}

                            {paymentStatus === "success" && (
                                <Fragment>
                                    <FaCheckCircle className="size-10 text-green-400 mb-6" />
                                    <p className="font-[500] text-lg mb-4 text-light-text-secondary">
                                        Payment verified
                                    </p>
                                </Fragment>
                            )}
                            {paymentStatus === "fail" && (
                                <Fragment>
                                    <FaCircleXmark className="size-10 text-red-400 mb-6" />
                                    <p className="font-[500] text-lg mb-4 text-light-text-secondary">
                                        Payment failed
                                    </p>
                                    <p className="font-[500] text-sm dark:text-dark-text-secondary text-light-text-secondary">
                                        Please retry the payment.
                                    </p>
                                </Fragment>
                            )}

                            {paymentStatus === "err4xx" && (
                                <Fragment>
                                    <FaCircleXmark className="size-10 text-red-400 mb-6" />
                                    <p className="font-[500] text-lg mb-4 text-light-text-secondary">
                                        Payment verification failed
                                    </p>
                                    <div className="font-[500] text-sm dark:text-dark-text-secondary text-light-text-secondary">
                                        Please click {" "}
                                        <button
                                            onClick={onClickRetry}
                                            type="button"
                                            className="border-none cursor-pointer hover:underline text-secondary"
                                        >
                                            retry
                                        </button>
                                        {" "}
                                        to try again.
                                    </div>
                                </Fragment>
                            )}

                            {paymentStatus === "err5xx" && (
                                <Fragment>
                                    <FaExclamationTriangle className="size-10 text-orange-400 mb-6" />
                                    <p className="font-[500] text-lg mb-4">
                                        Something went wrong on our side
                                    </p>
                                    <div className="font-[500] text-sm dark:text-dark-text-secondary text-light-text-secondary">
                                        Please click {" "}
                                        <button
                                            onClick={onClickRetry}
                                            type="button"
                                            className="border-none cursor-pointer hover:underline text-secondary"
                                        >
                                            retry
                                        </button>
                                        {" "}
                                        to try again.
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
