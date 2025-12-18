import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaChevronDown, FaComments, FaExclamationTriangle, FaEye, FaImage, FaPalette, FaVideo } from "react-icons/fa";
import { fontFamilies } from "../../constants";
import FieldMessage from "../../FieldMessage";
import { useDashboardContext } from "@/context/useDashboardContext";
import { FaCircleUser, FaCircleXmark } from "react-icons/fa6";
import { MdDashboardCustomize, MdOutlineSearchOff } from "react-icons/md";
import { avatarModelsApiPath, chatbotCustomizationsAll, chatbotCustomizationsAllApiPath, chatbotCustomizationsthreeDApiPath, chatbotCustomizationsWebsiteApiPath } from "@/constants/apiPaths";
import { createOrUpdate, retrieveOrRemove } from "@/utils/fetchUtils";
import AvatarBgStyles from "@/components/Modals/Dashboard/Chatbots/AvatarBgStyles";
import { AgentZeeHead } from "@/components/SVG";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import { formatLabel } from "@/utils";
import { useRouter } from "next/router";

export default function FunctionalPanel({ formMessages = {}, setFormMessages }) {
    const router = useRouter();
    const [currentTab, setCurrentTab] = useState("choose-avatar");
    const { chatbots, chatbotConfigurations, setChatbotConfigurations, chatbotCustomizationData, setChatbotCustomizationData, chatbotAvatars, setChatbotAvatars } = useDashboardContext();
    const [fetchingField, setFetchingField] = useState({
        avatar: {
            status: "ok",
            message: null
        }
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
                ["3d"]: {
                    ...prev?.["3d"],
                    [field]: {
                        ...prev?.["3d"]?.[field],
                        status: null,
                        message: null
                    }
                }
            }));
        }

        if (chatbotConfigurations?.configure?.["3d"]?.[field] === value) return;

        setChatbotConfigurations(prev => ({
            ...prev,
            configure: {
                ...prev.configure,
                ["3d"]: {
                    ...prev.configure?.["3d"],
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
                        ["3d"]: {
                            ...prev.configure?.["3d"],
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
            ["3d"]: {
                ...prev?.["3d"],
                [field]: {
                    ...prev?.["3d"]?.[field],
                    status: "loading",
                    message: "Updating..."
                }
            }
        }));

        const res = await createOrUpdate(payload, "PATCH", `${chatbotCustomizationsthreeDApiPath}${chatbotCustomizationData?.["3d"]?.id}/`, true);
        let resData = null;
        try {
            resData = await res?.json();
        }
        catch (e) { }


        if (res?.status >= 400 && res?.status < 500) {
            setFormMessages(prev => ({
                ...prev,
                ["3d"]: {
                    ...prev?.["3d"],
                    [field]: {
                        ...prev?.["3d"]?.[field],
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
                ["3d"]: {
                    ...prev?.["3d"],
                    [field]: {
                        ...prev?.["3d"]?.[field],
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
                ["3d"]: {
                    ...prev?.["3d"],
                    [field]: {
                        ...prev?.["3d"]?.[field],
                        status: null,
                        message: null
                    }
                }
            }));
            return resData;
        }

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

                <div className=" bg-light-bg-primary border border-light-border-primary rounded-lg overflow-hidden outline-none">
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
                                            className={clsx("bg-light-card-primary mx-auto size-24 shadow rounded-full border border-light-border-primary outline-none cursor-pointer flex flex-col items-center justify-center ring-offset-2 ring-offset-light-bg-primary",
                                                (chatbotConfigurations?.configure?.["3d"]?.avatar === item?.id) ? "ring-2 ring-secondary" : " hover:ring-2 hover:ring-secondary"
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
