import clsx from "clsx";
import WebsiteSection from "./Website";
import { useEffect, useMemo, useState } from "react";
import { useDashboardContext } from "@/context/useDashboardContext";
import { useRouter } from "next/router";
import ThreeDSection from "./ThreeD";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { requiredAgentConfigurationFields } from "../constants";
import FacebookSection from "./FacebookSection";
import WhatsAppSection from "./WhatsAppSection";
import InstagramSection from "./InstagramSection";
import DiscordSection from "./DiscordSection";
import { useAuthContext } from "@/context/useAuthContext";
import SlackSection from "./SlackSection";

export default function ConfigureSection({ setSelectedStep }) {

    const router = useRouter();

    const { updateLoginUser, loginUser } = useAuthContext();

    const { chatbots, chatbotStepper, setChatbotStepper, chatbotConfigurations } = useDashboardContext();

    const [formMessages, setFormMessages] = useState({
        website: {
            font_family: {
                status: null,
                message: null
            },
            box_shadow: {
                status: null,
                message: null
            },
            border_radius: {
                status: null,
                message: null
            },
            background_color: {
                status: null,
                message: null
            },
            agent_name: {
                status: null,
                message: null
            },
            agent_title: {
                status: null,
                message: null
            },
            agent_name_text_color: {
                status: null,
                message: null
            },
            agent_name_title_color: {
                status: null,
                message: null
            },
            agent_panel_color: {
                status: null,
                message: null
            },
            agent_bg_color: {
                status: null,
                message: null
            },
            show_agent_panel: {
                status: null,
                message: null
            },
            welcome_text: {
                status: null,
                message: null
            },
            input_placeholder: {
                status: null,
                message: null
            },
            input_text_color: {
                status: null,
                message: null
            },
            input_background_color: {
                status: null,
                message: null
            },
            chat_panel_color: {
                status: null,
                message: null
            },
            bot_text_bg_color: {
                status: null,
                message: null
            },
            user_text_bg_color: {
                status: null,
                message: null
            },
            bot_text_color: {
                status: null,
                message: null
            },
            user_text_color: {
                status: null,
                message: null
            },
            icon_bg_gradient_start: {
                status: null,
                message: null
            },
            icon_bg_gradient_end: {
                status: null,
                message: null
            },
            send_button_icon: {
                status: null,
                message: null
            },
            mic_button_icon: {
                status: null,
                message: null
            },
            enable_voice_input: {
                status: null,
                message: null
            },
            enable_3d_avatar_mode: {
                status: null,
                message: null
            },
            enable_dual_mode: {
                status: null,
                message: null
            },
            enable_simple_chat_mode: {
                status: null,
                message: null
            },
            enable_chatbot_actions: {
                status: null,
                message: null
            },
            default_mode: {
                status: null,
                message: null
            },
            avatar: {
                status: null,
                message: null
            },
        },
        ['3d']: {
            avatar: {
                status: null,
                message: null
            },
        },
        facebook: {
            connect: {
                status: null,
                message: null
            },
        }
    });



    useEffect(() => {
        // handleUpdateChatbotIntegration();
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

    const onNextClick = () => {

        const hasAnyFormMessages = Object.values(formMessages).some(group =>
            Object.values(group).some(({ status, message }) => (status || message))
        );


        if (hasAnyFormMessages) {
            const el = document.getElementById("action-required");
            if (el) {
                el.scrollIntoView({ block: "center", behavior: "smooth" });
            }
            return;
        };

        let allFilled = true;
        const requiredGroups = requiredAgentConfigurationFields?.configure || {};

        // check each group like website, 3d, whatsapp...
        for (const groupKey of Object.keys(requiredGroups)) {
            const fields = requiredGroups[groupKey];
            if (fields.length > 0) {
                const groupData = chatbotConfigurations?.[groupKey] || {};
                const completed = fields.every(f => groupData?.[f]);
                if (!completed) {
                    allFilled = false;
                    break;
                }
            }
        }


        setChatbotStepper(prev =>
            prev?.map(item =>
                item.id === "configure" ? { ...item, completed: allFilled } : item
            )
        );

        if (allFilled) {
            const currentStepIndex = chatbotStepper?.findIndex(obj => obj.id === "configure");
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
        const currentStepIndex = chatbotStepper?.findIndex(obj => obj.id === "configure");
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
                    <WebsiteSection
                        formMessages={formMessages?.website}
                        setFormMessages={setFormMessages}
                    />
                }
                {platforms?.includes("3D") &&
                    <ThreeDSection
                        formMessages={formMessages?.["3d"]}
                        setFormMessages={setFormMessages}
                    />
                }
                {platforms?.includes("Facebook") &&
                    <FacebookSection
                        formMessages={formMessages?.facebook}
                        setFormMessages={setFormMessages}
                    />
                }
                {platforms?.includes("Discord") &&
                    <DiscordSection
                        formMessages={formMessages?.facebook}
                        setFormMessages={setFormMessages}
                    />
                }
                {platforms?.includes("WhatsApp") &&
                    <WhatsAppSection
                        formMessages={formMessages?.facebook}
                        setFormMessages={setFormMessages}
                    />
                }
                {platforms?.includes("Instagram") &&
                    <InstagramSection
                        formMessages={formMessages?.facebook}
                        setFormMessages={setFormMessages}
                    />
                }
                {platforms?.includes("Slack") &&
                    <SlackSection />
                }
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
