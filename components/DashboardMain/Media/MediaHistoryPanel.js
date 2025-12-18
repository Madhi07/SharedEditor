import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
    FaEllipsisV,
    FaExclamationTriangle,
    FaPlus,
    FaTrash,
    FaVideo,
    FaImages,
    FaPlay,
    FaSpinner,
    FaMagic,
    FaCheckCircle,
    FaEdit,
    FaHourglassHalf,
    FaPlayCircle,
    FaTimesCircle
} from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdOutlineSearchOff } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import DeleteConfirmation from "@/components/Modals/DeleteConfirmation";
import { useMediaState } from "./context/MediaStateContext";
import { useMediaHistory } from "./context/MediaHistoryContext";
import { clearAllTimers } from "./utils/timerManager";
import { contentGeneratorsConfig } from "./constant/contentGenerators";



const statusConfig = {
    blog: {
        ready: {
            label: "Ready",
            icon: () => <FaCheckCircle />,
            color: "text-green-600"

        },
        prompts_ready: {
            label: "Drafting",
            icon: () => <FaMagic className="animate-pulse" />,
            color: "text-purple-500"
        }

    },
    reels: {
        completed: {
            label: "Ready",
            icon: () => <FaCheckCircle />,
            color: "text-green-600"
        },
        asset_generation_completed: {
            label: "Assets Ready",
            icon: () => <FaImages />,
            color: "text-green-600"
        },
        video: {
            label: "Rendering",
            icon: () => <FaVideo className="animate-pulse" />,
            color: "text-blue-500"
        },
        asset_generation_started: {
            label: "Assets...",
            icon: () => <FaImages className="animate-pulse" />,
            color: "text-orange-500"
        },
        prompt: {
            label: "Drafting",
            icon: () => <FaMagic className="animate-pulse" />,
            color: "text-purple-500"
        },

        script_generation_started: {
            label: "Scripting...",
            icon: () => <FaMagic className="animate-pulse" />,
            color: "text-purple-500",
        },
        script_generation_completed: {
            label: "Script Ready",
            icon: () => <FaCheckCircle />,
            color: "text-green-600",
        },
        script_generation_failed: {
            label: "Script Failed",
            icon: () => <FaTimesCircle />,
            color: "text-red-600",
        },

        // ---- Asset Generation ----
        asset_generation_started: {
            label: "Assets...",
            icon: () => <FaImages className="animate-pulse" />,
            color: "text-orange-500",
        },
        asset_generation_completed: {
            label: "Assets Ready",
            icon: () => <FaImages />,
            color: "text-green-600",
        },
        asset_generation_failed: {
            label: "Assets Failed",
            icon: () => <FaTimesCircle />,
            color: "text-red-600",
        },

        // ---- Video Generation ----
        video_generation_started: {
            label: "Rendering",
            icon: () => <FaVideo className="animate-pulse" />,
            color: "text-blue-500",
        },
        video_generation_completed: {
            label: "Video Ready",
            icon: () => <FaCheckCircle />,
            color: "text-green-600",
        },
        video_generation_failed: {
            label: "Rendering Failed",
            icon: () => <FaTimesCircle />,
            color: "text-red-600",
        },

        // ---- Final States ----
        success: {
            label: "Completed Successfully",
            icon: () => <FaCheckCircle />,
            color: "text-green-600",
        },
        failed: {
            label: "Failed",
            icon: () => <FaExclamationTriangle />,
            color: "text-red-600",
        },
    },
    general: {

        success: {
            label: "Ready",
            icon: () => <FaCheckCircle />,
            color: "text-green-600"
        },
        failed: {
            label: "Failed",
            icon: () => <FaExclamationTriangle />,
            color: "text-red-500"
        },
        creating: {
            label: "Processing",
            icon: () => <FaSpinner className="animate-spin" />,
            color: "text-secondary"
        },
        running: {
            label: "Processing",
            icon: () => <FaSpinner className="animate-spin" />,
            color: "text-secondary"
        },
        processing: {
            label: "Processing",
            icon: () => <FaSpinner className="animate-spin" />,
            color: "text-secondary"
        },
        generating: {
            label: "Processing",
            icon: () => <FaSpinner className="animate-spin" />,
            color: "text-secondary"
        }

    },
    default: {
        label: "Pending",
        icon: () => <FaSpinner />,
        color: "text-gray-400"
    },




}



const getStatusConfig = (status, subcategory) => {
    console.log("the config data", status, subcategory)
    const outcome = status?.toLowerCase() || "";
    let data =
        statusConfig[subcategory]?.[outcome] ??
        statusConfig.general[outcome]
    if (data) return data
    const subKeys = Object.keys(statusConfig[subcategory] || {});
    const generalKeys = Object.keys(statusConfig.general || {});

    const keyList = [...subKeys, ...generalKeys];
    const matchedKey = keyList.find(key => outcome.includes(key));

    if (matchedKey) {
        return data = statusConfig[subcategory]?.[matchedKey] ??
            statusConfig.general[matchedKey]
    }

    return statusConfig?.default;

}


export default function MediaHistoryPanel() {

    const router = useRouter();
    const { query } = router
    const { index } = query

    const subcategory = index[1]

    const {
        mediaList, setMediaList,
        setShowCreateSection, setMediaData,
        setChats, clearAll,
        setLoading, setCurrentStep,
        mediaData, setCreateOptions } = useMediaState();

    const [searchTerm, setSearchTerm] = useState("");

    const { deleteModal, setDeleteModal, deleteMedia, getMediaList, fetchMedia } = useMediaHistory()
    const { resMessages, setResMessages } = useMediaState()





    const initialRequirements = async () => {
        setResMessages({ status: "loading", message: "Fetching media history..." });
        const list = await getMediaList(subcategory);

        if (!list || !router?.query?.id) return;

        const found = list.find(item => item?.uuid === router?.query?.id);
        if (!found) {
            const newQuery = { ...router.query };
            delete newQuery.id;
            router.push({ pathname: router.pathname, query: newQuery });
        } else {
            setShowCreateSection(false);
        }
    }


    useEffect(() => {
        setMediaList([])
        initialRequirements();
    }, []);




    const handleClickNewMedia = () => {
        clearAllTimers();

        setCreateOptions((prev) => ({
            ...prev,
            ...contentGeneratorsConfig[subcategory]
        }))

        // Clear ID from URL to show Create View
        const newQuery = { ...router.query };
        delete newQuery.mediaId;
        router.push({ pathname: router.pathname, query: newQuery });
        clearAll('mediaId')
        clearAllTimers();

    }

    const handleMediaClick = (id) => {
        clearAllTimers();
        if (!id || router?.query?.mediaId === id) return;
        router.push({
            pathname: router.pathname,
            query: { ...router.query, mediaId: id }
        });
        setLoading(true)
        setCurrentStep(1)
        fetchMedia(subcategory, id);
        setShowCreateSection(false);
    };

    const handleClickDelete = async (id) => {
        setDeleteModal({
            subcategory: subcategory,
            status: null,
            message: "Are you sure you want to delete this generated media?",
            mediaId: id,
            open: true
        });
    }

    // --- Data Filtering ---
    const currentMedia = useMemo(() => {
        console.log("the mediaList", mediaList)
        const foundData = mediaList?.find(item => (item.uuid || item.id) === router.query?.mediaId);
        return mediaList?.find(item => (item.uuid || item.id) === router.query?.mediaId);
    }, [router.query?.mediaId, mediaList]);

    const filteredMedia = useMemo(() => {
        if (!searchTerm) return mediaList;
        return mediaList?.filter(item =>
            item?.prompt?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [mediaList, searchTerm]);




    return (
        <div id="media-sidebar" className="lg:w-[280px] w-[240px] bg-gray-200/25 border-r border-light-border-primary h-full flex flex-col">

            {/* --- Header --- */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-light-text-primary">Generated Media</h2>
                    <button
                        onClick={() => handleClickNewMedia()}
                        data-tooltip-id="new-media-tooltip"
                        className="relative inline-flex w-8 h-8 items-center justify-center p-2 rounded-lg border border-light-border-primary bg-light-card-primary outline-none hover:border-secondary transition-colors"
                    >
                        <FaPlus className="size-4 flex-shrink-0" />
                    </button>
                    <Tooltip id="new-media-tooltip" content="Generate New" place="bottom" className="z-10 !text-xs !py-1 !px-2" />
                </div>

                {/* --- Search --- */}
                <div className="relative">
                    <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search prompts..."
                        className="w-full pl-10 pr-4 py-2 border border-light-border-primary bg-light-card-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary text-light-text-primary"
                    />
                </div>
            </div>

            {/* --- List Content --- */}
            <div className="p-4 flex-1 overflow-y-auto  space-y-3">
                {resMessages?.status === "loading" && <MediaSkeleton />}

                {/* Error / Empty States */}
                {((resMessages?.status !== "loading" && resMessages?.status !== "ok") || (resMessages?.status === "ok" && mediaList?.length === 0)) && (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                        <MdOutlineSearchOff className="text-gray-400 size-8 mb-2" />
                        <p className="text-sm text-gray-500">{resMessages?.message || "No media found"}</p>
                        <button onClick={initialRequirements} className="mt-2 text-xs text-secondary underline">Refresh</button>
                    </div>
                )}

                
                {filteredMedia?.map((item) => {

                    // Get the simple status configuration here
                    const config = subcategory == "blog" ? getStatusConfig(item.overall_status, subcategory) : getStatusConfig(item.status, subcategory);

                    return (
                        <div key={item.uuid ?? item.id}
                            className={clsx("p-3 bg-light-card-primary border rounded-lg cursor-pointer flex",
                                (currentMedia?.id === item.id) ? "border-secondary shadow" : "hover:shadow border-light-border-primary hover:border-secondary"
                            )}

                        >
                            {/* Main Click Area */}
                            <div
                                onClick={() => handleMediaClick(item.uuid ?? item.id)}
                                className="pr-0 w-full">
                                <div className="flex items-center justify-between mb-1.5">

                                    {/* --- UPDATED STATUS DISPLAY --- */}
                                    <div className={`flex items-center gap-1.5 text-xs font-bold ${config.color}`}>
                                        {config?.icon && config.icon()}
                                        <span className="capitalize">{config.label}</span>
                                    </div>
                                    {
                                        item?.num_slides &&
                                        <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 whitespace-nowrap">
                                            {item.num_slides || 0} slides
                                        </span>
                                    }
                                </div>

                                <h4 className="text-sm font-medium text-light-text-primary line-clamp-1 leading-tight overflow-hidden break-all capitalize">
                                    {item.prompt ?? item.query}
                                </h4>
                            </div>
                            <button
                                type={"button"}
                                data-tooltip-id={item?.uuid ? `chatbot-menu-${item?.uuid}` : `chatbot-menu-${item?.id}`}
                                className="relative hover:text-secondary focus:text-secondary outline-none"
                            >
                                <FaEllipsisV />
                                <Tooltip
                                    id={item?.uuid ? `chatbot-menu-${item?.uuid}` : `chatbot-menu-${item?.id}`}
                                    place={"bottom-start"}
                                    clickable
                                    role={"dialog"}
                                    noArrow
                                    offset={1}
                                    opacity={1}
                                    openEvents={{
                                        click: true,
                                    }}
                                    closeEvents={{
                                        click: true
                                    }}
                                    positionStrategy="fixed"
                                    className="z-10 !p-2 !rounded-lg !bg-light-card-primary !shadow-card !text-light-text-primary border border-light-border-primary !w-[120px] flex flex-col !text-base"
                                >
                                    {item.video_url && (
                                        <a
                                            href={item.video_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-2 p-1.5 text-lg rounded-lg bg-gradient-to-r hover:from-primary/20 hover:to-secondary/20 hover:text-primary hover:font-[500]"
                                        >
                                            <FaPlay className=" flex-shrink-0" size={15} />
                                            <span> Video</span>
                                        </a>
                                    )}
                                    {mediaData?.id !== item.id &&
                                        <div
                                            onClick={() => handleChatbotEditClick(item)}
                                            className="flex items-center gap-2 p-1.5 text-lg rounded-lg bg-gradient-to-r hover:from-primary/20 hover:to-secondary/20 hover:text-primary hover:font-[500]"
                                        >
                                            <FaEdit className=" flex-shrink-0" />
                                            <span>
                                                Edit
                                            </span>
                                        </div>
                                    }
                                    <div
                                        onClick={() => handleClickDelete(item?.uuid ?? item?.id)}
                                        className="flex items-center gap-2 p-1.5 text-lg rounded-lg bg-gradient-to-r hover:from-primary/20 hover:to-secondary/20 hover:text-primary hover:font-[500]"
                                    >
                                        <FaTrash className=" flex-shrink-0" />
                                        <span>
                                            Delete
                                        </span>
                                    </div>
                                </Tooltip>
                            </button>

                        </div>
                    );
                })}
            </div>

            {/* --- Delete Modal --- */}
            {deleteModal?.open && (
                <DeleteConfirmation
                    status={deleteModal?.status}
                    message={deleteModal?.message}
                    handleCancelClick={() => setDeleteModal(p => ({ ...p, open: false }))}
                    handleDeleteClick={deleteMedia}

                />
            )}
        </div>
    );
}


const MediaSkeleton = () => (
    <div className="space-y-3">
        {[1, 2, 3].map(i => (
            <div key={i} className="p-3 bg-white border border-gray-100 rounded-lg animate-pulse">
                <div className="flex justify-between mb-2">
                    <div className="h-2 w-16 bg-gray-200 rounded"></div>
                    <div className="h-2 w-8 bg-gray-200 rounded"></div>
                </div>
                <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
                <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
            </div>
        ))}
    </div>
);