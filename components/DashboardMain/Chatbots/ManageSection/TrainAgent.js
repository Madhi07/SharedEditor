import { useRef, useState } from "react";
import { FaChevronCircleLeft, FaChevronCircleRight, FaSitemap } from "react-icons/fa";
import { MdOutlineRefresh } from "react-icons/md";
import { LuBadgeCheck } from "react-icons/lu";
import clsx from "clsx";
import { sitemapUrlRegExp, urlRegExp } from "@/constants";
import { createOrUpdate, retrieveOrRemove } from "@/utils/fetchUtils";
import { useAuthContext } from "@/context/useAuthContext";
import {  chatbotSitemapApiPath } from "@/constants/apiPaths";
import { useDashboardContext } from "@/context/useDashboardContext";
import FieldMessage from "./FieldMessage";
import { useRouter } from "next/router";
import { requiredAgentConfigurationFields } from "./constants";

export default function TrainAgent({ setSelectedStep }) {

    const router = useRouter();
    const { loginUser } = useAuthContext();
    const patchTimeoutRef = useRef(null);
    const { chatbots, chatbotConfigurations, chatbotCustomizationData, setChatbotCustomizationData, setChatbotConfigurations, chatbotStepper, setChatbotStepper } = useDashboardContext();
    const [formMessages, setFormMessages] = useState({
        sitemap_url: {
            status: null,
            message: null
        }
    });

    const onSitemapUrlChange = async (event) => {

        if (formMessages?.sitemap_url?.status || formMessages?.sitemap_url?.message) {
            setFormMessages(prev => ({
                ...prev,
                sitemap_url: {
                    ...prev,
                    status: null,
                    message: null
                }
            }));
        }

        setChatbotConfigurations(prev => ({
            ...prev,
            train: {
                ...prev?.train,
                sitemap_url: event.target.value
            }
        }));

        if (patchTimeoutRef.current) {
            clearTimeout(patchTimeoutRef.current);
        }

        patchTimeoutRef.current = setTimeout(async () => {

            // if (!sitemapUrlRegExp.test(event.target.value)) {
            if (!urlRegExp.test(event.target.value)) {
                setFormMessages(prev => ({
                    ...prev,
                    sitemap_url: {
                        ...prev,
                        status: "required",
                        message: "Please enter an valid Sitemap URL to proceed...!!!"
                    }
                }));
                return;
            }

            const payload = {
                sitemap_url: event.target.value,
                company_id: loginUser?.company_profile_id,
                chatbot_id: router?.query?.id
            }

            const result = await createChatbotSitemap(payload, "sitemap_url");

            if (!result) {
                setChatbotConfigurations(prev => ({
                    ...prev,
                    train: {
                        ...prev?.train,
                        sitemap_url: ""
                    }
                }));
            }
            else {
                await pollGetSitemapData();
            }

        }, 1000);
    }

    const createChatbotSitemap = async (payload = {}, field = null) => {
        if (Object.values(payload).length === 0 || !field) return;

        setFormMessages(prev => ({
            ...prev,
            [field]: {
                ...prev?.[field],
                status: "loading",
                message: "Processing your sitemap URL..."
            }
        }));
        const res = await createOrUpdate(payload, "POST", chatbotSitemapApiPath, true);
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
                    message: resData?.message || "Invalid input, please check and try again."
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

        if (res?.status === 200 || res?.status === 201) {
            // const resData = await res?.json();
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

    const getChatbotSitemap = async (chatbot_id = null, field = null) => {

        if (!chatbot_id || !field) return;

        const res = await retrieveOrRemove("GET", `${chatbotSitemapApiPath}?chatbot_id=${chatbot_id}`, true);
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
                    message: resData?.[field]?.[0] || "Invalid input, please check and try again."
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
                    message: "Server issue, please try again later."
                }
            }));
            return false;
        }

        if (res?.status === 200) {
            return resData?.data;
        }
    };

    const pollGetSitemapData = async () => {

        setFormMessages(prev => ({
            ...prev,
            sitemap_url: {
                ...prev.sitemap_url,
                status: "loading",
                message: "Checking sitemap progress..."
            }
        }));

        const maxTries = 5, interval = 3000;
        let totalCalls = 0;
        const timeIntervel = setInterval(async () => {
            ++totalCalls;

            const sitemapData = await getChatbotSitemap(router?.query?.id, "sitemap_url");

            if (!sitemapData) {
                clearInterval(timeIntervel);
                return;
            }

            if (sitemapData?.length > 0) {
                clearInterval(timeIntervel);
                setFormMessages(prev => ({
                    ...prev,
                    sitemap_url: {
                        ...prev.sitemap_url,
                        status: null,
                        message: null
                    }
                }));
                setChatbotCustomizationData(prev => ({
                    ...prev,
                    sitemap_url: sitemapData?.[0]?.sitemap_url || ""
                }));
                return;
            }


            if (totalCalls === maxTries) {

                setFormMessages(prev => ({
                    ...prev,
                    sitemap_url: {
                        ...prev.sitemap_url,
                        status: "timeout-exceeded",
                        message: "Sitemap is taking longer than expected. Please try again"
                    }
                }));
                clearInterval(timeIntervel);
                return;
            }

        }, interval);
    }

    const onNextClick = () => {

        const hasAnyFormMessages = Object.values(formMessages).some(
            ({ status, message }) => (status || message)
        );

        if (hasAnyFormMessages) {
            const el = document.getElementById("action-required");
            if (el) {
                el.scrollIntoView({ block: "center", behavior: "smooth" });
            }
            return;
        };

        let allFilled = true;

        const { train } = requiredAgentConfigurationFields;

        train.forEach((field) => {
            const value = chatbotConfigurations?.train?.[field];

            if (!value) {
                allFilled = false;
                setFormMessages((prev) => ({
                    ...prev,
                    [field]: {
                        ...prev?.[field],
                        message: "This field is required...!!!",
                        status: "required",
                    },
                }));
            }
        });


        setChatbotStepper(prev =>
            prev?.map(item =>
                item.id === "train" ? { ...item, completed: allFilled } : item
            )
        );

        if (allFilled) {
            const currentStepIndex = chatbotStepper?.findIndex(obj => obj.id === "train");
            if ((currentStepIndex + 1) < chatbotStepper?.length) {
                setSelectedStep(chatbotStepper?.[currentStepIndex + 1]?.id);
            }
            return;
        }
        else {
            setTimeout(() => {
                const el = document.getElementById("action-required");
                if (el) {
                    el.scrollIntoView({ block: "center", behavior: "smooth" });
                }
            }, 100);
            return;
        }
    };

    const onBackClick = () => {
        const currentStepIndex = chatbotStepper?.findIndex(obj => obj.id === "train");
        if ((currentStepIndex - 1) < chatbotStepper?.length) {
            setSelectedStep(chatbotStepper?.[currentStepIndex - 1]?.id);
        }
        return;
    }

    return (
        <div
            className={clsx("xl:w-[85%] w-full mx-auto transform transition-all duration-300")}
        >

            <div id="sectionC" className="mb-6">
                <h3 className="text-xl font-medium mb-2">Enter the Sitemap URL</h3>
                <p className="dark:text-dark-text-secondary text-light-text-secondary mb-4">Provide the sitemap URL to help your agent navigate your website structure</p>

                <div className="bg-light-card-primary shadow rounded-lg p-5 border border-light-border-primary">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <div className="relative flex items-center">
                                <FaSitemap className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
                                <input
                                    type="text"
                                    value={chatbotConfigurations?.train?.sitemap_url}
                                    disabled={(!chatbotConfigurations?.setup?.website_url || chatbotCustomizationData?.sitemap_url || formMessages?.sitemap_url?.status === "loading") ? true : false}
                                    onChange={(event) => onSitemapUrlChange(event)}
                                    placeholder="https://example.com/sitemap.xml"
                                    className="w-full bg-light-bg-primary border border-light-border-primary rounded-lg pl-10 pr-4 py-3 dark:text-dark-text-primary text-light-text-primary focus:border-secondary focus:outline-none disabled:cursor-not-allowed"
                                />

                                {formMessages?.sitemap_url?.status === "timeout-exceeded" && (
                                    <button
                                        onClick={async () => await pollGetSitemapData()}
                                        type="button"
                                        title="Retry"
                                        className="ml-2"
                                    >
                                        <MdOutlineRefresh className="size-6" />
                                    </button>
                                )}

                                {chatbotCustomizationData?.sitemap_url && (
                                    <LuBadgeCheck
                                        title="Verified"
                                        className="text-green-400 font-[500] size-6 ml-2"
                                    />
                                )}
                            </div>
                            <FieldMessage data={formMessages?.sitemap_url} />
                        </div>

                    </div>
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
                <button
                    onClick={onNextClick}
                    className="flex justify-center w-max items-center gap-2 px-4 py-2 rounded-full from-primary to-secondary bg-gradient-to-r text-white hover:opacity-90 hover-elevate font-[500]"
                >
                    Next
                    <FaChevronCircleRight />
                </button>
            </div>
        </div>
    )
}
