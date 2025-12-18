import { cancelSubscriptionApiPath, userInfoApiPath } from "@/constants/apiPaths";
import { useAuthContext } from "@/context/useAuthContext";
import { retrieveOrRemove } from "@/utils/fetchUtils";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaCheck, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { LuLoaderCircle } from "react-icons/lu";

export default function CancelSubscription({ setShowCancelSubscription }) {

    const { updateLoginUser } = useAuthContext();

    const [resMessages, setResMessages] = useState({
        status: null,
        message: null
    });

    const handleClickCancelSubscription = async () => {

        setResMessages(prev => ({
            ...prev,
            status: "loading",
            message: null
        }))

        const cancelRes = await cancelSubscription();

        // if (!cancelRes) return;

        if (cancelRes) await getUserInfo();

        const timeout = setTimeout(() => {
            clearTimeout(timeout);
            setResMessages(prev => ({
                ...prev,
                status: null,
                message: null
            }));
        }, 2000)
    };


    const cancelSubscription = async () => {
        const res = await retrieveOrRemove("GET", cancelSubscriptionApiPath, true);

        if (res?.status >= 400 && res?.status < 500) {
            setResMessages(prev => ({
                ...prev,
                status: "err4xx",
                message: "Unable to cancel your subscription. Please try again."
            }));
            return false;
        }

        if (res?.status >= 500) {
            setResMessages(prev => ({
                ...prev,
                status: "err5xx",
                message: "Server error while canceling. Try again later."
            }));
            return false;
        }

        if (res?.status === 200) {
            return true
        }
    }


    const getUserInfo = async () => {
        const res = await retrieveOrRemove("GET", userInfoApiPath, true);
        let resData = null;
        try {
            resData = await res?.json();
        }
        catch (e) { }

        if (res?.status === 200) {
            updateLoginUser(resData?.data);
        }


        return {};
    }

    return (
        <Dialog open={true} onClose={() => null} className="relative z-30">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-dark-bg-secondary/80 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform bg-light-card-primary overflow-hidden rounded-lg border border-light-border-primary shadow transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-sm data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                    >
                        <div className="p-6 w-full flex flex-col gap-4 items-center justify-center">

                            {(resMessages?.status === "err4xx" || resMessages?.status === "err5xx" || resMessages?.status === "ok") ? (
                                <Fragment>
                                    {resMessages?.status === "ok" && (
                                        <FaCheckCircle className="text-green-400 flex-shrink-0 text-2xl" />
                                    )}

                                    {resMessages?.status === "err4xx" && (
                                        <FaCircleXmark className="text-red-400 flex-shrink-0 text-2xl" />
                                    )}

                                    {resMessages?.status === "err5xx" && (
                                        <FaExclamationTriangle className="text-orange-400 flex-shrink-0 text-2xl" />
                                    )}

                                    {resMessages?.message && (
                                        <p className="text-light-text-primary font-[500] text-lg">
                                            {resMessages?.message}
                                        </p>
                                    )}
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <p className="text-light-text-primary font-[500] text-lg">
                                        Are you sure, you want to cancel your subscription?
                                    </p>
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => setShowCancelSubscription(false)}
                                            type="button"
                                            className="rounded-full font-[500] px-4 py-1 border border-secondary text-secondary hover:bg-secondary hover:text-white"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={async () => await handleClickCancelSubscription()}
                                            type="button"
                                            className="rounded-full font-[500] px-4 py-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white gap-2 inline-flex items-center justify-center"
                                        >
                                            {resMessages?.status === "loading" ? (
                                                <Fragment>
                                                    <LuLoaderCircle className="flex-shrink-0 animate-spin" />
                                                    Cancelling...
                                                </Fragment>
                                            ) :
                                                "Cancel Subscription"
                                            }

                                        </button>
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
