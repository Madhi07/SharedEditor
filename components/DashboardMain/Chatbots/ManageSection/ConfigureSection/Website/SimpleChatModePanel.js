import { AgentZeeHead } from "@/components/SVG";
import { useDashboardContext } from "@/context/useDashboardContext";
import Image from "next/image";
import { useMemo } from "react";
import { FaMicrophone } from "react-icons/fa";
import { IoSend } from "react-icons/io5";

export default function SimpleChatModePanel({
    handleClickPreviewPanel = () => null,
}) {

    const { chatbotConfigurations, chatbotAvatars, chatbotCustomizationData } = useDashboardContext();

    const selectedAvatarStyle = useMemo(() => {
        return chatbotAvatars.find(style => style?.id === chatbotConfigurations?.configure?.website?.avatar);
    }, [chatbotConfigurations?.configure?.website?.avatar, chatbotAvatars]);

    return (
        <div
            onClick={handleClickPreviewPanel}
            id="chatPreview"
            className="mx-auto relative flex flex-col max-w-md overflow-hidden p-4 transition-all duration-300 border-none cursor-pointer"
            style={{
                borderRadius: chatbotConfigurations?.configure?.website?.border_radius,
                backgroundColor: chatbotConfigurations?.configure?.website?.background_color,
                fontFamily: chatbotConfigurations?.configure?.website?.font_family,
                boxShadow: chatbotConfigurations?.configure?.website?.box_shadow
            }}
        >

            {chatbotConfigurations?.configure?.website?.show_agent_panel &&
                <div
                    className="overflow-hidden flex p-4 w-full items-center h-24 !rounded-b-none gap-4"
                    style={{
                        backgroundColor: chatbotConfigurations?.configure?.website?.agent_panel_color,
                        borderRadius: chatbotConfigurations?.configure?.website?.border_radius,
                        boxShadow: chatbotConfigurations?.configure?.website?.box_shadow
                    }}
                >
                    <div
                        className="h-12 w-12 rounded-full relative overflow-hidden inline-flex items-center justify-center"
                        style={{
                            backgroundColor: chatbotConfigurations?.configure?.website?.display_mode === "color" ? chatbotConfigurations?.configure?.website?.agent_bg_color : null,
                            boxShadow: chatbotConfigurations?.configure?.website?.box_shadow
                        }}
                    >
                        <div className="absolute inset-0 overflow-hidden">
                            {(chatbotConfigurations?.configure?.website?.display_mode === "image" && chatbotCustomizationData?.website?.chat_panel_image_url) &&
                                <Image
                                    src={chatbotCustomizationData?.website?.chat_panel_image_url || null}
                                    alt={"Avatar background image"}
                                    quality={100}
                                    width={1080}
                                    height={1920}
                                    loading="lazy"
                                    className="w-full h-full flex object-fill"
                                />
                            }
                            {(chatbotConfigurations?.configure?.website?.display_mode === "video" && chatbotCustomizationData?.website?.chat_panel_video_url) &&
                                <video
                                    src={chatbotCustomizationData?.website?.chat_panel_video_url || null}
                                    alt={"Avatar background video"}
                                    autoPlay
                                    playsInline
                                    loop
                                    controls={false}
                                    className="w-full h-full flex object-fill"
                                />
                            }
                        </div>

                        {(selectedAvatarStyle?.avatar_preview_image_url) &&
                            <Image
                                src={selectedAvatarStyle?.avatar_preview_image_url || null}
                                quality={100}
                                width={1024}
                                height={1024}
                                loading="lazy"
                                className="relative w-8 bg-transparent"
                            />
                        }
                    </div>

                    <div className="flex flex-col flex-1">
                        <h3
                            className="text-xl font-semibold"
                            style={{
                                color: chatbotConfigurations?.configure?.website?.agent_name_text_color
                            }}
                        >
                            {chatbotConfigurations?.configure?.website?.agent_name}
                        </h3>
                        <span
                            className="font-semibold"
                            style={{
                                color: chatbotConfigurations?.configure?.website?.agent_name_title_color
                            }}
                        >
                            {chatbotConfigurations?.configure?.website?.agent_title}
                        </span>
                    </div>



                </div>
            }

            <div
                id="chatPanel"
                className="overflow-hidden flex flex-col flex-1"
                style={{
                    backgroundColor: chatbotConfigurations?.configure?.website?.chat_panel_color,
                    borderRadius: chatbotConfigurations?.configure?.website?.show_agent_panel ? `0px 0px ${chatbotConfigurations?.configure?.website?.border_radius} ${chatbotConfigurations?.configure?.website?.border_radius}` : chatbotConfigurations?.configure?.website?.border_radius,
                    boxShadow: chatbotConfigurations?.configure?.website?.box_shadow
                }}
            >

                <div className="p-4 overflow-y-auto no-scrollbar h-[400px]">

                    <div className="flex mb-4">
                        <div
                            className="w-8 h-8 rounded-full overflow-hidden  flex items-center justify-center mr-2 flex-shrink-0"
                            style={{
                                backgroundImage: `linear-gradient(to right, ${chatbotConfigurations?.configure?.website?.icon_bg_gradient_start}, ${chatbotConfigurations?.configure?.website?.icon_bg_gradient_end})`
                            }}
                        >
                            <AgentZeeHead className="text-white !size-5" />
                        </div>
                        <div
                            className=" rounded-tl-none p-3 max-w-[60%]"
                            style={{
                                borderRadius: chatbotConfigurations?.configure?.website?.border_radius,
                                backgroundColor: chatbotConfigurations?.configure?.website?.bot_text_bg_color,
                                color: chatbotConfigurations?.configure?.website?.bot_text_color
                            }}
                        >
                            <p className="text-sm">{chatbotConfigurations?.configure?.website?.welcome_text}</p>
                        </div>
                    </div>

                </div>

                <div
                    className="p-3"
                >
                    <div className="pointer-events-none flex gap-2 items-center">
                        <input
                            disabled
                            type="text"
                            placeholder="Type here"
                            className="bg-transparent pl-4 pr-12 py-2 h-10 w-full"
                            style={{
                                color: chatbotConfigurations?.configure?.website?.input_text_color,
                                borderRadius: chatbotConfigurations?.configure?.website?.border_radius,
                                border: `1px solid ${chatbotConfigurations?.configure?.website?.icon_bg_gradient_start}`,
                                boxShadow: chatbotConfigurations?.configure?.website?.box_shadow,
                                backgroundColor: chatbotConfigurations?.configure?.website?.input_background_color,
                            }}
                        />

                        {chatbotConfigurations?.configure?.website?.send_button_icon &&
                            <button className="flex-shrink-0 w-10 h-10 rounded-full from-primary to-secondary bg-gradient-to-r flex items-center justify-center">
                                <IoSend className="text-white size-5" />
                            </button>
                        }

                        {chatbotConfigurations?.configure?.website?.mic_button_icon &&
                            <button className="flex-shrink-0 w-10 h-10 rounded-full from-primary to-secondary bg-gradient-to-r flex items-center justify-center">
                                <FaMicrophone className="text-white size-5" />
                            </button>
                        }
                    </div>

                    <div className="text-center text-xs dark:text-dark-text-secondary text-light-text-secondary mt-2">
                        Powered by AgentZee AI
                    </div>
                </div>
            </div>

        </div>
    )
}
