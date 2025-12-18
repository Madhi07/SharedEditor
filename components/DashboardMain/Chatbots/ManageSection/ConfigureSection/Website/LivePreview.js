import { useDashboardContext } from "@/context/useDashboardContext";
import { useEffect, useRef, useState } from "react";
import { FaExclamationTriangle, FaEye } from "react-icons/fa";
import DualModePanel from "./DualModePanel";
import AvatarModePanel from "./AvatarModePanel";
import clsx from "clsx";
import { LuLoaderCircle } from "react-icons/lu";
import { FaCircleXmark } from "react-icons/fa6";
import { BsLayoutSplit } from "react-icons/bs";
import { IoTabletPortraitOutline } from "react-icons/io5";
import { PiPersonLight } from "react-icons/pi";
import FieldMessage from "../../FieldMessage";
import { createOrUpdate, retrieveOrRemove } from "@/utils/fetchUtils";
import { chatbotCustomizationsAllApiPath, chatbotCustomizationsWebsiteApiPath, chatbotSitemapProcessingStatusApiPath } from "@/constants/apiPaths";
import { useRouter } from "next/router";
import SimpleChatModePanel from "./SimpleChatModePanel";

export default function LivePreview() {

    const router = useRouter();
    const { chatbots, chatbotConfigurations, setChatbotConfigurations, chatbotCustomizationData, setChatbotCustomizationData, chatbotSitemapProcessingStatus, setChatbotSitemapProcessingStatus } = useDashboardContext();

    const patchTimeoutRef = useRef(null);

    const [fetchingField, setFetchingField] = useState({
        preview_panel: {
            status: null,
            message: null
        }
    });

    const [formMessages, setFormMessages] = useState({
        default_mode: {
            status: null,
            message: null
        }
    }
    );

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

    const handlePatchByField = (field = null, value) => {

        if (!field) return;

        if (formMessages?.[field]?.status || formMessages?.[field]?.message) {
            setFormMessages(prev => ({
                ...prev,
                [field]: {
                    ...prev,
                    status: null,
                    message: null
                }
            }));
        }

        if (chatbotConfigurations?.configure?.website?.[field] === value) return;

        setChatbotConfigurations(prev => ({
            ...prev,
            configure: {
                ...prev.configure,
                website: {
                    ...prev.configure.website,
                    [field]: value
                }
            }
        }));

        if (patchTimeoutRef.current) {
            clearTimeout(patchTimeoutRef.current);
        }


        let payload = {
            [field]: value
        };

        patchTimeoutRef.current = setTimeout(async () => {
            const result = await patchChatbotCustomization(payload, field);
            if (!result) {
                setChatbotConfigurations(prev => ({
                    ...prev,
                    configure: {
                        ...prev.configure,
                        website: {
                            ...prev.configure.website,
                            [field]: null
                        }
                    }
                }));
            }
           
        }, 500);

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


    const patchChatbotCustomization = async (payload = {}, field = null) => {

        if (Object.values(payload).length === 0 || !field) return;


        setFormMessages(prev => ({
            ...prev,
            [field]: {
                ...prev?.[field],
                status: "loading",
                message: "Updating..."
            }
        }));

        const res = await createOrUpdate(payload, "PATCH", `${chatbotCustomizationsWebsiteApiPath}${chatbotCustomizationData?.website?.id}/`, true);
        let resData = null;
        try {
            resData = await res?.json();
        }
        catch (e) { }


        if (res?.status >= 400 && res?.status < 500) {
            setFormMessages(prev => ({
                ...prev,
                [field]: {
                    ...prev?.[field],
                    status: "err4xx",
                    message: resData?.message || resData?.[field]?.[0] || "Unable to update the data, Please try again."
                }
            }));
            return false;
        }

        if (res?.status >= 500) {
            setFormMessages(prev => ({
                ...prev,
                [field]: {
                    ...prev?.[field],
                    status: "err5xx",
                    message: res?.message || resData?.message || "Server issue, please try again later."
                }
            }));
            return false;
        }

        if (res?.status === 200) {
            setFormMessages(prev => ({
                ...prev,
                [field]: {
                    ...prev?.[field],
                    status: null,
                    message: null
                }
            }));
            return resData;
        }

    }

    return (
        <div className="col-span-3">
            <div className="flex items-center gap-3 mb-2">
                <FaEye className="flex-shrink-0 size-5 text-secondary" />
                <h3 className="text-lg font-semibold">Live Preview</h3>
            </div>
            <p className="dark:text-dark-text-secondary text-light-text-secondary mb-6">Here's how your AI chat interface will look</p>
            <div className="relative mb-4 overflow-hidden bg-light-bg-primary rounded-xl">

                {chatbotConfigurations?.configure?.website?.default_mode === "dual_mode" &&
                    <DualModePanel
                        handleClickPreviewPanel={handleClickPreviewPanel}
                    />
                }

                {chatbotConfigurations?.configure?.website?.default_mode === "simple_chat_mode" &&
                    <SimpleChatModePanel
                        handleClickPreviewPanel={handleClickPreviewPanel}
                    />
                }

                {chatbotConfigurations?.configure?.website?.default_mode === "3d_avatar_mode" &&
                    <AvatarModePanel
                        handleClickPreviewPanel={handleClickPreviewPanel}
                    />
                }


                {(fetchingField?.preview_panel?.status === "loading" || fetchingField?.preview_panel?.status === "err4xx" || fetchingField?.preview_panel?.status === "err5xx") && (
                    <div
                        style={{
                            borderRadius: chatbotConfigurations?.configure?.website?.border_radius
                        }}
                        className={clsx("absolute z-10 inset-0 backdrop-blur flex items-center justify-center bg-black/70 text-white text-lg border-none font-medium transition-all duration-300 gap-2.5",
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
            </div>

            <div className="flex items-center justify-end flex-col w-full">
                <div className="overflow-hidden rounded-lg w-max h-max dark:bg-dark-card-primary bg-light-card-primary border dark:border-dark-border-primary border-light-border-primary">
                    {chatbotConfigurations?.configure?.website?.enable_dual_mode && (
                        <button
                            title="Dual Mode"
                            type="button"
                            onClick={() => handlePatchByField('default_mode', "dual_mode")}
                            className={clsx("inline-flex items-center justify-center p-3 border-r  dark:border-dark-border-primary border-light-border-primary",
                                chatbotConfigurations?.configure?.website?.default_mode === "dual_mode" ? "bg-secondary text-white" : "bg-transparent"
                            )}
                        >
                            <BsLayoutSplit className="size-5" />
                        </button>
                    )}

                    {chatbotConfigurations?.configure?.website?.enable_simple_chat_mode && (
                        <button
                            title="Simple Chat Mode"
                            type="button"
                            onClick={() => handlePatchByField('default_mode', "simple_chat_mode")}
                            className={clsx("inline-flex items-center justify-center p-3  border-r dark:border-dark-border-primary border-light-border-primary",
                                chatbotConfigurations?.configure?.website?.default_mode === "simple_chat_mode" ? "bg-secondary text-white" : "bg-transparent"
                            )}
                        >
                            <IoTabletPortraitOutline className="size-5 " />
                        </button>
                    )}

                    {chatbotConfigurations?.configure?.website?.enable_3d_avatar_mode && (
                        <button
                            title="3D Avatar Mode"
                            type="button"
                            onClick={() => handlePatchByField('default_mode', "3d_avatar_mode")}
                            className={clsx("inline-flex items-center justify-center p-3",
                                chatbotConfigurations?.configure?.website?.default_mode === "3d_avatar_mode" ? "bg-secondary text-white" : "bg-transparent"
                            )}
                        >
                            <PiPersonLight className="size-5 " />
                        </button>
                    )}
                </div>

                <FieldMessage data={formMessages?.default_mode} />
            </div>
        </div>
    )
}
