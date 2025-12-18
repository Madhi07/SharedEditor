import { useAuthContext } from "@/context/useAuthContext";
import { formatLabel } from "@/utils";
import { Fragment, useState } from "react";
import { format, parseISO } from "date-fns";
import CancelSubscription from "@/components/Modals/Dashboard/CancelSubscription";
import { useRouter } from "next/router";
import { FaLock } from "react-icons/fa";

export default function SubscriptionCard() {
    const router = useRouter();
    const { loginUser, updateLoginUser } = useAuthContext();
    const [showCancelSubscription, setShowCancelSubscription] = useState(false);

    const handleClickViewPlan = () => {
        router.push({
            pathname: router.pathname,
            query: {
                index: router?.query?.index,
                tab: "billing"
            }
        });
    }

    return (
        <div id="subscription-card" className="bg-light-card-primary rounded-2xl shadow-sm border border-light-border-primary p-6">
            <h3 className="text-lg font-semibold text-light-text-primary mb-6">Subscription</h3>

            {loginUser?.user_plan === "free" ? (
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-secondary/50 to-secondary/5 flex items-center justify-center">
                        <FaLock className="text-2xl text-secondary" />
                    </div>


                    <h2 className="text-xl font-bold mb-3">Upgrade to Unlock Premium Features</h2>


                    <p className="dark:text-dark-text-secondary text-light-text-secondary leading-relaxed font-[500] mb-3">
                        You're currently on the Free Plan. Upgrade to access advanced dashboard insights,
                        full chat history, and powerful agent management tools.
                    </p>

                    <button
                        onClick={handleClickViewPlan}
                        className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-2 px-4 rounded-lg hover:from-primary/80 hover:to-secondary/80 transition-all duration-200"
                    >
                        View Plans
                    </button>
                </div>
            ) : (
                <Fragment>
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <span className="bg-secondary/20 text-secondary px-2 py-1 rounded-full text-xs font-[500] capitalize">
                                    {formatLabel(loginUser?.user_plan)}
                                </span>
                                {loginUser?.subscription_status && (
                                    <span className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs font-[500] capitalize">
                                        {formatLabel(loginUser?.subscription_status)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex justify-between text-sm text-light-text-secondary mb-2">
                                <span className="font-[500]">Trial Progress</span>
                                <span>
                                    {`${loginUser?.trial_info?.trial_current_day} of ${loginUser?.trial_info?.trial_total_days} days used`}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    style={{
                                        width: `${Math.min((loginUser?.trial_info?.trial_current_day / loginUser?.trial_info?.trial_total_days) * 100, 100)}%`
                                    }}
                                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        {loginUser?.trial_info?.trial_end_date && (
                            <div className="flex justify-between text-sm">
                                <span className="text-light-text-secondary font-[500]">Trial ends on</span>
                                <span className="text-light-text-secondary">
                                    {`${format(parseISO(loginUser?.trial_info?.trial_end_date), "LLLL do, yyyy h:mm a")}`}
                                </span>
                            </div>
                        )}

                        {loginUser?.next_billing_cycle_date && (
                            <div className="flex justify-between text-sm">
                                <span className="text-light-text-secondary font-[500]">Next billing</span>
                                <span className="text-light-text-secondary">
                                    {`${format(parseISO(loginUser?.next_billing_cycle_date), "LLLL do, yyyy h:mm a")}`}
                                </span>
                            </div>
                        )}
                        {/* <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Auto-renew</span>
                    <div className="flex items-center space-x-1">
                        <i className="text-green-500 text-xs" data-fa-i2svg=""><svg className="svg-inline--fa fa-circle-check" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg></i>
                        <span className="text-green-600">Enabled</span>
                    </div>
                </div> */}
                    </div>

                    <div className="flex space-x-3">
                        {loginUser?.user_plan !== "agentzee_starter" && (
                            <button
                                onClick={() => setShowCancelSubscription(true)}
                                className="flex-1 border border-red-600 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                Cancel Subscription
                            </button>
                        )}
                        <button
                            onClick={handleClickViewPlan}
                            className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-2 px-4 rounded-lg hover:from-primary/80 hover:to-secondary/80 transition-all duration-200"
                        >
                            View Plans
                        </button>
                    </div>
                </Fragment>
            )}


            {showCancelSubscription && (
                <CancelSubscription
                    setShowCancelSubscription={setShowCancelSubscription}
                />
            )}
        </div>
    )
}
