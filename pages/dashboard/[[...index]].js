import DashboardLayout from "@/components/DashboardLayout";
import Settings from "@/components/DashboardMain/Settings";
import FeatureGate from "@/components/DashboardMain/FeatureGate";
import { DashboardProvider } from "@/context/useDashboardContext";
import { useRouter } from "next/router";
import { useAuthContext } from "@/context/useAuthContext";
import ChatbotsSection from "@/components/DashboardMain/Chatbots";
import AgentsSection from "@/components/DashboardMain/AgentsSection";
import { Fragment } from "react";
import { NextSeo } from "next-seo";
import PaymentVerification from "@/components/Modals/PaymentVerification";
import { FlowProvider } from "@/context/FlowContext";
import MediaSection from "@/components/DashboardMain/Media";

const gatedPages = ["/chatbots", "/agents","/media"];

export default function DashboardPage() {

    const router = useRouter();

    const { loginUser } = useAuthContext();

    const currentPage = `/${router.query?.index?.[0]}${router.query?.index?.[1] ? `/${router.query?.index?.[1]}` : ""}`;

    const firstPath = `/${router.query?.index?.[0]}`;
    if (!router.isReady) return;

    return (
        <Fragment>
            <NextSeo
                title="Agentzee AI | Dashboard"
            />
            <DashboardProvider>
                <FlowProvider>
                    <DashboardLayout>
                        {(gatedPages.includes(firstPath)) && (
                            <FeatureGate>
                                {(firstPath === "/chatbots") && (
                                    <ChatbotsSection />
                                )}
                                {(firstPath === "/agents") && (
                                    <AgentsSection />
                                )}
                                {(firstPath === "/media") && (
                                    <MediaSection />
                                )}

                            </FeatureGate>
                        )}

                        {firstPath === "/settings" && (
                            <Settings />
                        )}
                    </DashboardLayout>

                    {(loginUser && (!loginUser?.user_plan || loginUser?.user_plan === "free")) &&
                        <PaymentVerification
                            open={firstPath === "/agents" && (router?.query?.payment === "razorpay" || router?.query?.payment === "stripe" || router?.query?.payment === "free-trial")}
                        />
                    }
                </FlowProvider>
            </DashboardProvider>
        </Fragment>
    )
}