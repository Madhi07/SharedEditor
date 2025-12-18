import { chatbotsApiPath } from "@/constants/apiPaths";
import { useDashboardContext } from "@/context/useDashboardContext";
import { retrieveOrRemove } from "@/utils/fetchUtils";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { FaEdit, FaEllipsisV, FaExclamationTriangle, FaPlus, FaTrash } from "react-icons/fa";
import { FaCircleXmark, FaMagnifyingGlass } from "react-icons/fa6";
import { MdOutlineSearchOff } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import { deployPlatformOptions } from "./constants";
import DeleteConfirmation from "@/components/Modals/DeleteConfirmation";

export default function ChatbotsPanel({ setShowCreateSection, setFormChatbotData }) {

    const router = useRouter();

    const { chatbots, setChatbots } = useDashboardContext();

    const [searchTerm, setSearchTerm] = useState("");

    const [deleteModal, setDeleteModal] = useState({
        status: null,
        message: null,
        chatbotId: null,
        open: false
    });

    const [resMessages, setResMessages] = useState({
        status: "ok",
        message: null
    });

    useEffect(() => {
        initialRequirements();
    }, []);

    const initialRequirements = async () => {
        if (chatbots?.length > 0) return;

        const chatbotsList = await getChatbots();

        if (!chatbotsList || !router?.query?.id) return;

        const found = chatbotsList.find(item => item?.id === router?.query?.id);
        if (!found) {
            router.push({
                pathname: router.pathname,
                query: {
                    index: router?.query?.index
                }
            });

        }
        else {
            setShowCreateSection(false)
        }

    }

    const getChatbots = async () => {
        setResMessages(prev => ({
            ...prev,
            status: "loading",
            message: "Fetching the chatbots...",
        }));

        const res = await retrieveOrRemove("GET", chatbotsApiPath, true);
        let resData = null;

        try {
            resData = await res?.json()
        }
        catch (e) { }

        if (res?.status >= 400 && res?.status < 500) {
            setResMessages(prev => ({
                ...prev,
                status: "err4xx",
                message: resData?.message || "Unable to fetch chatbot details.",
            }));
            return false;
        }

        if (res?.status >= 500) {
            setResMessages(prev => ({
                ...prev,
                status: "err5xx",
                message: res?.message || resData?.message || "Our server is busy. Please try again later.",
            }));
            return false;
        }

        if (res?.status === 200 || res?.status === 201) {
            if (resData?.length > 0) {
                setChatbots(resData?.sort((a, b) => new Date(b?.created_at) - new Date(a?.created_at)));
                setResMessages(prev => ({
                    ...prev,
                    status: "ok",
                    message: null
                }));
            }
            else {
                setChatbots([]);
                setResMessages(prev => ({
                    ...prev,
                    status: "ok",
                    message: "No chatbots created yet.",
                }));
            }
            return resData || [];
        }

        return [];
    }


    const handleClickNewChatbot = async () => {
        router.push({
            pathname: router.pathname,
            query: {
                index: router?.query?.index
            }
        });
        setShowCreateSection(true);
        setFormChatbotData(prev => ({
            ...prev,
            chatbotId: "",
            type: "Create",
            name: "",
            platforms: []
        }));
    }

    const handleChatbotClick = async (id = null) => {
        if (!id) return false;

        if (router?.query?.id !== id) {
            router.push({
                pathname: router.pathname,
                query: {
                    index: router?.query?.index,
                    id: id
                }
            });
            setShowCreateSection(false);
        }
    };

    const handleCancelClickDeleteModal = () => {
        setDeleteModal(prev => ({
            ...prev,
            status: null,
            message: null,
            chatbotId: null,
            open: false
        }));
    }

    const handleClickDeleteChatbot = (id = null) => {
        if (!id) return;
        setDeleteModal(prev => ({
            ...prev,
            open: !prev.open,
            chatbotId: id,
        }));
    }

    const handleDeleteClickDeleteModal = async () => {

        const result = await deleteChatbotById(deleteModal?.chatbotId);

        if (result) {
            const timeout = setTimeout(async () => {
                clearTimeout(timeout);
                handleCancelClickDeleteModal();
                if (router?.query?.id === deleteModal?.chatbotId) {
                    const newQuery = { ...router.query }
                    delete newQuery?.id;
                    router.push({
                        pathname: router.pathname,
                        query: newQuery
                    });
                    setShowCreateSection(true);
                }
                setChatbots(prev => prev.filter(bot => bot.id !== deleteModal?.chatbotId));
            }, 2000)
        }
    }

    const handleChatbotEditClick = (data = {}) => {

        if (Object.values(data).length === 0) return;

        setShowCreateSection(true);

        setFormChatbotData(prev => ({
            ...prev,
            chatbotId: data?.id,
            type: "Edit",
            name: data?.name,
            platforms: deployPlatformOptions.filter(item => data?.platforms?.includes(item?.name)).map(item => item.id)
        }));

        if (router?.query?.id) {
            router.push({
                pathname: router.pathname,
                query: {
                    index: router?.query?.index
                }
            });
        }
    }

    const deleteChatbotById = async (id = null) => {
        if (!id) return;

        setDeleteModal(prev => ({
            ...prev,
            status: "loading",
            message: "Deleting your chatbot..."
        }));

        const res = await retrieveOrRemove("DELETE", `${chatbotsApiPath}${id}/`, true);
        let resData = null;
        try {
            resData = await res?.json();
        }
        catch (e) { }

        if (res?.status >= 400 && res?.status < 500) {
            setDeleteModal(prev => ({
                ...prev,
                status: "err4xx",
                message: resData?.message || "Unable to delete chatbot. Please check and try again."
            }));

            return false;
        }

        if (res?.status >= 500) {
            setDeleteModal(prev => ({
                ...prev,
                status: "err5xx",
                message: res?.message || resData?.message || "Something went wrong on our end. Please try again later."
            }));

            return false;
        }
        if (res?.status === 204) {
            setDeleteModal(prev => ({
                ...prev,
                status: "ok",
                message: "Chatbot deleted successfully!"
            }));
            return true;
        }

    }

    const currentChatbot = useMemo(() => {
        return chatbots?.find(item => item.id === router.query?.id);
    }, [router.query?.id, chatbots]);

    const filteredChatbots = useMemo(() => {
        return chatbots?.filter(item => item?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()))
    }, [chatbots, searchTerm])

    return (
        <div
            id="config-sidebar"
            className="lg:w-[280px] w-[240px] bg-gray-200/25 border-r border-light-border-primary h-full overflow-hidden flex flex-col"
        >
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-light-text-primary">
                        Chatbots
                    </h2>
                    <div className="flex gap-2">

                        <button
                            onClick={handleClickNewChatbot}
                            type="button"
                            data-tooltip-id="new-chatbot-create"
                            className="relative inline-flex w-8 h-8 items-center justify-center p-2 rounded-lg border border-light-border-primary bg-light-card-primary outline-none"
                        >
                            <FaPlus className="size-4 flex-shrink-0" />
                            <Tooltip
                                id="new-chatbot-create"
                                content="New Chatbot"
                                place={"bottom"}
                                opacity={1}
                                positionStrategy="fixed"
                                className="z-10 !p-2.5 !rounded-lg font-[500] !bg-light-card-primary !shadow-card !text-light-text-primary"
                            />
                        </button>
                    </div>
                </div>
                <div className="relative">
                    <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search chatbots..."
                        className="w-full pl-10 pr-4 py-2 border border-light-border-primary bg-light-card-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary text-light-text-primary"
                    />
                </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto no-scrollbar">
                {resMessages?.status === "loading" && (
                    <ChatbotSkeleton />
                )}

                {(resMessages?.status === "err4xx" || resMessages?.status === "err5xx" || (resMessages?.status === "ok" && chatbots.length === 0)) && (
                    <div className="rounded-xl flex flex-col items-center justify-center p-4">
                        {resMessages?.status === "err4xx" && (
                            <FaCircleXmark className="text-red-400 size-6" />
                        )}

                        {resMessages?.status === "err5xx" && (
                            <FaExclamationTriangle className="text-orange-400 size-6" />
                        )}

                        {(resMessages?.status === "ok" && chatbots.length === 0) && (
                            <MdOutlineSearchOff className="text-secondary size-6" />
                        )}

                        {resMessages?.message && (
                            <p className="mt-2.5 text-sm font-[500] text-center">
                                {resMessages?.message}
                            </p>
                        )}

                        <button
                            onClick={async () => await initialRequirements()}
                            type="button"
                            className="text-sm px-3 py-1 rounded-full border border-secondary text-secondary hover:bg-secondary hover:text-white font-[500] mt-2.5"
                        >
                            Reload
                        </button>
                    </div>
                )}
                {(resMessages?.status === "ok" && chatbots.length >= 0) && (
                    <div className="space-y-3">
                        {filteredChatbots?.map((item, index) => (
                            <div
                                key={item.id}
                                className={clsx("p-3 bg-light-card-primary border rounded-lg cursor-pointer flex",
                                    (currentChatbot?.id === item.id) ? "border-secondary shadow" : "hover:shadow border-light-border-primary hover:border-secondary"
                                )}
                            >
                                <div
                                    onClick={() => handleChatbotClick(item?.id)}
                                    className="flex-1"
                                >
                                    <h4 className="text-sm font-medium text-light-text-primary mb-2">
                                        {item?.name}
                                    </h4>
                                    <p className="text-xs text-light-text-secondary line-clamp-1">
                                        {item?.platforms?.join(" • ")}
                                    </p>

                                </div>
                                <button
                                    type={"button"}
                                    data-tooltip-id={`chatbot-menu-${item?.id}`}
                                    className="relative hover:text-secondary focus:text-secondary outline-none"
                                >
                                    <FaEllipsisV />
                                    <Tooltip
                                        id={`chatbot-menu-${item?.id}`}
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
                                        <div
                                            onClick={() => handleChatbotEditClick(item)}
                                            className="flex items-center gap-2 p-1.5 text-lg rounded-lg bg-gradient-to-r hover:from-primary/20 hover:to-secondary/20 hover:text-primary hover:font-[500]"
                                        >
                                            <FaEdit className=" flex-shrink-0" />
                                            <span>
                                                Edit
                                            </span>
                                        </div>
                                        <div
                                            onClick={() => handleClickDeleteChatbot(item.id)}
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
                        ))}

                    </div>
                )}
            </div>

            {deleteModal?.open && (
                <DeleteConfirmation
                    status={deleteModal?.status}
                    message={deleteModal?.message}
                    handleCancelClick={handleCancelClickDeleteModal}
                    handleDeleteClick={handleDeleteClickDeleteModal}
                    handleRetryClick={handleDeleteClickDeleteModal}
                />
            )}
        </div>
    )
}


const ChatbotSkeleton = ({ count = 5 }) => {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="p-3 bg-light-card-primary border border-light-border-primary rounded-lg flex items-center"
                >
                    <div className="flex-1 animate-pulse mr-4">
                        <div className="h-2 w-[80%] rounded-lg bg-gray-200 mb-2" />
                        <div className="h-2 w-full rounded-lg bg-gray-200" />
                    </div>
                    <div className="h-6 w-2 rounded-lg bg-gray-200 animate-pulse" />
                </div>
            ))}

        </div>
    )
}
