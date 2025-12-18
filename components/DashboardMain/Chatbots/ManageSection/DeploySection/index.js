import clsx from "clsx";
import WebsiteSection from "./Website";
import { useEffect, useMemo } from "react";
import { useDashboardContext } from "@/context/useDashboardContext";
import { useRouter } from "next/router";
import { FaChevronCircleLeft, FaRegCheckCircle } from "react-icons/fa";
import { useAuthContext } from "@/context/useAuthContext";

export default function DeploySection({ setSelectedStep }) {

    const router = useRouter();

    const { updateLoginUser, loginUser } = useAuthContext();

    const { chatbots, chatbotStepper, setChatbotStepper, chatbotConfigurations } = useDashboardContext();



    useEffect(() => {
        handleUpdateChatbotIntegration();
    }, []);

    const handleUpdateChatbotIntegration = async () => {
        if (!router?.query?.code || !router?.query?.provider) return;

        const res = await fetch(
            `${process.env.WEB_URL}/api/get-token?provider=${router?.query?.provider}`,
            {
                method: "GET"
            }
        );

        let resData = null;

        try {
            resData = await res?.json();
        }
        catch (e) { }

        if (res?.status === 200) {
            const data = {
                chatbotsIntegrations: {
                    ...(loginUser?.chatbotsIntegrations && loginUser?.chatbotsIntegrations),
                    [router?.query?.id]: {
                        ...(loginUser?.chatbotsIntegrations?.[router?.query?.id] && loginUser?.chatbotsIntegrations?.[router?.query?.id]),
                        [router?.query?.provider]: resData || {}
                    }
                }
            };

            updateLoginUser(data);
            router.push({
                pathname: router.pathname,
                query: {
                    index: router?.query?.index,
                    id: router?.query?.state,
                }
            });
        }
    }


    const onBackClick = () => {
        const currentStepIndex = chatbotStepper?.findIndex(obj => obj.id === "deploy");
        if ((currentStepIndex - 1) < chatbotStepper?.length) {
            setSelectedStep(chatbotStepper?.[currentStepIndex - 1]?.id);
        }
        return;
    }

    const platforms = useMemo(() => {
        const data = chatbots?.find(item => item?.id === router?.query?.id);
        return data?.platforms || []
    }, [chatbots]);

    return (
        <div
            className={clsx("w-full mx-auto transform transition-all duration-300")}
        >
            <div className="w-full flex flex-col gap-6 mb-6">
                {platforms?.includes("Website") &&
                    <WebsiteSection />
                }

                <div className="w-full xl:p-6 p-4 rounded-lg bg-light-card-primary shadow border border-light-border-primary">
                    <FaRegCheckCircle className="flex-shrink-0 mx-auto size-8 text-green-400 mb-4" />
                    <p className="font-[500] text-light-text-primary text-lg text-center">
                        Chatbot is successfully configured!
                    </p>
                </div>

            </div>

            <div className="flex w-full items-center justify-between">
                <button
                    onClick={onBackClick}
                    className="flex justify-center w-max items-center gap-2 px-4 py-2 rounded-full border dark:border-dark-border-primary border-light-border-primary hover:opacity-80 hover-elevate font-[500]"
                >
                    <FaChevronCircleLeft />
                    Back
                </button>

            </div>
        </div>
    )
}
