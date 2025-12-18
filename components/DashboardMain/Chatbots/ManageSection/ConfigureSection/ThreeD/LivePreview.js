import { useDashboardContext } from "@/context/useDashboardContext";
import { useEffect, useMemo, useState } from "react";
import { FaChevronDown, FaExclamationTriangle, FaEye, FaMicrophone } from "react-icons/fa";
import clsx from "clsx";
import { LuLoaderCircle } from "react-icons/lu";
import { FaCircleXmark } from "react-icons/fa6";
import { retrieveOrRemove } from "@/utils/fetchUtils";
import AvatarViewer from "@/components/Avatar/AvatarViewer";
import { animationsToggles } from "@/constants";
import { chatbotSitemapProcessingStatusApiPath } from "@/constants/apiPaths";
import { useRouter } from "next/router";

export default function LivePreview() {

    const router = useRouter();

    const { chatbotAvatars, chatbotConfigurations, chatbotSitemapProcessingStatus, setChatbotSitemapProcessingStatus } = useDashboardContext();

    const [animationName, setAnimationName] = useState('relaxing');

    const [fetchingField, setFetchingField] = useState({
        preview_panel: {
            status: null,
            message: null
        }
    });


    useEffect(() => {

        initialRequirements();

    }, []);

    const initialRequirements = async () => {
        if (Object.values(chatbotSitemapProcessingStatus).length === 0 || !chatbotSitemapProcessingStatus?.is_ready) {
            await pollSitemapProcessingStatus();
        }
    }

    const handleClickPreviewPanel = () => {
        const widgetScript = document.getElementById("agentzee-widget-script");
        if (widgetScript) {
            widgetScript.setAttribute("agentzeeAgentId", agents?.id || "");
            widgetScript.setAttribute("src", `${process.env.WIDGET_SCRIPT_URL}?agentId=${agents?.id}`);
            const triggerer = document.getElementById("trigger-agentzee-agent");
            if (triggerer) {
                triggerer.click();
                const chatWidget = document.getElementById("agentzee-widget-triggerer");
                if (chatWidget) chatWidget.click();
            }
        }
    }

    const pollSitemapProcessingStatus = async () => {

        const maxTries = 50, timing = 3000;
        let totalCalls = 0;

        setFetchingField(prev => ({
            ...prev,
            preview_panel: {
                ...prev.preview_panel,
                status: "loading",
                message: "Fetching sitemap processing status..."
            }
        }));

        const timeIntervel = setInterval(async () => {

            ++totalCalls;

            const data = await getSitemapProcessingStatus(router?.query?.id);

            if (!data) {
                clearInterval(timeIntervel);
                return;
            }

            setFetchingField(prev => ({
                ...prev,
                preview_panel: {
                    ...prev.preview_panel,
                    message: `Processed ${data?.completed_count} out of ${data?.total_pages}.`
                }
            }));


            if (data?.is_ready) {
                clearInterval(timeIntervel);
                setFetchingField(prev => ({
                    ...prev,
                    preview_panel: {
                        ...prev.preview_panel,
                        status: "ok",
                        message: null
                    }
                }));
                // const resultCustomization = await getCustomizationData(agentsData?.[0]?.customization);
                // if (resultCustomization) {
                //     setFetchingField(prev => ({
                //         ...prev,
                //         chat_panel: {
                //             ...prev.chat_panel,
                //             status: null,
                //             message: null
                //         }
                //     }));
                // }
                return;
            }

            if (maxTries === totalCalls) {
                clearInterval(timeIntervel);
                setFetchingField(prev => ({
                    ...prev,
                    preview_panel: {
                        ...prev.preview_panel,
                        status: "err4xx",
                        message: "Sitemap process is taking longer than expected. Please try again"
                    }
                }));
                return;
            }

        }, timing);

    }

    const getSitemapProcessingStatus = async (chatbot_id = null) => {

        if (!chatbot_id) return;

        const response = await retrieveOrRemove("GET", `${chatbotSitemapProcessingStatusApiPath}?chatbot_id=${chatbot_id}`, true);
        let resData = null;

        try {
            resData = await response?.json();
        }
        catch (e) { }

        if (response?.status >= 400 && response?.status < 500) {
            setFetchingField(prev => ({
                ...prev,
                preview_panel: {
                    ...prev.preview_panel,
                    status: "err4xx",
                    message: resData?.message || "Unable to fetch the sitemap processing status."
                }
            }));

            return false;
        }
        if (response?.status >= 500) {
            setFetchingField(prev => ({
                ...prev,
                preview_panel: {
                    ...prev.preview_panel,
                    status: "err5xx",
                    message: response?.message || resData?.message || "Server error while fetching sitemap processing status."
                }
            }));

            return false;
        }

        if (response?.status === 200) {

            setChatbotSitemapProcessingStatus(resData?.data || {});
            return resData?.data;
        }

    };

    const selectedAvatarStyle = useMemo(() => {
        return chatbotAvatars.find(style => style?.id === chatbotConfigurations?.configure?.['3d']?.avatar);
    }, [chatbotConfigurations?.configure?.['3d']?.avatar, chatbotAvatars]);

    return (
        <div className="col-span-3 flex flex-col">
            <div className="flex items-center gap-3 mb-2">
                <FaEye className="flex-shrink-0 size-5 text-secondary" />
                <h3 className="text-lg font-semibold">Live Preview</h3>
            </div>
            <p className="dark:text-dark-text-secondary text-light-text-secondary mb-6">Here's how your AI chat interface will look</p>
            <div className="relative overflow-hidden bg-light-bg-primary rounded-xl border min-h-[300px] h-[600px]">

                {(fetchingField?.preview_panel?.status === "loading" || fetchingField?.preview_panel?.status === "err4xx" || fetchingField?.preview_panel?.status === "err5xx") && (
                    <div
                        style={{
                            borderRadius: chatbotConfigurations?.configure?.website?.border_radius
                        }}
                        className={clsx("absolute z-20 inset-0 backdrop-blur flex items-center justify-center bg-black/70 text-white text-lg border-none font-medium transition-all duration-300 gap-2.5",
                            (fetchingField?.preview_panel?.status === "loading") ? "flex-row" : "flex-col"
                        )}
                    >

                        {fetchingField?.preview_panel?.status === "loading" && (
                            <LuLoaderCircle className="size-6 animate-spin text-secondary" />
                        )}

                        {fetchingField?.preview_panel?.status === "err4xx" && (
                            <FaCircleXmark className="size-6 text-red-400" />
                        )}

                        {fetchingField?.preview_panel?.status === "err5xx" && (
                            <FaExclamationTriangle className="size-6 text-orange-400" />
                        )}

                        {fetchingField?.preview_panel?.message && (
                            <p className="font-[500] text-lg text-white text-center">
                                {fetchingField?.preview_panel?.message}
                            </p>
                        )}

                        {fetchingField?.preview_panel?.status !== "loading" && (
                            <button
                                type="button"
                                onClick={async () => await pollSitemapProcessingStatus()}
                                className="inline-flex items-center justify-center border border-secondary text-secondary rounded-full px-4 py-0.5 font-[500] hover:bg-secondary hover:text-white"
                            >
                                Retry
                            </button>
                        )}

                    </div>
                )}

                 {(selectedAvatarStyle?.three_d_file_url && chatbotSitemapProcessingStatus?.is_ready) && (
                    <AvatarViewer
                        avatarId={selectedAvatarStyle?.id}
                        avatarPath={selectedAvatarStyle?.three_d_file_url}
                        avatarThumbnail={selectedAvatarStyle?.avatar_preview_image_url}
                        animationName={animationName}
                    />
                )}

                <div className="inline-flex items-center justify-center gap-2 absolute top-4 left-4 z-10 capitalize cursor-pointer p-2 rounded-lg border border-gray-600">
                    <span className="text-light-text-primary font-[500]">
                        English
                    </span>
                    <FaChevronDown className="text-light-text-primary" />
                </div>

                <div id="animation-toggles" className="absolute top-1/2 -translate-y-1/2 z-10 right-4 flex flex-col gap-4">
                    {animationsToggles.map((toggle, index) => (
                        <button
                            key={index}
                            // onClick={() => setAnimationName(toggle?.name)}
                            className={clsx("relative group w-10 h-10 flex items-center justify-center text-white bg-gradient-to-r from-primary to-secondary rounded-full ring-offset-2 ring-offset-dark-bg-primary ring-primary",
                                // animationName === toggle.name ? "ring-2" : "hover:opacity-80"
                            )}
                        >
                            <toggle.icon className="size-6" />
                            <span className="bg-dark-card-primary rounded-lg text-white absolute p-2 w-max text-sm group-hover:block hidden right-16 border border-dark-border-primary">
                                {toggle.text}
                            </span>
                        </button>
                    ))}
                </div>


                <button
                    // onClick={!isRecording ? handleStart : handleStop}
                    type="button"
                    className="absolute z-10 top-0 right-0 w-16 h-16 bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center rounded-bl-full shadow-lg hover:opacity-80 transition"
                >
                    {/* {isRecording ?
                        <AnimateWave animate={isListening} bgColor="bg-white" rootClass="mb-4 ml-4" /> :
                        <FaMicrophone className="size-8 mb-4 ml-4" />
                    } */}
                    <FaMicrophone className="size-6 mb-4 ml-3" />
                </button>
            </div>
        </div>
    )
}
