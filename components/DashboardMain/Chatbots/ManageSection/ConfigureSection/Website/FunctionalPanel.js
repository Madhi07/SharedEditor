import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaChevronDown, FaComments, FaExclamationTriangle, FaEye, FaImage, FaPalette, FaVideo } from "react-icons/fa";
import { fontFamilies } from "../../constants";
import FieldMessage from "../../FieldMessage";
import { useDashboardContext } from "@/context/useDashboardContext";
import { FaCircleUser, FaCircleXmark } from "react-icons/fa6";
import { MdDashboardCustomize, MdOutlineSearchOff } from "react-icons/md";
import { avatarModelsApiPath, chatbotCustomizationsAll, chatbotCustomizationsAllApiPath, chatbotCustomizationsWebsiteApiPath } from "@/constants/apiPaths";
import { createOrUpdate, retrieveOrRemove } from "@/utils/fetchUtils";
import AvatarBgStyles from "@/components/Modals/Dashboard/Chatbots/AvatarBgStyles";
import { AgentZeeHead } from "@/components/SVG";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import { formatLabel } from "@/utils";
import { useRouter } from "next/router";

export default function FunctionalPanel({ formMessages, setFormMessages }) {
    const router = useRouter();

    const { chatbots, chatbotConfigurations, setChatbotConfigurations, chatbotCustomizationData, setChatbotCustomizationData, chatbotAvatars, setChatbotAvatars } = useDashboardContext();
    const [currentTab, setCurrentTab] = useState("design");
    const [fetchingField, setFetchingField] = useState({
        avatar: {
            status: "ok",
            message: null
        }
    });

    const [showBgStylesPanel, setShowBgStylesPanel] = useState({
        open: false,
        displayMode: null
    });

    useEffect(() => {
        initialRequirements();
    }, []);

    const patchTimeoutRef = useRef(null);

    const initialRequirements = async () => {
        if (chatbotAvatars?.length === 0) {
            await getChatbotAvatars();
        }
    };

    const getChatbotAvatars = async () => {
        setFetchingField(prev => ({
            ...prev,
            avatar: {
                ...prev.avatar,
                status: "loading",
                message: null
            }
        }));

        const response = await retrieveOrRemove("GET", avatarModelsApiPath);
        let resData = null;
        try {
            resData = await response?.json();
        }
        catch (e) { }

        if (response?.status === 200) {

            if (resData?.length > 0) {
                setChatbotAvatars(resData);
                setFetchingField(prev => ({
                    ...prev,
                    avatar: {
                        ...prev.avatar,
                        status: "ok",
                        message: null
                    }
                }));
            }
            else {
                setFetchingField(prev => ({
                    ...prev,
                    avatar: {
                        ...prev.avatar,
                        status: "ok",
                        message: "No 3D avatars available."
                    }
                }));
            }

            return resData;

        }

        if (response?.status >= 400 && response?.status < 500) {
            setFetchingField(prev => ({
                ...prev,
                avatar: {
                    ...prev.avatar,
                    status: "err4xx",
                    message: resData?.message || "Unable to fetch chatbot avatars."
                }
            }));

            return false;
        }
        if (response?.status >= 500) {
            setFetchingField(prev => ({
                ...prev,
                avatar: {
                    ...prev.avatar,
                    status: "err5xx",
                    message: response?.message || resData?.message || "Server error while fetching chatbot avatars."
                }
            }));

            return false;
        }
    }

    const handlePatchByField = (field = null, value, display_mode = null) => {

        if (!field) return;

        if (formMessages?.[field]?.status || formMessages?.[field]?.message) {
            setFormMessages(prev => ({
                ...prev,
                website: {
                    ...prev.website,
                    [field]: {
                        ...prev.website?.[field],
                        status: null,
                        message: null
                    }
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

        if (display_mode) {
            setChatbotConfigurations(prev => ({
                ...prev,
                configure: {
                    ...prev?.configure,
                    website: {
                        ...prev.configure.website,
                        display_mode
                    }
                }
            }));
            payload["display_mode"] = display_mode;
        }

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

    const patchChatbotCustomization = async (payload = {}, field = null) => {

        if (Object.values(payload).length === 0 || !field) return;

        setFormMessages(prev => ({
            ...prev,
            website: {
                ...prev.website,
                [field]: {
                    ...prev.website?.[field],
                    status: "loading",
                    message: "Updating..."
                }
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
                website: {
                    ...prev.website,
                    [field]: {
                        ...prev.website?.[field],
                        status: "err4xx",
                        message: resData?.message || resData?.[field]?.[0] || "Unable to update the data, Please try again."
                    }
                }
            }));
            return false;
        }

        if (res?.status >= 500) {
            setFormMessages(prev => ({
                ...prev,
                website: {
                    ...prev.website,
                    [field]: {
                        ...prev.website?.[field],
                        status: "err5xx",
                        message: res?.message || resData?.message || "Server issue, please try again later."
                    }
                }
            }));
            return false;
        }

        if (res?.status === 200) {
            setFormMessages(prev => ({
                ...prev,
                website: {
                    ...prev.website,
                    [field]: {
                        ...prev.website?.[field],
                        status: null,
                        message: null
                    }
                }
            }));
            return resData;
        }

    }

    const handleAvatarBgStylesPanel = (displayMode = null) => {
        setShowBgStylesPanel(prev => ({
            ...prev,
            open: !prev?.open,
            displayMode
        }));
    }

    const chatbotAvatarsByGender = useMemo(() => {
        return chatbotAvatars.filter(item => item?.gender?.toLowerCase() === chatbotConfigurations?.setup?.gender?.toLowerCase());
    }, [chatbotAvatars]);

    return (
        <div className="col-span-2">

            <div className="flex items-center gap-3 mb-2">
                <MdDashboardCustomize className="text-secondary flex-shrink-0 size-5" />
                <h3 className="text-lg font-semibold">Customization</h3>
            </div>
            <p className="text-light-text-secondary mb-6">
                Personalize the look, feel, and behavior
            </p>

            <div className="space-y-4">

                <div id="designSettings" className=" bg-light-bg-primary border border-light-border-primary rounded-lg overflow-hidden outline-none">
                    <button
                        className="w-full p-4 flex items-center justify-between text-left dark:hover:bg-white/5 hover:bg-black/5 transition-all duration-200"
                        onClick={() => setCurrentTab(currentTab === "design" ? null : "design")}
                    >
                        <div className="flex items-center gap-3">
                            <FaPalette className="text-secondary text-lg" />
                            <h3 className="text-lg font-medium">Design Settings</h3>
                        </div>
                        <FaChevronDown
                            className={clsx("dark:text-dark-text-secondary text-light-text-secondary transition-transform duration-200",
                                currentTab === "design" && "rotate-180"
                            )}
                        />
                    </button>

                    {currentTab === "design" &&
                        <div className="p-4 space-y-4">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div>
                                    <label className="dark:text-dark-text-secondary text-light-text-secondary font-[500] text-sm mb-2 block">Font Family</label>
                                    <select
                                        onChange={(e) => handlePatchByField('font_family', e.target.value)}
                                        className="w-full h-10 bg-light-card-primary border border-light-border-primary rounded-lg px-2 dark:text-dark-text-primary text-light-text-primary focus:border-secondary focus:outline-none">
                                        {fontFamilies.map((font, index) => (
                                            <option
                                                key={index}
                                            >
                                                {font}
                                            </option>
                                        ))}
                                    </select>
                                    <FieldMessage data={formMessages?.font_family} />
                                </div>

                                <div>
                                    <label className="dark:text-dark-text-secondary text-light-text-secondary font-[500] text-sm mb-2 block">Box Shadow</label>
                                    <input
                                        onChange={(e) => handlePatchByField('box_shadow', e.target.value)}
                                        type="text"
                                        value={chatbotConfigurations?.configure?.website?.box_shadow}
                                        className="w-full bg-light-card-primary border border-light-border-primary rounded-lg px-2 h-10 text-light-text-primary focus:border-secondary focus:outline-none"
                                    />
                                    <FieldMessage data={formMessages?.box_shadow} />
                                </div>

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div>
                                    <label className="dark:text-dark-text-secondary text-light-text-secondary font-[500] text-sm mb-2 block">Border Radius (px)</label>
                                    <input
                                        onChange={(e) => handlePatchByField('border_radius', e.target.value)}
                                        type="text"
                                        value={chatbotConfigurations?.configure?.website?.border_radius}
                                        className="w-full bg-light-card-primary border border-light-border-primary  rounded-lg px-2 h-10 dark:text-dark-text-primary text-light-text-primary focus:border-secondary focus:outline-none"
                                    />
                                    <FieldMessage data={formMessages?.border_radius} />
                                </div>

                                <div>
                                    <label className="dark:text-dark-text-secondary text-light-text-secondary font-[500] text-sm mb-2 block">Background Color</label>
                                    <input
                                        onChange={(e) => handlePatchByField('background_color', e.target.value)}
                                        type="color"
                                        value={chatbotConfigurations?.configure?.website?.background_color}
                                        className="w-full h-10 outline-none focus:border-secondary bg-light-card-primary border border-light-border-primary rounded-lg cursor-pointer"
                                    />
                                    <FieldMessage data={formMessages?.background_color} />
                                </div>

                            </div>


                            <div className="grid grid-cols-2  gap-6">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            onChange={() => handlePatchByField('enable_3d_avatar_mode', !chatbotConfigurations?.configure?.website?.enable_3d_avatar_mode)}
                                            checked={chatbotConfigurations?.configure?.website?.enable_3d_avatar_mode}
                                            type="checkbox"
                                            id="enable_3d_avatar_mode"
                                            className="w-4 h-4 accent-secondary rounded border border-light-border-primary cursor-pointer"
                                        />
                                        <label
                                            htmlFor="enable_3d_avatar_mode"
                                            className="dark:text-dark-text-secondary font-[500] text-light-text-secondary text-sm block cursor-pointer"
                                        >
                                            3D Avatar Mode
                                        </label>
                                    </div>

                                    <FieldMessage data={formMessages?.enable_3d_avatar_mode} />
                                </div>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            onChange={() => handlePatchByField('enable_dual_mode', !chatbotConfigurations?.configure?.website?.enable_dual_mode)}
                                            checked={chatbotConfigurations?.configure?.website?.enable_dual_mode}
                                            type="checkbox"
                                            id="enable_dual_mode"
                                            className="w-4 h-4 accent-secondary rounded border border-light-border-primary cursor-pointer"
                                        />
                                        <label
                                            htmlFor="enable_dual_mode"
                                            className="dark:text-dark-text-secondary font-[500] text-light-text-secondary text-sm block cursor-pointer"
                                        >
                                            Dual Mode
                                        </label>
                                    </div>

                                    <FieldMessage data={formMessages?.enable_dual_mode} />
                                </div>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            onChange={() => handlePatchByField('enable_simple_chat_mode', !chatbotConfigurations?.configure?.website?.enable_simple_chat_mode)}
                                            checked={chatbotConfigurations?.configure?.website?.enable_simple_chat_mode}
                                            type="checkbox"
                                            id="enable_simple_chat_mode"
                                            className="w-4 h-4 accent-secondary rounded border border-light-border-primary cursor-pointer"
                                        />
                                        <label
                                            htmlFor="enable_simple_chat_mode"
                                            className="dark:text-dark-text-secondary font-[500] text-light-text-secondary text-sm block cursor-pointer"
                                        >
                                            Simple Chat Mode
                                        </label>
                                    </div>

                                    <FieldMessage data={formMessages?.enable_simple_chat_mode} />
                                </div>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            onChange={() => handlePatchByField('enable_chatbot_actions', !chatbotConfigurations?.configure?.website?.enable_chatbot_actions)}
                                            checked={chatbotConfigurations?.configure?.website?.enable_chatbot_actions}
                                            type="checkbox"
                                            id="enable_chatbot_actions"
                                            className="w-4 h-4 accent-secondary rounded border border-light-border-primary cursor-pointer"
                                        />
                                        <label
                                            htmlFor="enable_chatbot_actions"
                                            className="dark:text-dark-text-secondary font-[500] text-light-text-secondary text-sm block cursor-pointer"
                                        >
                                            Chatbot Actions
                                        </label>
                                    </div>

                                    <FieldMessage data={formMessages?.enable_chatbot_actions} />
                                </div>

                            </div>
                        </div>
                    }
                </div>

                <div id="agentProfile" className=" bg-light-bg-primary border border-light-border-primary rounded-lg overflow-hidden outline-none">
                    <button
                        className="w-full p-4 flex items-center justify-between text-left dark:hover:bg-white/5 hover:bg-black/5 transition-all duration-200"
                        onClick={() => setCurrentTab(currentTab === "agent-profile" ? null : "agent-profile")}
                    >
                        <div className="flex items-center gap-3">
                            <FaCircleUser className="text-secondary text-lg" />
                            <h3 className="text-lg font-medium">Agent Profile</h3>
                        </div>
                        <FaChevronDown
                            className={clsx("dark:text-dark-text-secondary text-light-text-secondary transition-transform duration-200",
                                currentTab === "agent-profile" && "rotate-180"
                            )}
                        />
                    </button>

                    {currentTab === "agent-profile" &&
                        <div className="p-4 space-y-4">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div>
                                    <label className="font-[500] dark:text-dark-text-secondary text-light-text-secondary text-sm mb-2 block">Name</label>
                                    <input
                                        type="text"
                                        onChange={(e) => handlePatchByField('agent_name', e.target.value)}
                                        value={chatbotConfigurations?.configure?.website?.agent_name}
                                        className="w-full  bg-light-card-primary border border-light-border-primary rounded-lg px-2 h-10 dark:text-dark-text-primary text-light-text-primary focus:border-secondary focus:outline-none"
                                    />
                                    <FieldMessage data={formMessages?.agent_name} />
                                </div>

                                <div>
                                    <label className="font-[500] dark:text-dark-text-secondary text-light-text-secondary text-sm mb-2 block">Title</label>
                                    <input
                                        type="text"
                                        onChange={(e) => handlePatchByField('agent_title', e.target.value)}
                                        value={chatbotConfigurations?.configure?.website?.agent_title}
                                        className="w-full  bg-light-card-primary border border-light-border-primary rounded-lg px-2 h-10 dark:text-dark-text-primary text-light-text-primary focus:border-secondary focus:outline-none"
                                    />
                                    <FieldMessage data={formMessages?.agent_title} />
                                </div>

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                <div>
                                    <label className="font-[500] dark:text-dark-text-secondary text-light-text-secondary text-sm mb-2 block">Name Color</label>
                                    <input
                                        type="color"
                                        onChange={(e) => handlePatchByField('agent_name_text_color', e.target.value)}
                                        value={chatbotConfigurations?.configure?.website?.agent_name_text_color}
                                        className="w-full h-10 bg-light-card-primary focus:border-secondary outline-none border border-light-border-primary rounded-lg cursor-pointer"
                                    />
                                    <FieldMessage data={formMessages?.agent_name_text_color} />
                                </div>

                                <div>
                                    <label className="font-[500] dark:text-dark-text-secondary text-light-text-secondary text-sm mb-2 block">Title Color</label>
                                    <input
                                        type="color"
                                        onChange={(e) => handlePatchByField('agent_name_title_color', e.target.value)}
                                        value={chatbotConfigurations?.configure?.website?.agent_name_title_color}
                                        className="w-full h-10 bg-light-card-primary focus:border-secondary outline-none border border-light-border-primary rounded-lg cursor-pointer"
                                    />
                                    <FieldMessage data={formMessages?.agent_name_title_color} />
                                </div>

                                <div>
                                    <label className="font-[500] dark:text-dark-text-secondary text-light-text-secondary text-sm mb-2 block">Panel Color</label>
                                    <input
                                        type="color"
                                        onChange={(e) => handlePatchByField('agent_panel_color', e.target.value)}
                                        value={chatbotConfigurations?.configure?.website?.agent_panel_color}
                                        className="w-full h-10 bg-light-card-primary focus:border-secondary outline-none border border-light-border-primary rounded-lg cursor-pointer"
                                    />
                                    <FieldMessage data={formMessages?.agent_panel_color} />
                                </div>

                            </div>

                            <div>
                                <label className="font-[500] dark:text-dark-text-secondary text-light-text-secondary text-sm mb-2 block">Background Style</label>
                                <div className="grid grid-cols-3 gap-4">

                                    <label
                                        className={clsx("p-2 h-10 inline-flex items-center justify-center cursor-pointer gap-2 border rounded-md  bg-light-card-primary",
                                            chatbotConfigurations?.configure?.website?.display_mode === "color" ? "border-secondary" : 'dark:border-dark-border-primary border-light-border-primary'
                                        )}
                                    >

                                        <input
                                            type="color"
                                            onChange={(e) => handlePatchByField('agent_bg_color', e.target.value, "color")}
                                            value={chatbotConfigurations?.configure?.website?.agent_bg_color}
                                            style={{
                                                backgroundColor: chatbotConfigurations?.configure?.website?.agent_bg_color
                                            }}
                                            className="w-6 h-6 rounded-full flex-shrink-0 outline-none border-light-border-primary bg-light-card-primary cursor-pointer focus:border-secondary"
                                        />

                                        <span
                                            className={clsx("block font-[500]",
                                                chatbotConfigurations?.configure?.website?.display_mode === "color" && "text-secondary"
                                            )}>
                                            Colors
                                        </span>
                                    </label>

                                    <button
                                        onClick={() => handleAvatarBgStylesPanel("image")}
                                        className={clsx("p-2 h-10 inline-flex justify-center items-center gap-2 border rounded-md  bg-light-card-primary",
                                            chatbotConfigurations?.configure?.website?.display_mode === "image" ? "border-secondary" : 'dark:border-dark-border-primary border-light-border-primary'
                                        )}
                                    >

                                        <FaImage className={clsx("w-6 h-6 flex-shrink-0",
                                            chatbotConfigurations?.configure?.website?.display_mode === "image" && "text-secondary")} />

                                        <span
                                            className={clsx("block font-[500]",
                                                chatbotConfigurations?.configure?.website?.display_mode === "image" && "text-secondary"
                                            )}>
                                            Image
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleAvatarBgStylesPanel("video")}
                                        className={clsx("p-2 h-10 inline-flex justify-center items-center gap-2 border rounded-md cursor-pointer bg-light-card-primary relative",
                                            chatbotConfigurations?.configure?.website?.display_mode === "video" ? "border-secondary" : 'dark:border-dark-border-primary border-light-border-primary'
                                        )}
                                    >

                                        <FaVideo className={clsx("w-6 h-6 flex-shrink-0",
                                            chatbotConfigurations?.configure?.website?.display_mode === "video" && "text-secondary")} />

                                        <span
                                            className={clsx("block font-[500]",
                                                chatbotConfigurations?.configure?.website?.display_mode === "video" && "text-secondary"
                                            )}>
                                            Video
                                        </span>
                                    </button>

                                </div>
                                <FieldMessage data={formMessages?.agent_bg_color} />
                            </div>


                            <div>
                                <div className="flex items-center gap-2">
                                    <input
                                        onChange={() => handlePatchByField('show_agent_panel', !chatbotConfigurations?.configure?.website?.show_agent_panel)}
                                        checked={chatbotConfigurations?.configure?.website?.show_agent_panel}
                                        type="checkbox"
                                        id="show_agent_panel"
                                        className="w-4 h-4 accent-secondary rounded border-light-border-primary cursor-pointer"
                                    />
                                    <label
                                        htmlFor="show_agent_panel"
                                        className="dark:text-dark-text-secondary text-light-text-secondary text-sm font-[500] block cursor-pointer"
                                    >
                                        Show Agent Panel
                                    </label>

                                </div>

                                <FieldMessage data={formMessages?.show_agent_panel} />
                            </div>
                        </div>
                    }
                </div>

                <div id="chatInterface" className=" bg-light-bg-primary border border-light-border-primary rounded-lg overflow-hidden outline-none">
                    <button
                        className="w-full p-4 flex items-center justify-between text-left dark:hover:bg-white/5 hover:bg-black/5 transition-all duration-200"
                        onClick={() => setCurrentTab(currentTab === "chat-interface" ? null : "chat-interface")}
                    >
                        <div className="flex items-center gap-3">
                            <FaComments className="text-secondary text-lg" />
                            <h3 className="text-lg font-medium">Chat Interface</h3>
                        </div>
                        <FaChevronDown
                            className={clsx("dark:text-dark-text-secondary text-light-text-secondary transition-transform duration-200",
                                currentTab === "chat-interface" && "rotate-180"
                            )}
                        />
                    </button>

                    {currentTab === "chat-interface" &&
                        <div className="p-4 space-y-4">

                            <div>
                                <label className="dark:text-dark-text-secondary text-light-text-secondary text-sm mb-2 block font-[500]">Welcome Text</label>
                                <textarea
                                    onChange={(e) => handlePatchByField('welcome_text', e.target.value)}
                                    value={chatbotConfigurations?.configure?.website?.welcome_text}
                                    type="text"
                                    className="w-full no-scrollbar bg-light-card-primary border border-light-border-primary rounded-lg p-2 min-h-24 text-light-text-primary focus:border-secondary focus:outline-none"
                                />
                                <FieldMessage data={formMessages?.welcome_text} />
                            </div>

                            <div>
                                <label className="dark:text-dark-text-secondary text-light-text-secondary text-sm mb-2 block font-[500]">Input Placeholder</label>
                                <input
                                    type="text"
                                    onChange={(e) => handlePatchByField('input_placeholder', e.target.value)}
                                    value={chatbotConfigurations?.configure?.website?.input_placeholder}
                                    className="w-full  bg-light-card-primary border border-light-border-primary rounded-lg px-2 h-10 text-light-text-primary focus:border-secondary focus:outline-none"
                                />
                                <FieldMessage data={formMessages?.input_placeholder} />
                            </div>

                            <div>
                                <label className="dark:text-dark-text-secondary text-light-text-secondary text-sm mb-2 block font-[500]">Panel Color</label>
                                <input
                                    type="color"
                                    onChange={(e) => handlePatchByField('chat_panel_color', e.target.value)}
                                    value={chatbotConfigurations?.configure?.website?.chat_panel_color}
                                    className="w-full h-10 bg-light-card-primary focus:border-secondary outline-none border border-light-border-primary rounded-lg cursor-pointer"
                                />
                                <FieldMessage data={formMessages?.chat_panel_color} />
                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div>
                                    <label className="dark:text-dark-text-secondary text-light-text-secondary text-sm mb-2 block font-[500]">Input Color</label>
                                    <input
                                        type="color"
                                        onChange={(e) => handlePatchByField('input_text_color', e.target.value)}
                                        value={chatbotConfigurations?.configure?.website?.input_text_color}
                                        className="w-full h-10 bg-light-card-primary focus:border-secondary outline-none border border-light-border-primary rounded-lg cursor-pointer"
                                    />
                                    <FieldMessage data={formMessages?.input_text_color} />
                                </div>

                                <div>
                                    <label className="dark:text-dark-text-secondary text-light-text-secondary text-sm mb-2 block font-[500]">Input Background Color</label>
                                    <input
                                        type="color"
                                        onChange={(e) => handlePatchByField('input_background_color', e.target.value)}
                                        value={chatbotConfigurations?.configure?.website?.input_background_color}
                                        className="w-full h-10 bg-light-card-primary focus:border-secondary outline-none border border-light-border-primary rounded-lg cursor-pointer"
                                    />
                                    <FieldMessage data={formMessages?.input_background_color} />
                                </div>

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div>
                                    <label className="dark:text-dark-text-secondary text-light-text-secondary text-sm mb-2 block font-[500]">Bot Bubble Color</label>
                                    <input
                                        type="color"
                                        onChange={(e) => handlePatchByField('bot_text_bg_color', e.target.value)}
                                        value={chatbotConfigurations?.configure?.website?.bot_text_bg_color}
                                        className="w-full h-10 bg-light-card-primary focus:border-secondary outline-none border border-light-border-primary rounded-lg cursor-pointer"
                                    />
                                    <FieldMessage data={formMessages?.bot_text_bg_color} />
                                </div>

                                <div>
                                    <label className="dark:text-dark-text-secondary text-light-text-secondary text-sm mb-2 block font-[500]">User Bubble Color</label>
                                    <input
                                        type="color"
                                        onChange={(e) => handlePatchByField('user_text_bg_color', e.target.value)}
                                        value={chatbotConfigurations?.configure?.website?.user_text_bg_color}
                                        className="w-full h-10 bg-light-card-primary focus:border-secondary outline-none border border-light-border-primary rounded-lg cursor-pointer"
                                    />
                                    <FieldMessage data={formMessages?.user_text_bg_color} />
                                </div>

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="dark:text-dark-text-secondary text-light-text-secondary text-sm mb-2 block font-[500]">Bot Text Color</label>
                                    <input
                                        type="color"
                                        onChange={(e) => handlePatchByField('bot_text_color', e.target.value)}
                                        value={chatbotConfigurations?.configure?.website?.bot_text_color}
                                        className="w-full h-10 bg-light-card-primary focus:border-secondary outline-none border border-light-border-primary rounded-lg cursor-pointer"
                                    />
                                    <FieldMessage data={formMessages?.bot_text_color} />
                                </div>

                                <div>
                                    <label className="dark:text-dark-text-secondary text-light-text-secondary text-sm mb-2 block font-[500]">User Text Color</label>
                                    <input
                                        type="color"
                                        onChange={(e) => handlePatchByField('user_text_color', e.target.value)}
                                        value={chatbotConfigurations?.configure?.website?.user_text_color}
                                        className="w-full h-10 bg-light-card-primary focus:border-secondary outline-none border border-light-border-primary rounded-lg cursor-pointer"
                                    />
                                    <FieldMessage data={formMessages?.user_text_color} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="dark:text-dark-text-secondary text-light-text-secondary text-sm mb-2 block font-[500]">Icon Gradient Start</label>
                                    <input
                                        onChange={(e) => handlePatchByField('icon_bg_gradient_start', e.target.value)}
                                        value={chatbotConfigurations?.configure?.website?.icon_bg_gradient_start}
                                        type="color"
                                        className="w-full h-10 bg-light-card-primary focus:border-secondary outline-none border border-light-border-primary rounded-lg cursor-pointer"
                                    />
                                    <FieldMessage data={formMessages?.icon_bg_gradient_start} />
                                </div>
                                <div>
                                    <label className="dark:text-dark-text-secondary text-light-text-secondary text-sm mb-2 block font-[500]">Icon Gradient End</label>
                                    <input
                                        onChange={(e) => handlePatchByField('icon_bg_gradient_end', e.target.value)}
                                        value={chatbotConfigurations?.configure?.website?.icon_bg_gradient_end}
                                        type="color"
                                        className="w-full h-10 bg-light-card-primary focus:border-secondary outline-none border border-light-border-primary rounded-lg cursor-pointer"
                                    />
                                    <FieldMessage data={formMessages?.icon_bg_gradient_end} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            onChange={() => handlePatchByField('send_button_icon', !chatbotConfigurations?.configure?.website?.send_button_icon)}
                                            checked={chatbotConfigurations?.configure?.website?.send_button_icon}
                                            type="checkbox"
                                            id="send_button_icon"
                                            className="w-4 h-4 accent-secondary rounded border-light-border-primary cursor-pointer"
                                        />
                                        <label
                                            htmlFor="send_button_icon"
                                            className="dark:text-dark-text-secondary text-light-text-secondary text-sm block cursor-pointer font-[500]"
                                        >
                                            Send Button
                                        </label>
                                    </div>
                                    <FieldMessage data={formMessages?.send_button_icon} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            onChange={() => handlePatchByField('mic_button_icon', !chatbotConfigurations?.configure?.website?.mic_button_icon)}
                                            checked={chatbotConfigurations?.configure?.website?.mic_button_icon}
                                            type="checkbox"
                                            id="mic_button_icon"
                                            className="w-4 h-4 accent-secondary rounded border-light-border-primary cursor-pointer"
                                        />
                                        <label
                                            htmlFor="mic_button_icon"
                                            className="dark:text-dark-text-secondary text-light-text-secondary text-sm block cursor-pointer font-[500]"
                                        >
                                            Mic Button
                                        </label>
                                    </div>
                                    <FieldMessage data={formMessages?.mic_button_icon} />
                                </div>
                            </div>
                        </div>
                    }
                </div>

                <div id="choose-avatar" className=" bg-light-bg-primary border border-light-border-primary rounded-lg overflow-hidden outline-none">
                    <button
                        className="w-full p-4 flex items-center justify-between text-left dark:hover:bg-white/5 hover:bg-black/5 transition-all duration-200"
                        onClick={() => setCurrentTab(currentTab === "choose-avatar" ? null : "choose-avatar")}
                    >
                        <div className="flex items-center gap-3">
                            <AgentZeeHead className="text-secondary text-lg" />
                            <h3 className="text-lg font-medium">Choose Avatar</h3>
                        </div>
                        <FaChevronDown
                            className={clsx("dark:text-dark-text-secondary text-light-text-secondary transition-transform duration-200",
                                currentTab === "choose-avatar" && "rotate-180"
                            )}
                        />
                    </button>

                    {currentTab === "choose-avatar" &&
                        <div className="p-4">
                            {fetchingField?.avatar?.status === "loading" && (
                                <AvatarStylesSkeleton />
                            )}
                            {(fetchingField?.avatar?.status === "err4xx" || fetchingField?.avatar?.status === "err5xx" || (fetchingField?.avatar?.status === "ok" && chatbotAvatars.length === 0)) && (
                                <div className="w-full flex flex-col items-center justify-center gap-2.5 bg-light-card-primary rounded-lg p-4 border border-light-bg-primary">
                                    {fetchingField?.avatar?.status === "err4xx" && (
                                        <FaCircleXmark className="size-8 flex-shrink-0 text-red-400" />
                                    )}
                                    {fetchingField?.avatar?.status === "err5xx" && (
                                        <FaExclamationTriangle className="size-8 flex-shrink-0 text-orange-400" />
                                    )}
                                    {(fetchingField?.avatar?.status === "ok" && chatbotAvatars.length === 0) && (
                                        <MdOutlineSearchOff className="size-8 flex-shrink-0 text-secondary" />
                                    )}

                                    {fetchingField.avatar.message && (
                                        <p className="text-light-text-primary font-[500] text-center text-lg">
                                            {fetchingField.avatar.message}
                                        </p>
                                    )}

                                    <button
                                        onClick={async () => await getChatbotAvatars()}
                                        type="button"
                                        className="text-sm px-4 py-1 rounded-full border border-secondary text-secondary hover:bg-secondary hover:text-white font-[500]"
                                    >
                                        Refresh
                                    </button>
                                </div>
                            )}

                            {(fetchingField?.avatar?.status === "ok" && chatbotAvatars.length > 0) && (
                                <div className="grid grid-cols-3 gap-4 transition-all duration-300">
                                    {chatbotAvatarsByGender?.map((item) => (
                                        <button
                                            onClick={() => handlePatchByField("avatar", item.id)}
                                            key={item?.id}
                                            data-tooltip-id={item?.id}
                                            className={clsx("bg-light-card-primary size-24 shadow rounded-full border border-light-border-primary outline-none cursor-pointer flex flex-col items-center justify-center ring-offset-2 ring-offset-light-bg-primary mx-auto",
                                                (chatbotConfigurations?.configure?.website?.avatar === item?.id) ? "ring-2 ring-secondary" : " hover:ring-2 hover:ring-secondary"
                                            )}
                                        >
                                            <Image
                                                quality={100}
                                                alt={item.name}
                                                width={1024}
                                                height={1024}
                                                src={item?.preview_image_url || ""}
                                                className="w-full h-full rounded-full"
                                            />
                                            <Tooltip
                                                id={item.id}
                                                role={"dialog"}
                                                place="right"
                                                offset={15}
                                                arrowSize={18}
                                                positionStrategy="fixed"
                                                classNameArrow="border-r border-b border-light-border-primary"
                                                opacity={1}
                                                className="!w-max z-10 !bg-white !shadow-card !rounded-lg border border-light-border-primary !p-4"

                                            >
                                                <div className="flex flex-col items-center text-center">
                                                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-light-bg-primary">
                                                        <Image
                                                            quality={100}
                                                            alt={item.name}
                                                            width={1024}
                                                            height={1024}
                                                            src={item?.preview_image_url || ""}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <h4 className="font-medium mb-2 text-light-text-primary">{item.name}</h4>
                                                    <p className="text-light-text-secondary text-sm text-nowrap truncate">
                                                        {formatLabel(item?.ethnicity)} • {formatLabel(item?.type)}
                                                    </p>
                                                </div>
                                            </Tooltip>
                                        </button>
                                    ))}
                                </div>
                            )}

                            <FieldMessage data={formMessages?.avatar} />
                        </div>
                    }
                </div>
            </div>

            {/* Need add new logic */}
            {showBgStylesPanel?.open && (
                <AvatarBgStyles
                    open={showBgStylesPanel?.open}
                    displayMode={showBgStylesPanel?.displayMode}
                    onClose={() => handleAvatarBgStylesPanel()}
                />
            )}
        </div>
    )
}

const AvatarStylesSkeleton = ({ count = 6 }) => {
    return (
        <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, index) => (
                <div className="dark:bg-gray-800 bg-gray-200 rounded-full size-24 animate-pulse" />

            ))}

        </div>
    )
}
