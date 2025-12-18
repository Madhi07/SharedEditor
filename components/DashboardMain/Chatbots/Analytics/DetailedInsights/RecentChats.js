import { getRelativeTime } from "@/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { FaCheck } from "react-icons/fa";
import { FiInbox } from "react-icons/fi";

export default function RecentChats({ isFetching = true, data = [] }) {

    const router = useRouter();

    const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return (
        <section
            id="recent-alerts"
            className="flex flex-col dark:bg-dark-card-primary bg-light-card-primary shadow rounded-lg border dark:border-dark-border-primary border-light-border-primary p-4"
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Chats</h3>
                {
                    (data.length > 0) &&
                    <Link
                        href={`/dashboard/chatbots/conversations?id=${router?.query?.id}`}
                        className="text-secondary text-sm"
                    >
                        View All
                    </Link>
                }
            </div>
            <div className="space-y-4 flex-1 overflow-y-auto">
                {
                    (isFetching)
                        ?
                        <RecentChatsSkeleton />
                        :
                        (data.length === 0)
                            ?
                            <div className="h-full w-full flex flex-col items-center justify-center">
                                <FiInbox className="size-8 mb-2 text-secondary" />
                                <p className="text-lg font-[500] text-secondary">
                                    No data available.
                                </p>
                            </div>
                            :
                            (
                                sortedData?.slice(0, 3)?.map((item) => (
                                    <Fragment key={item?.id}>
                                        {item?.last_conversation &&
                                            <div className="flex items-start p-3 dark:bg-dark-bg-primary bg-light-bg-primary rounded-lg">
                                                <div className="w-8 h-8 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center mr-3 flex-shrink-0">
                                                    <FaCheck className="text-green-500" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <h4 className="text-sm font-medium">{item?.last_conversation?.question}</h4>
                                                    <p className="text-xs text-gray-400 mt-1 truncate">{item?.last_conversation?.answer}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{getRelativeTime(item?.created_at)}</p>
                                                </div>
                                            </div>
                                        }
                                    </Fragment>
                                ))
                            )
                }
                { }
            </div>
        </section>
    )
}


const RecentChatsSkeleton = ({ count = 3 }) => {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="h-12 w-full animate-pulse dark:bg-gray-800 bg-gray-200 rounded-lg"
                />
            ))}
        </div>
    )
}
