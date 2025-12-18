import { Fragment, useEffect, useState } from "react";
import { topNavs } from "./constants";
import clsx from "clsx";
import UserInfoCard from "./UserInfoCard";
import SubscriptionCard from "./SubscriptionCard";
import UsageOverview from "./UsageOverview";
import { retrieveOrRemove } from "@/utils/fetchUtils";
import { userInfoApiPath } from "@/constants/apiPaths";
import { useAuthContext } from "@/context/useAuthContext";
import { useRouter } from "next/router";
import PricingSection from "@/components/LandingPage/PricingSection";

export default function Settings() {

    const router = useRouter();

    const { updateLoginUser } = useAuthContext();

    useEffect(() => {
        getUserInfo();
    }, []);

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

    const handleClickTab = (tab = "") => {
        if (!tab) return;

        if (router.query?.tab?.toLowerCase() === tab.toLowerCase()) return;

        router.push({
            pathname: router.pathname,
            query: {
                index: router?.query?.index,
                tab: tab.toLowerCase()
            }
        });
    }


    const selectedTab = router?.query?.tab || "account";

    return (
        <div className="w-full h-full transition-all duration-300 overflow-hidden relative overflow-y-auto p-4 flex flex-col">

            <div id="settings-header" className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Settings</h2>
                        <p className="dark:text-dark-text-secondary text-light-text-secondary mt-1">Manage your account, billing, and preferences.</p>
                    </div>
                </div>
            </div>

            <div id="settings-tabs" className="mb-6 sticky -top-4 z-20 bg-light-bg-primary">
                <div className="border-b dark:border-dark-border-primary border-light-border-primary">
                    <nav className="flex space-x-6">
                        {topNavs.map((item, index) => (
                            <button
                                onClick={() => handleClickTab(item)}
                                key={index}
                                className={clsx("py-2 px-1 border-b-2 font-medium text-sm",
                                    (selectedTab.toLowerCase() === item.toLowerCase()) ? "border-secondary text-secondary" : "border-transparent dark:text-dark-text-secondary text-light-text-secondary"
                                )}
                            >
                                {item}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {selectedTab === "account" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <UserInfoCard />
                    <SubscriptionCard />
                </div>
            )}

            {selectedTab === "billing" && (
                <div className="pb-6">
                    <PricingSection
                        darkMode={true}
                    />
                </div>
            )}

            {/* <section id="usage-overview" className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Usage Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <UsageOverview />
                </div>
            </section> */}
        </div>
    )
}
