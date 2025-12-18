import { FaChevronCircleLeft, FaExclamationTriangle, FaInfoCircle, FaPaperPlane, FaPlus, FaUser } from "react-icons/fa";
import clsx from "clsx";
import { Fragment, useEffect, useRef } from "react";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { AgentZeeHead } from "@/components/SVG";
import { parseISO, format } from "date-fns";
import { useDashboardContext } from "@/context/useDashboardContext";
import { FaCircleXmark } from "react-icons/fa6";
import { MdOutlineSearchOff } from "react-icons/md";
import { useRouter } from "next/router";
import CustomerInfoTooltip from "./CustomerInfoTooltip";

export default function ChatArea({ onShowInfo, onBackClick, resMessages, getSessionConversationById }) {

    const router = useRouter();

    const { chatConversations } = useDashboardContext();

    const chatAreaRef = useRef();

    useEffect(() => {
        if (chatAreaRef?.current && chatConversations?.conversations?.length > 0) {
            chatAreaRef?.current?.scrollTo({
                top: chatAreaRef?.current?.scrollHeight,
                behaviour: 'auto'
            });
        }
    }, [chatConversations])

    return (
        <Fragment>
            <div className="h-16 border-b dark:border-dark-border-primary border-light-border-primary flex items-center gap-2 md:px-6 px-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBackClick}
                        className="xl:hidden w-5 h-5 rounded-lg inline-flex items-center justify-center dark:text-dark-text-secondary text-light-text-secondary"
                    >
                        <FaChevronCircleLeft className="w-full h-full" />
                    </button>

                    {resMessages?.status === "loading" ?
                        <ProfileSkeleton /> :
                        <Fragment>
                            <FaUser className='w-10 h-10 p-1.5 flex-shrink-0 object-cover rounded-full dark:bg-dark-card-primary bg-light-card-primary' />
                            <div className="">
                                <h3 className="text-sm font-medium dark:text-dark-text-primary text-light-text-primary">
                                    {chatConversations?.title}
                                </h3>
                                <p className="text-xs dark:text-dark-text-secondary text-light-text-secondary line-clamp-1">Session #{chatConversations?.id}</p>
                            </div>
                        </Fragment>
                    }

                </div>
                <div className="ml-auto flex gap-2">
                    <button
                        type="button"
                        data-tooltip-id="customer-info-tooltip"
                        className={clsx("w-5 h-5 relative rounded-lg inline-flex items-center justify-center dark:text-dark-text-secondary text-light-text-secondary hover:text-secondary focus:text-secondary")}
                    >
                        <FaInfoCircle className="w-full h-full" />

                        <CustomerInfoTooltip
                            id="customer-info-tooltip"
                        />

                    </button>
                </div>
            </div>

            <div ref={chatAreaRef} className="flex-1 md:p-6 p-4 overflow-y-auto">
                {resMessages?.status === "loading" && (
                    <ChatConversationsSkeleton />
                )}

                {(resMessages?.status === "err4xx" || resMessages?.status === "err5xx" || (resMessages?.status === "ok" && (!chatConversations?.conversations || chatConversations?.conversations?.length === 0))) && (
                    <div className="flex w-full h-full items-center justify-center">
                        <div className="flex flex-col items-center justify-center dark:bg-dark-card-primary bg-light-card-primary p-6 rounded-xl">
                            {resMessages?.status === "err4xx" && (
                                <FaCircleXmark className="text-red-400 size-8" />
                            )}

                            {resMessages?.status === "err5xx" && (
                                <FaExclamationTriangle className="text-orange-400 size-8" />
                            )}

                            {(resMessages?.status === "ok" && (!chatConversations?.conversations || chatConversations?.conversations?.length === 0)) && (
                                <MdOutlineSearchOff className="text-secondary size-8" />
                            )}

                            {resMessages?.message && (
                                <p className="mt-4 font-[500] text-center">
                                    {resMessages?.message}
                                </p>
                            )}


                            <button
                                onClick={async () => await getSessionConversationById(router?.query?.['session-id'] || chatConversations?.id)}
                                type="button"
                                className="px-4 py-1 rounded-full border border-secondary text-secondary hover:bg-secondary hover:text-white font-[500] mt-4"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )}

                {(resMessages?.status === "ok" && chatConversations?.conversations?.length > 0) && (
                    <div className="md:space-y-6 space-y-4">
                        {chatConversations?.conversations?.map((chat, index) => (
                            <Fragment key={index}>
                                <div
                                    className="flex items-start gap-4 md:max-w-[80%]"
                                >
                                    <FaUser className='w-8 h-8 p-1.5 flex-shrink-0 object-cover rounded-full dark:bg-dark-card-primary bg-light-card-primary' />
                                    <div className={clsx("rounded-2xl md:p-4 p-3 dark:bg-dark-card-primary bg-light-card-primary rounded-tl-none dark:text-dark-text-primary text-light-text-primary break-all")}>
                                        <div className="text-sm">{chat?.question}</div>
                                        <span className="text-xs text-gray-400 mt-1 block">{format(parseISO(chat?.created_at), "dd-MM-yyyy h:mm a")}</span>
                                    </div>
                                </div>

                                <div
                                    className="flex items-start gap-4 md:max-w-[80%] flex-row-reverse ml-auto"
                                >
                                    <div className="w-8 h-8 rounded-full mt-1 bg-dark-card-primary inline-flex items-center justify-center flex-shrink-0">
                                        <AgentZeeHead className="!size-5 !scale-x-[1] !text-white" />
                                    </div>
                                    <div className={clsx("rounded-2xl md:p-4 p-3 dark:bg-dark-card-primary bg-light-card-primary dark:text-dark-text-primary text-light-text-primary rounded-tr-none")}>
                                        <div className="text-sm mb-2 flex flex-col gap-2">
                                            <Markdown
                                                remarkPlugins={[remarkGfm]}
                                            >
                                                {chat?.answer}
                                            </Markdown>
                                        </div>
                                        <span className="text-xs text-gray-400 block">
                                            {format(parseISO(chat?.created_at), "dd-MM-yyyy h:mm a")}
                                        </span>
                                    </div>
                                </div>
                            </Fragment>
                        ))}
                    </div>
                )}
            </div>

            {chatConversations?.conversations?.length > 0 && (
                <div className="p-4 border-t dark:border-dark-border-primary border-light-border-primary">
                    <div className="flex items-center gap-2">
                        <button className="w-10 h-10 rounded-lg dark:bg-dark-card-primary bg-light-card-primary flex items-center justify-center text-gray-500 border dark:border-dark-border-primary border-light-border-primary">
                            <FaPlus />
                        </button>
                        <textarea
                            rows={1}
                            placeholder="Type your message..."
                            className="max-h-48 flex-1 resize-none overflow-hidden dark:bg-dark-card-primary bg-light-card-primary rounded-lg px-4 py-2 text-sm border dark:border-dark-border-primary border-light-border-primary outline-none focus:!border-primary"
                        />
                        <button className="w-10 h-10 rounded-lg from-primary to-secondary bg-gradient-to-r flex items-center justify-center hover:opacity-90 text-white">
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>
            )}



        </Fragment>
    )
}


const ChatConversationsSkeleton = ({ count = 4 }) => {
    return (
        <div className="md:space-y-6 space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <Fragment key={index}>
                    <div
                        className="flex items-start gap-4 md:max-w-[80%]"
                    >
                        <div className='w-8 h-8 rounded-full dark:bg-gray-800 bg-gray-300 animate-pulse' />
                        <div className={clsx("rounded-2xl md:p-4 p-3 dark:bg-dark-card-primary bg-light-card-primary rounded-tl-none dark:text-dark-text-primary text-light-text-primary w-[50%]")}>
                            <div className="w-[70%] h-2.5 dark:bg-gray-800 bg-gray-300 rounded-lg animate-pulse" />
                            <span className="w-[35%] h-2.5 dark:bg-gray-800 bg-gray-300 mt-1 block rounded-lg animate-pulse" />
                        </div>
                    </div>

                    <div
                        className="flex items-start gap-4 md:max-w-[80%] flex-row-reverse ml-auto"
                    >
                        <div className='w-8 h-8 rounded-full dark:bg-gray-800 bg-gray-300 animate-pulse' />
                        <div className={clsx("rounded-2xl md:p-4 p-3 dark:bg-dark-card-primary bg-light-card-primary rounded-tr-none dark:text-dark-text-primary text-light-text-primary w-[50%]")}>
                            <div className="w-[70%] h-2.5 dark:bg-gray-800 bg-gray-300 rounded-lg animate-pulse" />
                            <span className="w-[35%] h-2.5 dark:bg-gray-800 bg-gray-300 mt-1 block rounded-lg animate-pulse" />
                        </div>
                    </div>
                </Fragment>
            ))}
        </div>
    )
}


const ProfileSkeleton = () => {
    return (
        <Fragment>
            <div className='w-10 h-10 dark:bg-gray-800 bg-gray-300 rounded-full animate-pulse flex-shrink-0' />
            <div>
                <div className="dark:bg-gray-800 bg-gray-300 w-28 h-2.5 animate-pulse rounded-lg mb-1" />
                <div className="dark:bg-gray-800 bg-gray-300 w-28 h-2.5 animate-pulse rounded-lg" />
            </div>
        </Fragment>
    )
}
