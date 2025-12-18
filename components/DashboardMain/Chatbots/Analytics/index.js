import { Fragment, useEffect, useState } from "react";
import WelcomeSection from "./WelcomeSection";
import MetricCard from "./MetricCard";
import TopIssues from "./DetailedInsights/TopIssues";
import RecentTrends from "./DetailedInsights/RecentTrends";
import { createOrUpdate } from "@/utils/fetchUtils";
import { chatbotDashboardApiPath } from "@/constants/apiPaths";
import { getDateRange } from "@/utils";
import RecentChats from "./DetailedInsights/RecentChats";
import { useDashboardContext } from "@/context/useDashboardContext";
import { FaExclamationCircle, FaExclamationTriangle } from "react-icons/fa";
import { useRouter } from "next/router";

export default function AnalyticsSection() {

    const router = useRouter();

    const { chatbotDashboardData, setChatbotDashboardData } = useDashboardContext();
    const [fetching, setFetching] = useState({
        status: "err4xx",
        message: null
    });
    const [selectedFilter, setSelectedFilter] = useState("Today")

    useEffect(() => {

        initialRequirements();

    }, [router.query?.id]);

    const initialRequirements = async () => {

        if (!router.query?.id) return;

        const dates = getDateRange(selectedFilter);
        const payload = {
            ...dates,
            chatbot_id: router.query?.id
        }
        const resDashboard = await getDashboardAnalytics(payload);
    }

    const getDashboardAnalytics = async (payload = {}) => {

        if (Object.values(payload).length === 0) return;

        setFetching(prev => ({
            ...prev,
            status: "loading"
        }));

        const response = await createOrUpdate(payload, "POST", chatbotDashboardApiPath, true);
        let resData = null;
        try {
            resData = await response?.json();
        }
        catch (e) { }

        if (response.status === 200) {
            setChatbotDashboardData(resData?.data);
            setFetching(prev => ({
                ...prev,
                status: null,
                message: null
            }));
            return true;
        }

        if (response.status >= 400 && response.status < 500) {
            setFetching(prev => ({
                ...prev,
                status: "err4xx",
                message: resData?.message || "Unable to fetch dashboard data."
            }));
            return false;
        }

        if (response.status >= 500) {
            setFetching(prev => ({
                ...prev,
                status: "err5xx",
                message: response?.message || resData?.message || "Server error while fetching dashboard data."
            }));
            return false;
        }


    }

    const onFilterClick = async (filterType = "") => {
        setSelectedFilter(filterType);
        const dates = getDateRange(filterType);
        let payload = {
            chatbot_id: router.query?.id
        }
        if (filterType !== "All") {
            payload = { ...payload, ...dates }
        }
        await getDashboardAnalytics(payload);
    }


    return (
        <div className="overflow-y-auto p-4 w-full h-full">
            {(fetching?.status === "err4xx" || fetching?.status === "err5xx") ? (
                <div className="w-full h-full flex items-center justify-center">
                    <div className="max-w-3xl flex flex-col items-center justify-center p-6 gap-4 dark:bg-dark-card-primary bg-light-card-primary rounded-xl border dark:border-dark-border-primary border-light-border-primary">
                        {fetching?.status === "err4xx" && (
                            <FaExclamationCircle className="text-red-400 size-8" />
                        )}

                        {fetching?.status === "err5xx" && (
                            <FaExclamationTriangle className="text-orange-400 size-8 mb-4" />
                        )}

                        {fetching?.message && (
                            <p className="font-[500] text-lg text-light-text-primary text-center">
                                {fetching?.message}
                            </p>
                        )}

                        <button
                            onClick={async () => await initialRequirements()}
                            type="button"
                            className="px-4 py-1 border border-secondary text-secondary font-[500] rounded-full hover:bg-secondary hover:text-white"
                        >
                            Reload
                        </button>

                    </div>
                </div>
            ) : (
                <Fragment>
                    <section id="welcome-section" className="lg:mb-8 mb-6">
                        <WelcomeSection
                            selectedFilter={selectedFilter}
                            onFilterClick={onFilterClick}
                        />
                    </section>

                    <section id="key-metrics" className="grid grid-cols-2 xl:grid-cols-4 gap-4 lg:mb-8 mb-6">
                        <MetricCard
                            isFetching={fetching?.status === "loading"}
                            title={"Total Chats"}
                            selectedFilter={selectedFilter}
                            data={chatbotDashboardData?.total_chats || {}}
                        />

                        <MetricCard
                            isFetching={fetching?.status === "loading"}
                            title={"Customer Leads"}
                            selectedFilter={selectedFilter}
                            data={chatbotDashboardData?.customer_leads || {}}
                        />

                        <MetricCard
                            isFetching={fetching?.status === "loading"}
                            title={"Average Response Time"}
                            selectedFilter={selectedFilter}
                            data={chatbotDashboardData?.average_response_time || {}}
                        />

                        <MetricCard
                            isFetching={fetching?.status === "loading"}
                            title={"Customer Satisfaction"}
                            selectedFilter={selectedFilter}
                            data={chatbotDashboardData?.customer_satisfaction || {}}
                        />

                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <TopIssues
                            isFetching={fetching?.status === "loading"}
                            data={chatbotDashboardData?.top_issues || []}
                        />
                        <RecentTrends
                            isFetching={fetching?.status === "loading"}
                            data={chatbotDashboardData?.recent_trends || []}
                        />
                        <RecentChats
                            isFetching={fetching?.status === "loading"}
                            data={chatbotDashboardData?.recent_chats || []}
                        />
                    </div>
                </Fragment>
            )}

        </div>
    )
}
