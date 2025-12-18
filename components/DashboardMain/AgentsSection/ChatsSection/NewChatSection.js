import { AgentZeeHead } from "@/components/SVG";
import { agentChatApiPath, agentChatSessionsApiPath } from "@/constants/apiPaths";
import { useAuthContext } from "@/context/useAuthContext";
import { useDashboardContext } from "@/context/useDashboardContext";
import { createOrUpdate, retrieveOrRemove } from "@/utils/fetchUtils";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import ChatInputArea from "../ChatInputArea";

export default function NewChatSection({ setShowCreateSection, setFetchingField }) {

    const router = useRouter();

    const { setAgentChatSessions, setAgentChatData } = useDashboardContext();

    const { loginUser } = useAuthContext();

    const [questionValue, setQuestionValue] = useState("");

    const handleSend = async (event) => {

        if (event?.key && (event.shiftKey || event.key !== "Enter")) return;

        if (event?.preventDefault) event.preventDefault();

        if (!questionValue) return; // don't send empty

        setShowCreateSection(false);

        setQuestionValue("");

        // Optimistic UI update
        setAgentChatData(prev => [
            ...prev,
            { question: questionValue }
        ]);

        setFetchingField(prev => ({
            ...prev,
            chat: { ...prev.chat, status: "loading", message: null }
        }));

        const payload = {
            question: questionValue,
            chat_id: router?.query?.id || null,
            company_id: loginUser?.company_profile_id
        };

        const result = await postChat(payload);

        if (!result || Object.values(result).length === 0) return;

        router.push({
            pathname: router?.pathname,
            query: {
                index: router?.query?.index,
                id: result?.chat_id
            }
        });

        setFetchingField(prev => ({
            ...prev,
            chat: {
                ...prev.chat,
                status: null,
                message: null
            }
        }));

        setAgentChatData(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = result;
            return updated;
        });

        await getChatSessions();

    }

    const postChat = async (payload = {}) => {
        if (Object.values(payload).length === 0) return;

        const res = await createOrUpdate(payload, "POST", agentChatApiPath, true);
        let resData = null;
        try {
            resData = await res?.json();
        }
        catch (e) { }

        if (res?.status >= 400 && res?.status < 500) {
            setFetchingField(prev => ({
                ...prev,
                chat: {
                    ...prev.chat,
                    status: "err4xx",
                    message: resData?.message || "Unable to send your message. Please check and try again."
                }
            }));

            return false;
        }

        if (res?.status >= 500) {
            setFetchingField(prev => ({
                ...prev,
                chat: {
                    ...prev.chat,
                    status: "err5xx",
                    message: res?.message || resData?.message || "Server error. Please try again later."
                }
            }));

            return false;
        }

        if (res?.status === 200 || res?.status === 201) {
            return resData || {};
        }


        return {};

    };

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

    return (
        <div className="flex-1 flex overflow-y-auto p-4 items-center justify-center">
            <div className="max-w-3xl mx-auto w-full">

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary/80 to-secondary/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <AgentZeeHead className="!size-10  text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-light-text-primary mb-2">
                        Welcome to Agentzee AI
                    </h2>
                    <p className="text-light-text-secondary max-w-md mx-auto">
                        Your intelligent AI assistant is ready to help. Start a conversation below.
                    </p>
                </div>

                <ChatInputArea
                    containerClassName={"flex w-full shadow-card flex-col rounded-xl bg-light-card-primary border border-light-border-primary cursor-text overflow-hidden"}
                    inputClassName={"leading-normal caret-black p-4 transition-[padding] select-text font-[500] duration-200 ease-in-out max-h-[260px] resize-none text-light-text-primary w-full overflow-y-auto outline-none scroll-p-5 selection:bg-secondary/50"}
                    sendButtonClassName={"h-8 min-h-6 w-8 min-w-6 flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-white transition-all duration-100 cursor-pointer disabled:cursor-default disabled:opacity-70"}
                    sendButtonDisabled={!questionValue.trim()}
                    onInputKeyDown={handleSend}
                    inputValue={questionValue}
                    onSendClick={handleSend}
                    onInputValueChange={(e) => setQuestionValue(e.target.value)}
                />

            </div>
        </div>
    )
}
