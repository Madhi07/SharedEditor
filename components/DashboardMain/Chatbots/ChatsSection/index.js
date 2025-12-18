import "react-datepicker/dist/react-datepicker.css";
import ChatsList from "./ChatsList";
import ChatArea from "./ChatArea";
import { useEffect, useState } from "react";
import clsx from "clsx";
import CustomerInfo from "./CustomerInfoTooltip";
import useUpdateQueryParams from "@/hooks/updateQueryParams";
import { createOrUpdate, retrieveOrRemove } from "@/utils/fetchUtils";
import { format, parse } from "date-fns";
import { chatSessionsApiPath, chatSessionsWithConversationsApiPath } from "@/constants/apiPaths";
import { useRouter } from "next/router";
import { useDashboardContext } from "@/context/useDashboardContext";

export default function ChatsSection() {
    const router = useRouter();
    const updateQueryParams = useUpdateQueryParams();
    const [activePanel, setActivePanel] = useState("list");

    const { setChatSessions, setChatConversations, chatConversations } = useDashboardContext();

    const [resMessages, setResMessages] = useState({
        sessions: {
            status: "loading",
            message: null
        },
        conversations: {
            status: "loading",
            message: null
        },
    })

    const [fromDate, setFromDate] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return router.query?.['start-date'] ? router.query?.['start-date'] : format(date, "dd-MM-yyyy");
    });

    const [toDate, setToDate] = useState(() => {
        const date = new Date();
        return router.query?.['end-date'] ? router.query?.['end-date'] : format(date, "dd-MM-yyyy");
    });



    useEffect(() => {

        initialRequirements();

    }, [router.query?.id]);


    const initialRequirements = async () => {

        if (!router.query?.id) return;

        const chatSessions = await getChatSessions(fromDate, toDate, router.query?.id);
        const width = window.innerWidth;
        if (width > 768) {
            if (chatSessions?.length > 0) {
                await getSessionConversationById(router?.query?.['session-id'] || chatSessions?.[0]?.id);
            }
            else {
                setChatConversations({});
                setResMessages(prev => ({
                    ...prev,
                    conversations: {
                        ...prev.conversations,
                        status: "ok",
                        message: "No chat conversations available."
                    }
                }));
            }
        }
    }



    const getChatSessions = async (start_date = "", end_date = "", chatbot_id = "") => {

        if (!start_date || !end_date || !chatbot_id) return;

        setChatSessions([]);

        if (resMessages?.sessions?.status !== "loading") {
            setResMessages(prev => ({
                ...prev,
                sessions: {
                    ...prev.sessions,
                    status: "loading",
                    message: null
                }
            }));
        }

        const res = await retrieveOrRemove("GET", `${chatSessionsApiPath}?chatbot_id=${chatbot_id}&start_date=${start_date}&end_date=${end_date}`, true);
        let resData = null;

        try {
            resData = await res?.json();
        }
        catch (e) { }

        if (res?.status >= 400 && res?.status < 500) {
            setResMessages(prev => ({
                ...prev,
                sessions: {
                    ...prev.sessions,
                    status: "err4xx",
                    message: resData?.message || "Unable to fetch the chat sessions."
                }
            }));
            return false;
        }

        if (res?.status >= 500) {
            setResMessages(prev => ({
                ...prev,
                sessions: {
                    ...prev.sessions,
                    status: "err5xx",
                    message: resData?.message || "Server error while fetching the chat sessions."
                }
            }));
            return false;
        }

        if (res?.status === 200) {
            if (resData?.length > 0) {
                const sortedData = resData?.sort((a, b) => new Date(b?.created_at) - new Date(a?.created_at));
                setChatSessions(sortedData);
                setResMessages(prev => ({
                    ...prev,
                    sessions: {
                        ...prev.sessions,
                        status: "ok",
                        message: null
                    }
                }));
            }
            else {
                setResMessages(prev => ({
                    ...prev,
                    sessions: {
                        ...prev.sessions,
                        status: "ok",
                        message: "No chat sessions available."
                    }
                }));
            }

            return resData;
        }

    }

    const getSessionConversationById = async (session_id = null) => {

        setChatConversations({});

        if (!session_id) return false;

        if (resMessages?.conversations?.status !== "loading") {
            setResMessages(prev => ({
                ...prev,
                conversations: {
                    ...prev.conversations,
                    status: "loading",
                    message: null
                }
            }));
        }

        const path = chatSessionsWithConversationsApiPath.replace("<id>", session_id);
        const res = await retrieveOrRemove("GET", path, true);
        let resData = null;

        try {
            resData = await res?.json();
        }
        catch (e) { }

        if (res?.status >= 400 && res?.status < 500) {
            setResMessages(prev => ({
                ...prev,
                conversations: {
                    ...prev.conversations,
                    status: "err4xx",
                    message: resData?.message || "Unable to fetch the chat conversations."
                }
            }));
            return false;
        }

        if (res?.status >= 500) {
            setResMessages(prev => ({
                ...prev,
                conversations: {
                    ...prev.conversations,
                    status: "err5xx",
                    message: resData?.message || "Server error while fetching the chat conversations."
                }
            }));
            return false;
        }

        if (res?.status === 200) {
            setChatConversations(resData?.data || {});

            if (resData?.data?.conversations > 0) {

                setResMessages(prev => ({
                    ...prev,
                    conversations: {
                        ...prev.conversations,
                        status: "ok",
                        message: null
                    }
                }));
            }
            else {
                setResMessages(prev => ({
                    ...prev,
                    conversations: {
                        ...prev.conversations,
                        status: "ok",
                        message: "No chat conversations available."
                    }
                }));
            }

            return resData;
        }

    }


    const onDateChange = async (date, type = null) => {

        if (!type || !date) return;

        setResMessages(prev => ({
            ...prev,
            conversations: {
                ...prev.conversations,
                status: "loading",
                message: null
            }
        }));
        let sessionId = null;
        if (type === "from") {
            setFromDate(date);
            updateQueryParams({
                'start-date': date
            });
            const chatSessions = await getChatSessions(date, toDate, router.query?.id);
            sessionId = chatSessions?.[0]?.id || null;
        }

        if (type === "to") {
            setToDate(date);
            updateQueryParams({
                'end-date': date
            });
            const chatSessions = await getChatSessions(fromDate, date, router.query?.id);
            sessionId = chatSessions?.[0]?.id || null;
        }

        if (sessionId) {
            await getSessionConversationById(sessionId)
        }
        else {
            setResMessages(prev => ({
                ...prev,
                conversations: {
                    ...prev.conversations,
                    status: "ok",
                    message: "No chat conversations available."
                }
            }));
        }

        if (router.query?.["session-id"]) updateQueryParams({ 'session-id': null });
    }


    const onClickSession = async (session_id = null) => {
        if (!session_id) return;

        if (session_id === router?.query?.['session-id']) return;

        setChatConversations({});

        setResMessages(prev => ({
            ...prev,
            conversations: {
                ...prev.conversations,
                status: "loading",
                message: null
            }
        }));
        setActivePanel("chat");
        updateQueryParams({ 'session-id': session_id });
        await getSessionConversationById(session_id);
    }


    const onBackClick = () => {
        setActivePanel("list");
        updateQueryParams({ 'session-id': null });
    }

    return (
        <div className="flex w-full h-full">
            <div
                id="chatList"
                className={clsx(
                    "xl:max-w-[300px] w-full py-4 flex-col border-r flex-shrink-0",
                    "dark:bg-dark-card-primary bg-light-card-primary dark:border-dark-border-primary border-light-border-primary",
                    {
                        "flex": activePanel === "list",
                        "hidden": activePanel !== "list",
                        "xl:flex": true,
                    }
                )}
            >
                <ChatsList
                    fromDate={fromDate}
                    toDate={toDate}
                    onClickSession={onClickSession}
                    onDateChange={onDateChange}
                    resMessages={resMessages?.sessions}
                    initialRequirements={initialRequirements}
                />

            </div>
            <div
                id="chatArea"
                className={clsx(
                    "flex-1 flex-col",
                    {
                        "flex": activePanel === "chat",
                        "hidden": activePanel !== "chat",
                        "xl:flex": activePanel !== "info",
                    }
                )}
            >
                <ChatArea
                    onBackClick={onBackClick}
                    onShowInfo={() => setActivePanel("info")}
                    resMessages={resMessages?.conversations}
                    getSessionConversationById={getSessionConversationById}
                />
            </div>

        </div>
    )
};
