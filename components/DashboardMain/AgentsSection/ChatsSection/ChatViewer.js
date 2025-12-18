import { agentChatApiPath, agentChatSessionWithConversationsApiPath } from "@/constants/apiPaths";
import { useAuthContext } from "@/context/useAuthContext";
import { useDashboardContext } from "@/context/useDashboardContext";
import { createOrUpdate, retrieveOrRemove } from "@/utils/fetchUtils";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import { FaArrowUp, FaExclamationTriangle } from "react-icons/fa";
import { FaCircleXmark, FaRotate } from "react-icons/fa6";
import Markdown from "react-markdown";
import { BounceLoader } from "react-spinners";
import remarkGfm from "remark-gfm";
import ChatInputArea from "../ChatInputArea";
import clsx from "clsx";

export default function ChatViewer({ setFetchingField, fetchingField }) {

    const router = useRouter();

    const conversationAreaRef = useRef();

    const { agentChatData, setAgentChatData } = useDashboardContext();

    const { loginUser } = useAuthContext();

    const [questionValue, setQuestionValue] = useState("");

    useEffect(() => {
        if (!conversationAreaRef.current || agentChatData?.length === 0 || !router?.query?.id) return;

        conversationAreaRef?.current?.scrollTo({
            top: conversationAreaRef?.current?.scrollHeight,
            behaviour: 'smooth'
        });


    }, [agentChatData, router?.query?.id]);

    useEffect(() => {

        initialRequirements();

    }, [router?.query?.id]);


    const initialRequirements = async () => {
        if (!router?.query?.id) return;

        await getAgentConversationsById(router?.query?.id);

    }

    const getAgentConversationsById = async (session_id = null) => {
        if (!session_id) return;

        // setFetchingField(prev => ({
        //     ...prev,
        //     chatsData: {
        //         ...prev.chatsData,
        //         status: "loading",
        //         message: null
        //     }
        // }));

        const path = agentChatSessionWithConversationsApiPath.replace("<id>", session_id);
        const res = await retrieveOrRemove("GET", path, true);
        let resData = null;
        try {
            resData = await res?.json();
        }
        catch (e) { }

        if (res?.status >= 400 && res?.status < 500) {
            setFetchingField(prev => ({
                ...prev,
                chatsData: {
                    ...prev.chatsData,
                    status: "err4xx",
                    message: resData?.message || "Unable to fetch the conversations."
                }
            }));

            return false;
        }

        if (res?.status >= 500) {
            setFetchingField(prev => ({
                ...prev,
                chatsData: {
                    ...prev.chatsData,
                    status: "err5xx",
                    message: res?.message || resData?.message || "Server error. Please try again later."
                }
            }));

            return false;
        }

        if (res?.status === 200 || res?.status === 201) {
            setFetchingField(prev => ({
                ...prev,
                chatsData: {
                    ...prev.chatsData,
                    status: "ok",
                    message: null
                }
            }));
            setAgentChatData(resData?.data?.conversations || []);
            return resData?.data?.conversations || [];
        }


        return [];
    }

    const handleSend = async (event, action = "") => {

        if (event?.key && (event.shiftKey || event.key !== "Enter")) return;

        if (event?.preventDefault) event.preventDefault();

        if (!questionValue) return; // don't send empty

        setQuestionValue("");

        // Optimistic UI update
        if (action !== "retry") {
            setAgentChatData(prev => [
                ...prev,
                { question: questionValue }
            ]);
        }

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

        if (!result || Object.values(result).length === 0) {
            setQuestionValue(payload?.question);
            return;
        };

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


    return (
        <div
            ref={conversationAreaRef}
            className="flex-1 flex flex-col relative overflow-y-auto"
        >
            <div
                id="conversations-area"
                className="max-w-3xl mx-auto flex-1 w-full relative p-6"
            >

                {/* {fetchingField?.chatsData?.status === "loading" && (
                    <ConversionsSkeleton />
                )} */}

                {(fetchingField?.chatsData?.status === "err4xx" || fetchingField?.chatsData?.status === "err5xx") && (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className="max-w-3xl flex items-center justify-center flex-col gap-2.5 p-4 bg-light-card-primary border border-light-border-primary shadow rounded-lg">
                            {fetchingField?.chatsData?.status === "err4xx" && (
                                <FaCircleXmark className="text-red-400 flex-shrink-0 size-5" />
                            )}
                            {fetchingField?.chatsData?.status === "err5xx" && (
                                <FaExclamationTriangle className="text-orange-400 flex-shrink-0 size-5" />
                            )}

                            {fetchingField?.chatsData?.message && (
                                <p className="text-[500] text-center text-light-text-primary">
                                    {fetchingField?.chatsData?.message}
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
                    </div>
                )}

                {fetchingField?.chatsData?.status === "ok" && (
                    <div className="flex flex-col gap-8">
                        {agentChatData?.map((item, index) => (
                            <Fragment key={index}>

                                {item?.question && (
                                    <div className="text-black ml-auto text-base relative rounded-2xl px-4 py-3 whitespace-pre-wrap max-w-[70%] bg-light-card-primary shadow border border-light-border-primary">
                                        {item?.question}
                                    </div>
                                )}

                                <div className="text-base max-w-[70%] !text-black">
                                    {(item === agentChatData[agentChatData?.length - 1]) && (fetchingField?.chat?.status === "loading" || fetchingField?.chat?.status === "err4xx" || fetchingField?.chat?.status === "err5xx") && (
                                        <div>
                                            <div className="flex items-center gap-2.5">
                                                {fetchingField?.chat?.status === "loading" && (
                                                    <BounceLoader
                                                        size={24}
                                                        color={"#FF3A8C"}
                                                    />
                                                )}
                                                {fetchingField?.chat?.status === "err4xx" && (
                                                    <FaCircleXmark className="text-red-400 size-4 flex-shrink-0" />
                                                )}
                                                {fetchingField?.chat?.status === "err5xx" && (
                                                    <FaExclamationTriangle className="text-orange-400 size-4 flex-shrink-0" />
                                                )}

                                                {fetchingField?.chat?.message && (
                                                    <p className={clsx("text-[500]",
                                                        fetchingField?.chat?.status === "err4xx" && "text-red-400",
                                                        fetchingField?.chat?.status === "err5xx" && "text-orange-400",
                                                    )}>
                                                        {fetchingField?.chat?.message}
                                                    </p>
                                                )}

                                            </div>

                                            {fetchingField?.chat?.status !== "loading" && (
                                                <div className="flex">
                                                    <button
                                                        onClick={() => handleSend({ key: "Enter" }, "retry")}
                                                        title="Try again..."
                                                        type="button"
                                                        className="rounded-lg p-1.5 hover:bg-gray-200 inline-flex items-center justify-center mt-2.5"
                                                    >
                                                        <FaRotate className="w-4 h-4 flex-shrink-0" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {item?.answer && (
                                        <Markdown
                                            remarkPlugins={[remarkGfm]}
                                        >
                                            {item?.answer || ""}
                                        </Markdown>
                                    )}
                                </div>

                            </Fragment>
                        ))}
                    </div>
                )}

            </div>

            <div className="w-full bg-light-bg-primary sticky z-10 bottom-0 pb-4">
                <ChatInputArea
                    containerClassName={"flex max-w-3xl mx-auto w-full shadow-card flex-col rounded-xl bg-light-card-primary border border-light-border-primary cursor-text overflow-hidden"}
                    inputClassName={"leading-normal caret-black p-4 transition-[padding] select-text font-[500] duration-200 ease-in-out max-h-[260px] resize-none text-light-text-primary w-full overflow-y-auto outline-none scroll-p-5 selection:bg-secondary/50"}
                    sendButtonClassName={"h-8 min-h-6 w-8 min-w-6 flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-white transition-all duration-100 cursor-pointer disabled:cursor-default disabled:opacity-70"}
                    sendButtonDisabled={!questionValue.trim() || fetchingField?.chat?.status === "loading" || fetchingField?.chatsData?.status !== "ok"}
                    onInputKeyDown={handleSend}
                    inputValue={questionValue}
                    onSendClick={handleSend}
                    onInputValueChange={(e) => setQuestionValue(e.target.value)}
                />
            </div>
        </div>
    )
}

const ConversionsSkeleton = ({ count = 3 }) => {
    return (
        <div className="flex flex-col gap-8">
            {Array.from({ length: count }).map((_, index) => (
                <Fragment key={index}>
                    <div className="text-black ml-auto rounded-2xl px-4 py-3 w-[40%] bg-light-card-primary shadow border border-light-border-primary">
                        <div className="w-full h-2.5 bg-gray-200 animate-pulse mb-2 rounded-lg"></div>
                        <div className="w-[50%] h-2.5 bg-gray-200 animate-pulse rounded-lg"></div>
                    </div>
                    <div className="w-[40%]">
                        <div className="w-full h-2.5 bg-gray-200 animate-pulse mb-2 rounded-lg"></div>
                        <div className="w-[50%] h-2.5 bg-gray-200 animate-pulse rounded-lg"></div>
                    </div>
                </Fragment>
            ))}
        </div>
    )
}
