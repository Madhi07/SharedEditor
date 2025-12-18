import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { deployPlatformOptions } from "../constants";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useDashboardContext } from "@/context/useDashboardContext";
import { useAuthContext } from "@/context/useAuthContext";
import Stepper from "./Stepper";
import { retrieveOrRemove } from "@/utils/fetchUtils";
import { chatbotCustomizationsAllApiPath, chatbotCustomizationsWebsiteApiPath } from "@/constants/apiPaths";
import { chatbotConfigurationData, chatbotStepperSchema, chatbotWebsiteConfigurationData, chatbotWebsiteStepperSchema, mapStepComponent, requiredAgentConfigurationFields } from "./constants";
import { LuLoaderCircle } from "react-icons/lu";
import { FaCircleXmark } from "react-icons/fa6";
import { FaExclamationTriangle } from "react-icons/fa";

export default function ManageSection() {

    const router = useRouter();
    const { chatbots, setChatbotConfigurations, setChatbotStepper, setChatbotCustomizationData, setChatbotSitemapProcessingStatus, setChatbotFacebookPages } = useDashboardContext();
    const [currentPlatforms, setCurrentPlatforms] = useState([]);

    const [globalResMsg, setGlobalResMsg] = useState({
        status: null,
        message: null
    });

    const [currentMappingData, setCurrentMappingData] = useState(null);
    const chatbotSectionRef = useRef();
    const { loginUser } = useAuthContext();

    const [selectedStep, setSelectedStep] = useState("setup");

    useEffect(() => {
        initialRequirements();

        return () => {
            if (!router?.query?.id || chatbots?.length === 0) return;

            setSelectedStep("setup");
            setChatbotFacebookPages([]);
            setChatbotCustomizationData({});
            setChatbotSitemapProcessingStatus({});
        }
    }, [router?.query?.id, chatbots]);

    useEffect(() => {
        if (chatbotSectionRef.current && router?.query?.step) {
            chatbotSectionRef.current.scrollTo({
                top: 0,
                behaviour: "auto"
            })
        }
    }, [selectedStep]);


    useEffect(() => {
        reloadAfterIntegrationConnect();
    }, []);

    const reloadAfterIntegrationConnect = () => {
        if (router?.query?.state) {
            if (router?.query?.code) {
                router.push({
                    pathname: router.pathname,
                    query: {
                        id: router?.query?.state,
                        ...router?.query
                    }
                });
            }
            else {
                router.push({
                    pathname: router.pathname,
                    query: {
                        index: router?.query?.index,
                        id: router?.query?.state
                    }
                });
            }

            setSelectedStep("configure");
        }
    }


    const initialRequirements = async () => {

        if (!router?.query?.id || chatbots?.length === 0) return;

        const currentChatbot = chatbots?.find(item => item?.id === (router?.query?.id));
        const platforms = deployPlatformOptions.filter(item => currentChatbot?.platforms?.includes(item?.name)) || [];
        setCurrentPlatforms(platforms);


        setGlobalResMsg(prev => ({
            ...prev,
            status: "loading",
            message: "Fetching chatbot's customization data...",
        }));

        const chatbotCustomizations = await getChatbotCustomizationsById(router?.query?.id);

        if (!chatbotCustomizations) return;

        setGlobalResMsg(prev => ({
            ...prev,
            status: "ok",
            message: null,
        }));

        updateInitialChatbotStepper([], [], chatbotCustomizations);
        updateInitialChatbotConfigurations([], [], chatbotCustomizations);
        updateInitialMapping();

        return;
    };

    const updateInitialChatbotStepper = (websitesData = [], sitemapData = [], customizationData = {}) => {

        const updatedStepper = chatbotStepperSchema.map(step => {
            if (step.id === "setup") {
                const requiredFields = requiredAgentConfigurationFields?.setup || [];
                const completed = requiredFields.length === 0 || requiredFields.every(key => customizationData?.[key]);
                return { ...step, completed };
            }

            // if (step.id === "train") {
            //     const requiredFields = requiredAgentConfigurationFields?.train || [];
            //     const completed = requiredFields.length === 0 || (websitesData?.[0]?.url && sitemapData?.[0]?.sitemap_url)
            //     return { ...step, completed: completed };
            // }
            if (step.id === "train") {
                const requiredFields = requiredAgentConfigurationFields?.train || [];
                const completed = requiredFields.length === 0 || requiredFields.every(key => customizationData?.[key])
                return { ...step, completed: completed };
            }

            if (step.id === "configure") {
                const requiredGroups = requiredAgentConfigurationFields?.configure || {};
                let completed = true;

                // check each group like website, 3d, whatsapp...
                for (const groupKey of Object.keys(requiredGroups)) {
                    const fields = requiredGroups[groupKey];
                    if (fields.length > 0) {
                        const groupData = customizationData?.[groupKey] || {};
                        const allFilled = fields.every(f => groupData?.[f]);
                        if (!allFilled) {
                            completed = false;
                            break;
                        }
                    }
                }

                return { ...step, completed };
            }

            if (step.id === "deploy") {
                const requiredFields = requiredAgentConfigurationFields?.deploy || [];
                const completed =
                    requiredFields.length === 0 ||
                    requiredFields.every(key => customizationData?.[key]);
                return { ...step, completed };
            }

            return step;
        });

        setChatbotStepper(
            updatedStepper.filter(stepper => stepper.plans.includes(loginUser?.user_plan))
        );

        return;
    }

    const updateInitialChatbotConfigurations = (websitesData = [], sitemapData = [], customizationData = {}) => {

        const filteredData = chatbotConfigurationData.filter(item => item.plans.includes(loginUser?.user_plan));

        const updatedConfigurationData = filteredData.reduce((acc, item) => {
            if (item.step === "train") {
                acc.train = Object.keys(item.data).reduce((obj, key) => {
                    obj[key] = customizationData?.[key] ?? item.data[key];
                    return obj;
                }, {});
                return acc;
            }

            if (item.step === "setup") {
                acc.setup = Object.keys(item.data).reduce((obj, key) => {
                    obj[key] = customizationData?.[key] ?? item.data[key];
                    return obj;
                }, {});
                return acc;
            }

            if (item.step === "configure") {
                acc.configure = Object.keys(customizationData).reduce((obj, key) => {
                    if (key in item.data) {
                        // keep only allowed schema fields
                        const allowedFields = Object.keys(item.data[key]);

                        obj[key] = allowedFields.reduce((section, field) => {
                            section[field] =
                                customizationData[key]?.[field] ?? item.data[key][field];
                            return section;
                        }, {});
                    }
                    return obj;
                }, {});

                return acc;
            }


            // fallback (deploy or others)
            acc[item.step] = item.data;
            return acc;
        }, {});

        setChatbotConfigurations(updatedConfigurationData);

    }

    const updateInitialMapping = () => {
        const data = Object.fromEntries(
            Object.entries(mapStepComponent).filter(([_, value]) =>
                value.plans.includes(loginUser?.user_plan)
            )
        );

        setCurrentMappingData(data);
    }


    const getChatbotCustomizationsById = async (id = null) => {
        if (!id) return;

        const res = await retrieveOrRemove("GET", `${chatbotCustomizationsAllApiPath}?chatbot_id=${id}`, true);

        let resData = null;

        try {
            resData = await res?.json()
        }
        catch (e) { }

        if (res?.status >= 400 && res?.status < 500) {
            setGlobalResMsg(prev => ({
                ...prev,
                status: "err4xx",
                message: resData?.message || "Unable to fetch chatbot customization details.",
            }));
            return false;
        }

        if (res?.status >= 500) {
            setGlobalResMsg(prev => ({
                ...prev,
                status: "err5xx",
                message: res?.message || resData?.message || "Our server is busy. Please try again later.",
            }));
            return false;
        }

        if (res?.status === 200 || res?.status === 201) {
            setChatbotCustomizationData(resData?.data || {});
            return resData?.data || {};
        }

    };

    const mappingData = useMemo(() => {
        return currentMappingData?.[selectedStep];
    }, [selectedStep, currentMappingData]);


    return (
        <div className="py-4 overflow-y-auto w-full h-full flex flex-col relative">

            <div className="px-4 mb-6">
                <h1 className="xl:text-2xl text-xl font-bold text-light-text-primary mb-2">Multi-Platform Chatbot Setup</h1>
                <p className="text-light-text-secondary">Configure your chatbot for different platforms with custom settings and integrations.</p>
            </div>

            {currentPlatforms?.length > 0 && (
                <div
                    id="platform-tabs"
                    className="mb-6 px-4 py-1 w-full sticky bg-light-bg-primary flex-shrink-0 -top-[18px] z-10 overflow-x-auto no-scrollbar border-b border-gray-200"
                >
                    <div className="flex items-center space-x-1 rounded-lg p-1">
                        {currentPlatforms.map((platform) => (
                            <button
                                key={platform.id}
                                type="button"
                                className={clsx("flex items-center space-x-2 px-4 py-2 rounded-md text-sm cursor-default transition font-[500]")}
                            >
                                <platform.icon className="size-4" />
                                <span>
                                    {platform.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div ref={chatbotSectionRef} className="flex-1 px-6">

                {(globalResMsg?.status === "loading" || globalResMsg?.status === "err4xx" || globalResMsg?.status === "err5xx") && (
                    <div className="flex w-full h-full p-6 items-center justify-center">
                        <div className={clsx("p-6 bg-light-card-primary shadow rounded-xl flex items-center justify-center gap-2.5 max-w-lg",
                            (globalResMsg?.status === "loading") ? "flex-row" : "flex-col"
                        )}>
                            {globalResMsg?.status === "loading" && (
                                <LuLoaderCircle className="size-6 animate-spin text-secondary" />
                            )}

                            {globalResMsg?.status === "err4xx" && (
                                <FaCircleXmark className="text-red-400 size-6" />
                            )}

                            {globalResMsg?.status === "err5xx" && (
                                <FaExclamationTriangle className="text-orange-400 size-6" />
                            )}

                            {globalResMsg?.message && (
                                <p className="text-center text-light-text-primary font-[500] text-lg">
                                    {globalResMsg?.message}
                                </p>
                            )}

                            {globalResMsg?.status !== "loading" && (
                                <button
                                    onClick={async () => await initialRequirements()}
                                    type="button"
                                    className="text-sm px-4 py-1 rounded-full border border-secondary text-secondary hover:bg-secondary hover:text-white font-[500]"
                                >
                                    Retry
                                </button>
                            )}

                        </div>
                    </div>
                )}

                {globalResMsg.status === "ok" && (
                    <Fragment>
                        <div id="stepper" className="mb-6 max-w-3xl mx-auto">
                            <Stepper
                                selectedStep={selectedStep}
                            />
                        </div>

                        {mappingData?.component && (
                            <mappingData.component
                                selectedStep={selectedStep}
                                setSelectedStep={setSelectedStep}
                            />
                        )}
                    </Fragment>
                )}
            </div>
        </div>
    )
}
