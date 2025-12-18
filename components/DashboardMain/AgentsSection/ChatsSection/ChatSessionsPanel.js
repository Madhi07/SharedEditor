import { agentChatSessionsApiPath, chatbotsApiPath } from "@/constants/apiPaths";
import { useDashboardContext } from "@/context/useDashboardContext";
import { retrieveOrRemove } from "@/utils/fetchUtils";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { FaEdit, FaEllipsisH, FaExclamationTriangle, FaPlus, FaTrash } from "react-icons/fa";
import { FaCircleXmark, FaMagnifyingGlass } from "react-icons/fa6";
import { MdOutlineSearchOff } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import DeleteConfirmation from "@/components/Modals/DeleteConfirmation";
import EditChatSession from "@/components/Modals/Dashboard/Agents/EditChatSession";

export default function ChatSessionsPanel({ setShowCreateSection, setFetchingField, fetchingField }) {

    const router = useRouter();

    const { agentChatSessions, setAgentChatSessions, setAgentChatData } = useDashboardContext();

    const [searchTerm, setSearchTerm] = useState("");

    const [deleteModal, setDeleteModal] = useState({
        status: null,
        message: null,
        sessionId: null,
        open: false
    });

    const [editModal, setEditModal] = useState({
        sessionId: null,
        open: false,
        data: {}
    })

    useEffect(() => {
        initialRequirements();
    }, []);

    const initialRequirements = async () => {
        if (agentChatSessions?.length > 0) return;

        const agentChatsList = await getChatSessions();

        if (!agentChatsList || agentChatsList?.length === 0 || !router?.query?.id) return;

        const found = agentChatsList.find(item => item?.id === router?.query?.id);
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

    const getChatSessions = async () => {
        setFetchingField(prev => ({
            ...prev,
            chatSessions: {
                ...prev.chatSessions,
                status: "loading",
                message: "Fetching the chats...",
            }
        }));

        const res = await retrieveOrRemove("GET", agentChatSessionsApiPath, true);
        let resData = null;

        try {
            resData = await res?.json()
        }
        catch (e) { }

        if (res?.status >= 400 && res?.status < 500) {
            setFetchingField(prev => ({
                ...prev,
                chatSessions: {
                    ...prev.chatSessions,
                    status: "err4xx",
                    message: resData?.message || "Unable to fetch chats",
                }
            }));
            return false;
        }

        if (res?.status >= 500) {
            setFetchingField(prev => ({
                ...prev,
                chatSessions: {
                    ...prev.chatSessions,
                    status: "err5xx",
                    message: res?.message || resData?.message || "Our server is busy. Please try again later.",
                }
            }));
            return false;
        }

        if (res?.status === 200 || res?.status === 201) {
            if (resData?.length > 0) {
                setAgentChatSessions(resData?.sort((a, b) => new Date(b?.created_at) - new Date(a?.created_at)));
                setFetchingField(prev => ({
                    ...prev,
                    chatSessions: {
                        ...prev.chatSessions,
                        status: "ok",
                        message: null
                    }
                }));
            }
            else {
                setAgentChatSessions([]);
                setFetchingField(prev => ({
                    ...prev,
                    chatSessions: {
                        ...prev.chatSessions,
                        status: "ok",
                        message: "You haven't started any chats yet.",
                    }
                }));
            }
            return resData || [];
        }

        return [];
    }


    const handleNewChatClick = async () => {

        router.push({
            pathname: router.pathname,
            query: {
                index: router?.query?.index
            }
        });

        setShowCreateSection(true);
        setAgentChatData([]);
    }

    const handleClickChatSession = async (id = null) => {
        if (!id) return false;

        if (router?.query?.id !== id) {
            router.push({
                pathname: router.pathname,
                query: {
                    index: router?.query?.index,
                    id: id
                }
            });
            setAgentChatData([]);
            setShowCreateSection(false);
        }
    };

    const handleCancelClickDeleteModal = () => {
        setDeleteModal(prev => ({
            ...prev,
            status: null,
            message: null,
            sessionId: null,
            open: false
        }));
    }

    const handleClickDeleteChatSession = (id = null) => {
        if (!id) return;
        setDeleteModal(prev => ({
            ...prev,
            open: !prev.open,
            sessionId: id,
        }));
    }

    const handleDeleteClickDeleteModal = async () => {

        const result = await deleteAgentChatSessionById(deleteModal?.sessionId);

        if (result) {
            const timeout = setTimeout(async () => {
                clearTimeout(timeout);
                handleCancelClickDeleteModal();
                if (router?.query?.id === deleteModal?.sessionId) {
                    const newQuery = { ...router.query }
                    delete newQuery?.id;
                    router.push({
                        pathname: router.pathname,
                        query: newQuery
                    });
                    setShowCreateSection(true);
                    setAgentChatData([]);
                }
                setAgentChatSessions(prev => prev.filter(session => session.id !== deleteModal?.sessionId));
            }, 2000)
        }
    }

    const handleChatSessionEditClick = (data = {}) => {
        if (Object.values(data).length === 0) return;

        setEditModal(prev => ({
            ...prev,
            open: !prev.open,
            sessionId: data?.id,
            data: {
                title: data?.title,
            }
        }));
    }

    const handleEditModalCancelClick = () => {
        setEditModal(prev => ({
            ...prev,
            open: !prev.open,
            sessionId: null,
            data: {}
        }));
    }


    const deleteAgentChatSessionById = async (id = null) => {
        if (!id) return;

        setDeleteModal(prev => ({
            ...prev,
            status: "loading",
            message: "Deleting your chat..."
        }));

        const res = await retrieveOrRemove("DELETE", `${agentChatSessionsApiPath}${id}/`, true);
        let resData = null;
        try {
            resData = await res?.json();
        }
        catch (e) { }

        if (res?.status >= 400 && res?.status < 500) {
            setDeleteModal(prev => ({
                ...prev,
                status: "err4xx",
                message: resData?.message || "Unable to delete the chat. Please try again."
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
                message: "Chat detail deleted successfully!"
            }));
            return true;
        }

    }


    const currentAgentChatSession = useMemo(() => {
        return agentChatSessions?.find(item => item.id === router.query?.id);
    }, [router.query?.id, agentChatSessions]);

    const filteredAgentChats = useMemo(() => {
        return agentChatSessions?.filter(item => item?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()))
    }, [agentChatSessions, searchTerm])


    return (
        <div
            id="config-sidebar"
            className="w-[280px] bg-gray-200/25 border-r border-light-border-primary h-full overflow-hidden flex flex-col"
        >

            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-light-text-primary">
                        Chats
                    </h2>
                    <button
                        onClick={handleNewChatClick}
                        type="button"
                        data-tooltip-id="new-chat-btn"
                        className="relative inline-flex w-8 h-8 items-center justify-center p-2 rounded-lg border border-light-border-primary bg-light-card-primary outline-none"
                    >
                        <FaPlus className="size-4 flex-shrink-0" />
                        <Tooltip
                            id="new-chat-btn"
                            content="New Chat"
                            place={"bottom"}
                            opacity={1}
                            positionStrategy="fixed"
                            className="z-10 !p-2.5 !rounded-lg font-[500] !bg-light-card-primary !shadow-card !text-light-text-primary"
                        />
                    </button>
                </div>
                <div className="relative">
                    <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search chats..."
                        className="w-full pl-10 pr-4 py-2 border border-light-border-primary bg-light-card-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary text-light-text-primary"
                    />
                </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto no-scrollbar">
                {fetchingField?.chatSessions?.status === "loading" && (
                    <ChatSessionSkeleton />
                )}

                {(fetchingField?.chatSessions?.status === "err4xx" || fetchingField?.chatSessions?.status === "err5xx" || (fetchingField?.chatSessions?.status === "ok" && agentChatSessions.length === 0)) && (
                    <div className="rounded-xl flex flex-col items-center justify-center p-4">
                        {fetchingField?.chatSessions?.status === "err4xx" && (
                            <FaCircleXmark className="text-red-400 size-6" />
                        )}

                        {fetchingField?.chatSessions?.status === "err5xx" && (
                            <FaExclamationTriangle className="text-orange-400 size-6" />
                        )}

                        {(fetchingField?.chatSessions?.status === "ok" && agentChatSessions.length === 0) && (
                            <MdOutlineSearchOff className="text-secondary size-6" />
                        )}

                        {fetchingField?.chatSessions?.message && (
                            <p className="mt-2.5 text-sm font-[500] text-center">
                                {fetchingField?.chatSessions?.message}
                            </p>
                        )}


                        <button
                            onClick={async () => await initialRequirements()}
                            type="button"
                            className="text-sm px-4 py-1 rounded-full border border-secondary text-secondary hover:bg-secondary hover:text-white font-[500] mt-2.5"
                        >
                            Reload
                        </button>
                    </div>
                )}

                {(fetchingField?.chatSessions?.status === "ok" && agentChatSessions.length >= 0) && (
                    <div className="space-y-2.5">
                        {filteredAgentChats?.map((item, index) => (
                            <div
                                key={item.id}
                                className={clsx("p-2.5 bg-light-card-primary border rounded-lg cursor-pointer flex",
                                    (currentAgentChatSession?.id === item.id) ? "border-secondary shadow" : "hover:shadow border-light-border-primary hover:border-secondary"
                                )}
                            >
                                <div
                                    onClick={() => handleClickChatSession(item?.id)}
                                    className="flex-1 mr-2.5"
                                >
                                    <p className="text-light-text-primary font-[500] line-clamp-1">
                                        {item?.title}
                                    </p>
                                </div>
                                <button
                                    type={"button"}
                                    data-tooltip-id={`chat-session-menu-${item?.id}`}
                                    className="relative hover:text-secondary focus:text-secondary outline-none"
                                >
                                    <FaEllipsisH />
                                    <Tooltip
                                        id={`chat-session-menu-${item?.id}`}
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
                                            onClick={() => handleChatSessionEditClick(item)}
                                            className="flex items-center gap-2 p-1.5 text-lg rounded-lg bg-gradient-to-r hover:from-primary/20 hover:to-secondary/20 hover:text-primary hover:font-[500]"
                                        >
                                            <FaEdit className=" flex-shrink-0" />
                                            <span>
                                                Edit
                                            </span>
                                        </div>
                                        <div
                                            onClick={() => handleClickDeleteChatSession(item.id)}
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

            {editModal?.open && (
                <EditChatSession
                    onCancelClick={handleEditModalCancelClick}
                    data={editModal}
                />
            )}
        </div>
    )
}


const ChatSessionSkeleton = ({ count = 5 }) => {
    return (
        <div className="space-y-2.5">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="p-2.5 bg-light-card-primary border border-light-border-primary rounded-lg flex items-center"
                >
                    <div className="flex-1 h-2.5 rounded-lg bg-gray-200 animate-pulse mr-2.5" />
                    <div className="h-2.5 w-6 rounded-lg bg-gray-200 animate-pulse" />
                </div>
            ))}

        </div>
    )
}
