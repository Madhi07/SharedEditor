import { razorpayCreatePaymentLink, stripeCreateCheckoutSession, userInfoApiPath } from "@/constants/apiPaths";
import { useAuthContext } from "@/context/useAuthContext";
import { retrieveOrRemove } from "@/utils/fetchUtils";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { FaCircleXmark, FaXmark } from "react-icons/fa6";
import { LuLoaderCircle } from "react-icons/lu";

export default function CreditsRecharge() {

    const router = useRouter();

    const { loginUser, updateLoginUser } = useAuthContext();

    const creditsFormRef = useRef(null);

    const [resMessages, setResMessages] = useState({
        status: null,
        message: null
    });

    const [totalCredits, setTotalCredits] = useState(null);


    useEffect(() => {

        if (!router.isReady) return;

        if (router?.query?.["credits-recharge"] === "failed") {
            const timeout = setTimeout(() => {
                clearTimeout(timeout);
                onCancel();
            }, 3000);

            return;
        }

        if (router.query?.['credits-recharge'] === "success") {
            creditsRechargeVerification();
            return
        }

    }, [router.query])


    const onCancel = () => {
        const newQuery = { ...router.query };
        delete newQuery["credits-recharge"];
        router.push({
            pathname: router.pathname,
            query: newQuery
        });
        return;
    }


    const handleAmountChange = (event) => {
        if (loginUser?.country === "India") {
            setTotalCredits(event.target.value >= 1 ? event.target.value * 1 : 0);
        }
        else {
            setTotalCredits(event.target.value >= 1 ? event.target.value * 200 : 0);
        }
    };

    const creditsRechargeVerification = async () => {
        setResMessages(prev => ({
            ...prev,
            status: "loading",
            message: "One moment, we're confirming your recharge…"
        }));

        let count = 0;
        const maxTries = 20;
        const intervalTime = 6000; // 6 seconds

        const timer = setInterval(async () => {
            count++;

            const res = await retrieveOrRemove("GET", userInfoApiPath, true);
            let resData = null;
            try {
                resData = await res?.json();
            }
            catch (e) { }

            if (res.status >= 400 && res.status < 500) {
                setResMessages(prev => ({
                    ...prev,
                    status: "err4xx",
                    message: resData?.message || "Unable to fetch your credits."
                }));
                clearInterval(timer);
                return;
            }

            if (res.status >= 500) {
                setResMessages(prev => ({
                    ...prev,
                    status: "err4xx",
                    message: resData?.message || "Our servers are busy right now. Please try again in a moment."
                }));
                clearInterval(timer);
                return;
            }

            if (res.status === 200) {
                if (resData?.data?.credits > loginUser?.credits) {
                    setResMessages(prev => ({
                        ...prev,
                        status: "ok",
                        message: "Your recharge is complete. Enjoy your new credits!"
                    }));
                    clearInterval(timer);
                    setTimeout(() => {
                        updateLoginUser(resData?.data);
                        onCancel();
                    }, 3000);
                    return;
                }
            }

            // Stop polling if max tries reached
            if (count >= maxTries) {
                setResMessages(prev => ({
                    ...prev,
                    status: "maxTries",
                    message: "Taking longer than expected."
                }));
                clearInterval(timer);
                return
            }
        }, intervalTime);
    }


    if (!router.isReady) return;

    return (
        <Dialog open={true} onClose={() => null} className="relative z-20">
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
                        <div className="dark:bg-dark-card-primary bg-light-card-primary rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 md:mx-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold dark:text-dark-text-primary text-light-text-primary">Purchase Credits</h3>
                            </div>

                            {(router?.query?.["credits-recharge"] === "show") && (
                                <form
                                    className="space-y-4 text-left"
                                    ref={creditsFormRef}
                                    method="POST"
                                    action={`${process.env.API_URL}${loginUser?.country === "India" ? razorpayCreatePaymentLink : stripeCreateCheckoutSession}`}
                                >
                                    <div>
                                        <label className="block text-sm font-medium dark:text-dark-text-secondary text-light-text-secondary mb-2">
                                            {`Amount (${loginUser?.country === "India" ? "INR" : "USD"})`}
                                        </label>
                                        <input
                                            onChange={handleAmountChange}
                                            type="number"
                                            name="price"
                                            placeholder={`Enter amount in ${loginUser?.country === "India" ? "₹" : "$"}`}
                                            min="1"
                                            className="dark:text-dark-text-primary text-light-text-primary w-full px-3 py-2 dark:bg-dark-bg-primary bg-light-bg-primary border dark:border-dark-border-primary border-light-border-primary rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                                            required
                                        />
                                        <input readOnly name="user_id" value={loginUser?.user_id} className="hidden" />
                                        <input
                                            readOnly
                                            name="callback_success_url"
                                            value={`${window.location.origin}${window.location.pathname}?credits-recharge=success`}
                                            className="hidden"
                                        />
                                        <input
                                            readOnly
                                            name="callback_failed_url"
                                            value={`${window.location.origin}${window.location.pathname}?credits-recharge=failed`}
                                            className="hidden"
                                        />
                                    </div>

                                    {totalCredits ? (
                                        <p
                                            id="credits-preview"
                                            className="text-green-500 text-sm font-medium">
                                            {`You will receive ${totalCredits} credits.`}
                                        </p>
                                    ) : ""}

                                    <div className="flex justify-end space-x-3 mt-6">
                                        <button
                                            onClick={onCancel}
                                            type="button"
                                            id="cancel-purchase"
                                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            id="confirm-purchase"
                                            className="px-4 py-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white text-sm font-medium rounded-lg transition-colors"
                                        >
                                            Purchase
                                        </button>
                                    </div>
                                </form>
                            )}

                            {(router?.query?.["credits-recharge"] === "failed") && (
                                <div className="flex w-full items-center justify-center p-4 flex-col">
                                    <FaCircleXmark className="text-red-400 size-8 mb-4" />
                                    <p className="text-lg font-[500] text-center">
                                        Recharge failed or cancelled. Please try again.
                                    </p>
                                </div>
                            )}

                            {(router?.query?.["credits-recharge"] === "success") && (
                                <div className="flex w-full items-center justify-center p-4 flex-col">
                                    {resMessages?.status === "err4xx" && (
                                        <FaCircleXmark className="text-red-400 size-8 mb-4" />
                                    )}
                                    {(resMessages?.status === "err5xx" || resMessages?.status === "maxTries") && (
                                        <FaExclamationTriangle className="text-orange-400 size-8 mb-4" />
                                    )}
                                    {resMessages?.status === "loading" && (
                                        <LuLoaderCircle className="text-primary animate-spin size-8 mb-4" />
                                    )}
                                    {resMessages?.status === "ok" && (
                                        <FaCheckCircle className="text-green-400 size-8 mb-4" />
                                    )}
                                    <p className="text-lg font-[500] text-center dark:text-dark-text-primary text-light-text-primary">
                                        {resMessages?.message}
                                    </p>

                                    {(resMessages?.status === "err4xx" || resMessages?.status === "err5xx" || resMessages?.status === "maxTries") && (
                                        <button
                                            onClick={async () => await creditsRechargeVerification()}
                                            type="button"
                                            className="mt-4 border border-secondary py-1 px-4 rounded-full text-secondary font-[500] hover:bg-secondary hover:text-white"
                                        >
                                            Retry
                                        </button>
                                    )}

                                </div>
                            )}

                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}
