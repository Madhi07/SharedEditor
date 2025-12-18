import Link from "next/link";
import { pricingPlans } from "./constants";
import clsx from "clsx";
import { Fragment, useRef, useState } from "react";
import { useAuthContext } from "@/context/useAuthContext";
import { useRouter } from "next/router";
import { useIpContext } from "@/context/useIpContext";
import { createTrialSubscriptionApiPath, razorpayCreateSubscriptionApiPath, stripeCreateSubscriptionApiPath } from "@/constants/apiPaths";
import { createOrUpdate } from "@/utils/fetchUtils";
import { LuLoaderCircle } from "react-icons/lu";
import { FaCheckCircle } from "react-icons/fa";

export default function PricingSection({ darkMode }) {
    const router = useRouter();
    const { loginUser, loading } = useAuthContext();
    const { ipConfigData } = useIpContext();
    const [planClicked, setPlanClicked] = useState(null);
    const pricingFormRef = useRef();


    const handlePricingBtnClick = async (data = {}) => {
        if (!loginUser?.token) {
            router.push('/login');
            return;
        }

        if (data?.plan === "agentzee_enterprise") {
            router.push("/contact-us");
            return;
        }

        if (loginUser?.user_plan !== "free") {
            router.push("/dashboard/agents/chats");
            return;
        }

        if (data?.plan === "agentzee_starter") {
            setPlanClicked(data?.name);
            const formData = new FormData();
            formData.append("plan", data?.plan);
            formData.append("user", loginUser?.user_id);
            const res = await createOrUpdate(formData, "POST", createTrialSubscriptionApiPath, true);
            if (res?.status === 201) {
                router.push("/dashboard/agents/chats?payment=free-trial");
                setPlanClicked(null);
                return true;
            }
        }
        else {
            if (pricingFormRef.current) {
                const planInput = pricingFormRef.current.querySelector("input[name='plan']");
                if (planInput) {
                    planInput.setAttribute("value", data?.plan);
                }

                if (loginUser?.country !== "India") {
                    const lookupKeyInput = pricingFormRef.current.querySelector("input[name='lookup_key']");
                    if (lookupKeyInput) {
                        lookupKeyInput.setAttribute("value", data?.lookup_key);
                    }
                    pricingFormRef.current.setAttribute('action', `${process.env.API_URL}${stripeCreateSubscriptionApiPath}`);
                    pricingFormRef.current.setAttribute('method', 'POST');
                    pricingFormRef.current.submit();
                }
                else {
                    setPlanClicked(data?.name);
                    const formData = new FormData();
                    formData.append("plan", data?.plan);
                    formData.append("plan_id", data?.razorpay_plan_id);
                    formData.append("user", loginUser?.user_id);
                    const res = await createOrUpdate(formData, "POST", razorpayCreateSubscriptionApiPath, true);
                    if (res?.status === 200 || res?.status === 201) {
                        const resData = await res?.json();
                        const options = {
                            key: resData?.data?.razorpay_key,
                            subscription_id: resData?.data?.subscription?.id,
                            name: 'AgentZee AI',
                            image: "https://agentzee.ai/agentzee-face-color.png",
                            handler: function (response) {
                                router.push("/dashboard/agents/chats?payment=razorpay");
                                return;
                            },
                            method: {
                                card: true,
                                netbanking: false,
                                upi: true,
                                wallet: false,
                                emi: false,
                            },
                            prefill: {
                                email: loginUser?.email
                            },
                            theme: {
                                color: '#6E3AFF'
                            },
                            modal: {
                                ondismiss: () => {
                                    setPlanClicked(null);
                                    return;
                                }
                            }
                        };

                        const rzp = new Razorpay(options);
                        rzp.open();

                        rzp.on('payment.failed', function (response) {
                            setPlanClicked(null);
                            return;
                        })
                    }
                }
            }
        }

    }

    return (
        <div className="relative">
            <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full bg-primary/20 filter blur-[150px]"></div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className={clsx("inline-block px-4 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border mb-4",
                        darkMode ? "dark:border-dark-border-primary border-light-border-primary" : "border-white/10"
                    )}>
                        <p className="text-sm font-medium">Simple Pricing</p>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Choose Your Plan</h2>
                    <p className={clsx("text-xl",
                        darkMode ? "dark:text-dark-text-secondary text-light-text-secondary" : "text-gray-300"
                    )}>
                        Flexible pricing options to fit businesses of all sizes. No hidden fees.
                    </p>
                </div>

                <form ref={pricingFormRef} className="grid grid-cols-1 xl:grid-cols-4 gap-6 md:grid-cols-2">
                    {pricingPlans.map((plan) => (
                        <div
                            key={plan.plan}
                            className={clsx("relative bg-gradient-to-br border rounded-2xl p-8 hover:border-secondary/30 transition-all duration-300",
                                plan.popular ? "scale-105 shadow-lg bg-gradient-to-br from-primary/20 to-secondary/20 border-white/10" :
                                    `${darkMode ? "dark:bg-dark-card-primary bg-light-card-primary dark:border-dark-border-primary border-light-border-primary" : "from-dark-bg-secondary to-dark-bg-primary border-white/5"}`,
                            )}
                        >
                            {plan.popular &&
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary px-4 py-1 rounded-full text-sm font-medium text-white">
                                    Most Popular
                                </div>
                            }

                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <p className={clsx("mb-6",
                                darkMode ? "dark:text-dark-text-secondary text-light-text-secondary" : 'text-gray-400'
                            )}>
                                {plan.description}
                            </p>

                            <div className="mb-6">
                                <span className="text-5xl font-bold">
                                    {!loading && (
                                        (loginUser?.country) ?
                                            (loginUser?.country === "India") ?
                                                plan?.priceINR :
                                                plan?.priceUSD :
                                            (ipConfigData?.country_name === "India") ?
                                                plan?.priceINR :
                                                plan?.priceUSD
                                    )}


                                </span>
                                <span className={clsx(darkMode ? "dark:text-dark-text-secondary text-light-text-secondary" : 'text-gray-400')}>/month</span>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className={clsx("flex items-start", feature?.liClassName && feature?.liClassName)}>
                                        <feature.icon
                                            className={clsx("mt-1 mr-3", feature?.iconClassName && feature?.iconClassName)}
                                        />
                                        <span>{feature?.text}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                type="button"
                                disabled={planClicked ? true : false}
                                onClick={() => handlePricingBtnClick(plan)}
                                className={clsx("flex items-center justify-center w-full backdrop-blur-sm border border-white/10 transition-colors px-8 py-3 rounded-full font-medium cursor-pointer",
                                    plan.popular ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white" :
                                        `${darkMode ? "dark:bg-dark-bg-primary bg-light-bg-primary dark:border-dark-border-primary border-light-border-primary hover:!bg-opacity-60" : "bg-white/10 hover:bg-white/20 text-white"}`
                                )}
                            >
                                {(planClicked === plan.name) ?
                                    <LuLoaderCircle className="animate-spin" /> :
                                    plan?.buttonText
                                }
                            </button>

                            {!plan.is_credit_card_required && (
                                <div className="flex items-center gap-2 mt-4 justify-center animate-pulse">
                                    <FaCheckCircle className="text-secondary text-sm"/>
                                    <p className="text-sm text-center text-secondary font-[500]">
                                        No credit card required.
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="hidden">
                        <input
                            readOnly
                            type="text"
                            name="user"
                            value={loginUser?.user_id || ""}
                        ></input>
                        <input
                            readOnly
                            type="text"
                            name="plan"
                            value={''}
                        ></input>
                        <input
                            type="text"
                            name='success_url'
                            readOnly
                            value={`${process.env.WEB_URL}/dashboard/agents/chats?payment=stripe`}
                        ></input>
                        <input
                            type="text"
                            name='failed_url'
                            readOnly
                            value={`${process.env.WEB_URL}/dashboard/agents/chats?payment=stripe`}
                        ></input>
                        <input
                            readOnly
                            type="text"
                            name="lookup_key"
                            value={''}
                        ></input>
                    </div>
                </form>
            </div>
        </div >
    )
}
